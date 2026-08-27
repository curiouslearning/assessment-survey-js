# Implementation Plan: Build Environment Constant

**Branch**: `001-add-environment-constant` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-add-environment-constant/spec.md`

## Summary

Expose a single compile-time `environment` constant (`'develop' | 'test' | 'production'`) derived from the existing `NODE_ENV` build signal, extend `build:standalone` so all three modes are independently buildable (webpack's own `mode` stays a 2-way development/production switch internally, decoupled from the 3-way `environment`/`NODE_ENV`), wire a new `test`-branch CircleCI deploy job that syncs into a shared bucket's `assessment-survey-js/` sub-folder, apply a test-mode-only asset base-path prefix through the **existing `data-asset-base-url` webcomponent-parameter mechanism** (rewritten at build time on the copied `index.html` via a `CopyWebpackPlugin` transform, not by removing the attribute or adding a JS-side fallback) so the deployed bundle resolves its own assets under that sub-folder, and include `environment` in the `metadata` object at both existing `AndroidInterface` call sites in `App.ts`.

**MR-75 amendment (2026-08-28)**: Additionally gate whether `AndroidInterface` is constructed at all (both existing call sites) behind a new remote feature flag, `mr-75`, checked via `featureFlagsService.isFeatureEnabled()` — but only when the resolved `platform` is `'standalone'`. The flag ANDs with the existing `enableAndroidSummary` value (never overrides an explicit host opt-out) and reuses the exact existing `FEATURE_DRAG_DROP_UI`-style constant/evaluation pattern already in `src/App.ts`. See User Story 4 in spec.md, research.md §6, data-model.md's "Feature flag gate (`mr-75`)" section, and contracts/feature-gate-mr-75.md.

## Technical Context

**Language/Version**: TypeScript ~4.8.3 (strict mode), compiled/bundled for two targets: an ES5 web bundle (webpack 5 + Babel, `standalone.ts` entry) and an ESM npm package (`tsc`, `index.ts` entry); tooling scripts run under Node.js.

**Primary Dependencies**: webpack 5 / webpack-cli / webpack-dev-server, `cross-env`, `copy-webpack-plugin`, `workbox-cli` (`wb:inject`), `@curiouslearning/core` (`AndroidInterface`), `@curiouslearning/features` (`featureFlagsService.isFeatureEnabled()` — already a dependency for the existing `drag-drop-assessment-ui` flag; MR-75 reuses it, no new dependency added), Jest + ts-jest; CircleCI `node` and `aws-s3` orbs.

**Storage**: N/A — no persistence involved; this feature only touches build configuration, one new small source module, and CI/deploy wiring.

**Testing**: Jest + ts-jest (existing `test/` tree mirrors `src/`). New coverage: `test/environment.test.ts` (resolution logic) and new assertions in `test/src/App.test.ts` (metadata payload shape at both `AndroidInterface` call sites) — both required by Constitution Principle VI (happy-path Gherkin-style coverage for new behavior).

**Target Platform**: Browser (standalone bundle, served from S3+CloudFront-style static hosting) and Node.js (CI, published npm package consumers' own bundlers).

**Project Type**: Single project — existing npm library with a standalone web-bundle build and a CircleCI pipeline; no new project/module boundary is introduced.

**Performance Goals**: N/A — no measurable runtime performance impact (one additional small constant module, one additional metadata field, one additional CI job).

**Constraints**:
- Webpack's `mode` option only accepts `development` / `production` / `none` — it cannot represent a third `test` value directly, so `environment` (3-way) and webpack `mode` (2-way) must be resolved independently from the same `NODE_ENV` input, not conflated into one setting.
- The test-mode asset base-path prefix MUST be inert (no-op) for `develop` and `production` builds — no risk of regressing the two already-working deploy destinations.
- Changes MUST NOT alter the npm-package publish workflows (`build_and_publish`, `build_and_publish_dryrun`) or the `rc`/`main` publish-approval jobs.
- The `test` S3 destination is a bucket shared with other projects (`s3://globallit-aws-s3-static-webapp-test-us-east-2`) — the deploy job MUST only write under its own `assessment-survey-js/` prefix.
- (MR-75) The `mr-75` flag check MUST run only after `featureFlagsService.initialize()` settles, and MUST only ever narrow `enableAndroidSummary` (`true` → `false`), never override an explicit host-config opt-out.
- (MR-75) The gate MUST be scoped to `platform === 'standalone'` without editing `src/standalone.ts` — achieved via the `platform` signal `App.ts` already resolves/defaults, not a new mechanism.

**Scale/Scope**: One new source file (`src/environment.ts`, ~15–20 lines), edits to two `AndroidInterface` call sites in `src/App.ts`, edits to `webpack.config.js` (mode/nodeEnv decoupling + a `CopyWebpackPlugin` transform on the `index.html` pattern that rewrites `data-asset-base-url`'s value per mode) and `package.json` scripts, one new job + one new branch filter in `.circleci/config.yml`, two test files. `index.html` and `src/standalone.ts` are **not edited** — the existing `data-asset-base-url` attribute mechanism is retained as-is (see research.md §3a). **MR-75 amendment**: one new constant + one new conditional (~5 lines) in `src/App.ts`'s `spinUp()`, one new contract file, additional assertions in the existing `test/src/App.test.ts` — no new source files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Strict TypeScript, No `any` | `src/environment.ts` is a fully-typed literal union (`'develop' \| 'test' \| 'production'`) resolved via a `switch`, no `any`/`unknown` boundary involved (input is always `string \| undefined`). `AndroidInterface`'s `metadata` field is typed `AppEventPayloadMetadata` (an open, `Record<string, any>`-backed record per the published package's own validator) on the *library's* side — this feature adds a key to an object literal, it does not introduce a new `any` in *our* source. | PASS |
| II. Hybrid Paradigm (OOP for state, FP for transforms) | `environment` resolution is a pure function with no identity/state — correctly FP. It is consumed (not computed) inside `App`, an existing stateful class — correct boundary, no mixing. | PASS |
| III. SOLID OOP | No new class introduced. Existing `AndroidInterface` construction call sites in `App.ts` gain one metadata key; no interface/abstraction changes. | PASS |
| IV. Pure Functions for FP code | `resolveEnvironment()` takes no implicit global mutable state beyond reading `process.env.NODE_ENV` once at module load to produce the exported constant — this mirrors the existing, accepted pattern for `appVersion` (a module-level constant derived once, not a function called repeatedly with hidden state). The resolver function itself, given an explicit string input, is pure and independently unit-testable. | PASS |
| V. Composition & Orchestration Boundaries | No new inheritance, no long method chains introduced. | PASS |
| VI. Gherkin-style testing, happy-path coverage | New behavior (environment resolution; `environment` present in Android metadata) gets new Given/When/Then-style spec files per the Testing section above. | PASS (planned, not yet written) |

No violations requiring the Complexity Tracking table.

*Post-Phase-1 re-check*: research.md and data-model.md confirmed the mechanism stays a pure resolver function + two module-level constants, one existing class's constructor-call sites gaining one object key each, and CI/script config edits — nothing in Phase 0/1 design introduced a new class, inheritance, mutable global, or `any`. All rows above still hold; no re-justification needed.

*Amendment (2026-08-26)*: the `test` environment has its own AWS region after all (superseding an earlier same-region correction). The new `s3-deploy-test` CircleCI job uses a new `AWS_TEST_REGION` variable, matching the existing `s3-deploy-prod` → `AWS_PROD_REGION` pattern — see research.md §5.

*Amendment (2026-08-26, cont'd)*: `AWS_TEST_REGION` is context-scoped, not a plain project env var — it lives inside a CircleCI context named `aws-context`. `s3-deploy-test` must therefore declare `context: [aws-context]` (the same mechanism `build_and_publish`/`build_and_publish_dryrun` already use for `github-context`/`npmjs-context`), or the variable simply won't resolve. See research.md §5 for the still-open assumption about whether the AWS access key/secret also move into that context. No other part of the design changes; the Constitution Check above is unaffected (this is a CI/ops detail, not a code-paradigm concern).

*Amendment (2026-08-26, cont'd again)*: the test-mode asset base-path fix originally called for removing `index.html`'s `data-asset-base-url` attribute and adding an environment-aware JS fallback (`DEFAULT_ASSET_BASE_URL` in `src/standalone.ts`). That's superseded — the existing `data-asset-base-url` webcomponent-parameter mechanism is retained untouched; the environment-aware value is instead injected into that same attribute at build time via a `CopyWebpackPlugin` transform in `webpack.config.js`. `index.html` and `src/standalone.ts` are no longer edited by this feature at all. See research.md §3a. This is a mechanism-routing change, not a paradigm change — the Constitution Check above (Principle IV in particular: `buildBasePath` is still a pure derivation from `NODE_ENV`) still holds without re-justification.

*Amendment (2026-08-28, MR-75)*: Scope extended to gate `AndroidInterface` construction (both call sites) behind a new `mr-75` feature flag for `platform === 'standalone'` sessions — see spec.md User Story 4, research.md §6. Re-checked against all six principles: no new class or inheritance (Principle III unaffected); the gate is a single boolean expression assigned to an existing instance field inside the existing `App` class, evaluated once per `spinUp()` (Principle II — stateful orchestration in `App`, no transformation logic extracted into a separate pure function because there is no meaningful transformation beyond one boolean AND, consistent with how the adjacent `FEATURE_DRAG_DROP_UI` check is already written inline); no `any` introduced, `isFeatureEnabled()` is already typed `(flag: string) => boolean` (Principle I); new Given/When/Then acceptance scenarios (User Story 4) get corresponding `test/src/App.test.ts` assertions per Principle VI. All rows still PASS; no Complexity Tracking entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-add-environment-constant/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── build-scripts.md
│   ├── android-interface-metadata.md
│   └── feature-gate-mr-75.md      # NEW (MR-75 amendment)
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── environment.ts                 # NEW — exports `Environment` type + `environment` constant + `buildBasePath`
└── App.ts                         # EDIT — both AndroidInterface call sites gain `environment` in metadata;
                                    #        (MR-75) new `FEATURE_ANDROID_SUMMARY_STANDALONE` constant + gate
                                    #        applied to `this.enableAndroidSummary` in `spinUp()`

test/
├── environment.test.ts            # NEW — Gherkin-style resolution tests
└── src/App.test.ts                # EDIT — asserts `environment` present in both metadata payloads;
                                    #        (MR-75) new assertions per contracts/feature-gate-mr-75.md

webpack.config.js                  # EDIT — decouple `mode` (2-way) from NODE_ENV (3-way); add a CopyWebpackPlugin
                                    #        `transform` on the index.html pattern that rewrites the existing
                                    #        `data-asset-base-url` attribute's value per mode (see research.md §3a)
package.json                       # EDIT — build:standalone gains develop/test variants
.circleci/config.yml               # EDIT — new `s3-deploy-test` job + `test` branch filter

# NOT edited by this feature (mechanism retained as-is — research.md §3a):
#   index.html          — data-asset-base-url="/assets" stays as the literal source-file default
#   src/standalone.ts   — getStandaloneAssetBaseUrl()/DEFAULT_ASSET_BASE_URL unchanged
```

**Structure Decision**: Single-project layout (unchanged). This is a small, cross-cutting change to existing files plus one new leaf module (`src/environment.ts`) — no new top-level directory or package boundary is warranted.

## Complexity Tracking

*No Constitution violations — table not needed.*
