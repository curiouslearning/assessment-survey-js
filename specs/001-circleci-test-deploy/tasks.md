---
description: "Task list for CircleCI Test-Environment Build & Deploy"
---

# Tasks: CircleCI Test-Environment Build & Deploy

**Input**: Design documents from `/specs/001-circleci-test-deploy/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/build-and-sync-command.md](./contracts/build-and-sync-command.md), [quickstart.md](./quickstart.md)

**Tests**: No automated test tasks are generated — the spec did not request TDD, and this is a
CI/CD configuration change. Validation is performed via `circleci config validate` and the
Given/When/Then scenarios in [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story. Note that all pipeline work edits the single
file `.circleci/config.yml`, so tasks within/across stories that touch it are **sequential**, not
parallel, to avoid conflicts.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in each task

## Path Conventions

This feature changes CI/CD configuration for a single web project. Affected files:
`.circleci/config.yml` (pipeline) and `package.json` (add `lint` script). Design docs live under
`specs/001-circleci-test-deploy/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the enforceable quality-gate scripts the pipeline depends on

- [ ] T001 Add `"lint": "prettier --check ."` to the `scripts` block in `package.json` (research R5; enforces constitution Principle IV)
- [ ] T002 Verify gate scripts run locally: `npm run lint`, `npm test`, and `npm run build` all succeed and `build/` is produced (see [quickstart.md](./quickstart.md) "Local validation")

**Checkpoint**: `lint`, `test`, and `build` are all runnable npm scripts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the reusable `build_and_sync` command that the test-environment job and the
existing deploy jobs all build on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add a `commands.build_and_sync` reusable command to `.circleci/config.yml` with parameters `to` (string), `build-script` (string), and `from` (string, default `./build`), per [contracts/build-and-sync-command.md](./contracts/build-and-sync-command.md); steps: `checkout` → `node/install-packages` → `npm run << parameters.build-script >>` → `aws-s3/sync` using existing `AWS_ACCESS_KEY`/`AWS_SECRET_ACCESS_KEY`/region env vars with `from`/`to` bound to parameters
- [ ] T004 Validate the config parses with the new command: run `circleci config validate` and `circleci config process .circleci/config.yml`

**Checkpoint**: `build_and_sync` command exists and the config still validates

---

## Phase 3: User Story 1 - Automated test-environment deployment (Priority: P1) 🎯 MVP

**Goal**: On changes to the test-environment branch, produce a production-configured build and
publish it to the test-environment S3 bucket automatically.

**Independent Test**: Push a change to the test-environment branch and confirm the pipeline builds
with production config and the artifacts appear at the configured S3 destination (mirrors `./build`).

### Implementation for User Story 1

- [ ] T005 [US1] Add an `s3-deploy-test` job to `.circleci/config.yml` using the `node/default` executor (tag `24.10`) that invokes `build_and_sync` with `build-script: build`, `from: ./build`, `to: s3://globallit-aws-s3-static-webapp-test-us-west-2`, `region: AWS_TEST_REGION` (production config per research R3; destination/region confirmed via clarify — research R6)
- [ ] T006 [US1] Add a workflow entry in `.circleci/config.yml` that runs `s3-deploy-test`, filtered to the test-environment branch only (planned default `test`; FR-001, research R6)
- [ ] T007 [US1] Validate: `circleci config validate` passes and the `s3-deploy-test` job resolves in `circleci config process`
- [ ] T008 [US1] Confirm happy-path behavior against [quickstart.md](./quickstart.md) Scenario 1 & 2 (build uses production config; `./build` mirrored to the destination, stale files removed — FR-005, FR-006)

**Checkpoint**: A push to the test branch builds and publishes to the test S3 bucket

---

## Phase 4: User Story 2 - Quality gate blocks broken deployments (Priority: P1)

**Goal**: A failing lint, test, or build stops the pipeline before anything is published.

**Independent Test**: Introduce (separately) a lint error, a failing test, and a build error on the
test-environment branch and confirm the pipeline halts before the S3 sync in each case.

### Implementation for User Story 2

- [ ] T009 [US2] In the `s3-deploy-test` job in `.circleci/config.yml`, add ordered gate steps **before** the `build_and_sync` invocation: `run: npm run lint`, then `run: npm test` (lint → test → build → sync ordering per FR-002/FR-004, research R4)
- [ ] T010 [US2] Validate ordering with `circleci config process` — confirm `lint`, then `test`, then build/sync appear in that order for `s3-deploy-test`
- [ ] T011 [US2] Confirm gate behavior against [quickstart.md](./quickstart.md) Scenarios 3–5: a failing lint, test, or build stops the job before `aws-s3/sync` runs

**Checkpoint**: Broken code on the test branch never reaches the S3 bucket

---

## Phase 5: User Story 3 - Reusable, parameterized deploy command (Priority: P2)

**Goal**: Prove the build-and-sync logic is a single parameterized unit reusable across
environments without editing the command body.

**Independent Test**: Invoke `build_and_sync` with different `to` / `build-script` / `from` values
and confirm each invocation targets exactly its parameters with no command-body edits.

### Implementation for User Story 3

- [ ] T012 [US3] Refactor the existing `s3-deploy` job (develop → `assessment-and-survey-development`) in `.circleci/config.yml` to call `build_and_sync` with `build-script: build`, `from: ./build`, `to: s3://assessment-and-survey-development`, preserving its `develop` branch filter (contract backward-compatibility note; FR-007)
- [ ] T013 [US3] Refactor the existing `s3-deploy-prod` job (main → `assessment-and-survey-production`) in `.circleci/config.yml` to call `build_and_sync` with its production `to`/region, preserving its `main` branch filter
- [ ] T014 [US3] Validate: `circleci config validate` passes and `circleci config process` shows all three jobs (`s3-deploy`, `s3-deploy-prod`, `s3-deploy-test`) driven by `build_and_sync` with their distinct parameters (FR-008–FR-010)
- [ ] T015 [US3] Confirm parameter reuse against [quickstart.md](./quickstart.md) Scenario 6 (same command body, different destinations/scripts/folders via parameters)

**Checkpoint**: One reusable command drives develop, main, and test deploys via parameters only

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize, document, and confirm no secrets leak

- [ ] T016 Confirm no AWS secrets are committed in `.circleci/config.yml` — credentials come only from env vars (FR-011)
- [ ] T017 [P] Note the new test-environment branch/bucket and the `lint` gate in `README.md` (deploy targets section)
- [ ] T018 Run the full [quickstart.md](./quickstart.md) "Expected outcomes checklist" end-to-end and check off each item

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately (T001 then T002)
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories** (the `build_and_sync` command must exist first)
- **User Stories (Phase 3–5)**: All depend on Foundational completion
- **Polish (Phase 6)**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational. Creates the `s3-deploy-test` job + workflow filter.
- **US2 (P1)**: Builds on the US1 job (adds gate steps to `s3-deploy-test`), so **US2 follows US1** — they edit the same job.
- **US3 (P2)**: Independent of US1/US2's job; refactors the two pre-existing deploy jobs onto the shared command. Can be done any time after Foundational.

### Within Each User Story

- Config edits precede validation; validation precedes quickstart confirmation.

### Parallel Opportunities

- **Limited by a shared file**: US1, US2, and US3 all edit `.circleci/config.yml`, so their config-editing tasks are sequential, not parallel.
- T017 (`README.md`) is marked `[P]` — it's the only task touching a different file and can run alongside config work.
- After Foundational, **US3** (refactor of existing jobs) can proceed in parallel with **US1→US2** only if worked on a separate branch/copy to avoid `.circleci/config.yml` merge conflicts.

---

## Parallel Example

```bash
# Only cross-file parallelism is safe here (single config file otherwise):
Task: "T017 Update README.md deploy-targets section"   # different file
# ...while config.yml tasks (T005/T009/T012) proceed sequentially on the pipeline.
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1 (Setup): add the `lint` script.
2. Complete Phase 2 (Foundational): add the `build_and_sync` command.
3. Complete Phase 3 (US1): test-env job + workflow filter → **STOP and VALIDATE** a push publishes to the test bucket.
4. Complete Phase 4 (US2): add lint→test gate → validate broken code is blocked.
5. This is the shippable MVP: automated, gated test-environment deploys.

### Incremental Delivery

1. Setup + Foundational → command ready.
2. US1 → test-env deploy works (demo).
3. US2 → gate enforced (demo).
4. US3 → existing develop/main jobs refactored onto the shared command (cleanup + reuse proof).
5. Polish → docs + secret check.

---

## Notes

- [P] tasks = different files, no dependencies. Here, almost all work is in one config file, so
  parallelism is intentionally minimal.
- [Story] labels map tasks to spec user stories for traceability.
- No automated test tasks: validation is `circleci config validate`/`process` plus the quickstart
  Given/When/Then scenarios (constitution Principle III — behavior described in Gherkin form).
- Commit after each task or logical group; keep AWS credentials in env vars only.
