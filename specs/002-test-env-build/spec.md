# Feature Specification: Configurable Build Base Path per Environment

**Feature Branch**: `002-test-env-build`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "reset 002 requirements. build should be able to accept basePath config. for dev and prod, keep this \"\". for test, add \"/assessment-survey-js\". add build scripts in package.json for dev, test and production."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Environment-specific base path applied at build time (Priority: P1)

As a member of the development team, I want each build to be produced with a base path
appropriate to the environment it targets, so the deployed application resolves its resources
correctly whether it is hosted at a domain root or under a sub-path.

**Why this priority**: This is the core value of the feature. The test environment serves the
application from a sub-path (`/assessment-survey-js`) while dev and prod serve it from the root
(`""`). Without an environment-driven base path, the test artifact resolves resources from the
wrong location and the application fails to load correctly.

**Independent Test**: Produce a test build and confirm its base path is `/assessment-survey-js`;
produce a dev build and a prod build and confirm each has an empty (`""`) base path.

**Acceptance Scenarios**:

1. **Given** the test environment is selected, **When** a build is produced, **Then** the build's
   base path is `/assessment-survey-js`.
2. **Given** the dev environment is selected, **When** a build is produced, **Then** the build's
   base path is `""` (empty / root).
3. **Given** the prod environment is selected, **When** a build is produced, **Then** the build's
   base path is `""` (empty / root).
4. **Given** a produced build, **When** the application loads in its target environment, **Then**
   its resources resolve relative to that environment's configured base path without broken
   references.

---

### User Story 2 - Named build scripts per environment (Priority: P1)

As a developer or CI pipeline, I want a distinct build script for each of dev, test, and
production, so I can produce the correct artifact for a given environment with a single named
command.

**Why this priority**: The team and the CI pipeline need a stable, unambiguous way to trigger the
build for each environment. Without dedicated scripts, selecting the right base path per
environment is manual and error-prone.

**Independent Test**: Run each of the dev, test, and production build scripts and confirm each
completes and produces an artifact carrying its environment's configured base path.

**Acceptance Scenarios**:

1. **Given** the project's build scripts, **When** the dev build script is run, **Then** it
   produces a dev build with base path `""`.
2. **Given** the project's build scripts, **When** the test build script is run, **Then** it
   produces a test build with base path `/assessment-survey-js`.
3. **Given** the project's build scripts, **When** the production build script is run, **Then** it
   produces a production build with base path `""`.

---

### User Story 3 - Base path is a configurable input, not hard-coded per build (Priority: P2)

As a build maintainer, I want the base path to be a configurable value consumed by the build
rather than a hard-coded value that must be hand-edited between builds, so adding or changing an
environment's base path is a configuration change, not a source edit.

**Why this priority**: Making the base path a first-class configuration input reduces future
maintenance and prevents mistakes from manual edits, but the immediate dev/test/prod need can be
met even before broader reuse is generalized.

**Independent Test**: Change the base path value provided to a build and confirm the produced
artifact reflects the new value without editing application source.

**Acceptance Scenarios**:

1. **Given** the build accepts a base path configuration, **When** a build is run with a given
   base path value, **Then** the produced artifact reflects exactly that value.
2. **Given** the build accepts a base path configuration, **When** no base path is provided,
   **Then** the build uses the empty (`""`) default, matching dev/prod behavior.

---

### User Story 4 - Base path drives generated asset paths (Priority: P1)

As a user of the deployed application, I want every asset the application references to be prefixed
with the environment's configured base path, so that when the app is served from a sub-path (test:
`/assessment-survey-js`) its assets resolve correctly rather than pointing at the domain root.

**Why this priority**: Setting the base path is only useful if the application actually consumes it
when generating asset references. This story closes the loop between the configured base path and
the paths the running application requests, which is what makes the test-environment deployment
actually load.

**Independent Test**: With the base path set to `/assessment-survey-js`, confirm a generated asset
path is `/assessment-survey-js/<asset>`; with the base path set to `""`, confirm the generated
asset path matches today's root-relative/document-relative behavior.

**Acceptance Scenarios**:

1. **Given** the application's base path is set to `/assessment-survey-js`, **When** an asset path
   is generated (via the base-aware asset resolution at
   [assessment-template-resolvers.ts:withBase](../../src/ui/dom-template/assessment-template-resolvers.ts#L31)),
   **Then** the generated path is prefixed with `/assessment-survey-js`.
2. **Given** the application's base path is set to `""`, **When** an asset path is generated,
   **Then** the resulting path matches the current (pre-feature) behavior with no base prefix.
3. **Given** a base path with a trailing slash, **When** an asset path is generated, **Then** the
   base and asset are joined without a doubled or missing separator.

---

### User Story 5 - Service worker and PWA respect the base path (Priority: P1)

As a user of the deployed test application, I want offline support and the installable PWA to work
when the app is served from `/assessment-survey-js`, so that caching, offline navigation, and app
installation behave the same as they do at the domain root.

**Why this priority**: The service worker precaches assets and provides an offline navigation
fallback, and the web app manifest defines the PWA start location. Several of these currently rely
on root-absolute paths (`/index.html`, `/bundle.js`, and a `start_url` of `/`) that ignore the base
path. Under a sub-path deployment those references point outside the deployed app, so the offline
fallback fails to serve the cached shell and the installed PWA opens the wrong location. Without
this story the test build precaches assets but breaks offline and installs incorrectly.

**Independent Test**: Deploy a build with base path `/assessment-survey-js`, then (a) load the app
offline and confirm a page refresh/navigation is served the cached shell from under the base path,
and (b) inspect the web app manifest and confirm its start location is under `/assessment-survey-js`.
Repeat with base path `""` and confirm behavior is unchanged from today.

**Acceptance Scenarios**:

1. **Given** the base path is `/assessment-survey-js`, **When** the service worker resolves its
   offline navigation fallback shell, **Then** it targets the cached shell under
   `/assessment-survey-js` rather than a root-absolute `/index.html`, so the fallback is served
   from cache.
2. **Given** the base path is `/assessment-survey-js`, **When** the service worker's minimal
   fallback precache (used when Workbox is unavailable) runs, **Then** the paths it caches resolve
   under `/assessment-survey-js` rather than the domain root.
3. **Given** the base path is `/assessment-survey-js`, **When** the web app manifest is produced,
   **Then** its start location resolves under `/assessment-survey-js`.
4. **Given** the base path is `""`, **When** the service worker and web app manifest are produced,
   **Then** their behavior matches the current (pre-feature) behavior with no change.

---

### Edge Cases

- What happens when a build is run without specifying an environment or base path? It MUST default
  to an empty (`""`) base path, matching dev/prod behavior.
- What happens to already-absolute or externally-hosted asset references? They are out of scope for
  base-path prefixing; only assets resolved through the base-aware resolution are affected.
- What happens to service-worker fallbacks that today use root-absolute paths (`/index.html`,
  `/bundle.js`)? Under a non-empty base path they MUST resolve under the base path; otherwise the
  offline navigation fallback misses the cached shell and serves nothing.
- What happens to the web app manifest `start_url` (currently `/`) under a non-empty base path? It
  MUST resolve under the base path so the installed PWA opens the deployed app rather than the
  domain root.
- What happens to the precache manifest itself under a sub-path? Its entries are relative and are
  resolved against the service worker's scope; the deployment MUST place the service worker (and the
  build root it is generated from) under the base path so those relative entries resolve correctly.
- What happens if a base path is provided with or without a trailing slash? The build MUST apply
  the value consistently so resources resolve correctly regardless of that minor formatting
  difference.
- What happens to the existing default/production build behavior? Producing a build with an empty
  base path MUST match today's behavior, so existing deployments are unaffected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The build MUST accept a base path as a configuration input.
- **FR-002**: When no base path is provided, the build MUST default to an empty string (`""`).
- **FR-003**: The dev build MUST use a base path of `""`.
- **FR-004**: The production build MUST use a base path of `""`.
- **FR-005**: The test build MUST use a base path of `/assessment-survey-js`.
- **FR-006**: The project MUST provide a distinct, named build script for each of the dev, test,
  and production environments.
- **FR-007**: Each environment's build script MUST apply that environment's configured base path
  without requiring manual source edits between builds.
- **FR-008**: The base path value MUST flow through to wherever the application resolves its
  resources, so the produced artifact loads correctly under its target environment's path.
- **FR-009**: Introducing the configurable base path MUST NOT change the output of a build that
  uses the empty (`""`) base path compared to current default behavior.
- **FR-010**: The base path set in the application MUST be the value used when generating asset
  paths through the base-aware asset resolution (`withBase` in
  `src/ui/dom-template/assessment-template-resolvers.ts`, invoked by the template engine's asset
  resolution), so generated asset references are prefixed with the configured base path.
- **FR-011**: When the base path is empty (`""`), generated asset paths MUST retain their current
  behavior (root-relative or document-relative per the existing resolution rules).
- **FR-012**: Base-path prefixing of asset paths MUST handle a base path supplied with or without a
  trailing slash, producing a correctly joined path in either case.
- **FR-013**: The service worker's offline navigation fallback MUST target the cached application
  shell under the configured base path rather than a root-absolute path (`/index.html`), so the
  fallback is served from cache when the app is deployed under a sub-path.
- **FR-014**: The service worker's minimal fallback precache (used when Workbox fails to load) MUST
  cache paths resolved under the configured base path rather than root-absolute paths
  (`/index.html`, `/bundle.js`).
- **FR-015**: The web app manifest's start location (`start_url`) MUST resolve under the configured
  base path.
- **FR-016**: When the base path is empty (`""`), the service worker behavior and web app manifest
  MUST be unchanged from current behavior, so existing (dev/prod) deployments are unaffected.
- **FR-017**: The service worker's precache manifest entries MUST resolve under the configured base
  path; the build/deployment MUST place the service worker under the base path so its relative
  precache entries resolve correctly.

### Key Entities *(include if feature involves data)*

- **Build environment**: The named target of a build — dev, test, or production — that selects
  which base path value applies.
- **Base path configuration**: The environment-dependent value the build consumes to determine
  where the application is hosted; `""` for dev and production, `/assessment-survey-js` for test.
- **Build script**: The named command that triggers a build for a specific environment with that
  environment's base path applied.
- **Base-aware asset resolution**: The point at which a relative asset path is combined with the
  configured base path to produce the final asset reference (`withBase`); it is where the base path
  value is consumed at runtime.
- **Service worker**: The offline/caching layer that precaches build assets and provides an offline
  navigation fallback; it must resolve its cached-shell and fallback paths under the base path.
- **Web app manifest**: The PWA metadata (including the start location) that must resolve under the
  base path so the installed app opens the deployed sub-path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of test builds produce an artifact whose base path is `/assessment-survey-js`.
- **SC-002**: 100% of dev and production builds produce an artifact whose base path is `""`.
- **SC-003**: A developer can produce the correct artifact for any of the three environments with a
  single named command, without editing application source or configuration between builds.
- **SC-004**: Changing the provided base path value changes the produced artifact's base path
  accordingly, with no source edits required.
- **SC-005**: A build produced with an empty base path is equivalent to the current default build
  output, so existing deployments are unaffected.
- **SC-006**: With the base path set to `/assessment-survey-js`, 100% of assets resolved through
  the base-aware resolution are requested from under `/assessment-survey-js`.
- **SC-007**: With the base path set to `/assessment-survey-js`, an offline page refresh/navigation
  is served the cached application shell from under `/assessment-survey-js` (offline fallback
  succeeds rather than returning nothing).
- **SC-008**: With the base path set to `/assessment-survey-js`, the web app manifest's start
  location resolves under `/assessment-survey-js`.

## Assumptions

- "basePath" is a single configurable value applied to the build that determines the root under
  which the application is served; `""` means served from the domain root, `/assessment-survey-js`
  means served from that sub-path.
- The test environment is served from `/assessment-survey-js` (matching the repository name,
  spelled with a double "s"), superseding the earlier `/assesment-survey-js/assets` value from the
  previous version of this spec.
- The base path governs how the application resolves its resources; the concrete consumption point
  is the existing base-aware asset resolution `withBase` in
  `src/ui/dom-template/assessment-template-resolvers.ts` (used by the template engine's
  `resolveAsset`). This feature feeds the configured base path into that value so generated asset
  paths are prefixed accordingly; it does not introduce a new resolution mechanism.
- The existing `withBase` normalization already trims a trailing slash and strips leading slashes on
  the asset path; this feature relies on that behavior rather than changing it.
- Three environments are in scope now — dev, test, and production. No other environments (e.g.
  staging) are included.
- The dedicated build scripts are added to the project's `package.json` script definitions, as
  requested; the test build script is intended to be callable by the existing test-environment CI
  flow (see `specs/001-circleci-test-deploy`).
- The service worker is registered with a relative script URL (`./sw.js`), so its scope follows the
  page location; the deployment is expected to serve the build root (including `sw.js`) under the
  base path. This feature addresses the remaining root-absolute references that do not follow that
  scope, namely the offline-fallback shell paths and the web app manifest `start_url`.
- The concrete root-absolute references to reconcile with the base path are the service-worker
  offline navigation fallback and minimal fallback precache in `sw-src.js` (currently `/index.html`
  and `/bundle.js`) and the `start_url` (currently `/`) in `public/manifest.json`. Relative
  references such as the manifest icon `src` already resolve correctly and are unchanged.
- No configuration beyond the base path is introduced by this feature.
