# Phase 0 Research: Configurable Build Base Path per Environment

All Technical Context items were resolvable from the existing codebase; there were no open
`NEEDS CLARIFICATION` markers. This document records the key decisions and the alternatives weighed.

## Decision 1 — How the build receives the base path

**Decision**: Read `process.env.BASE_PATH` in `webpack.config.js`, defaulting to `""`. Set it per
environment through the npm scripts using the already-present `cross-env` dependency
(`cross-env BASE_PATH=/assessment-survey-js ...`).

**Rationale**: Mirrors the existing `NODE_ENV` pattern already used in `webpack.config.js` and the
`build:standalone` script. `cross-env` is already a devDependency, so no new tooling. Environment
variable → single source of truth consumed by webpack, satisfying FR-001/FR-002/FR-006/FR-007.

**Alternatives considered**:
- A separate `webpack.test.config.js` — rejected: duplicates the whole config for a one-value delta
  and drifts from the production config (the exact problem the reset spec avoids).
- A CLI `--env` flag parsed in webpack — workable but less consistent with the current `NODE_ENV`
  convention and noisier in `package.json`.

## Decision 2 — Injecting the base path into `index.html`

**Decision**: Add a placeholder token to `index.html` (`data-asset-base-url="__BASE_PATH__/assets"`)
and replace `__BASE_PATH__` with the configured base path in the `copy-webpack-plugin` `transform`
hook for the `index.html` pattern. Empty base path yields `/assets` (unchanged); test yields
`/assessment-survey-js/assets`.

**Rationale**: `index.html` is already copied verbatim by `copy-webpack-plugin`; a per-pattern
`transform` is the least-invasive injection point. Keeping `/assets` as the suffix means the
empty-base-path output is byte-identical to today (FR-009). The value lands in the exact attribute
`standalone.ts` already reads (`data-asset-base-url`), which flows to `withBase` via the template
engine — satisfying FR-005, FR-008, FR-010 with no new runtime code.

**Alternatives considered**:
- Runtime derivation of the base path from `window.location` — rejected: the spec states the *build*
  applies the base path (FR-005/FR-007), and build-time injection is deterministic and testable
  without a browser.
- `html-webpack-plugin` templating — rejected: the project copies a hand-authored `index.html`
  rather than generating one; adding the plugin is a larger change than a token replace.

## Decision 3 — `manifest.json` `start_url` under a sub-path

**Decision**: Make `start_url` base-path-aware by tokenizing it the same way
(`"start_url": "__BASE_PATH__/"`), replaced at copy time. Empty base path → `/` (unchanged); test →
`/assessment-survey-js/`.

**Rationale**: Uses the identical injection mechanism as `index.html` for consistency, and keeps the
empty-base-path value exactly `/` (FR-016). Satisfies FR-015/SC-008.

**Alternatives considered**:
- Relative `start_url: "."` (resolved against the manifest URL) — technically valid and
  injection-free, but changes the empty-base-path value away from the current literal `/`, making
  the "unchanged for dev/prod" guarantee harder to assert byte-for-byte. Token replace keeps the
  dev/prod output identical.

## Decision 4 — Service worker offline fallbacks under a sub-path

**Decision**: Make the service worker's fallbacks **scope-relative at runtime** rather than
injecting a base path at build time:
- Compute the shell URL from `self.registration.scope` (e.g. `new URL('index.html', scope)`), and
  prefer the Workbox precache cache key (`getCacheKeyForURL('index.html')`) when Workbox is present.
- Replace the hard-coded `caches.match('/index.html')` navigation fallbacks and the minimal
  fallback precache `['/index.html', '/bundle.js']` with scope-relative equivalents.

**Rationale**: The SW is registered with a relative URL (`new Workbox('./sw.js')` in `App.ts`), so
its `registration.scope` already equals the deployment sub-path. Deriving fallbacks from scope makes
them correct for *any* base path with **zero** build-time SW injection and keeps the empty-base-path
case identical (scope is the origin root → `/index.html`). Satisfies FR-013/FR-014/FR-017 and
SC-007. The precache manifest entries are already relative and resolve against scope (FR-017), so no
change to `workbox-config.js` is needed beyond confirming the SW is deployed under the base path.

**Alternatives considered**:
- Build-time token replacement inside `sw-src.js` before `workbox injectManifest` — rejected: adds a
  second, different injection mechanism and bakes the path in statically when the SW can already
  discover it from its own scope at runtime.

## Decision 5 — Webpack `output.publicPath`

**Decision**: Leave `output.publicPath` at the webpack 5 default (`'auto'`); do not hard-code a root
path. Verify no absolute-root chunk URLs are emitted.

**Rationale**: `index.html` references `bundle.js`, the stylesheet, the manifest, and the loading
image with **relative** URLs, which resolve correctly under a sub-path. `'auto'` keeps any
dynamically-loaded chunk URLs relative to the script location, so nothing points at the domain root.

**Alternatives considered**:
- Setting `publicPath = BASE_PATH + '/'` — unnecessary given all static references are already
  relative; would add another place the base path must be kept consistent.

## Decision 6 — Test placement and style

**Decision**: Add Gherkin-style Given/When/Then scenarios in new `*.spec.ts` files under `test/`
mirroring `src/` (and a `test/build/` spec for the base-path composition rules).

**Rationale**: Constitution Principle III prefers `.spec` files; jest's default `testMatch` already
includes `*.spec.ts`, so they run under `npm test` alongside the existing `*.test.ts` suite.
