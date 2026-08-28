# Feature Specification: Build Environment Constant

**Feature Branch**: `001-add-environment-constant`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "add a feature that creats a constant called environment that contains the value of the build mode used (develop, test, production). This means and build:standalone will have develop, test and production modes. Update circle ci config to use those modes to its corresponding environment (main branches). Pass that environment constant as a metadata parameter for AndroidInterface."

**Amendment (2026-08-28, MR-75)**: Scope extended, at the user's direction, to also gate `AndroidInterface` summary logging in standalone mode behind a remote feature flag (`mr-75`) fetched via `featureFlagsService.isFeatureEnabled()` — see User Story 4 below. This is folded into this existing spec rather than a new feature folder, per explicit instruction.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Runtime code knows which environment it was built for (Priority: P1)

As a developer, when the library runs (in the browser bundle, in the published package, or under the test runner), I need a single global `environment` value (`develop`, `test`, or `production`) that reliably reflects which mode the code was built/run in, so that environment-dependent behavior and diagnostics can rely on one source of truth instead of ad-hoc checks scattered through the code.

**Why this priority**: Every other story (CI wiring, Android metadata) depends on this constant existing and being correct. Without it, there is nothing to plug into the build pipeline or into `AndroidInterface`.

**Independent Test**: Can be fully tested by building the standalone bundle in each of the three modes and asserting, from the built/loaded bundle, that the exposed `environment` value matches the mode it was built with; and by running the automated test suite and asserting the value resolves to `test`.

**Acceptance Scenarios**:

1. **Given** the standalone bundle is built in "develop" mode, **When** the bundle runs, **Then** the exposed `environment` constant equals `develop`.
2. **Given** the standalone bundle is built in "production" mode, **When** the bundle runs, **Then** the exposed `environment` constant equals `production`.
3. **Given** the standalone bundle is built in "test" mode, **When** the bundle runs, **Then** the exposed `environment` constant equals `test`.
4. **Given** the automated test suite is executed (`npm test`), **When** any test reads the `environment` constant, **Then** it equals `test` without any extra configuration, because the test runner's own default mode already means "test".
5. **Given** no build mode is explicitly configured (e.g. an ad-hoc local run), **When** the code resolves `environment`, **Then** it falls back to `develop` rather than throwing or resolving to an empty/undefined value.

---

### User Story 2 - Each deployment pipeline branch ships a bundle flagged with its real environment (Priority: P2)

As a DevOps engineer, when CircleCI builds and deploys the standalone bundle for a given branch, I need `build:standalone` to run in the mode matching that branch's deployment target, so the bundle shipped to each destination correctly reports which environment it belongs to.

**Why this priority**: Depends on User Story 1 existing. Delivers value by making the deployed artifacts self-describing, which is the direct ask from the feature request ("update circle ci config to use those modes to its corresponding environment").

**Independent Test**: Can be fully tested by triggering (or simulating) a CircleCI pipeline run on each of the `develop`, `test`, and `main` branches and inspecting the deployed bundle's `environment` value in each destination.

**Acceptance Scenarios**:

1. **Given** a pipeline run on the `develop` branch, **When** the deploy job builds and syncs the bundle, **Then** the deployed bundle's `environment` value is `develop` and it is synced to the existing development S3 bucket.
2. **Given** a pipeline run on the `main` branch, **When** the deploy job builds and syncs the bundle, **Then** the deployed bundle's `environment` value is `production` and it is synced to the existing production S3 bucket.
3. **Given** a pipeline run on the `test` branch, **When** the deploy job builds and syncs the bundle, **Then** the deployed bundle's `environment` value is `test` and it is synced into the `assessment-survey-js/` folder of the shared test S3 bucket (`s3://globallit-aws-s3-static-webapp-test-us-east-2/assessment-survey-js`), not the bucket root.
4. **Given** the bundle is built for the `test` environment, **When** its assets (bundle, stylesheet, images) are resolved at runtime, **Then** they resolve correctly under the `/assessment-survey-js/` sub-path the shared bucket serves them from, rather than assuming the bucket root.
5. **Given** the bundle is built for the `develop` or `production` environment, **When** its assets are resolved at runtime, **Then** they continue to resolve from the destination's root exactly as they do today (no sub-path prefix applied).
6. **Given** a pipeline run on any other branch not covered above, **When** the pipeline executes, **Then** no environment-specific deploy job runs for that branch (unchanged from current behavior).

---

### User Story 3 - Android host app logs are traceable to the environment that produced them (Priority: P3)

As a support/QA engineer investigating a session or summary report received through the Android host integration, I need the `environment` value included in the metadata sent to `AndroidInterface`, so I can immediately tell whether a given report came from a develop, test, or production build without cross-referencing deploy timestamps or app versions.

**Why this priority**: Smallest, most self-contained slice; depends on Story 1 but not on Story 2. Delivers immediate diagnostic value even before CI wiring is complete.

**Independent Test**: Can be fully tested by triggering both Android-integration code paths (session logging and summary-data logging) in a build with a known mode and asserting the metadata payload passed to `AndroidInterface` contains the matching `environment` value.

**Acceptance Scenarios**:

1. **Given** an assessment session ends, **When** the app logs user-session data through `AndroidInterface`, **Then** the metadata payload includes an `environment` field equal to the current build's `environment` value.
2. **Given** a game (assessment or survey) ends and summary data is emitted, **When** the app logs summary data through `AndroidInterface`, **Then** the metadata payload includes an `environment` field equal to the current build's `environment` value.

---

### User Story 4 - `AndroidInterface` summary logging in standalone mode is gated behind feature flag `mr-75` (Priority: P2)

As a developer rolling out Android-host summary reporting for the standalone bundle, I need the existing `enableAndroidSummary` behavior to also require the remote `mr-75` feature flag to be enabled when the app is running in standalone mode, so the summary-logging integration can be turned on/off remotely (via Statsig) without a redeploy, independent of whatever the host page's own `enableAndroidSummary` config says.

**Why this priority**: Independent of Stories 1–3's `environment` constant, but shares the same host-integration surface (`AndroidInterface`) as Story 3, so it's sequenced alongside it. Not required for Stories 1/2 to deliver value.

**Independent Test**: Can be fully tested by starting the app with `platform: 'standalone'` (the default for `startStandaloneApp`/`src/standalone.ts`) under each combination of `enableAndroidSummary` config value (`true`/default vs. explicit `false`) and `featureFlagsService.isFeatureEnabled('mr-75')` mock return value (`true`/`false`), and asserting whether `notifySummaryData`/session-end logging actually constructs an `AndroidInterface` instance.

**Acceptance Scenarios**:

1. **Given** the app is running with `platform: 'standalone'` and `enableAndroidSummary` resolves to `true` (default or explicit), **When** the `mr-75` feature flag resolves to `true`, **Then** `AndroidInterface` is constructed and summary/session data is logged exactly as it is today.
2. **Given** the app is running with `platform: 'standalone'` and `enableAndroidSummary` resolves to `true`, **When** the `mr-75` feature flag resolves to `false`, **Then** `AndroidInterface` is NOT constructed and no summary/session data is logged, even though `enableAndroidSummary` itself says "on".
3. **Given** the app is running with `platform: 'standalone'` and the host explicitly passed `enableAndroidSummary: false`, **When** the `mr-75` feature flag resolves to `true`, **Then** `AndroidInterface` is still NOT constructed — the flag can only narrow (AND with) the existing config, never force logging on against an explicit opt-out.
4. **Given** the app is running with a `platform` other than `standalone` (e.g. the `<assessment-survey-player>` web component's default `'ftm'` platform), **When** the game ends, **Then** the `mr-75` flag is not consulted at all and `enableAndroidSummary` alone (existing, unchanged behavior) determines whether `AndroidInterface` is constructed.
5. **Given** `featureFlagsService.initialize()` fails or the flag is otherwise unresolvable, **When** the app is running in standalone mode, **Then** the `mr-75` flag is treated as disabled (fail-safe/closed), matching the existing fail-safe treatment of the `drag-drop-assessment-ui` flag at the same initialization call.

---

### Edge Cases

- What happens when the underlying mode signal is an unrecognized string (something other than the three known modes)? System MUST fall back to `develop` rather than propagating an invalid value.
- What happens when `AndroidInterface` logging is disabled (`enableAndroidSummary` is off)? No metadata is sent at all (unchanged, pre-existing behavior) — the `environment` field is simply not part of any payload in that case.
- What happens for branches/workflows that don't deploy a standalone bundle at all (e.g. the npm package publish jobs)? They are unaffected — the environment-to-mode mapping only governs the standalone bundle build/deploy jobs.
- What happens if a future branch is added without an explicit environment mapping? It must not silently deploy under an incorrect environment label; it should be treated the same as "no environment-specific job runs" until explicitly wired.
- What happens if the test-mode base URL is accidentally applied to a develop or production build? Assets would 404 under a non-existent sub-path on buckets that are served from their root — this MUST NOT happen; the sub-path prefix is exclusively a `test`-mode concern.
- What happens if `mr-75` resolves to `true` but `platform !== 'standalone'`? No effect — the flag is only ever consulted for standalone-platform sessions (FR-016); non-standalone consumers keep today's `enableAndroidSummary`-only behavior unconditionally.
- What happens if the flag check runs before `featureFlagsService.initialize()` resolves? It MUST NOT — the gate is applied only after `initialize()` settles (success or caught failure), never against a not-yet-initialized service (which could return a stale/default value non-deterministically).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a single global `environment` constant whose value is one of exactly three literal values: `develop`, `test`, or `production`.
- **FR-002**: The `environment` constant's value MUST be derived from the build/run mode the code was produced or executed under, not hardcoded per environment copy of the source.
- **FR-003**: `build:standalone` MUST support producing a bundle in any of the three modes (`develop`, `test`, `production`), selectable at build-invocation time.
- **FR-004**: Running the automated test suite MUST resolve `environment` to `test` with no additional developer configuration required.
- **FR-005**: If the underlying mode signal is missing or unrecognized, `environment` MUST resolve to `develop` (safe default).
- **FR-006**: The CircleCI pipeline MUST build and deploy the standalone bundle for the `develop` branch using `develop` mode, to the existing development S3 destination.
- **FR-007**: The CircleCI pipeline MUST build and deploy the standalone bundle for the `main` branch using `production` mode, to the existing production S3 destination.
- **FR-008**: The CircleCI pipeline MUST add a deploy job for the `test` branch that builds the standalone bundle using `test` mode and syncs it into the `assessment-survey-js/` folder of the shared test S3 bucket (`s3://globallit-aws-s3-static-webapp-test-us-east-2`), leaving the rest of that bucket untouched.
- **FR-009**: The metadata payload passed to `AndroidInterface` at both existing call sites (user-session logging and summary-data logging) MUST include the current `environment` value.
- **FR-010**: Introducing the `environment` constant and its propagation into `AndroidInterface` metadata MUST NOT change any other field already present in those metadata payloads (e.g. `app_version`) or alter unrelated CircleCI jobs (npm package publish workflows).
- **FR-011**: The build MUST support a configurable base URL (a sub-path prefix under which the bundle's own assets are served) that is applied only to `test`-mode builds, so the bundle deployed into `assessment-survey-js/` on the shared bucket resolves its own assets under that same sub-path.
- **FR-012**: `develop`- and `production`-mode builds MUST NOT have any base-URL sub-path applied; their assets continue to resolve exactly as they do today (served from each destination's root).
- **FR-013**: The system MUST expose a named constant for the `mr-75` feature-flag key (mirroring the existing `FEATURE_DRAG_DROP_UI` constant pattern), so the literal flag string is defined once and referenced by name, not repeated as a magic string.
- **FR-014**: When the resolved `platform` is `'standalone'`, the effective value used to decide whether `AndroidInterface` is constructed (at both existing call sites) MUST be `enableAndroidSummary AND featureFlagsService.isFeatureEnabled('mr-75')` — evaluated only after `featureFlagsService.initialize()` has settled.
- **FR-015**: The `mr-75` gate MUST only ever narrow `enableAndroidSummary` from `true` to effectively-`false`; it MUST NOT cause `AndroidInterface` to be constructed when `enableAndroidSummary` itself resolved to `false` (explicit config opt-out always wins).
- **FR-016**: When the resolved `platform` is anything other than `'standalone'`, the `mr-75` flag MUST NOT be consulted; `enableAndroidSummary` alone continues to determine whether `AndroidInterface` is constructed, unchanged from current behavior.
- **FR-017**: If feature-flag initialization fails or `isFeatureEnabled('mr-75')` cannot be resolved, the flag MUST be treated as disabled (fail-safe/closed) — consistent with how a failed `featureFlagsService.initialize()` already leaves `isFeatureEnabled(FEATURE_DRAG_DROP_UI)` resolving to `false` today.

### Key Entities

- **Environment**: A build/run-mode classification with exactly three possible values (`develop`, `test`, `production`); consumed wherever the codebase needs to know which environment it is currently operating in.
- **AndroidInterface metadata**: The existing metadata object sent alongside session and summary logs to the Android host app; gains one new field (`environment`) alongside the existing `app_version`.
- **CircleCI deploy job**: A per-branch pipeline job that builds the standalone bundle and syncs it to an S3 destination; each of the three relevant branches (`develop`, `test`, `main`) maps one-to-one to one `environment` value and one S3 destination (the `test` destination being a sub-folder of a bucket shared with other projects, rather than a dedicated bucket).
- **Base URL / public path**: A sub-path prefix under which a build's own assets are served; empty for `develop`/`production`, and set to the shared bucket's `assessment-survey-js/` folder for `test` builds only.
- **Feature flag gate (`mr-75`)**: A remotely-controlled boolean (Statsig, via `featureFlagsService.isFeatureEnabled()`) that, only when `platform === 'standalone'`, is ANDed with `enableAndroidSummary` to decide whether `AndroidInterface` is constructed at either existing call site; defaults to disabled if unresolved.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For each of the three modes, a build produced in that mode reports the matching `environment` value 100% of the time, verified by an automated check.
- **SC-002**: A person inspecting any Android session or summary log can determine which environment produced it without consulting any other source (deploy logs, timestamps, app version lookup tables).
- **SC-003**: All three branch-based CircleCI deploy jobs (`develop`, `test`, `main`) run their build step with the correct mode and deploy to the correct, distinct S3 destination, with zero manual post-deploy correction needed.
- **SC-005**: The bundle deployed to the shared test bucket's `assessment-survey-js/` folder loads and runs correctly from that sub-path (no broken asset references), while develop and production deployments show no change in how their assets resolve.
- **SC-004**: Existing CI workflows unrelated to the standalone bundle (npm package publish/dry-run) show no behavior change after this feature ships.
- **SC-006**: Toggling the `mr-75` Statsig flag off, with no code deploy, stops all `AndroidInterface` construction from standalone-mode sessions within one feature-flag refresh cycle, verified by an automated test that mocks the flag both ways.
- **SC-007**: Non-standalone consumers (web component default platform) show zero behavior change in `enableAndroidSummary` handling after this feature ships, verified by an automated test asserting the flag is never consulted off the standalone platform.

## Assumptions

- "Build mode" for the purposes of this feature covers three states — local/dev, automated-test, and production — and does not need to represent finer-grained variants (e.g. staging-of-staging) beyond the newly added `test` branch/environment.
- The `test` branch is a new CircleCI addition dedicated to this environment. Its S3 destination, `s3://globallit-aws-s3-static-webapp-test-us-east-2`, is a bucket shared with other projects; this feature owns only the `assessment-survey-js/` folder within it and MUST NOT disturb other folders/objects in that bucket.
- The shared bucket serves each project folder at a URL path matching the folder name (e.g. `.../assessment-survey-js/`), so a `test`-mode build needs its own assets referenced under that same sub-path prefix; `develop` and `production` keep serving from their existing dedicated buckets' roots and need no such prefix.
- The two existing `AndroidInterface` call sites in the app's Android integration path are the complete set of places that need the `environment` field; no other host-integration payload is in scope.
- Consumers of the published npm package (as opposed to the standalone bundle) are responsible for their own bundler/runtime environment configuration; this feature only guarantees a correct default (`develop`) when no mode signal is present, not a build-time-frozen value inside the published package artifact.
- The existing `rc` branch and its npm-publish-approval workflow are out of scope; they are not being converted into a fourth environment.
- `platform: 'standalone'` (the default `startStandaloneApp`/`src/standalone.ts` sets, per `src/App.ts:691`) is a reliable, existing signal that distinguishes standalone-bootstrap sessions from other consumers (e.g. the web component defaults `platform` to `'ftm'`); this feature relies on that existing signal rather than introducing a new one or editing `src/standalone.ts` itself.
- The `mr-75` flag is evaluated once per `spinUp()` call, immediately after `featureFlagsService.initialize()` settles — same lifecycle as the existing `FEATURE_DRAG_DROP_UI` check — not re-evaluated later (e.g. mid-session) if the remote flag value changes after the app has already started.
