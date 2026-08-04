# Spec: Improve Overall Assessment Runtime Performance

> **Template note:** This document follows the reusable SDD structure. For future tickets, replace **Ticket Context**, **Business Goal**, **Problem Statement**, and **Acceptance Criteria** below. This instance was generated from one of the template's example tasks, not a live Jira ticket — Jira/Atlassian MCP is not yet authorized in this environment, so ticket linkage is manual for now. Once the Atlassian MCP connector is authorized (via claude.ai connector settings or `/mcp`), the "Ticket Context" section can be populated by looking up the ticket key directly instead of pasting text here.

## Ticket Context

Improve overall Assessment runtime performance. General ask to reduce load time, main-thread overhead, and perceived latency in the adaptive `Assessment` engine (`src/assessment/assessment.ts`) and its supporting subsystems, independent of any specific reported bug.

## Business Goal

Faster load and a smoother question-to-question flow, especially on the varied and often low-end device/network conditions this product's learners use, without changing the adaptive scoring algorithm's behavior or output (the BST-based basal/ceiling scoring must remain correct and unchanged).

## Problem Statement

A code-level investigation of `src/assessment/assessment.ts`, `src/baseQuiz.ts`, `src/utils/jsonUtils.ts`, `src/analytics/`, `src/components/audioController.ts`, and the webpack build found that **the adaptive-testing algorithm itself (BST traversal, bucket search, foil generation) is not a measurable bottleneck at current production data scale** — real content (`public/data/english-lettersounds.json`) has only 10 buckets × 10 items (~10KB JSON), so O(n) and even the one O(n²) pattern found (`convertToBucketBST`) are trivial in absolute terms. The concrete, evidence-backed performance levers are elsewhere:

1. **No code-splitting anywhere in the build.** `webpack.config.js` produces a single `bundle.js` with no `optimization.splitChunks` and zero `import()` calls anywhere in `src/`. Every session ships the full `Assessment` engine, `Survey` engine, both UI adapters (`LegacyAssessmentUIAdapter` and `DragDropAssessmentUI`), and the full analytics/Firebase integration, even though a given session only ever uses one game mode and one UI mode (resolved via config/feature flag at startup).
2. **High console.log volume on hot paths.** `assessment.ts` contains 25+ `console.log` calls, several logging entire arrays/objects (e.g. `console.log(this.buckets[...])`, `console.log(bucketsRoot)`), and `src/utils/AnalyticsUtils.ts`'s `calculateScore` logs the full `buckets` array. These run on question/bucket transitions and have measurable overhead in some mobile WebViews, particularly when devtools/remote debugging is attached.
3. **Audio preload network bursts at bucket transitions.** `AudioController.PreloadBucket`, called from `assessment.ts` immediately before entering a new bucket, fires up to ~10 concurrent `new Audio()` fetches per bucket transition. This is non-blocking for JS execution but can cause perceived-latency spikes for the first few plays in a new bucket under constrained bandwidth.
4. **Latent lifecycle issues** — `BaseQuiz`'s `PubSub` has no `unsubscribe` method and no error isolation in its publish loop; there is no `dispose()`/teardown for the DOM listeners `BaseQuiz`'s constructor wires up. Not currently exercised as a leak (no repeated-subscribe pattern found in use today), but worth closing off if the spec anticipates multi-instance/retake flows.
5. **Minor/opportunistic:** a dead `searchStage` enum (declared, never used), a dead `eventString` variable built but never sent, and three separable O(n) scans in `AnalyticsUtils.ts` (`getBasalBucketID`, `getCeilingBucketID`, `calculateScore`) that could be merged into one pass — all cheap, low-risk cleanups with no behavior change.

## Acceptance Criteria

*(Proposed — confirm against the real ticket once available; these are written to be directly testable.)*

1. The initial bundle payload for a given session no longer includes UI-adapter code for the *unused* mode (legacy vs. drag-drop) — verified by comparing production bundle output/chunk manifest before and after.
2. Debug `console.log` calls on the per-question/per-answer/per-bucket hot path in `assessment.ts` and `AnalyticsUtils.ts` are removed or gated behind an explicit dev-mode flag (the codebase already has a dev-mode concept in `BaseQuiz`) — verified by grep count and a runtime check with dev-mode off.
3. `AnalyticsUtils.ts`'s basal/ceiling/score computation performs a single pass over `buckets` instead of three separate scans, with identical output — verified by existing/extended unit tests asserting unchanged scoring results.
4. No behavior change to adaptive scoring, bucket traversal, or question selection — verified by full `test/assessment/assessment.test.ts` suite passing unmodified in intent (same assertions, same results).
5. Production bundle size for a representative single-mode session is measurably smaller than the current single-bundle baseline (baseline to be captured via `npm run build:standalone` before starting).

---

# 1. Executive Summary

The `Assessment` engine's own algorithm (BST bucket navigation, foil generation, scoring) is well within its performance budget at real content scale (10 buckets × 10 items) and does not need an algorithmic rewrite. The measurable, addressable performance levers are build/delivery-level (single monolithic bundle shipping unused UI-mode/game-mode code to every session) and hygiene-level (verbose logging on hot paths, three redundant O(n) scans, a couple of dead-code items). This spec proposes targeted, incremental fixes — code-splitting by UI mode and game mode, hot-path log cleanup, and a scoring-scan consolidation — with no change to adaptive-testing behavior.

**Success metrics:** smaller per-session bundle payload; reduced console output volume in production; unchanged assessment scoring/behavior verified by existing tests; no regression in load time or question-flow correctness.

# 2. Current State Analysis

**Existing implementation:**
- `src/assessment/assessment.ts` (766 lines) — buckets stored as a flat array (`this.buckets: bucket[]`) and simultaneously wrapped in a BST of `TreeNode`s (`this.currentNode`) sharing the same bucket object references. The BST governs `RandomBST` traversal order; the flat array is used for all lookups (`getBasalBucketID`, `getCeilingBucketID`, `calculateScore`) and the `LinearArrayBased` mode.
- `src/components/tNode.ts` — `sortedArrayToIDsBST` builds a balanced-ish BST of bucket IDs once at bucket-build time; `convertToBucketBST` (assessment.ts:285-295) then does an `Array.find` per BST node to attach the actual bucket object — O(n²) over the ID tree, but only run at bucket (re)build time, not per question.
- `src/baseQuiz.ts` — minimal `PubSub` (`subscribe`/`publish`, no `unsubscribe`), used for exactly one event (`'ENDED'`) today; ~10 `document.getElementById`-based DOM listeners wired directly in the constructor with no corresponding teardown method.
- `src/utils/jsonUtils.ts` — fetches and fully parses the assessment/survey JSON once (`buildBuckets` guards against re-fetching); no caching layer needed given single-fetch-per-instance behavior.
- `src/analytics/analytics-integration.ts` — fire-and-forget `track()` calls on the per-question hot path (`ANSWERED`, `BUCKET_COMPLETED`); one synchronous `XMLHttpRequest` POST (`sendDataToThirdParty`) fires once, at assessment completion only.
- `src/components/audioController.ts` — `PreloadBucket` triggers non-blocking `new Audio()` fetches at bucket-transition time (not per-question); `PrepareAudioAndImagesForSurvey` does a one-time bulk preload for the whole quiz.
- `webpack.config.js` — single entry point (`src/standalone.ts`), single `bundle.js` output, `target: ['web', 'es5']`, Babel targeting `chrome 49`/`ios 10`/`safari 10`; **no `optimization.splitChunks`, no dynamic `import()` anywhere in `src/`.**

**Relevant modules:** `src/assessment/`, `src/baseQuiz.ts`, `src/utils/jsonUtils.ts`, `src/analytics/`, `src/components/audioController.ts`, `src/ui/` (both UI adapters), `webpack.config.js`.

**Current limitations:**
- Every session's bundle includes both `LegacyAssessmentUIAdapter`/`UIController` and `DragDropAssessmentUI`, plus both `Assessment` and `Survey` engines, regardless of which one config/feature-flag resolution actually selects at runtime.
- No memoization, `requestIdleCallback`, or lazy-loading pattern exists anywhere in `src/` — greenfield for any such optimization.
- No performance/benchmark tests exist; the only test fixture (`test/assessment/assessment.test.ts`) uses a 2-bucket × 4-item mock, too small to surface any scaling issue even if one existed.

**Technical debt:** dead `searchStage` enum (assessment.ts:19-23, never referenced); dead `eventString` variable built in `logPuzzleCompletedEvent` (assessment.ts:324-331) but never used/sent; `AnalyticsUtils.ts` uses `for...in` over arrays (slower, picks up inherited enumerable props) instead of `for...of`/indexed loops in three separate functions that could be one pass.

# 3. Root Cause Analysis

**Why the perceived "runtime performance" issue exists, ranked by expected real-world impact:**

1. **Bundle delivery, not algorithm, is the dominant cost.** Because `webpack.config.js` has no code-splitting and no dynamic `import()` usage anywhere, every session downloads and parses/executes the full `Assessment` + `Survey` engines, both UI adapters, and the full analytics/Firebase integration — regardless of which are actually used (mode selection happens at runtime via config/feature flag, after the bundle is already fully loaded). On slow networks or low-end devices, parse/compile time and download time for unused code is a real, measurable cost that dwarfs anything happening inside the BST/bucket logic itself.
2. **Verbose synchronous logging on hot paths.** `assessment.ts` and `AnalyticsUtils.ts` call `console.log` (including full-object dumps) on nearly every question/bucket/score-computation path. `console.log` with object arguments can force the browser devtools (or a WebView's remote-debugging bridge, common on Android app-embedded contexts) to serialize/inspect the object even when no console is visibly open in some environments — real, if hard to quantify precisely, overhead on the hot path.
3. **Redundant array scans at score time.** `getBasalBucketID`, `getCeilingBucketID`, and `calculateScore` each independently scan the full `buckets` array via `for...in`. This runs once at assessment end, not per-question, so its absolute cost is negligible today (n=10) — it's included because it's a free, low-risk consolidation while touching this code, not because it's a bottleneck.
4. **Foil/target rejection-sampling loops** (`selectRandomUnusedItem`, `generateRandomFoil`, `generateLinearFoil`) run per question with unbounded `do/while` + `.includes()` loops. At current bucket sizes (~10 items, capped at ~5 tries) this is bounded and cheap; it is **not** recommended as a priority fix, but is noted as a scaling risk if bucket sizes shrink or try-counts increase in the future (see Open Questions).

**CPU/Memory impact:** items 2–3 are trivial at current scale (single-digit milliseconds at most). Item 1 (bundle size) is the only lever with a plausible multi-hundred-millisecond-or-more real-world impact, particularly on parse/compile time for low-end CPUs and download time on constrained networks.

**Offline impact:** none of the identified issues relate to offline/service-worker behavior; `cacheModel.ts`/Workbox handling is unaffected by this spec.

# 4. Proposed Solution

**High-level approach** — prioritize delivery-level and hygiene-level fixes over algorithmic changes, since the evidence shows the algorithm itself is not the bottleneck at real content scale:

1. **Code-split by UI mode and game mode.** Convert the `LegacyAssessmentUIAdapter`/`UIController` vs. `DragDropAssessmentUI` selection, and the `Assessment` vs. `Survey` selection, in `src/App.ts` to use dynamic `import()` at the point where the mode is already resolved (after feature-flag/config resolution, before instantiation). Webpack handles the chunk-loading runtime itself regardless of the `es5`/old-browser Babel target, so this does not require raising the browser support bar.
2. **Remove or gate hot-path logging.** Delete the `console.log` calls that fire on the per-question/per-answer/per-bucket path in `assessment.ts` and the full-object dump in `AnalyticsUtils.ts`'s `calculateScore`; where a log is genuinely useful for debugging, gate it behind the existing `BaseQuiz` dev-mode flag rather than removing it outright.
3. **Consolidate the three basal/ceiling/score scans** in `AnalyticsUtils.ts` into a single pass over `buckets`, preserving identical output (verified via existing tests).
4. **Remove dead code:** the unused `searchStage` enum and the unused `eventString` variable in `logPuzzleCompletedEvent`.
5. **Not proposed in this iteration:** rewriting the BST/foil-generation logic, adding memoization/idle-scheduling, or capping the rejection-sampling loops — none are justified by current evidence; revisit only if content sizes grow substantially (see Open Questions).

**Why this approach:** every recommendation is grounded in a specific, located finding from the code review, prioritized by actual measured/inferred impact (bundle size first, since it's the only item with plausible large real-world cost) rather than by theoretical algorithmic elegance.

**Alternatives considered:**
- *Rewrite the BST/bucket engine for asymptotic efficiency.* Rejected — no evidence of a bottleneck at current or near-future content scale; would be premature optimization against unneeded future requirements.
- *Add a generic memoization layer.* Rejected — no repeated-computation hot path was found that would benefit; would add complexity without a measured win.
- *Full route-based lazy loading (webpack magic comments, prefetch hints, etc.).* Deferred — a simple conditional dynamic `import()` at the mode-selection point captures nearly all the win with much less complexity; revisit only if bundle analysis after this change shows further meaningful splits are available.

**Trade-offs:** dynamic `import()` introduces a small additional network round-trip for the actually-used chunk (mitigated by webpack's chunk-loading + can be prefetched once mode is known slightly earlier in `App.spinUp()` if desired); code-splitting changes the build output shape (multiple chunk files instead of one bundle), which may require updates to how the standalone build is deployed/referenced if it assumes a single `bundle.js` file — confirm with whoever owns the deployment/CDN config.

**Business value:** faster initial load, especially on low-end/constrained-network sessions, with no change to assessment behavior or scoring — directly serves the stated business goal without touching the parts of the system where a mistake would affect scoring correctness.

# 5. Architecture Hooks

- **Existing modules involved:** `src/App.ts` (mode resolution and instantiation point — `App.spinUp()`), `webpack.config.js` (build config), `src/assessment/assessment.ts`, `src/utils/AnalyticsUtils.ts`.
- **Components affected:** `LegacyAssessmentUIAdapter`/`UIController`, `DragDropAssessmentUI`, `Assessment`, `Survey` — all become dynamically imported rather than statically bundled; their public interfaces (`AssessmentUI`, `BaseQuiz` subclasses) are unchanged.
- **Services affected:** none of `src/analytics/`, `src/components/audioController.ts`, or `src/services/` change behavior — only `assessment.ts`'s logging and `AnalyticsUtils.ts`'s scan pattern change internally.
- **Hooks/lifecycle:** `App.spinUp()` is the integration point — after `@curiouslearning/features` resolves the `assessmentUIMode`/game-type, replace the current static `new DragDropAssessmentUI()` / `new UIController()` / `new Assessment()` / `new Survey()` construction with an `await import(...)` at that same point.
- **State management:** no state-shape changes; this is purely a loading-mechanism change plus internal logging/scan cleanup.
- **Performance-sensitive paths:** `App.spinUp()` (load-time), `assessment.ts`'s per-question/per-bucket methods (logging removal), `AnalyticsUtils.ts` scoring functions (scan consolidation).
- **Rendering paths / asset loading flow:** unaffected — `AudioController` preload timing and behavior are unchanged by this spec.

# 6. Folder Structure

```
src/
  App.ts                          (modified — dynamic import() at UI-mode / game-mode resolution point)
  assessment/
    assessment.ts                 (modified — remove/gate hot-path console.log calls, remove dead searchStage enum and eventString variable)
  utils/
    AnalyticsUtils.ts              (modified — consolidate 3 scans into 1 pass)
webpack.config.js                 (modified — confirm/enable code-splitting output naming; no splitChunks config change strictly required since dynamic import() creates separate chunks automatically)
test/
  assessment/
    assessment.test.ts             (modified — add/adjust tests for consolidated scoring scan; verify no behavior change)
  App.test.ts                      (modified, if exists — verify dynamic import path is exercised; check current test file name/location before assuming)
```

No new folders are introduced; this is a targeted change to existing files plus a build-config review.

# 7. File-Level Implementation Plan

**`src/App.ts`**
- Purpose: resolves `assessmentUIMode`/game type from config + feature flags and instantiates the corresponding UI/game classes.
- Required changes: replace static imports/instantiations of `DragDropAssessmentUI`, `LegacyAssessmentUIAdapter`/`UIController`, `Assessment`, and `Survey` with `await import(...)` calls gated on the already-resolved mode, at the same point in `spinUp()` where the mode is currently branched on.
- Public APIs affected: none (external `AppStartupConfig` and constructor signature unchanged; this is an internal loading-mechanism change).
- Internal methods affected: `spinUp()` (or wherever mode-based instantiation currently occurs — confirm exact method name/line before implementation).

**`src/assessment/assessment.ts`**
- Purpose: adaptive assessment engine.
- Required changes: remove or gate (behind existing dev-mode flag) the ~25+ `console.log` calls on hot paths (question build, bucket transition, answer handling); delete the unused `searchStage` enum (lines ~19-23) and the unused `eventString` variable in `logPuzzleCompletedEvent` (lines ~324-331).
- Public APIs affected: none.
- Internal methods affected: `buildBuckets`, `logPuzzleCompletedEvent`, bucket-transition methods (`tryMoveBucketRandomBST`/`tryMoveBucketLinearArrayBased`) — logging removal only, no logic change.

**`src/utils/AnalyticsUtils.ts`**
- Purpose: computes basal/ceiling bucket IDs and final score at assessment end.
- Required changes: merge `getBasalBucketID`, `getCeilingBucketID`, and the bucket-lookup portion of `calculateScore` into a single pass over `buckets` (e.g., one loop computing all three derived values), replacing `for...in` with `for...of`/indexed iteration; remove the full-array `console.log(buckets)` call.
- Public APIs affected: none if existing exported function signatures (`getBasalBucketID`, `getCeilingBucketID`, `calculateScore`) are preserved as thin wrappers around the consolidated internal pass — confirm whether these are called independently elsewhere before merging into one internal implementation, to avoid triple-computing if a shared internal helper isn't introduced.
- Internal methods affected: as above.

**`webpack.config.js`**
- Purpose: build configuration.
- Required changes: verify dynamic `import()` calls produce separate chunk files with sensible names (`output.chunkFilename`); no `optimization.splitChunks` config is strictly required for this to work, but review whether the deployment/CDN setup (outside this repo) assumes a single `bundle.js` and needs updating to serve multiple chunk files.

**`test/assessment/assessment.test.ts`**
- Required changes: add/extend tests asserting the consolidated `AnalyticsUtils` scan produces identical basal/ceiling/score results to the current three-scan implementation, using both the existing small mock fixture and (recommended, see Section 11) a fixture closer to real content size (10×10) to guard against future scale changes.

# 8. Performance Considerations

- **CPU optimization:** removing hot-path `console.log` calls and consolidating three O(n) scans into one reduces both call overhead and (for the logs) potential devtools/WebView serialization cost. At current scale (n=10 buckets) the absolute CPU saving is small but nonzero and free to capture.
- **Rendering optimization:** not directly affected by this spec (no DOM/rendering changes proposed here — see the separate drag-interaction-performance spec for rendering-path work).
- **Asset loading optimization:** not changed by this spec; `AudioController` preload behavior is out of scope here.
- **Bundle/parse-time optimization (primary lever):** code-splitting by mode should meaningfully reduce the JS payload actually downloaded/parsed/executed per session, since a session only ever uses one of two UI adapters and one of two game engines. Measure the actual delta via `npm run build:standalone` output size before/after (a concrete before/after number should be captured once implementation begins — the current checked-in `build/bundle.js` at ~800KB appears to be a development-mode artifact, not the production baseline, so a fresh production build should be the true baseline).
- **Offline performance:** unaffected; service-worker caching behavior in `App.ts`/`cacheModel.ts` is unchanged.
- **Low-end device considerations:** reduced parse/compile time from a smaller per-session bundle disproportionately helps low-end CPUs, where JS parse/compile (not just execution) is a significant fraction of load time.

# 9. Risks

| Risk | Type | Mitigation |
|---|---|---|
| Code-splitting changes build output shape (multiple chunks vs. one `bundle.js`), potentially breaking a deployment/CDN assumption of a single file | Deployment | Confirm with whoever owns the standalone-build deployment before merging; verify `wb:inject`/service-worker manifest generation still works correctly against multiple chunks |
| Removing `console.log` calls removes a debugging aid relied on by another team/support workflow | Regression | Gate behind existing dev-mode flag rather than deleting outright, so debugging capability is preserved when explicitly enabled |
| Consolidating three scoring scans introduces a subtle behavior change in edge cases (e.g., tie-breaking, missing bucket ID) | Correctness | Add explicit before/after unit tests covering edge cases (no passed bucket, all buckets passed, single bucket) prior to merging |
| Dynamic `import()` timing shifts when analytics/Firebase initializes relative to first question | User-facing | Verify `AnalyticsIntegration.initializeAnalytics()` (in `App.ts`) still completes before any `track()` call that depends on it, regardless of import ordering |

# 10. Acceptance Criteria Mapping

| Acceptance Criterion | Implementation | Validation | Expected Outcome |
|---|---|---|---|
| Initial bundle excludes the unused UI-adapter/game-mode code | Dynamic `import()` in `App.ts` at mode-resolution point | Compare production build output/chunk manifest before vs. after (`npm run build:standalone`) | Per-session downloaded JS is smaller than the current single-bundle baseline |
| Hot-path `console.log` removed or dev-mode-gated | Edit `assessment.ts`, `AnalyticsUtils.ts` | Grep count of `console.log` on hot-path methods; manual run with dev-mode off | No hot-path console output in production/non-dev-mode runs |
| Basal/ceiling/score computed in one pass | Consolidate in `AnalyticsUtils.ts` | Extend `test/assessment/assessment.test.ts` with before/after equivalence assertions | Identical scoring results, single-pass implementation |
| No behavior change to scoring/traversal/selection | No logic changes to BST/foil-generation code | Full existing `assessment.test.ts` suite passes | All current assertions hold unmodified |
| Measurable bundle size reduction | Code-splitting + build verification | `npm run build:standalone` size comparison, captured before starting implementation as baseline | Documented before/after size delta in the PR description |

# 11. Unit Testing

**Files to test:**
- `test/assessment/assessment.test.ts` (extend)
- A new or extended test file for `src/utils/AnalyticsUtils.ts` if one doesn't already exist as a standalone file (confirm current location/coverage before assuming a new file is needed)
- `test/App.test.ts` (or equivalent, if it exists — confirm exact path) for the dynamic-import mode-resolution change

**Scenarios:**
- Consolidated basal/ceiling/score computation returns identical results to the current three-scan implementation across: no bucket passed, all buckets passed, single bucket, buckets passed non-contiguously.
- `App.ts`'s mode resolution correctly awaits the dynamically-imported module before instantiating it, for all four combinations (legacy/drag-drop × assessment/survey).
- Removed/gated `console.log` calls: assert (via a spy on `console.log`) that no hot-path logging occurs when dev-mode is off, and that it does occur when dev-mode is explicitly on (if gating rather than full removal is chosen).

**Edge cases:**
- Empty `buckets` array passed to the consolidated scoring function (should not throw; confirm current behavior is preserved).
- A bucket with `tested: true` but `passed: false` at the boundary between basal and ceiling.

**Failure cases:** dynamic `import()` rejecting (e.g., network failure loading a chunk) — confirm existing error-handling expectations in `App.spinUp()` (check whether a try/catch or fallback already exists; add one if not, scoped narrowly to the import call).

**Mocks required:** existing bucket fixtures in `test/assessment/assessment.test.ts`; consider adding a larger (10×10) fixture mirroring `public/data/english-lettersounds.json` for closer-to-real-scale regression coverage, addressing the current gap where only a 2×4 mock exists.

**Coverage recommendation:** maintain or improve current coverage on `AnalyticsUtils.ts` and `assessment.ts`; add coverage for the new dynamic-import branch in `App.ts` if not already covered.

# 12. End-to-End Testing

- **Happy path:** complete a full assessment session in each of the four mode combinations (legacy/drag-drop × RandomBST/LinearArrayBased) end-to-end, confirming identical final score/summary data to pre-change behavior.
- **Regression scenarios:** dev-mode bucket-gen-mode toggle (which calls `buildBuckets` again) still works correctly after logging cleanup.
- **Negative scenarios:** simulate a slow/failed dynamic-import chunk load (e.g., via network throttling/blocking in a manual test) and confirm a reasonable failure mode (error surfaced via `onClose`/host integration, not a silent hang) — this is new behavior introduced by code-splitting and should be explicitly verified.
- **Offline scenario:** confirm service-worker caching (Workbox) still correctly caches/serves the new multi-chunk build output; re-run `wb:inject` and verify the generated manifest includes all chunks.
- **Low-end device scenario:** measure and compare time-to-first-question on a throttled/low-end profile before and after the code-splitting change.
- **Performance validation:** capture load-time and bundle-size metrics before/after using the same methodology (e.g., Lighthouse or manual Network-panel timing) on a representative session.
- **Cross-browser/platform validation:** confirm dynamic `import()`-based chunk loading works correctly on the project's older target browsers (Chrome 49/iOS 10/Safari 10 per Babel config) — webpack's own chunk-loading runtime supports this without requiring native ES module `import()`, but should be explicitly verified given how old these targets are.

# 13. Rollout Strategy

- **Implementation order:** (1) hot-path logging cleanup + dead-code removal (lowest risk, no behavior change) → (2) `AnalyticsUtils.ts` scan consolidation with before/after test coverage → (3) code-splitting in `App.ts` + webpack verification (highest value, requires the most validation, especially around deployment/CDN assumptions and old-browser chunk-loading support).
- **Deployment:** standard release process; recommend capturing a production build size baseline (`npm run build:standalone`) immediately before starting, so the final PR can report a concrete before/after delta.
- **Rollback plan:** each of the three implementation phases is independently revertable (separate commits/PRs recommended) since they touch different files with no interdependency beyond ordering.
- **Monitoring:** no new analytics event is required; if desired, existing `AnalyticsIntegration` could be extended with a load-time metric in a future iteration (not required for this spec).
- **Success metrics:** documented bundle-size reduction; confirmed-unchanged assessment test suite; qualitative load-time improvement on a throttled/low-end profile.

# 14. Open Questions

- What does the deployment/CDN pipeline for the standalone build currently assume about output shape (single `bundle.js` vs. multiple chunks)? This must be confirmed before code-splitting can be safely merged.
- Are the `console.log` calls in `assessment.ts`/`AnalyticsUtils.ts` relied on by any external support/debugging workflow that would be broken by gating them behind dev-mode? Confirm with the team before removing vs. gating.
- Is there an expectation that bucket/content sizes will grow significantly beyond the current ~10×10 scale? If so, the rejection-sampling foil-generation loops (currently deprioritized as low-risk) should be revisited with a bounded-attempt fallback.
- Should `getBasalBucketID`/`getCeilingBucketID`/`calculateScore` remain as independently callable exported functions (thin wrappers around a shared internal pass), or can callers be updated to call one consolidated function directly? Depends on whether anything outside `assessment.ts` calls these independently — needs a repo-wide usage check before finalizing the consolidation approach.
- Once Jira/Atlassian MCP is authorized, should this document be regenerated with the actual ticket's acceptance criteria in place of the proposed ones above?
