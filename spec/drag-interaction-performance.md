# Spec: Improve Drag Interaction Performance on Lower-End Devices

> **Template note:** This document follows the reusable SDD structure. For future tickets, replace **Ticket Context**, **Business Goal**, **Problem Statement**, and **Acceptance Criteria** below. This instance was generated from one of the template's example tasks, not a live Jira ticket — Jira/Atlassian MCP is not yet authorized in this environment, so ticket linkage is manual for now. Once the Atlassian MCP connector is authorized (via claude.ai connector settings or `/mcp`), the "Ticket Context" section can be populated by looking up the ticket key directly instead of pasting text here.

## Ticket Context

Improve drag interaction performance on lower-end devices. Users on low-end Android devices and older browsers (the project targets Chrome 49, iOS 10, Safari 10 per `webpack.config.js`) report perceived jank/stutter while dragging an answer tile toward the drop target in the drag-and-drop assessment UI (`DragDropAssessmentUI`, feature-flagged via `drag-drop-assessment-ui`).

## Business Goal

Keep the drag-and-drop assessment experience smooth on the low-end/older devices that make up a meaningful share of the target population (this product serves literacy learners across varied device tiers, often older Android hardware). Perceived stutter during drag directly undermines trust in the interaction and can cause mis-drops, hurting assessment accuracy as well as UX.

## Problem Statement

Dragging an answer tile is driven entirely by native Pointer Events with per-move work done synchronously on the main thread — there is no `requestAnimationFrame` batching anywhere in the codebase. Two specific mechanisms compound on every `pointermove`:

1. A **forced synchronous layout** (write→read thrash): `DraggableButton.onMove` writes `style.transform`, and immediately afterward `DragEventController.handlePointerDragMove` calls `getActiveDropContext()` → `isWithinTargetArea()`, which calls `getBoundingClientRect()` on both the dragged element and the drop target. Reading layout geometry right after a style write forces the browser to flush layout synchronously, once per pointermove event, rather than batching to the next paint.
2. A **continuously painting CSS animation** runs for the full duration of every drag gesture: `.answerButton.dragging::before/::after` in `public/css/drag-drop-style.css` (lines ~313–424) animates `text-shadow` (`sparkle-glitter-a`/`-b`, 1.6s/1.2s infinite). Unlike `transform`/`opacity`, `text-shadow` is not compositor-only — it forces paint work on every animation frame, running concurrently with the transform updates the drag itself is producing.

On capable hardware this is invisible; on low-end devices (the CPUs implied by the project's `chrome 49`/`ios 10` Babel targets) the combination of per-event layout thrash plus concurrent non-compositable paint is a plausible, evidence-backed source of dropped frames.

Additional secondary contributors identified during code review (lower severity, included for completeness):
- `DragEventController.attach()` adds `pointerdown/pointermove/pointerup/pointercancel/dragstart` listeners without an explicit `{ passive: true }` option, even though the handlers never call `preventDefault()` on `pointermove` itself.
- `DragDropAssessmentUI.prepareQuestion()`/`revealQuestion()` tear down and rebuild the answers container via `innerHTML = ''` and rebuild, and recreate the play button (and its click listener) on every question/replay rather than reusing persistent DOM and listeners.

## Acceptance Criteria

*(Proposed — confirm against the real ticket once available; these are written to be directly testable.)*

1. During an active drag gesture, no `getBoundingClientRect()`/layout-reading call executes in the same task as a `style.transform` write for the same frame (verified by Chrome DevTools Performance panel showing no "Forced reflow" / "Layout thrashing" warnings during a recorded drag).
2. Drag-related pointermove handling is batched to at most one update per animation frame (verified via a rAF-batching implementation and a Performance-panel recording showing `pointermove`-driven work coalesced into a single per-frame task).
3. The `.dragging` state animation no longer forces continuous per-frame paint on low-end devices, while the sparkle's visual appearance (colors, star positions) is unchanged — verified via DevTools "Paint" flame chart showing paint work only at each animation step boundary (a few times per cycle) rather than on every rendered frame during drag.
4. Drag-and-drop pointer listeners are registered with `{ passive: true }` where they don't call `preventDefault()`.
5. No regression in existing drag-and-drop tests (`test/ui/draggable-button.test.ts`, `test/ui/drag-controller.test.ts`, `test/ui/drop-target.test.ts`) plus new tests covering the rAF-batched move path.
6. Manual verification on at least one throttled/low-end device profile (Chrome DevTools CPU throttling ≥4x slowdown, or an actual low-end Android device) shows a subjectively smoother drag with sustained frame rate closer to 60fps than the current implementation.

---

# 1. Executive Summary

Drag interaction in `DragDropAssessmentUI` is hand-rolled on native Pointer Events with no `requestAnimationFrame` batching, no debounce/throttle utilities, and no drag/animation library dependency anywhere in the project. Two concrete, code-located issues explain most plausible low-end jank: a forced-synchronous-layout pattern on every `pointermove`, and a continuously-painting `text-shadow` CSS animation that runs for the whole drag gesture. Both are fixable incrementally, without introducing a new drag library or rewriting the interaction model. Expected impact: smoother, more predictable drag on low-end/older devices, fewer accidental mis-drops, no change to the interaction's visual design or API surface.

**Success metrics:** sustained frame rate during drag on a throttled/low-end profile; elimination of DevTools "forced reflow" warnings during drag; no regression in existing unit tests; qualitative pass on a real low-end device.

# 2. Current State Analysis

**Existing implementation** — `src/ui/drag-drop/`:
- `dragdrop-ui.ts` (`DragDropAssessmentUI`, 476 lines) implements the `AssessmentUI` interface ([src/ui/assessment-ui.ts](src/ui/assessment-ui.ts)). It wraps each of the 6 pre-mounted `answerButton1`–`answerButton6` elements in a `DraggableButton`, wraps the `.chestdiv` drop zone in a `DropAreaTarget`, and creates a single `DragEventController` attached to the whole game container.
- `dom-events/drag-controller.ts` — `DragEventController` listens for `pointerdown/pointermove/pointerup/pointercancel/dragstart` on the game container (event delegation, not per-button listeners — good for listener count). Tracks one `activePointerId` to ignore multi-touch.
- `dom-events/draggable-button.ts` — `DraggableButton` applies `touchAction: none`, `userSelect: none`, and moves the button purely via `style.transform` (GPU-compositable, correct approach) — no `top`/`left` mutation.
- `dom-events/drop-target.ts` — `DropAreaTarget`, a thin wrapper publishing `DROP_ELEMENT_INTERACTION` on drop; `onHover` is an empty stub.
- Static DOM skeleton (`src/ui/dom-template/sections/drag-drop/draggable-question-view-wrapper-section.ts`) mounts the fixed 6-button layout once at survey init; per-question changes are `innerHTML` rewrites inside `dragdrop-ui.ts`, not skeleton rebuilds.
- Drag sound effects (`src/services/drag-drop-audio-controller.ts`) subscribe to `ON_DRAG_START`/`ON_DRAG_RETURN` on the app event bus ([src/services/app-event-bus.ts](src/services/app-event-bus.ts)) and call `AudioController.PlaySoundEffect`, synchronously invoked from within the pointerdown/pointerup handlers.

**Current limitations:**
- No `requestAnimationFrame` usage anywhere in the codebase — all pointermove work (transform write, `getBoundingClientRect` reads, hover-area math) runs synchronously inside the native event callback, once per native event (which can fire faster than the display's refresh rate on some devices/browsers).
- No debounce/throttle utility exists in `src/` to build on.
- No drag or animation library dependency (`interact.js`, `dnd-kit`, GSAP, etc.) — everything is hand-rolled, which is appropriate for this project's size but means there's no existing abstraction to lean on; performance work here is about tightening the hand-rolled implementation, not swapping libraries.
- No test file exists for `DragDropAssessmentUI` itself (only its constituent pieces — `DraggableButton`, `DragEventController`, `DropAreaTarget` — have tests).

**Technical debt:** the per-question `innerHTML` teardown/rebuild of the play button (recreating and re-attaching a click listener every question, `dragdrop-ui.ts` line ~265) is unrelated to drag-move perf directly but is a minor GC/allocation cost worth a one-line fix while in this code.

# 3. Root Cause Analysis

**Why the issue exists:** the interaction was built directly against Pointer Events with straightforward, synchronous state updates — a reasonable initial implementation, but it never introduced frame-based batching, so every native `pointermove` (which can fire more often than the display refresh rate, especially on touchscreens) does full work immediately.

**Specific bottlenecks, in order of expected impact:**

1. **Forced synchronous layout ("layout thrashing")** — `draggable-button.ts`'s `onMove` writes `element.style.transform` for the dragged tile. Immediately afterward, in the same `pointermove` handler tick, `drag-controller.ts`'s `handlePointerDragMove` (lines ~121–133) calls `getActiveDropContext()` → `isWithinTargetArea()`, which calls `dragElement.getBoundingClientRect()` and `chestImage.getBoundingClientRect()`. Reading geometry immediately after a style write forces the browser to synchronously recompute layout instead of deferring it to the next paint — on every single pointermove, for the whole drag gesture. This is the classic "write then read" thrashing pattern and scales directly with move-event frequency and CPU speed, making it the most likely single cause of visible low-end jank.
2. **Non-compositable continuous animation during drag** — `.answerButton.dragging::before`/`::after` in `public/css/drag-drop-style.css` animates `text-shadow` continuously (`sparkle-glitter-a` 1.6s infinite, `sparkle-glitter-b` 1.2s infinite) for as long as the `.dragging` class is present, i.e. the entire gesture. `text-shadow` cannot be handled by the compositor thread alone (unlike `transform`/`opacity`); it requires repaint on every animation frame. This repaint work runs on the main thread concurrently with the pointermove-driven transform updates, competing for the same frame budget.
3. **No rAF batching / no throttling** — because there is no `requestAnimationFrame` scheduling and no debounce/throttle utility anywhere in `src/`, every native pointermove does full work (transform write, rect reads, hover-area check) synchronously and immediately, rather than coalescing multiple same-frame events into one update.
4. **Missing `{ passive: true }`** on the pointer listeners (`drag-controller.ts` `attach()`) — since `pointermove`/`pointerdown` never call `preventDefault()`, marking them passive lets the browser optimize scroll/composite scheduling around them; currently the browser must assume they might call `preventDefault()` and budget accordingly.

**CPU/Memory impact:** items 1–3 are CPU/main-thread-bound (layout + paint), not memory-bound. No memory leak or growth pattern was found in the drag path itself. Offline impact: none — this is a pure client-side rendering/interaction concern, unrelated to network/offline behavior.

# 4. Proposed Solution

**High-level approach** — tighten the existing hand-rolled implementation in place; do not introduce a drag library or rewrite the interaction model:

1. **Batch pointermove work to `requestAnimationFrame`.** In `DragEventController`, instead of doing the transform write + hover-check synchronously inside `handlePointerDragMove`, store the latest pointer position and schedule (at most once per frame, via a simple in-file rAF-batch flag — no new utility needed for a single call site) a single update that (a) writes the transform, then (b) performs the drop-area check. This alone resolves the write-then-read ordering problem for free, since the read can be deferred to be batched with the browser's own layout pass rather than forced mid-task.
2. **Cap the drag animation's repaint frequency without changing its look.** `text-shadow` isn't compositor-only, so the fix isn't to remove or restyle it — it's to stop the browser from continuously interpolating it. Change `.answerButton.dragging::before/::after`'s `animation-timing-function` from `linear` to `steps(4, jump-end)` / `steps(3, jump-end)` (matching the 4/3 keyframe stops already defined in `sparkle-glitter-a`/`-b`). This makes the animation snap directly between the existing keyframe values instead of interpolating between them, so the browser repaints only once per step (a few times per cycle) instead of on every rendered frame — same colors, same star positions, same overall twinkle, far less paint work.
3. **Add `{ passive: true }`** to the `pointerdown`/`pointermove`/`pointerup`/`pointercancel` listeners in `DragEventController.attach()` (leave `dragstart` non-passive since it calls `preventDefault()`).
4. **(Minor, opportunistic)** stop recreating the play-button `innerHTML`/listener every question in `dragdrop-ui.ts`; attach the listener once and only swap the icon/state.

**Why this approach:** every fix targets a concretely identified, measurable mechanism (forced reflow, non-compositable paint) rather than a speculative rewrite. It preserves the existing architecture (`AssessmentUI` interface, event-delegated `DragEventController`, CSS-driven visual states) and requires no new dependencies.

**Alternatives considered:**
- *Swap to a drag library (e.g., interact.js).* Rejected — adds a dependency and bundle weight for a problem that's fixable with ~30 lines of change in the existing controller; the current architecture (delegated pointer events + transform-only movement) is already close to best practice.
- *Rewrite drag as a state machine with a dedicated scheduler.* Rejected as disproportionate — the fix is localized to two files; a broader rewrite isn't justified by the evidence gathered.

**Trade-offs:** rAF-batching adds one frame of at-most latency between pointer input and visual update, which is imperceptible (<16ms) and standard practice; it should not be perceived as "laggier" drag. The `steps()` timing change is visually neutral by construction (it reuses the exact same keyframe values), so unlike a property-swap it does not need design sign-off — the only change is how often the browser paints between the already-defined states, not what gets painted.

**Business value:** low implementation cost, no architectural risk, directly targets the reported symptom (jank on low-end devices) with measurable before/after validation.

# 5. Architecture Hooks

- **Modules involved:** `src/ui/drag-drop/dom-events/drag-controller.ts`, `src/ui/drag-drop/dom-events/draggable-button.ts`, `src/ui/drag-drop/dom-events/drop-target.ts`, `src/ui/drag-drop/dragdrop-ui.ts`.
- **Components affected:** none outside the drag-drop UI variant — the legacy `UIController` path is untouched; `DragDropAssessmentUI` is only active behind the `drag-drop-assessment-ui` feature flag.
- **Services affected:** `src/services/drag-drop-audio-controller.ts` / `src/services/app-event-bus.ts` are not modified, but the timing of `ON_DRAG_START`/`ON_DRAG_RETURN` publishes (currently synchronous inside pointerdown/pointerup) should be reviewed to confirm they stay outside the new rAF-batched move path (they already are — they fire on down/up, not move).
- **Lifecycle methods:** `DragEventController.attach()`/`detach()` (listener registration point — add `{ passive: true }` here); `DragDropAssessmentUI.dispose()` (ensure any pending rAF handle from the batching change is cancelled here to avoid a dangling callback after teardown).
- **State management:** no new state store; the rAF batching introduces one small piece of transient state (latest pointer position + a "frame scheduled" flag) scoped inside `DragEventController`.
- **Performance-sensitive paths:** `handlePointerDragMove` (the hot path), the `.dragging` CSS state.
- **Rendering paths:** transform-driven compositor updates (already correct pattern) plus the new rAF batching point.
- **Asset loading flow:** unaffected — this spec does not touch `AudioController`/image preloading.

# 6. Folder Structure

```
src/
  ui/
    drag-drop/
      dragdrop-ui.ts                     (modified — minor: stop rebuilding play-button listener per question)
      dom-events/
        drag-controller.ts               (modified — rAF-batch pointermove, add passive listeners)
        draggable-button.ts              (modified — expose a synchronous "apply transform now" method for the controller to call inside its rAF callback, if not already structured that way)
        drop-target.ts                   (unchanged)
        index.ts                         (unchanged)
public/
  css/
    drag-drop-style.css                  (modified — switch .dragging::before/::after animation-timing-function to steps() to cap repaint frequency)
test/
  ui/
    drag-controller.test.ts              (modified — add rAF-batching + passive-listener assertions)
    draggable-button.test.ts             (unchanged, verify still passes)
    drop-target.test.ts                  (unchanged, verify still passes)
```

No new folders or files are introduced; this is a targeted, in-place change to three existing files plus one stylesheet.

# 7. File-Level Implementation Plan

**`src/ui/drag-drop/dom-events/drag-controller.ts`**
- Purpose: owns pointer event wiring and per-move drag/drop-check logic.
- Required changes: in `attach()`, add `{ passive: true }` to `pointerdown`/`pointermove`/`pointerup`/`pointercancel` listener registrations (leave `dragstart` as-is). In `handlePointerDragMove`, replace the immediate write+read with: store latest event/position, and if no frame is already scheduled, `requestAnimationFrame(() => { applyMove(); checkDropArea(); scheduled = false })`. Cancel any pending rAF handle in `detach()`.
- Public APIs affected: none (constructor/`attach`/`detach` signatures unchanged).
- Internal methods affected: `handlePointerDragMove`, `attach`, `detach`.

**`src/ui/drag-drop/dom-events/draggable-button.ts`**
- Purpose: applies transform to the dragged element.
- Required changes: none functionally required if `onMove` is already a simple synchronous transform write — the controller will simply call it from inside the rAF callback instead of directly from the event handler. Verify `onMove` has no side effects that assume synchronous-with-event timing.
- Public APIs affected: none.

**`src/ui/drag-drop/dragdrop-ui.ts`**
- Purpose: orchestrates question rendering and drag/answer wiring.
- Required changes (minor, opportunistic — not required for the core perf fix): attach the play-button click listener once during `configure()`/`init()` rather than recreating `innerHTML` + listener in every `prepareQuestion`/`revealQuestion` call; update only the icon/state.
- Public APIs affected: none (`AssessmentUI` interface unchanged).

**`public/css/drag-drop-style.css`**
- Purpose: visual styling, including the `.dragging` sparkle effect (lines ~313–424, `zoomIn` keyframes ~line 492).
- Required changes: keep the existing `sparkle-glitter-a`/`-b` keyframes on `.answerButton.dragging::before/::after` unchanged; change only the `animation-timing-function` from `linear` to `steps(4, jump-end)` (`::before`) and `steps(3, jump-end)` (`::after`), matching the number of non-repeating keyframe stops already defined in each. No design sign-off needed — the rendered colors/positions are identical, only the repaint cadence changes.

**`test/ui/drag-controller.test.ts`**
- Required changes: add tests asserting (a) listeners are registered with `passive: true` where applicable, (b) multiple synchronous `pointermove` events before a frame flush result in only one `applyMove`/drop-check invocation (mock `requestAnimationFrame` to control frame timing), (c) a pending rAF is cancelled on `detach()`.

# 8. Performance Considerations

- **CPU optimization:** eliminating the forced-reflow pattern removes one synchronous layout recalculation per pointermove; rAF batching further caps the update rate to display refresh rate (typically 60Hz) regardless of native event frequency.
- **Rendering optimization:** `steps()` timing on the `.dragging` sparkle animation caps repaint to the animation's discrete keyframe boundaries (a few times per cycle) instead of continuous per-frame interpolation, freeing up main-thread time during drag without changing what's rendered.
- **Asset loading / audio:** unaffected by this change (out of scope — `PlaySoundEffect` calls on drag start/return remain as-is, they're not on the per-move hot path).
- **Low-end device considerations:** these are precisely the fixes most likely to matter on low-end hardware, since forced reflow and repaint cost scale with CPU speed; capping the sparkle animation to a handful of paints per cycle instead of ~60/sec directly reduces that cost without any hardware-acceleration assumptions.
- **Measurable expectations:** target zero "Forced reflow"/"Layout thrashing" warnings in Chrome DevTools Performance panel during a recorded drag; target no continuous main-thread paint activity attributable to the `.dragging` pseudo-elements during a recorded drag.

# 9. Risks

| Risk | Type | Mitigation |
|---|---|---|
| rAF batching introduces a perceptible one-frame input lag | Technical | One frame (<16ms) is below human perception threshold for this kind of interaction; validate subjectively during manual testing |
| `steps()` cadence feels too "strobe-like" rather than a smooth twinkle | User / Design | Timing was chosen to match the animation's existing keyframe count (4/3 stops); adjust the step count or duration if a quick visual pass finds it too abrupt — low-risk since it's a one-line tweak |
| Removing `preventDefault` expectations by adding `passive: true` accidentally breaks a listener that *does* need to call `preventDefault()` | Regression | Audit each listener individually before adding the flag; `dragstart` (which does call `preventDefault()`) is explicitly excluded |
| Old browser targets (Chrome 49/iOS 10/Safari 10 per Babel config) may have different `requestAnimationFrame`/Pointer Events support nuances | Deployment | `requestAnimationFrame` and Pointer Events are both supported at these target versions; no polyfill needed, but confirm during QA on an actual old-device profile if available |

# 10. Acceptance Criteria Mapping

| Acceptance Criterion | Implementation | Validation | Expected Outcome |
|---|---|---|---|
| No layout read immediately after a transform write during drag | rAF-batch the read+write in `drag-controller.ts` | DevTools Performance recording of a drag gesture | No "Forced reflow" warnings |
| Pointermove work batched to ≤1 update/frame | rAF scheduling flag in `handlePointerDragMove` | Unit test mocking `requestAnimationFrame`; DevTools frame trace | One `applyMove`/drop-check per animation frame regardless of native event rate |
| `.dragging` animation no longer forces paint every frame | Switch `animation-timing-function` to `steps()` in `drag-drop-style.css` | DevTools Paint flame chart during drag | Paint only at step boundaries (a few times per cycle), same visual result |
| Passive listeners where applicable | Add `{ passive: true }` in `attach()` | Unit test asserting listener options; manual scroll-during-drag check | Listener options include `passive: true` for non-preventing handlers |
| No regression in existing drag tests | Run `npm test` on affected files | `test/ui/draggable-button.test.ts`, `drag-controller.test.ts`, `drop-target.test.ts` | All existing tests pass unmodified in intent |
| Smoother drag on low-end/throttled profile | All of the above combined | Manual test with 4x+ CPU throttling or real low-end device | Subjectively smoother, closer to 60fps sustained |

# 11. Unit Testing

**Files to test:**
- `test/ui/drag-controller.test.ts` (extend)
- `test/ui/draggable-button.test.ts` (regression only)
- `test/ui/drop-target.test.ts` (regression only)

**Scenarios:**
- Multiple `pointermove` events dispatched synchronously before a `requestAnimationFrame` callback fires result in exactly one `applyMove`/drop-check call, using the latest position.
- `detach()` cancels any pending scheduled frame (mock `cancelAnimationFrame` and assert it's called if a frame was pending).
- Listener registration options include `{ passive: true }` for `pointerdown`/`pointermove`/`pointerup`/`pointercancel`, and do **not** include `passive: true` for `dragstart` (or omit it, since `dragstart` calls `preventDefault()`).
- Existing overlap-detection behavior (drop vs. no-drop) is unchanged when routed through the batched path — reuse existing mocked `getBoundingClientRect` fixtures from the current test file.

**Edge cases:**
- Drag ends (`pointerup`/`pointercancel`) while a rAF callback is still pending — ensure no stale update fires after teardown.
- Rapid drag-start/drag-end cycles (simulating fast repeated gestures) don't leak scheduled frames.

**Failure cases:** a mocked `requestAnimationFrame` that never fires should not throw or hang the test (use fake timers / manual rAF flush helpers, consistent with existing test patterns in `test/ui/`).

**Mocks required:** `requestAnimationFrame`/`cancelAnimationFrame` (jsdom doesn't implement real frame timing — mock or polyfill consistent with `jest.setup.js` conventions), existing `getBoundingClientRect` mocks already used in `drag-controller.test.ts`.

**Coverage recommendation:** maintain or improve current coverage on `drag-controller.ts`; no new source files are introduced so no new baseline is needed.

# 12. End-to-End Testing

- **Happy path:** drag an answer tile from its origin to the drop target on both legacy and drag-drop UI modes (drag-drop only affected); confirm drop registers and answer is recorded correctly.
- **Regression scenarios:** replay/retry flow (`revealQuestion` path) still renders and re-attaches the play button correctly after the opportunistic play-button fix.
- **Negative scenarios:** releasing a drag outside the drop target still correctly returns the tile (`ON_DRAG_RETURN` audio + snap-back), unaffected by the rAF batching change.
- **Low-end device scenario:** manually test on a throttled Chrome profile (4x–6x CPU slowdown) or an actual older/low-end Android device; confirm subjectively smoother drag and no visible stutter compared to current build.
- **Performance validation:** record a Chrome DevTools Performance trace before and after the change for an identical drag gesture; compare for forced-reflow warnings and paint activity during the `.dragging` state.
- **Cross-browser/platform validation:** test on at least one older WebView/browser matching the project's Babel targets (Chrome 49-era Android WebView proxy, or closest available; Safari/iOS if device access allows) given the explicit `es5`/old-browser build target.

# 13. Rollout Strategy

- **Implementation order:** (1) rAF-batch the move handler + passive listeners (lowest risk, most direct perf win) → (2) switch the `.dragging` sparkle animation to `steps()` timing (no design review needed, visually neutral) → (3) opportunistic play-button listener fix.
- **Deployment:** ship behind the existing `drag-drop-assessment-ui` feature flag boundary (no new flag needed — this only touches code already gated by that flag); standard release process, no special phased rollout required given the change is behavior-preserving (same interaction, just smoother).
- **Rollback plan:** revert the three modified source files / one stylesheet; no data migration or persisted-state change is involved, so rollback is a simple code revert.
- **Monitoring:** no new analytics event is proposed; if desired, an optional follow-up could add a lightweight frame-timing sample during drag reported via existing analytics (`AnalyticsIntegration`), but this is not required for this change and is called out only as a future option (see Open Questions).
- **Success metrics:** qualitative low-end device pass + DevTools trace comparison (see Sections 8/10); no user-facing metric currently instrumented for drag smoothness.

# 14. Open Questions

- What specific low-end devices/browsers should be used as the reference bar for "improved"? (No current device lab / BrowserStack config was found in this repo — confirm the actual test devices with QA.)
- Does the `steps()` cadence (4/3 steps matching the existing keyframe stops) read as the intended twinkle, or would a different step count/duration look better in practice? Worth a quick visual pass, though no design rework is required since colors/positions are unchanged.
- Should frame-timing telemetry be added (via existing `AnalyticsIntegration`) to measure real-world drag smoothness post-release, or is manual/QA validation sufficient for this iteration?
- Once Jira/Atlassian MCP is authorized, should this document be regenerated with the actual ticket's acceptance criteria in place of the proposed ones above?
