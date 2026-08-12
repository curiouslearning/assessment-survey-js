# Phase 1 Data Model: Configurable Build Base Path per Environment

This feature is configuration-centric; the "data" is the small set of build inputs and the
composition rules that turn them into produced-artifact values. No persistent storage is involved.

## Entities

### BuildEnvironment

The named target a build is produced for.

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| name | enum | `dev` \| `test` \| `production` | Selected by the invoked npm script |
| basePath | string | see mapping below | The sub-path the app is served under |
| nodeEnv | enum | `development` \| `production` | Existing webpack mode selector; unchanged |

**Environment → basePath → nodeEnv mapping**

| Environment | basePath | NODE_ENV |
|-------------|----------------------|-------------|
| dev | `""` | development |
| test | `/assessment-survey-js` | production |
| production | `""` | production |

> Rationale: test is a production-equivalent build (per `specs/001-circleci-test-deploy`) that only
> differs by base path, so it uses `NODE_ENV=production` with a non-empty `basePath`.

### BasePathConfig

The single configurable value the build consumes.

| Field | Type | Default | Validation |
|-------|------|---------|------------|
| basePath | string | `""` | Empty, or a leading-slash path segment (e.g. `/assessment-survey-js`); a trailing slash is tolerated and normalized away |

**Normalization rules** (already implemented by `normalizeBaseUrl` in `assetUtils.ts` and
`assessment-template-resolvers.ts`):

- Empty/undefined → `""`.
- A trailing `/` is trimmed.
- When composing with an asset path, leading slashes on the asset path are stripped and a single `/`
  joins base and path.

### ProducedArtifactValues (derived, not stored)

Values written into build outputs, derived purely from `basePath`.

| Artifact | Field | Value when basePath `""` | Value when basePath `/assessment-survey-js` |
|----------|-------|--------------------------|---------------------------------------------|
| `index.html` | `data-asset-base-url` | `/assets` | `/assessment-survey-js/assets` |
| `manifest.json` | `start_url` | `/` | `/assessment-survey-js/` |
| `sw.js` (runtime) | offline shell URL | `/index.html` (scope root) | `/assessment-survey-js/index.html` (scope) |
| `sw.js` (runtime) | fallback precache paths | `index.html`, `bundle.js` under root scope | same, under `/assessment-survey-js/` scope |

## Base-path composition function (pure)

Conceptual signature (already realized by `withBase` / `resolveAssetPath`):

```
compose(basePath: string, relativePath: string): string
  base := trimTrailingSlash(basePath)
  path := stripLeadingSlashes(relativePath)
  if base is empty: return rootRelative ? "/" + path : path
  return base + "/" + path
```

- **Deterministic**: same inputs → same output.
- **No side effects**: pure string transformation; used at build-injection time and runtime asset
  resolution alike.

## State & transitions

None. A build is a stateless transformation: `(BuildEnvironment) → ProducedArtifactValues`. There
are no runtime state transitions introduced by this feature.

## Requirement traceability

| Requirement | Model element |
|-------------|---------------|
| FR-001, FR-002 | BasePathConfig (input + default) |
| FR-003, FR-004, FR-005 | Environment→basePath mapping |
| FR-006, FR-007 | BuildEnvironment (per-env script selection) |
| FR-008, FR-010, FR-011, FR-012 | compose() + `index.html data-asset-base-url` |
| FR-009, FR-016 | "basePath `""`" columns equal current values |
| FR-013, FR-014, FR-017 | sw.js runtime rows (scope-derived) |
| FR-015 | manifest.json start_url row |
