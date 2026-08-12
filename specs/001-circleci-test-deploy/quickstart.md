# Quickstart & Validation: CircleCI Test-Environment Build & Deploy

This guide validates the feature end-to-end. It references [contracts/build-and-sync-command.md](./contracts/build-and-sync-command.md)
and [data-model.md](./data-model.md) rather than restating them. No application code is included here.

## Prerequisites

- CircleCI CLI installed (`circleci version`) for local config validation.
- Repository connected to a CircleCI project with these env vars set: `AWS_ACCESS_KEY`,
  `AWS_SECRET_ACCESS_KEY`, and an AWS region var (`AWS_TEST_REGION` = `us-west-2` for the test context).
- The test-environment S3 bucket `globallit-aws-s3-static-webapp-test-us-west-2` exists and the credentials can write to it.
- `package.json` has runnable `lint`, `test`, and `build` scripts (this feature adds `lint`).

## Local validation (no deploy)

```bash
# 1. Config is syntactically valid and the command/jobs resolve
circleci config validate
circleci config process .circleci/config.yml > /dev/null

# 2. The gates run locally exactly as CI invokes them
npm run lint
npm test
npm run build          # produces ./build (production config)
ls build/index.html build/bundle.js   # build artifacts present
```

## Validation scenarios (Given / When / Then)

### Scenario 1 — Happy path publishes to the test environment (US1)

- **Given** a change is pushed to the test-environment branch and all scripts pass,
- **When** the `s3-deploy-test` job runs,
- **Then** it executes `lint` → `test` → `build_and_sync`, and the contents of `./build` are mirrored
  to the configured `s3://…` destination.

### Scenario 2 — Production-equivalent build (US1)

- **Given** the job uses `build-script: build`,
- **When** the build step runs,
- **Then** it runs `npm run build` (NODE_ENV=production webpack + workbox), producing the same
  production artifact the existing deploy jobs produce.

### Scenario 3 — Lint failure blocks deploy (US2)

- **Given** a formatting/lint error exists on the branch,
- **When** the job runs,
- **Then** `npm run lint` exits non-zero, the job stops, and `aws-s3/sync` never executes.

### Scenario 4 — Test failure blocks deploy (US2)

- **Given** a failing test on the branch,
- **When** the job runs,
- **Then** `npm test` exits non-zero, the job stops before `build_and_sync`.

### Scenario 5 — Build failure blocks deploy (US2)

- **Given** a build error (e.g. a bad `build-script` name),
- **When** the job runs,
- **Then** `npm run <build-script>` exits non-zero and no sync occurs.

### Scenario 6 — Parameter reuse (US3)

- **Given** the `build_and_sync` command,
- **When** it is invoked with different `to`, `build-script`, and `from` values (e.g. the existing
  develop and main jobs),
- **Then** each invocation targets exactly its parameters with no edits to the command body.

### Scenario 7 — Mirror deletes stale files (FR-006)

- **Given** a file previously deployed no longer exists in `./build`,
- **When** the sync runs,
- **Then** that file is removed from the destination so it matches `./build`.

## Expected outcomes checklist

- [ ] `circleci config validate` passes.
- [ ] `s3-deploy-test` runs only on the test-environment branch.
- [ ] A failing lint, test, or build prevents any S3 sync.
- [ ] After a successful run, the destination bucket matches `./build` exactly.
- [ ] The same `build_and_sync` command can drive the develop/main deploys via parameters.
