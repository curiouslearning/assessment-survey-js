---

description: "Task list template for feature implementation"
---

# Tasks: Build Environment Constant

**Input**: Design documents from `/specs/001-add-environment-constant/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included. Constitution Principle VI mandates at least one Gherkin-style happy-path spec for every new unit of behavior — this is a project-wide rule, not an ad hoc TDD request, so test tasks are generated alongside implementation tasks for every user story.

**Organization**: Tasks are grouped by user story (from [spec.md](./spec.md)) to enable independent implementation and testing of each story.

**Regenerated 2026-08-26**: supersedes the previous version of this file. The asset base-path mechanism changed — the existing `data-asset-base-url` attribute in `index.html` is retained as-is; the environment-aware value is now injected into that attribute at build time via a `CopyWebpackPlugin` transform in `webpack.config.js`, instead of removing the attribute and adding a JS-side fallback in `src/standalone.ts`. Neither `index.html` nor `src/standalone.ts` is edited by this feature. See research.md §3a and plan.md's Amendments.

**Updated 2026-08-28 (MR-75 amendment)**: T001–T019 above are unchanged (already complete) and were not touched. Only Phase 7 (User Story 4) is new, adding the `mr-75` feature-flag gate on `AndroidInterface` construction in standalone mode — see spec.md User Story 4, research.md §6, data-model.md's "Feature flag gate (`mr-75`)" section, and [contracts/feature-gate-mr-75.md](./contracts/feature-gate-mr-75.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to the repository root

---

## Phase 1: Setup

**Purpose**: Confirm no new tooling/dependencies are required before touching build config

- [X] T001 Verify existing (dev)dependencies already cover everything this feature needs: `cross-env`, `webpack`/`webpack-cli` (mode/`optimization.nodeEnv` config only, research.md §1a/§2), `copy-webpack-plugin` (confirm the installed version — currently `14.0.0` per `package-lock.json` — supports a per-pattern `transform`/`transformer` function; it does), `ts-jest`/`jest`. No `package.json` dependency/devDependency additions required. No file changes; record the confirmation in the PR description.

**Checkpoint**: No new dependencies needed — proceed directly to Foundational.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Decouple webpack's 2-way `mode` from the 3-way `NODE_ENV`/`environment` concept, so any of the three build modes can be invoked without a webpack config-validation error. Blocks all of User Story 1's per-mode build scenarios and all of User Story 2's script/CI/base-path work (User Story 3 does not depend on this).

**⚠️ CRITICAL**: Complete before starting User Story 1 or User Story 2.

- [X] T002 In [webpack.config.js](../../webpack.config.js): change `mode: nodeEnv` to derive webpack's own mode explicitly — `mode: nodeEnv === 'production' ? 'production' : 'development'` — so `NODE_ENV=test` (and `development`) both build in webpack's `development` mode without a `mode` validation error, while the raw `nodeEnv` value keeps flowing through unchanged. Also add `optimization: { nodeEnv }` so webpack's automatic `process.env.NODE_ENV` bundle-time replacement inlines the raw 3-way `nodeEnv` value instead of defaulting to `mode` (research.md §1a — without this, a `test` build would silently inline `"development"`). Then remove the now-redundant `--mode=production` / `--mode=development` CLI flags from the `build:standalone` and `dev` scripts in [package.json](../../package.json), since the config now derives `mode` itself (research.md §2).

**Checkpoint**: `cross-env NODE_ENV=test webpack -c webpack.config.js` (and `development`/`production`) all succeed without a mode validation error, and a quick build confirms `process.env.NODE_ENV` inlines the raw value, not `mode`. User Story 1 and User Story 2 work can begin.

---

## Phase 3: User Story 1 - Runtime code knows which environment it was built for (Priority: P1) 🎯 MVP

**Goal**: Expose a global `environment` constant (`'develop' | 'test' | 'production'`) derived from `NODE_ENV`, with a safe `develop` fallback.

**Independent Test**: Build the standalone bundle in each of the three modes and confirm the loaded bundle's `environment` value matches; run `npm test` and confirm `environment === 'test'` with no extra config (quickstart.md steps 1–2).

### Tests for User Story 1

- [X] T003 [US1] Write Gherkin-style (Given/When/Then) unit tests in `test/src/environment.test.ts` covering spec.md Acceptance Scenarios 1–5: `NODE_ENV=production` → `production`; `NODE_ENV=test` → `test`; `NODE_ENV=development` → `develop`; `NODE_ENV` unset/unrecognized → `develop` (safe default). Run `npm test -- test/src/environment.test.ts` and confirm it fails (the module doesn't exist yet).

### Implementation for User Story 1

- [X] T004 [US1] Create `src/environment.ts` exporting `type Environment = 'develop' | 'test' | 'production'`, a pure `resolveEnvironment(nodeEnv: string | undefined): Environment` function implementing the resolution table in [data-model.md](./data-model.md#environment), and a module-level `export const environment: Environment = resolveEnvironment(process.env.NODE_ENV);`. Re-run T003's tests and confirm they now pass.

**Checkpoint**: User Story 1 is fully functional and independently testable — `environment` resolves correctly in every build mode and under Jest.

---

## Phase 4: User Story 2 - Each deployment pipeline branch ships a bundle flagged with its real environment (Priority: P2)

**Goal**: `build:standalone` gains `develop`/`test` variants; test-mode builds resolve their own assets under the shared bucket's `assessment-survey-js/` sub-path **through the existing `data-asset-base-url` attribute mechanism** (not by removing it); CircleCI deploys each branch with the matching mode to the matching (and, for `test`, sub-scoped) destination.

**Independent Test**: Run each `build:standalone*` script and confirm the mode/environment/base-path match [contracts/build-scripts.md](./contracts/build-scripts.md); statically review `.circleci/config.yml` against [data-model.md](./data-model.md#circleci-deploy-job-branch--environment--destination-mapping) (quickstart.md steps 1, 3, 5).

### Tests for User Story 2

- [X] T005 [P] [US2] Extend `test/src/environment.test.ts` with Gherkin-style tests for a new `buildBasePath` constant per [data-model.md](./data-model.md#build-base-path): `environment === 'test'` → `'/assessment-survey-js'`; `develop`/`production` → `''`. Confirm the new assertions fail (constant doesn't exist yet).

### Implementation for User Story 2

- [X] T006 [P] [US2] In `package.json`, add `build:standalone:develop` (`cross-env NODE_ENV=development webpack -c webpack.config.js`) and `build:standalone:test` (`cross-env NODE_ENV=test webpack -c webpack.config.js`) scripts. Leave `build:standalone` as the production default, per [contracts/build-scripts.md](./contracts/build-scripts.md).
- [X] T007 [US2] In `src/environment.ts`, add `export const buildBasePath: string = environment === 'test' ? '/assessment-survey-js' : '';` (depends on T004, T005). Re-run T005's tests and confirm they pass.
- [X] T008 [US2] In [webpack.config.js](../../webpack.config.js), give the `CopyWebpackPlugin` pattern that copies `index.html` a `transform` function that rewrites the copied file's `data-asset-base-url="..."` attribute value to `` `${buildBasePath}/assets` ``, where `buildBasePath` is computed inline in this file from `nodeEnv` (`nodeEnv === 'test' ? '/assessment-survey-js' : ''` — the same mapping as T007's, intentionally expressed a second time here since this plain-JS config can't easily `require()` the TypeScript `src/environment.ts` module; see research.md §3a "Duplication note"). Do **not** edit `index.html` itself or `src/standalone.ts` — the attribute mechanism and `getStandaloneAssetBaseUrl()` are retained exactly as they are today; only the value baked into the *copied* `build/index.html` changes per mode (depends on T002 for the `nodeEnv`/`buildPath` variables already in scope).

**Verify T008**: run each of the three `build:standalone*` scripts and `grep -o 'data-asset-base-url="[^"]*"' build/index.html` — expect `/assets` for `develop`/`production` and `/assessment-survey-js/assets` for `test` (quickstart.md step 3).

- [X] T009 [P] [US2] In `.circleci/config.yml`, add a new `s3-deploy-test` job mirroring `s3-deploy`'s shape: run `npm run build:standalone:test` then `npm run wb:inject` (equivalent to `s3-deploy`'s single `npm run build` step, but explicitly in `test` mode — research.md §5), declare `context: [aws-context]` so `AWS_TEST_REGION` resolves, and `aws-s3/sync` `from: ./build` `to: s3://globallit-aws-s3-static-webapp-test-us-east-2/assessment-survey-js` using `AWS_TEST_REGION` for the region input and the existing `AWS_ACCESS_KEY`/`AWS_SECRET_ACCESS_KEY` for credentials (depends on T006; research.md §5).
- [X] T010 [US2] In `.circleci/config.yml`, update the existing `s3-deploy` job's build steps to `npm run build:standalone:develop` then `npm run wb:inject` (instead of the untargeted `npm run build`), so the `develop` branch explicitly builds in `develop` mode (depends on T006 and T009, same file).
- [X] T011 [US2] In `.circleci/config.yml`'s `s3-deploy-workflow`, add `s3-deploy-test` to the `jobs` list with `filters: branches: only: [test]` and `requires: [node/test]`, alongside the existing `develop`/`main`-filtered jobs. Leave `s3-deploy-prod` untouched (still `npm run build`, i.e. production mode) (depends on T009, T010, same file).

**Checkpoint**: User Stories 1 AND 2 both work independently — all three `build:standalone*` scripts produce the correct `environment`/base-path combination (delivered via the retained `data-asset-base-url` attribute), and `.circleci/config.yml` maps `develop`/`test`/`main` branches to their respective modes and destinations.

---

## Phase 5: User Story 3 - Android host app logs are traceable to the environment that produced them (Priority: P3)

**Goal**: Both `AndroidInterface` call sites in `src/App.ts` include `environment` in their `metadata` payload.

**Independent Test**: Run `npm test -- test/src/App.test.ts` and confirm both metadata payloads include `environment` (quickstart.md step 4; [contracts/android-interface-metadata.md](./contracts/android-interface-metadata.md)).

### Tests for User Story 3

- [X] T012 [US3] In `test/src/App.test.ts`, add/extend Gherkin-style tests asserting the `metadata` object passed to `AndroidInterface` at both call sites (user-session logging in the `game.subscribe('ENDED', ...)` handler at `src/App.ts:351`, and `notifySummaryData` at `src/App.ts:572`) includes `environment` alongside the existing `app_version` (spec.md Acceptance Scenarios 1–2 for User Story 3). Confirm the new assertions fail.

### Implementation for User Story 3

- [X] T013 [US3] In `src/App.ts`'s `game.subscribe('ENDED', ...)` handler (`src/App.ts:355`), import `environment` from `./environment` and change `metadata: { app_version: appVersion }` to `metadata: { app_version: appVersion, environment }` (depends on T004, T012).
- [X] T014 [US3] In `src/App.ts`'s `notifySummaryData` method (`src/App.ts:575`), change `metadata: { app_version: appVersion }` to `metadata: { app_version: appVersion, environment }` (depends on T004, T012). Re-run T012's tests and confirm both now pass.

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Repo-wide quality gates and documentation, per the Constitution's Quality Gates section.

- [X] T015 [P] Run `npm run format` and review the diff for the files touched by this feature.
- [X] T016 Run the full suite (`npm test`) and confirm zero failing tests (Constitution Quality Gate).
- [X] T017 Run `npm run build:all` and confirm `build:standalone` (all three modes, via T002/T006's scripts) and `build:package` complete without errors (Constitution Quality Gate).
- [X] T018 Execute [quickstart.md](./quickstart.md) steps 1–5 end-to-end and confirm every expected outcome, including step 3's per-mode `data-asset-base-url` attribute check.
- [X] T019 [P] Update the "Commands" section of [CLAUDE.md](../../CLAUDE.md) to document `build:standalone:develop` / `build:standalone:test` alongside the existing `build:standalone` entry, and add an "Environment" entry to the Key Subsystems section per [CLAUDE.md](../../CLAUDE.md)'s existing subsystem-list format.

---

## Phase 7: User Story 4 - `AndroidInterface` summary logging in standalone mode is gated behind feature flag `mr-75` (Priority: P2) (MR-75 amendment, 2026-08-28)

**Goal**: When the resolved `platform` is `'standalone'`, `this.enableAndroidSummary` is ANDed with `featureFlagsService.isFeatureEnabled('mr-75')` (evaluated once, after `featureFlagsService.initialize()` settles) before either `AndroidInterface` call site in `src/App.ts` runs — never overriding an explicit host `enableAndroidSummary: false`, and never consulted outside `platform === 'standalone'`.

**Independent Test**: Run `npm test -- test/src/App.test.ts` and confirm the new assertions in T020 pass for all four combinations in [contracts/feature-gate-mr-75.md](./contracts/feature-gate-mr-75.md) (quickstart.md step 6).

### Tests for User Story 4

- [X] T020 [US4] In `test/src/App.test.ts`, add Gherkin-style tests per spec.md User Story 4 Acceptance Scenarios 1–5 and [contracts/feature-gate-mr-75.md](./contracts/feature-gate-mr-75.md): (a) `platform: 'standalone'`, `enableAndroidSummary` true (default), `featureFlagsService.isFeatureEnabled` mocked to return `true` for `'mr-75'` → `AndroidInterface` IS constructed; (b) same but mocked `false` → `AndroidInterface` is NOT constructed; (c) `platform: 'standalone'`, `enableAndroidSummary: false` explicit, flag mocked `true` → still NOT constructed; (d) `platform` omitted/non-standalone (e.g. `'ftm'`) → construction follows `enableAndroidSummary` alone and `isFeatureEnabled` is never called with `'mr-75'`; (e) `featureFlagsService.initialize` mocked to reject → flag treated as disabled (fail-closed), matching the existing `FEATURE_DRAG_DROP_UI` fallback assertion style already used in this file. Confirm the new assertions fail (the gate doesn't exist yet).
  - **Correction found during implementation**: the user-session call site (`game.subscribe('ENDED', ...)`, `src/App.ts` ~line 376) never actually checked `enableAndroidSummary` — only `notifySummaryData` (call site 2) did. Without fixing call site 1 too, the `mr-75` gate would have zero effect on user-session logging, contradicting FR-014 ("both existing call sites"). Added two extra tests covering call site 1 specifically. Also updated the existing "Given an assessment session ends…" test (T012/T013, User Story 3), which calls `spinUp()` with default (standalone) platform, to mock the flag enabled — otherwise it would fail against the new default-off gate.

### Implementation for User Story 4

- [X] T021 [US4] In `src/App.ts`, add `export const FEATURE_ANDROID_SUMMARY_STANDALONE = 'mr-75';` alongside the existing `FEATURE_DRAG_DROP_UI` constant. In `spinUp()`, immediately after the existing `featureFlagsService.initialize()` try/catch block (so it runs whether that block succeeded or was caught) and after `applyHostIntegrationConfig(config)` has already set the pre-flag `this.enableAndroidSummary`, add: `if ((config.platform ?? 'standalone') === 'standalone') { this.enableAndroidSummary = this.enableAndroidSummary && featureFlagsService.isFeatureEnabled(FEATURE_ANDROID_SUMMARY_STANDALONE); }` (depends on T020; research.md §6). Also added `&& this.enableAndroidSummary` to call site 1's existing `if (appType === Assessment.TYPE)` guard (see T020's correction note) so the gate actually takes effect there too. Re-run T020's tests and confirm they now pass.

**Checkpoint**: User Story 4 is independently functional — standalone-mode `AndroidInterface` construction now additionally requires the `mr-75` flag; non-standalone consumers (web component) are unaffected.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks User Story 1 and User Story 2 (does not block User Story 3, which touches only `src/App.ts`/`src/environment.ts` and never invokes webpack).
- **User Story 1 (Phase 3)**: Depends on Foundational. No dependency on User Story 2 or 3.
- **User Story 2 (Phase 4)**: Depends on Foundational and on User Story 1 (`environment` must exist before `buildBasePath` can derive from it, T007).
- **User Story 3 (Phase 5)**: Depends on User Story 1 only (`environment` must exist, T004) — independent of User Story 2, can be implemented in parallel with Phase 4 by a different contributor.
- **Polish (Phase 6)**: Depends on all three original user stories being complete (T001–T014). Not re-run wholesale for the MR-75 amendment — see Phase 7's own checkpoint instead.
- **User Story 4 (Phase 7, MR-75 amendment)**: No dependency on User Stories 1/2 (`environment`/`buildBasePath`) at all — only touches `src/App.ts`/`test/src/App.test.ts`, the same files as User Story 3 (T013, T014, T012). Sequence T020/T021 after T012–T014 (same-file edits, not parallel), not because of a data dependency.

### Within Each User Story

- Tests are written first and confirmed failing before the corresponding implementation task.
- `src/environment.ts` grows incrementally: `environment`/`resolveEnvironment` (US1, T004) then `buildBasePath` (US2, T007) — same file, so T007 always runs after T004.
- `webpack.config.js` is touched twice (T002 in Foundational, T008 in US2) — sequential, same file.
- `.circleci/config.yml` edits (T009–T011) are sequential — same file.

### Parallel Opportunities

- T005 (test file) and T006 (`package.json`) touch different files with no dependency on each other — run in parallel.
- T009 (new CircleCI job) touches a different file from T005/T006/T007/T008 and only needs T006's script names to exist — can start as soon as T006 lands, in parallel with T007/T008.
- T015 and T019 (Polish) touch different files from each other and from T016–T018 — run in parallel.
- Phase 4 (User Story 2) and Phase 5 (User Story 3) have no file overlap (`.circleci/config.yml`/`package.json`/`webpack.config.js` vs. `src/App.ts`) and can be staffed/executed in parallel once Phase 3 (User Story 1) is done.

---

## Parallel Example: User Story 2

```bash
# Once User Story 1 (T003-T004) is done, launch together:
Task: "Extend test/src/environment.test.ts with buildBasePath tests"       # T005
Task: "Add build:standalone:develop / build:standalone:test to package.json"  # T006
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1) — `environment` constant resolves correctly everywhere.
3. **STOP and VALIDATE**: quickstart.md steps 1–2.
4. This alone already unblocks ad hoc `environment`-based checks in code, even before CI/Android wiring exists.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. User Story 1 → validate independently (MVP).
3. User Story 2 and User Story 3 → can proceed in parallel (no file overlap) → validate each independently.
4. Polish → repo-wide gates (`npm test`, `npm run build:all`, quickstart.md, CLAUDE.md).

### Operational prerequisite (outside this repo, do not block coding on it)

Before T009–T011 can be validated against a *real* CircleCI run (not just statically reviewed), the `aws-context` CircleCI context must exist and contain `AWS_TEST_REGION`, and the shared bucket's access key must have write permission scoped to the `assessment-survey-js/` prefix (research.md §5). This is an ops/IAM step for whoever administers the CircleCI project, tracked here so it isn't silently assumed to already be in place.

---

## Notes

- [P] tasks = different files, no dependency on an incomplete task.
- [Story] label maps each task to its user story for traceability back to spec.md.
- Every implementation task has a preceding, initially-failing test task, per Constitution Principle VI.
- Commit after each task or logical group.
- Stop at either checkpoint (end of Phase 3, end of Phase 4/5) to validate independently before continuing.
- **MR-75 amendment**: after T021, re-run `npm test` (full suite) and execute [quickstart.md](./quickstart.md) step 6 before considering the amendment done — no new Polish task was added since this is a ~5-line, same-file change riding on Phase 6's already-passing gates; re-running them is sufficient without a dedicated task entry.
