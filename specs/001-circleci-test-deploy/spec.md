# Feature Specification: CircleCI Test-Environment Build & Deploy

**Feature Branch**: `feature/mr-190-create-test-env`

**Created**: 2026-08-11

**Status**: Draft

**Input**: User description: "Generate circleci build config for test environment. Should use production config. Should lint, test, build before synching to s3 bucket. Use circleci command or make a new oone. command should be parameterized to (s3 destination), build-script (as defined in package.json), from (build folder)."

## Clarifications

### Session 2026-08-11

- Q: What S3 destination should the test-environment build be published to? → A: `s3://globallit-aws-s3-static-webapp-test-us-west-2` (region `us-west-2`)
- Q: What triggers a test-environment deployment? → A: Merges to the `test` branch

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automated test-environment deployment (Priority: P1)

As a member of the development team, when approved changes land on the test-environment
branch, I want the pipeline to validate the code and publish a production-equivalent build to
the test environment automatically, so the team always has a current, deployable artifact to
verify against without manual steps.

**Why this priority**: This is the core value of the feature — without automated
validate-and-publish, there is no test-environment deployment at all. Every other capability
depends on this flow existing.

**Independent Test**: Push a change to the test-environment branch and confirm the pipeline
runs quality checks, produces a production-configured build, and the resulting artifacts appear
at the configured test-environment destination.

**Acceptance Scenarios**:

1. **Given** a change is merged to the test-environment branch, **When** the pipeline runs,
   **Then** it executes linting, the test suite, and a production-configured build in that order
   before any deployment step.
2. **Given** all quality checks and the build succeed, **When** the pipeline reaches the
   deployment step, **Then** the contents of the configured build folder are synchronized to the
   configured S3 destination.
3. **Given** the build folder is synchronized to S3, **When** the sync completes, **Then** the
   test-environment destination reflects the newly built artifacts and stale files no longer
   present in the build folder are removed.

---

### User Story 2 - Quality gate blocks broken deployments (Priority: P1)

As a release-conscious engineer, I want a failing lint, test, or build to stop the pipeline
before anything is published, so broken code never reaches the test environment.

**Why this priority**: A deployment pipeline that publishes unvalidated artifacts is worse than
none; the gate is what makes the automation trustworthy. This directly enforces the project's
"green quality gates" principle.

**Independent Test**: Introduce a deliberate lint error (then separately a failing test, then a
build error) on the test-environment branch and confirm the pipeline halts before the S3 sync
step in each case.

**Acceptance Scenarios**:

1. **Given** linting fails, **When** the pipeline runs, **Then** the pipeline stops and the S3
   sync step does not execute.
2. **Given** the test suite fails, **When** the pipeline runs, **Then** the pipeline stops and
   the S3 sync step does not execute.
3. **Given** the production build fails, **When** the pipeline runs, **Then** the pipeline stops
   and the S3 sync step does not execute.

---

### User Story 3 - Reusable, parameterized deploy command (Priority: P2)

As a pipeline maintainer, I want the validate-build-and-sync behavior packaged as a single
reusable command parameterized by S3 destination, build script name, and source build folder, so
the same logic can be reused for additional environments or destinations without duplicating
configuration.

**Why this priority**: Reuse and parameterization reduce future maintenance and make it trivial
to add further environments, but the test-environment flow can ship first even if reuse is added
incrementally.

**Independent Test**: Invoke the command with a given S3 destination, build-script name, and
source folder, then invoke it again with different values, and confirm each invocation targets the
values it was given without editing the command body.

**Acceptance Scenarios**:

1. **Given** the reusable command, **When** it is invoked with an S3 destination parameter,
   **Then** artifacts are synchronized to exactly that destination.
2. **Given** the reusable command, **When** it is invoked with a build-script parameter naming a
   script defined in `package.json`, **Then** that script is used to produce the build.
3. **Given** the reusable command, **When** it is invoked with a source build-folder parameter,
   **Then** the contents of exactly that folder are synchronized.

---

### Edge Cases

- What happens when the named build script does not exist in `package.json`? The pipeline MUST
  fail clearly at the build step rather than proceed to sync an empty or stale folder.
- What happens when the configured build folder is empty or missing after a "successful" build?
  The pipeline MUST treat this as a failure and MUST NOT publish an empty destination.
- What happens when deployment credentials for the destination are missing or invalid? The sync
  step MUST fail with a clear error and MUST NOT partially publish.
- What happens when two changes land on the test-environment branch in quick succession? The most
  recently completed successful pipeline determines the final published state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The pipeline MUST trigger automatically on merges to the `test` branch.
- **FR-002**: The pipeline MUST run linting, the automated test suite, and a build, in that
  order, before any deployment step.
- **FR-003**: The build step MUST use the production configuration/build script so the
  test-environment artifact is production-equivalent.
- **FR-004**: The pipeline MUST halt and skip deployment if linting, testing, or building fails.
- **FR-005**: On successful validation and build, the pipeline MUST synchronize the contents of
  the configured build folder to the configured S3 destination
  (`s3://globallit-aws-s3-static-webapp-test-us-west-2`, region `us-west-2`, for the test
  environment).
- **FR-006**: The synchronize step MUST make the destination match the build folder, removing
  destination files that are no longer present in the build folder.
- **FR-007**: The validate-build-and-sync behavior MUST be expressed as a single reusable command.
- **FR-008**: The reusable command MUST accept a parameter for the S3 destination.
- **FR-009**: The reusable command MUST accept a parameter for the build-script name as defined in
  `package.json`.
- **FR-010**: The reusable command MUST accept a parameter for the source build folder to
  synchronize from.
- **FR-011**: Deployment credentials MUST be supplied through the pipeline's secure configuration
  rather than committed to the repository.

### Key Entities *(include if feature involves data)*

- **Pipeline run**: A single execution triggered by a change on the test-environment branch;
  proceeds through validate → build → deploy stages and has an overall pass/fail outcome.
- **Reusable deploy command**: The parameterized unit encapsulating validate-build-and-sync;
  attributes are its three parameters (S3 destination, build-script name, source build folder).
- **Build artifact set**: The files produced in the source build folder that are published to the
  destination.
- **Deployment destination**: The S3 location that receives the synchronized artifacts for the
  test environment — `s3://globallit-aws-s3-static-webapp-test-us-west-2` (region `us-west-2`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of changes landing on the test-environment branch trigger a pipeline run
  without manual intervention.
- **SC-002**: 0% of pipeline runs with a failing lint, test, or build step result in any artifact
  being published to the destination.
- **SC-003**: A team member can point the reusable command at a new S3 destination, build script,
  and source folder using parameters only, with no edits to the command body.
- **SC-004**: After a successful run, the destination contents exactly match the build folder
  contents (no missing new files, no leftover stale files).
- **SC-005**: A newly merged change is validated, built, and published to the test environment
  within a single automated pipeline run.

## Assumptions

- The test-environment deploy is triggered by merges to the `test` branch (see Clarifications).
- "Production config" means the existing production build script/configuration already defined in
  the project is reused for the test environment so the artifact is production-equivalent; a
  separate test-only build configuration is out of scope.
- The project already exposes lint, test, and build steps as scripts (the "green quality gates"
  from the project constitution); this feature orchestrates those steps rather than defining them.
- Deployment targets the S3 bucket `globallit-aws-s3-static-webapp-test-us-west-2` in region
  `us-west-2` (see Clarifications); the credentials needed to write to it are provided through the
  CI platform's secure configuration.
- Synchronization semantics mirror a folder-to-bucket sync (upload changed/new files, remove files
  absent from the source), consistent with the "should sync" intent.
- Rollback, multi-region distribution, and cache/CDN invalidation are out of scope for this
  feature.
