# Phase 0 Research: Build Environment Constant

## 1. How should `environment` be resolved, and where does its input come from?

**Decision**: Add `src/environment.ts` exporting `type Environment = 'develop' | 'test' | 'production'` and a module-level constant `environment: Environment`, resolved once from `process.env.NODE_ENV` via a pure `resolveEnvironment(nodeEnv: string | undefined): Environment` function (`'production'` → `production`, `'test'` → `test`, anything else including `undefined`/`'development'` → `develop`).

**Rationale**: `NODE_ENV` already naturally takes exactly the right value in every context this codebase runs in, with zero new plumbing:
- `npm run dev` and `npm run build:standalone` already set `NODE_ENV` explicitly via `cross-env` ([package.json](../../package.json)).
- Jest sets `NODE_ENV=test` automatically whenever it isn't already set — confirmed no override exists in [jest.config.js](../../jest.config.js) or [jest.setup.js](../../jest.setup.js).
- Webpack automatically statically replaces `process.env.NODE_ENV` throughout bundled source (not just its own internals) whenever `mode` is configured — this is built-in webpack behavior, not something this repo's [webpack.config.js](../../webpack.config.js) has to opt into. So the constant is dead-code-eliminated to a literal in the production/standalone bundles, matching how `appVersion` ([src/App.ts:31](../../src/App.ts#L31)) is already treated as a build-time literal.
- This mirrors the one existing precedent in the codebase (`appVersion`) rather than introducing a second, parallel env-signaling mechanism (e.g. a custom `webpack.DefinePlugin` global).

**Alternatives considered**:
- A custom `__ENVIRONMENT__` global injected via an additional `DefinePlugin` call — rejected: redundant with `NODE_ENV`, which already carries the same information into the bundle for free, and would create two signals that could drift out of sync.
- A runtime config field on `AppStartupConfig` (host passes `environment` in) — rejected: the request is for a build-time constant with one source of truth, not a per-instance runtime override; it would also make `environment` absent unless every host integrator remembers to pass it, defeating the "it's just always known" goal.

## 1a. Correction found during implementation: webpack's automatic `process.env.NODE_ENV` replacement follows `mode`, not the raw env var

**What was wrong**: §1 above assumed webpack's built-in `process.env.NODE_ENV` substitution inlines the actual `NODE_ENV` environment variable value. It doesn't — by default it inlines `optimization.nodeEnv`, whose own default is `mode` (only ever `'development'` or `'production'`). A build run with `NODE_ENV=test` (mode: `development`, per §2 below) was silently inlining `"development"` into the bundle, not `"test"` — confirmed by inspecting the actual compiled `build/bundle.js` output (`resolveEnvironment("development")` where `resolveEnvironment("test")` was expected).

**Fix**: [webpack.config.js](../../webpack.config.js) now sets `optimization: { nodeEnv }` explicitly, using the raw 3-way `nodeEnv` variable (not `mode`) — decoupling the `process.env.NODE_ENV` bundle-time replacement from webpack's own 2-way `mode`, the same way `mode` itself was already decoupled in §2. Re-verified against the actual bundle output for all three modes after the fix: `resolveEnvironment("test")`, `resolveEnvironment("development")`, and (in production, where terser folds the literal away entirely) no leftover `assessment-survey-js` sub-path string — all correct.

## 2. How can `build:standalone` produce three modes when webpack's `mode` option only has two?

**Decision**: Decouple the two concepts inside [webpack.config.js](../../webpack.config.js):
- `NODE_ENV` (read from `process.env`) drives `environment`/`isDev`-style bundle behavior and is passed straight through via cross-env — this is the 3-way signal (`develop`/`test`/`production`).
- Webpack's own `mode` field is derived, not passed in 1:1: `mode: nodeEnv === 'production' ? 'production' : 'development'`. `test` and `develop` both resolve to webpack's `development` mode (no minification, inline source maps) since neither is a production release; only the exported `environment` constant tells them apart at runtime.
- Drop the CLI `--mode=production` / `--mode=development` flags from the `build:standalone` / `dev` npm scripts, since the config now derives `mode` itself from `NODE_ENV` — keeping a single source of truth instead of two (CLI flag vs. env var) that could disagree.
- Add two new scripts alongside the existing `build:standalone` (which keeps its current meaning — production — for backward compatibility with `npm run build` / `build:all` / existing CI jobs):
  - `build:standalone:develop` → `cross-env NODE_ENV=development webpack -c webpack.config.js`
  - `build:standalone:test` → `cross-env NODE_ENV=test webpack -c webpack.config.js`

**Rationale**: Webpack validates `mode` against a fixed enum (`'development' | 'production' | 'none'`); passing `'test'` directly would be a config validation error. Every other observable "mode" behavior this repo cares about (minification, source maps) is genuinely binary (dev-like vs. prod-like) — `test` behaves like a dev-like build, it just needs to *identify itself* as `test` at runtime, which `environment` (not webpack `mode`) is responsible for.

**Alternatives considered**:
- Converting `webpack.config.js` to the function form `(env) => ({...})` and passing `--env mode=test` on the CLI — more flexible long-term, but a materially larger diff to an already-working config for no behavior this feature needs; rejected in favor of the minimal, additive `NODE_ENV`-branching change.

## 3. How does the test deploy avoid breaking other projects in the shared bucket, and how do assets resolve under a sub-folder?

**Decision**:
- **Sync target**: CircleCI's `aws-s3/sync` orb command wraps a plain `aws s3 sync <from> <to>`, which treats any path segments after the bucket name as a key prefix. The new `test` job's `to:` becomes `s3://globallit-aws-s3-static-webapp-test-us-east-2/assessment-survey-js` — this only ever touches objects under that prefix, leaving the rest of the shared bucket untouched, with no extra plugin needed.
- **Asset base path**: [index.html](../../index.html) already references its own script/stylesheet/image assets with **relative** paths (`bundle.js`, `assets/css/style.css`, `assets/img/loadingImg.gif`) — these resolve correctly under any sub-path automatically, because the browser resolves them against the page's own URL. The one exception is the `#assessment-survey-root` element's `data-asset-base-url="/assets"` attribute — an **absolute, root-relative** path read at runtime by `getStandaloneAssetBaseUrl()` in [src/standalone.ts:32-40](../../src/standalone.ts#L32-L40), which is what [src/utils/assetUtils.ts](../../src/utils/assetUtils.ts) uses to build every image/audio asset URL. Under the shared bucket's `assessment-survey-js/` prefix, `/assets` would incorrectly resolve to the bucket root instead of `/assessment-survey-js/assets`.
- **Fix**: Remove the hardcoded `data-asset-base-url="/assets"` value from `index.html` (leave the attribute empty/absent) so `getStandaloneAssetBaseUrl()` falls through to its own `DEFAULT_ASSET_BASE_URL` constant, and make *that* constant environment-aware: `` `${buildBasePath}/assets` `` where `buildBasePath` is a second, small compile-time constant living next to `environment` in `src/environment.ts` — empty string for `develop`/`production`, `'/assessment-survey-js'` for `test`. Because `index.html` no longer hardcodes the path, it stays byte-identical across all three deploys; only the compiled bundle's default differs per build mode, which is exactly the "should only apply for test build" requirement, enforced at the single point where the value is computed rather than by branching logic scattered across the HTML or CI config.

**Rationale**: This keeps the sub-path concern entirely inside the JS build (one new constant, one attribute removal) instead of introducing HTML templating (`html-webpack-plugin`) or a `CopyWebpackPlugin` per-environment `transform` step, both of which would be larger changes for the same outcome.

**Alternatives considered**:
- Set webpack's `output.publicPath` to the sub-path for test builds — rejected as insufficient on its own: `publicPath` only affects webpack-emitted `<script>`/chunk URLs, not the hand-authored `data-asset-base-url` attribute or the CopyWebpackPlugin-copied `assets/` tree, which is what the actual 404 risk is (image/audio assets), so it wouldn't fix the real problem by itself.
- Template `index.html` per-environment via `html-webpack-plugin` — rejected: replaces an already-working `CopyWebpackPlugin` + static-`index.html` setup with a new plugin and templating syntax for the sake of one attribute.

## 3a. Correction (design update, 2026-08-26): retain the `data-asset-base-url` webcomponent-parameter mechanism instead of removing it

**What changed**: The original §3 "Fix" removed the `data-asset-base-url` attribute from `index.html` and pushed the environment-aware default into a new JS-side fallback (`DEFAULT_ASSET_BASE_URL` in `src/standalone.ts`). That mechanism — an HTML attribute the standalone bootstrap and the `<assessment-survey-player>` web component both read via `getStandaloneAssetBaseUrl()` / the equivalent web-component parameter — is an existing, intentional integration surface (host pages/embedders set it explicitly). Removing its value from `index.html` is undesirable even though it happens to be unused *within this repo's own* deploys today: it's the one supported way a host sets a non-default asset base URL, and the feature should route the new test-mode base path *through* it, not around it.

**Decision**: `index.html`'s `data-asset-base-url="/assets"` attribute is left exactly as-is — untouched, still the literal default for local `npm run dev` / repository authoring. `src/standalone.ts` (`getStandaloneAssetBaseUrl()`, `DEFAULT_ASSET_BASE_URL`) is **not edited at all** by this feature. Instead, [webpack.config.js](../../webpack.config.js)'s existing `CopyWebpackPlugin` pattern that copies `index.html` into `build/` gains a `transform` function that rewrites the copied file's `data-asset-base-url="..."` attribute value in place, to the same `buildBasePath`-derived path (`` `${buildBasePath}/assets` ``) computed from `nodeEnv` right there in the config — `/assets` for `develop`/`production` (i.e., a no-op rewrite back to the same value), `/assessment-survey-js/assets` for `test`. The attribute mechanism, and every other consumer of it (host pages, the web component's own `data-asset-base-url` parameter), is completely unaffected; only *which literal value ships inside this repo's own `build/index.html`* varies by mode.

**Rationale**:
- Keeps the runtime contract identical to today: one attribute, read one way, by one function — no new fallback-resolution branch to reason about or keep in sync with the attribute path.
- `webpack.config.js` already owns exactly this kind of per-mode, build-time-only concern (it already derives webpack's own `mode` and `optimization.nodeEnv` from the same `nodeEnv` value, per §1a/§2) — adding one more small derivation (`buildBasePath`) and one `transform` callback on an existing `CopyWebpackPlugin` pattern is consistent with that existing shape, not a new mechanism.
- `src/standalone.ts` needing no change at all is a strictly smaller diff than editing it to grow an environment-aware default that would then almost never be exercised in practice (`index.html`'s attribute is always present).

**Duplication note**: `buildBasePath`'s three-way mapping now exists in two places — `src/environment.ts` (exported for unit-testability per data-model.md, and for any future in-app consumer) and inline in `webpack.config.js` (consumed by the `CopyWebpackPlugin` transform, which cannot easily `require()` a TypeScript module without adding a `ts-node`/build-order dependency). Both derive from the identical single input (`nodeEnv`) via the identical trivial ternary, the same accepted pattern already used for `mode` vs. `environment` in §2 — there is one input and one mapping table, just expressed twice for two different toolchains (TS source vs. plain-JS build config), not two signals that could disagree.

**Alternatives considered**:
- Have `webpack.config.js` `require()` a compiled/plain-JS shared module for `buildBasePath` so the mapping truly lives in one file — rejected for now: would require either pre-compiling `src/environment.ts` before `webpack.config.js` loads (ordering problem) or extracting the one-line ternary into a third plain-`.js` file solely to be shared, which is more indirection than the duplicated one-liner it replaces. Revisit only if the mapping ever grows past a trivial 3-way switch.
- Keep the original (removed-attribute + JS fallback) design — rejected per the "what changed" note above: it works, but abandons the existing `data-asset-base-url` mechanism instead of using it, which is the specific thing this update corrects.

## 4. Does `@curiouslearning/core`'s `AndroidInterface` accept an arbitrary `environment` key inside `metadata`?

**Decision**: Yes — confirmed by inspecting the published package's type declarations and runtime schema (v1.13.0, the version pinned in `package-lock.json`):
- `AndroidInterfaceOptions.metadata` is typed `AppEventPayloadMetadata`.
- The runtime Zod validator backing it (`schema-validators.d.ts`) types `metadata` as `z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>` — an open, arbitrary-string-keyed record, not a closed/strict shape.

Adding `environment` alongside the existing `app_version` key at both call sites (`src/App.ts` lines ~355 and ~575) is therefore both type-safe and will pass runtime validation without any change to the `@curiouslearning/core` dependency.

**Alternatives considered**: None needed — no ambiguity once the actual published type/schema was checked (this repo's local `node_modules` isn't installed in this environment, so the check was done directly against the published package files on the npm registry rather than left as an assumption).

## 5. CircleCI wiring for the new `test` branch/job

**Decision**: Add a `s3-deploy-test` job mirroring the existing `s3-deploy` job (same `npm run build` step, which already chains `build:standalone` → `wb:inject`, parametrized by `NODE_ENV=test`), pointed at the shared bucket prefix, and add it to `s3-deploy-workflow` with `filters: branches: only: [test]`, alongside the existing `develop`/`main` filtered jobs.

**Rationale**: Matches the existing job/workflow shape exactly (same orbs, same `node/test` requirement gate) — the smallest possible diff that satisfies "the corresponding environment" wiring per branch.

**Region**: the `test` environment has its own AWS region, distinct from `develop`/`production`. It's supplied by a new CircleCI environment variable, `AWS_TEST_REGION` — but unlike `AWS_DEFAULT_REGION`/`AWS_PROD_REGION` (plain project-level env vars, since today's `s3-deploy`/`s3-deploy-prod` jobs declare no `context:` at all), `AWS_TEST_REGION` lives inside a CircleCI **context** named `aws-context`. The new `s3-deploy-test` job therefore MUST declare `context: [aws-context]` (mirroring how `build_and_publish`/`build_and_publish_dryrun` already declare `context: [github-context, npmjs-context]` to pull in their own context-scoped secrets) so that variable resolves at all — a plain env-var reference with no matching `context:` entry would simply be empty.

**Open item for the implementer (not a design ambiguity, an ops/secrets prerequisite)**: the `aws-context` CircleCI context must exist and contain `AWS_TEST_REGION` (value: the shared bucket's actual region, e.g. `us-east-2` per the bucket name `globallit-aws-s3-static-webapp-test-us-east-2`) before the new job can run for real. Whether `AWS_ACCESS_KEY`/`AWS_SECRET_ACCESS_KEY` for the test job also come from `aws-context` or continue to be the existing project-level ones is an assumption, not confirmed — assumed to still be the existing shared project-level `AWS_ACCESS_KEY`/`AWS_SECRET_ACCESS_KEY` (same as `s3-deploy`/`s3-deploy-prod` use today) unless told otherwise, since only `AWS_TEST_REGION` was called out as living in the context. Either way, that access key must have write permission scoped to the `assessment-survey-js/` prefix of the shared bucket. This is an IAM/CircleCI-settings change outside this repo's tracked files, called out in `quickstart.md` and `tasks.md` rather than silently assumed to already exist.
