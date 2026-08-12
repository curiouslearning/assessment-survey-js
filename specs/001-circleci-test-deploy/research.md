# Phase 0 Research: CircleCI Test-Environment Build & Deploy

All items below were resolved from the existing repository configuration and the feature spec. No
open `NEEDS CLARIFICATION` markers remain.

## R1. Reusable command vs. duplicated jobs

- **Decision**: Introduce a single CircleCI reusable **command** named `build_and_sync` with
  parameters `to`, `build-script`, and `from`, and invoke it from the test-environment job (and,
  optionally, from the existing `s3-deploy` / `s3-deploy-prod` jobs).
- **Rationale**: The current `.circleci/config.yml` duplicates the `checkout` →
  `node/install-packages` → `npm run build` → `aws-s3/sync` sequence across two jobs. A parameterized
  command removes the duplication and satisfies FR-007..FR-010. Aligns with constitution Principle II
  (single responsibility, open for reuse via parameters).
- **Alternatives considered**: (a) Copy/paste a third job for the test env — rejected, perpetuates
  duplication the user explicitly wants to avoid. (b) Author a private CircleCI orb — rejected as
  over-engineered for one repo; a reusable command in the same config is simpler.

## R2. Command parameters and naming

- **Decision**: Parameters are `to` (string, S3 destination URI), `build-script` (string, an npm
  script name defined in `package.json`), and `from` (string, source build folder, default `./build`).
  The command runs `npm run <build-script>` then `aws-s3/sync from=<from> to=<to>`.
- **Rationale**: Matches the user's requested parameters — "(s3 destination), build-script (as defined
  in package.json), from (build folder)". Using the npm script name as a parameter keeps the CI config
  decoupled from build internals; `package.json` remains the single source of build truth (Principle
  II). Defaulting `from` to `./build` matches the webpack `output.path` (`build/`) and workbox
  `globDirectory: build/`.
- **Alternatives considered**: Passing a raw shell build command instead of an npm script name —
  rejected; it duplicates build logic already centralized in `package.json`.

## R3. "Production config" for the test environment

- **Decision**: The test-environment job builds with `npm run build` (which runs
  `build:standalone` with `NODE_ENV=production` + `workbox injectManifest`), i.e. the same production
  build the existing deploy jobs use.
- **Rationale**: The spec requires a production-equivalent artifact ("Should use production config").
  `webpack.config.js` switches to production mode when `NODE_ENV=production`, and `build:standalone`
  sets exactly that. Passing `build` as the `build-script` parameter reuses this without a separate
  test-only build configuration.
- **Alternatives considered**: A dedicated test build config — rejected as explicitly out of scope and
  contrary to "use production config."

## R4. Quality-gate ordering (lint → test → build → sync)

- **Decision**: The test-environment job runs `npm run lint`, then `npm test`, then the
  `build_and_sync` command (which performs build then sync). Any failure stops the job before sync.
- **Rationale**: Satisfies FR-002/FR-004 and constitution Principle IV. CircleCI stops a job at the
  first failing step, so ordering the steps this way guarantees no sync on failure.
- **Alternatives considered**: Running lint/test as separate upstream jobs with `requires` — valid and
  can be adopted, but a single ordered job is the simplest correct expression and keeps the gate and the
  deploy in one place. Fan-out can be added later without changing the command contract.

## R5. Missing `lint` script (constitution gap)

- **Decision**: Add `"lint": "prettier --check ."` to `package.json` scripts.
- **Rationale**: Principle IV requires lint to pass, but no `lint` script exists today — only `format`
  (`prettier --write .`). Prettier is already a devDependency, so `prettier --check .` is the
  lowest-friction enforceable gate and is the read-only counterpart of the existing `format` script. No
  new tooling is introduced.
- **Alternatives considered**: Adding ESLint — more thorough but pulls in new dependencies and config;
  deferred as a possible future enhancement. Skipping lint entirely — rejected, violates Principle IV and
  FR-002.

## R6. Trigger branch and destination for the test environment

- **Decision (confirmed via `/speckit-clarify`)**: Gate the test-environment job to the `test` branch
  and sync to `s3://globallit-aws-s3-static-webapp-test-us-west-2` in region `us-west-2`. Region is
  passed as a command parameter naming an env var (test job → `AWS_TEST_REGION`, set to `us-west-2` in
  the CircleCI test context), keeping dev/prod on their existing region vars.
- **Rationale**: Existing config uses `develop → assessment-and-survey-development` and
  `main → assessment-and-survey-production`; the test environment is a distinct bucket. The destination
  and region are command parameters, so values are trivially changeable per environment.
- **Alternatives considered**: Reusing `develop`/the development bucket — rejected; the user asked for a
  distinct test environment, and reusing develop would conflate the two.

## R7. Credentials and orb/executor versions

- **Decision**: Reuse the existing secure env vars (`AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`, an
  AWS region var), the `circleci/aws-s3@3.0` and `circleci/node@7.0.0` orbs, and the `node/default`
  executor at tag `24.10` — all already present in `.circleci/config.yml`.
- **Rationale**: Consistency with the working pipeline; satisfies FR-011 (no committed secrets).
- **Alternatives considered**: Introducing a CircleCI context for AWS creds — compatible and can be
  layered on, but not required since env vars are already wired.
