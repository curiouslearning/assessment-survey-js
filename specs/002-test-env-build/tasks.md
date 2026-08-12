---
description: "Task list for Configurable Build Base Path per Environment"
---

# Tasks: Configurable Build Base Path per Environment

**Input**: Design documents from `specs/002-test-env-build/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. The project constitution (Principle III — Gherkin-Style Specs Over Tests, and
Principle IV — Green Quality Gates) requires behavior to be covered by Given/When/Then specs and
`npm test` to pass. New tests use `*.spec.ts` (matched by jest's default `testMatch`).

**Organization**: Tasks are grouped by user story. Note that `webpack.config.js` is shared by the
foundational plumbing and User Stories 1 and 5, so tasks touching it are sequential (never `[P]`
with each other).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All paths are repository-relative.

## Path Conventions

Single project: source at `src/`, tests at `test/` (mirrors `src/`), build config at repo root,
build output at `build/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare test locations; confirm tooling picks up new specs.

- [X] T001 [P] Create the `test/build/` directory for build-configuration specs (repo already has `test/ui/dom-template/`).
- [X] T002 [P] Confirm jest runs `*.spec.ts` (default `testMatch`) by adding a temporary trivial `test/build/base-path.spec.ts` placeholder and running `npm test`; keep the file for Phase 4/6/7 specs.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `BASE_PATH` build input and the token-injection mechanism that User Stories 1 and 5
both depend on.

**⚠️ CRITICAL**: No base-path injection story (US1, US5) can be completed until this phase is done.

- [X] T003 In `webpack.config.js`, read `process.env.BASE_PATH`, treat unset/empty as `""`, and normalize a trailing slash away; expose a `basePath` const (mirrors the existing `nodeEnv` pattern). This realizes FR-001/FR-002.
- [X] T004 In `webpack.config.js`, add a reusable text-transform helper for `copy-webpack-plugin` that replaces the literal token `__BASE_PATH__` with the resolved `basePath`, returning a `Buffer`; wire it as the `transform` for text patterns (targets added in US1/US5).

**Checkpoint**: `BASE_PATH` flows into webpack and a token-replace transform is available.

---

## Phase 3: User Story 1 - Environment-specific base path applied at build time (Priority: P1) 🎯 MVP

**Goal**: A build injects the configured base path into `index.html` so the produced
`data-asset-base-url` is `<basePath>/assets`.

**Independent Test**: Build with `BASE_PATH=/assessment-survey-js` and confirm
`build/index.html` contains `data-asset-base-url="/assessment-survey-js/assets"`; build with empty
`BASE_PATH` and confirm `data-asset-base-url="/assets"`.

### Tests for User Story 1

- [X] T005 [P] [US1] Add Gherkin spec `test/build/base-path.spec.ts` covering the pure compose rule for the asset base URL: Given basePath `""` → `/assets`; Given basePath `/assessment-survey-js` → `/assessment-survey-js/assets`; Given a trailing slash → single-separator join (FR-005, FR-012, SC-001/SC-002).

### Implementation for User Story 1

- [X] T006 [US1] In `index.html`, change the root element attribute to the token form `data-asset-base-url="__BASE_PATH__/assets"` (empty base path must render `/assets`, unchanged).
- [X] T007 [US1] In `webpack.config.js`, apply the T004 transform to the `index.html` copy pattern so `__BASE_PATH__` is replaced at build time (sequential with T004/T003 — same file).

**Checkpoint**: `build:test`-style build produces the sub-path asset base URL; empty base path is byte-identical to today.

---

## Phase 4: User Story 2 - Named build scripts per environment (Priority: P1)

**Goal**: `build:dev`, `build:test`, `build:production` scripts select the right base path and mode.

**Independent Test**: Run each script; confirm each completes and produces the base path from its
environment (per [contracts/build-scripts.md](./contracts/build-scripts.md)).

### Tests for User Story 2

- [X] T008 [P] [US2] Add spec `test/build/build-scripts.spec.ts` that reads `package.json` and asserts: `build:dev`/`build:test`/`build:production` exist; `build:test` sets `BASE_PATH=/assessment-survey-js` and `NODE_ENV=production`; `build:dev` sets empty `BASE_PATH` and `NODE_ENV=development`; `build:production` sets empty `BASE_PATH` and `NODE_ENV=production` (FR-003/FR-004/FR-005/FR-006).

### Implementation for User Story 2

- [X] T009 [US2] In `package.json`, add `build:dev`, `build:test`, `build:production` scripts using `cross-env` to set `NODE_ENV` and `BASE_PATH`, each running the standalone webpack build plus `wb:inject` (see contract's illustrative shape).
- [X] T010 [US2] In `package.json`, make the existing `build` script delegate to `build:production` (or otherwise guarantee empty-base-path output) so there is no regression (FR-009).

**Checkpoint**: All three named builds work; default `build` still produces empty base path.

---

## Phase 5: User Story 4 - Base path drives generated asset paths (Priority: P1)

**Goal**: The injected base path is the value the runtime asset resolution (`withBase` /
`resolveAssetPath`) prefixes onto asset paths.

**Independent Test**: With base path `/assessment-survey-js`, a generated asset path is
`/assessment-survey-js/<asset>`; with `""`, it matches current root-/document-relative behavior.

### Tests for User Story 4

- [X] T011 [P] [US4] Add Gherkin spec `test/ui/dom-template/with-base.spec.ts` for `withBase(baseUrl, path, rootRelativeAssetPaths)`: Given base `/assessment-survey-js` → prefixed path; Given empty base + `rootRelativeAssetPaths=true` → `/path`; Given empty base + `false` → `path`; Given trailing slash → single-separator join (FR-010/FR-011/FR-012, SC-006).

### Implementation for User Story 4

- [X] T012 [US4] Verify the resolution chain consumes the injected value end-to-end: `standalone.ts` reads `data-asset-base-url` → `templateConfig.assetBaseUrl` → `assessment-template-engine.ts:resolveAsset` → `withBase`. Confirm no code change is needed; if the injected `data-asset-base-url` is not reaching `withBase`, fix the wiring in `src/standalone.ts` / `src/ui/dom-template/assessment-template-engine.ts`.

**Checkpoint**: Assets resolve under the configured base path at runtime.

---

## Phase 6: User Story 5 - Service worker and PWA respect the base path (Priority: P1)

**Goal**: Offline fallbacks and the web app manifest resolve under the base path so caching,
offline navigation, and PWA install work from a sub-path.

**Independent Test**: Serve a `/assessment-survey-js` build; offline refresh serves the cached
shell from under the base path, and the manifest start location is under `/assessment-survey-js`.

### Tests for User Story 5

- [X] T013 [P] [US5] Add to `test/build/base-path.spec.ts` a scenario for the manifest `start_url` compose rule: Given basePath `""` → `/`; Given `/assessment-survey-js` → `/assessment-survey-js/` (FR-015, SC-008).
- [X] T014 [P] [US5] Add a Gherkin spec covering a pure `resolveShellUrl(scope, 'index.html')` join rule (scope-relative shell resolution) in `test/build/sw-base-path.spec.ts`: Given scope origin root → `/index.html`; Given scope `/assessment-survey-js/` → `/assessment-survey-js/index.html` (FR-013, SC-007).

### Implementation for User Story 5

- [X] T015 [US5] In `public/manifest.json`, change `start_url` to the token form `"__BASE_PATH__/"` (empty base path must render `/`, unchanged).
- [X] T016 [US5] In `webpack.config.js`, apply the T004 transform to the `public/manifest.json` copy pattern so `__BASE_PATH__` is replaced (sequential with T007 — same file).
- [X] T017 [US5] In `sw-src.js`, replace the hard-coded `caches.match('/index.html')` navigation fallbacks (fetch handler) with a scope-relative shell URL derived from `self.registration.scope` (prefer the Workbox precache cache key `getCacheKeyForURL('index.html')` when Workbox is loaded) (FR-013).
- [X] T018 [US5] In `sw-src.js`, change the minimal fallback precache `cache.addAll(['/index.html', '/bundle.js'])` to scope-relative paths resolved from `self.registration.scope` (FR-014).

**Checkpoint**: Offline fallback and PWA start URL work under `/assessment-survey-js`; empty base path unchanged.

---

## Phase 7: User Story 3 - Base path is a configurable input, not hard-coded (Priority: P2)

**Goal**: The base path is a first-class configurable input with an empty default and override
without source edits. (Mechanism delivered in Phase 2; this phase adds explicit coverage/docs.)

**Independent Test**: Provide an arbitrary `BASE_PATH` to a build and confirm the produced artifact
reflects it; provide none and confirm empty-default behavior.

### Tests for User Story 3

- [X] T019 [P] [US3] Add to `test/build/base-path.spec.ts` scenarios for the input contract: Given no base path → default `""` (asset base URL `/assets`, start_url `/`); Given an override value → composed output reflects exactly that value (FR-002, FR-007, SC-003/SC-004).

### Implementation for User Story 3

- [X] T020 [US3] Confirm no additional code is required (Phase 2 satisfies FR-001/FR-002/FR-007); if the empty-default or override path is not honored, correct the `basePath` resolution in `webpack.config.js`.

**Checkpoint**: Base path is provably a configurable input with an empty default.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and end-to-end validation across all stories.

- [X] T021 Run `npm run lint` (prettier) and fix any formatting in touched files (`webpack.config.js`, `index.html`, `public/manifest.json`, `sw-src.js`, `package.json`, new specs).
- [X] T022 Run `npm test` and ensure all specs (new `*.spec.ts` + existing suite) pass (Principle IV).
- [X] T023 Run `npm run build:production` and `npm run build:dev`; confirm `build/index.html` → `data-asset-base-url="/assets"` and `build/manifest.json` `start_url` → `/` (no regression; grep `__BASE_PATH__` returns nothing).
- [X] T024 Run `npm run build:test`; confirm `build/index.html` → `data-asset-base-url="/assessment-survey-js/assets"` and `start_url` → `/assessment-survey-js/`; grep `__BASE_PATH__` across `build/` returns nothing.
- [ ] T025 Execute [quickstart.md](./quickstart.md) steps 4–6 (serve the test build under `/assessment-survey-js/`, verify asset network paths, offline fallback, and PWA start URL; then verify the root-served empty-base-path SW behavior). **Partially done**: build-output values verified (asset base URL, start_url, no token leftovers) and SW scope-relative logic unit-tested (`sw-base-path.spec.ts`); the live in-browser offline/PWA checks remain a manual verification step.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS US1 and US5 (which use the transform).
- **User Stories**: US1, US2, US4, US5 (all P1); US3 (P2). US2 and US4 do not depend on Phase 2 and may start right after Setup; US1 and US5 require Phase 2.
- **Polish (Phase 8)**: Depends on all desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: Requires Foundational (T003/T004). Owns `index.html` + its transform wiring.
- **US2 (P1)**: Independent — only edits `package.json`. Can run in parallel with everything.
- **US4 (P1)**: Independent — resolver verification/spec; no shared file with US1/US5.
- **US5 (P1)**: Requires Foundational (T004) for the manifest transform; also edits `sw-src.js` (independent of US1). Its webpack task (T016) is sequential with US1's T007 (same file).
- **US3 (P2)**: Satisfied by Foundational; adds explicit coverage. No blocking of others.

### Shared-file constraints (NOT parallel with each other)

- `webpack.config.js`: T003 → T004 → T007 (US1) → T016 (US5) run sequentially.
- `test/build/base-path.spec.ts`: T005 (US1), T013 (US5), T019 (US3) append to the same file — sequence them or merge.

### Within Each User Story

- Write the story's spec first (should fail), then implement, then re-run to green.

---

## Parallel Opportunities

- Setup: T001 and T002 are `[P]`.
- Across stories after Setup: **US2** (T008→T009→T010, `package.json`) and **US4** (T011→T012, resolvers) can proceed fully in parallel with the Foundational→US1→US5 webpack chain — different files.
- Specs in different files are `[P]`: T008 (`build-scripts.spec.ts`), T011 (`with-base.spec.ts`), T014 (`sw-base-path.spec.ts`) can be written together.

### Parallel Example

```bash
# After Setup, two independent tracks run at once:
# Track A (webpack chain): T003 → T004 → T007 (US1) → T016 (US5) → T017/T018 (sw-src.js)
# Track B (independent files, in parallel):
Task: "US2 build scripts in package.json (T008 → T009 → T010)"
Task: "US4 withBase spec + wiring check (T011 → T012)"
Task: "US5 sw-src.js fallbacks (T017, T018) once specs T014 exist"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup → Phase 2 Foundational → Phase 3 US1.
2. **STOP and VALIDATE**: `build:test`-style build yields `data-asset-base-url="/assessment-survey-js/assets"`; empty base path yields `/assets`.
3. This is the smallest shippable slice: the test build resolves assets under the sub-path.

### Incremental Delivery

1. Foundation + US1 → asset base URL correct (MVP).
2. + US2 → one-command builds per environment.
3. + US4 → confirmed runtime asset resolution coverage.
4. + US5 → offline + PWA correct under the sub-path (completes the test-env deployment story).
5. + US3 → explicit configurable-input coverage.
6. Polish → lint/test/build green + quickstart validation.

---

## Notes

- `[P]` = different files, no dependencies. The webpack chain and the shared spec file are the main
  non-parallel constraints — see Shared-file constraints above.
- Empty base path (`""`) MUST reproduce today's output for dev/prod (FR-009/FR-016) — asserted in
  T023.
- `sw-src.js` is a raw service-worker script (not bundled); the scope-relative logic is validated by
  a pure-helper spec (T014) plus the offline quickstart step (T025), since the file itself is not
  imported by jest.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
