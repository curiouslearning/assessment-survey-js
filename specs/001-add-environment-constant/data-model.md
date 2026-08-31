# Data Model: Build Environment Constant

This feature has no persisted/database entities. The "entities" below are the compile-time and configuration constructs it introduces or extends.

## Environment

| Field | Type | Notes |
|---|---|---|
| `environment` | `'develop' \| 'test' \| 'production'` | Module-level constant exported from `src/environment.ts`; resolved once at module load from `process.env.NODE_ENV`. |

**Resolution rule** (pure function, unit-testable in isolation per Constitution Principle IV):

| `NODE_ENV` value | `environment` |
|---|---|
| `'production'` | `production` |
| `'test'` | `test` |
| `'development'` | `develop` |
| anything else / `undefined` | `develop` (safe default — FR-005) |

**Validation rules**: None beyond the switch above — every possible string input maps to one of exactly three values; there is no invalid/error state to reject (unrecognized input degrades to `develop` rather than throwing, per Edge Cases in spec.md).

**State transitions**: None — resolved once per process/bundle load, immutable for the lifetime of that process/bundle (same treatment as the existing `appVersion` constant).

## Build base path

| Field | Type | Notes |
|---|---|---|
| `buildBasePath` | `string` | Companion constant in `src/environment.ts`, derived from `environment`. |

| `environment` | `buildBasePath` |
|---|---|
| `develop` | `''` (no prefix) |
| `production` | `''` (no prefix) |
| `test` | `'/assessment-survey-js'` |

Consumed by a `CopyWebpackPlugin` `transform` on `webpack.config.js`'s `index.html` copy pattern, which rewrites the copied file's existing `data-asset-base-url="..."` attribute to `` `${buildBasePath}/assets` `` per build mode. The attribute mechanism itself (source `index.html`, `getStandaloneAssetBaseUrl()` in `src/standalone.ts`) is unchanged — this feature only changes which literal value ends up inside `build/index.html`'s attribute, not how or where that attribute is read (see research.md §3a, superseding the original §3 "remove the attribute" design).

## AndroidInterface metadata (extended)

Existing external contract (defined by `@curiouslearning/core`, not owned by this repo) — see [contracts/android-interface-metadata.md](./contracts/android-interface-metadata.md) for the full before/after payload shape at both call sites.

| Field | Type | Change |
|---|---|---|
| `app_version` | `string` | Unchanged — already present. |
| `environment` | `'develop' \| 'test' \| 'production'` | **New** — added by this feature at both call sites in `src/App.ts`. |

## CircleCI deploy job (branch → environment → destination mapping)

| Branch | `environment` / `NODE_ENV` | Webpack `mode` | S3 destination |
|---|---|---|---|
| `develop` | `develop` / `development` | `development` | `s3://assessment-and-survey-development` (unchanged, existing) |
| `test` | `test` | `development` | `s3://globallit-aws-s3-static-webapp-test-us-east-2/assessment-survey-js` (**new**) |
| `main` | `production` | `production` | `s3://assessment-and-survey-production` (unchanged, existing) |

Relationships: each row is a 1:1 mapping — one branch triggers exactly one deploy job, which runs the build in exactly one mode, which sets `environment` to exactly one value, which is synced to exactly one destination. No branch maps to more than one row and no row is shared by two branches.

## Feature flag gate (`mr-75`) — MR-75 amendment

| Field | Type | Notes |
|---|---|---|
| `FEATURE_ANDROID_SUMMARY_STANDALONE` | `'mr-75'` (string literal constant) | New module-level constant in `src/App.ts`, alongside the existing `FEATURE_DRAG_DROP_UI`. |
| effective `enableAndroidSummary` | `boolean` | Derived, not stored separately: `platform === 'standalone' ? (enableAndroidSummary && isFeatureEnabled('mr-75')) : enableAndroidSummary`. |

**Resolution rule** (evaluated once per `spinUp()` call, after `featureFlagsService.initialize()` settles):

| `platform` | `enableAndroidSummary` (pre-flag) | `isFeatureEnabled('mr-75')` | Effective `enableAndroidSummary` |
|---|---|---|---|
| `'standalone'` | `true` | `true` | `true` |
| `'standalone'` | `true` | `false` | `false` |
| `'standalone'` | `false` | `true` | `false` (explicit opt-out always wins — FR-015) |
| `'standalone'` | `false` | `false` | `false` |
| anything else (e.g. `'ftm'`) | `true` or `false` | not consulted | unchanged — `enableAndroidSummary` alone (FR-016) |

**Validation rules**: None beyond the truth table above — `isFeatureEnabled()` always returns a `boolean` (confirmed safe-default `false` when unresolved, per `test/_mocks/curiouslearning-features.js`), so there is no error/invalid state to reject.

**State transitions**: Resolved once per `spinUp()` call (same lifecycle as `assessmentUIMode`'s `FEATURE_DRAG_DROP_UI` check); not re-evaluated mid-session if the remote flag value changes after startup, per the Assumptions in spec.md.
