# Phase 1 Data Model: CircleCI Test-Environment Build & Deploy

This feature is CI/CD configuration; its "entities" are pipeline constructs rather than persisted
data. They map directly to the spec's Key Entities.

## Entity: `build_and_sync` reusable command

The parameterized unit encapsulating build-then-sync (spec: "Reusable deploy command").

| Parameter      | Type   | Required | Default   | Description                                              |
|----------------|--------|----------|-----------|----------------------------------------------------------|
| `to`           | string       | yes | —                  | S3 destination URI, e.g. `s3://globallit-aws-s3-static-webapp-test-us-west-2` |
| `build-script` | string       | yes | —                  | npm script name from `package.json` (e.g. `build`)       |
| `from`         | string       | no  | `./build`          | Source build folder synchronized to `to`                 |
| `region`       | env_var_name | no  | `AWS_DEFAULT_REGION` | Env var naming the AWS region (test job → `AWS_TEST_REGION` = `us-west-2`) |

**Validation rules** (from requirements):

- `build-script` MUST name a script that exists in `package.json`; a non-existent script MUST fail the
  build step (FR-009, edge case).
- `from` MUST contain build output after the build step; an empty/missing folder MUST fail rather than
  publish an empty destination (edge case).
- Sync MUST mirror source to destination, deleting destination files absent from `from` (FR-006).

**Behavior sequence**: `checkout` → install packages → `npm run <build-script>` → `aws-s3/sync from=<from> to=<to>`.

## Entity: Test-environment job

A single execution unit (spec: "Pipeline run") that enforces the quality gate before deployment.

**Ordered steps**:

1. `checkout`
2. install packages (`node/install-packages`)
3. `npm run lint` — gate 1 (FR-002)
4. `npm test` — gate 2 (FR-002)
5. `build_and_sync` command with the test-environment parameters — build (gate 3) then sync (FR-005)

**State transitions**: `queued → running → (any step fails ⇒ failed, no sync) | (all pass ⇒ success, published)`.

## Entity: Workflow / branch trigger

Wires the job to the designated test-environment branch (spec: part of "Pipeline run" trigger).

| Field    | Value                                                        |
|----------|-------------------------------------------------------------|
| trigger  | push to the test-environment branch (planned default `test`) |
| filter   | branch filter limiting the job to that branch (FR-001)      |
| requires | none additional (gate steps are in-job) or upstream test job |

## Entity: Deployment destination

The S3 location receiving synchronized artifacts (spec: "Deployment destination").

| Field       | Value                                                       |
|-------------|-------------------------------------------------------------|
| bucket URI  | passed via `to` (`s3://globallit-aws-s3-static-webapp-test-us-west-2`) |
| region      | `us-west-2`, via the `region` param → `AWS_TEST_REGION` env var |
| credentials | `AWS_ACCESS_KEY` / `AWS_SECRET_ACCESS_KEY` env vars (FR-011) |

## Entity: Build artifact set

Files produced in `from` by the build script and published to the destination.

- Source: output of `npm run <build-script>` (production build → `build/`).
- Published as: the mirrored contents of `from` at `to`.
