# Implementation Plan: Configurable Build Base Path per Environment

**Branch**: `002-test-env-build` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-test-env-build/spec.md`

## Summary

Introduce a build-time **base path** input that determines the sub-path the standalone app is
served from: `""` for dev and production (behavior unchanged) and `/assessment-survey-js` for test.
The base path is injected at build time into the produced `index.html` (`data-asset-base-url`) and
`manifest.json` (`start_url`), and the service worker's offline fallbacks are made scope-relative so
precaching, offline navigation, and PWA install all work under a sub-path. Three named npm scripts
(`build:dev`, `build:test`, `build:production`) select the base path via a `BASE_PATH` environment
variable consumed by webpack. The base path flows into the existing runtime asset resolution
(`withBase` / `resolveAssetPath`) with no new resolution mechanism.

## Technical Context

**Language/Version**: TypeScript ~4.8 (compiled via ts-loader + babel to ES5)

**Primary Dependencies**: webpack 5, copy-webpack-plugin 14, cross-env 10, workbox-cli 7
(`injectManifest`), workbox-window (runtime SW registration), jest 29 + ts-jest (tests)

**Storage**: N/A (static front-end build; service-worker Cache Storage at runtime)

**Testing**: jest (`npm test`); new Gherkin-style `*.spec.ts` files under `test/` (default jest
`testMatch` already picks up `*.spec.ts`)

**Target Platform**: Browser (standalone web build served from S3 static hosting; dev via
webpack-dev-server on port 8081)

**Project Type**: Single project — front-end library + standalone web app (`src/`, `test/`, webpack
build to `build/`)

**Performance Goals**: N/A (no runtime hot path changed; base-path composition is a constant-time
string join at build/startup)

**Constraints**: Empty base path (`""`) MUST produce byte-equivalent output to today for dev/prod
(FR-009, FR-016); offline-capable via service worker must keep working under a sub-path

**Scale/Scope**: 3 build environments (dev, test, production); ~4 files touched
(`package.json`, `webpack.config.js`, `index.html`/`public/manifest.json` tokens, `sw-src.js`) plus
new specs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. OOP and FP Where Applicable** — PASS. The added logic is data transformation (compose a base
  path with a relative path), naturally expressed as small **pure functions**. No new stateful
  objects are warranted.
- **II. SOLID and Pure Functions Where Applicable** — PASS. Base-path composition is a pure,
  deterministic function; side effects (webpack copy transform, service-worker Cache API,
  `self.registration.scope` reads) stay at the build/runtime boundary, not inside the transform.
- **III. Gherkin-Style Specs Over Tests** — PASS (with note). New behavior is covered by
  Given/When/Then scenarios in `*.spec.ts` files. The repo currently uses `*.test.ts`; new files use
  `*.spec.ts` (also matched by jest) to honor Principle III's preference for spec files, with
  scenario titles written as Given/When/Then.
- **IV. Green Quality Gates (lint, test, build)** — PASS. The plan requires `npm run lint`
  (prettier), `npm test`, and all three builds to pass; empty-base-path equivalence is asserted so
  existing dev/prod output is unchanged.

**Result**: No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-test-env-build/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── build-scripts.md         # npm script + BASE_PATH input contract
│   └── produced-artifacts.md    # index.html / manifest.json / sw.js output contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (already present)
└── tasks.md             # /speckit-tasks output (NOT created here)
```

### Source Code (repository root)

```text
index.html                                  # add BASE_PATH token in data-asset-base-url
public/manifest.json                        # make start_url base-path-aware
sw-src.js                                    # scope-relative offline fallbacks
webpack.config.js                            # read process.env.BASE_PATH; inject via copy transform
package.json                                 # build:dev / build:test / build:production scripts

src/
├── standalone.ts                            # (unchanged wiring) reads data-asset-base-url
├── utils/assetUtils.ts                      # existing resolveAssetPath (base-aware; unchanged)
└── ui/dom-template/
    └── assessment-template-resolvers.ts     # existing withBase (base-aware; unchanged)

test/
├── build/base-path.spec.ts                  # Gherkin specs: env→base path, token injection
└── ui/dom-template/with-base.spec.ts        # Gherkin specs: withBase base-path composition
```

**Structure Decision**: Single-project layout (matches the repo). The feature is primarily a
**build-configuration** change plus a small **service-worker** adjustment; the runtime asset
resolvers (`withBase`, `resolveAssetPath`) are already base-path-aware and are reused unchanged. The
base path is injected into static assets at webpack copy time and consumed by the SW via its
registration scope at runtime, avoiding any new resolution code path.

## Complexity Tracking

> No Constitution Check violations — this section intentionally left empty.
