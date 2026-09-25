# Research: Spelling Assessment Analytics Reporting

## 1. Is the Firebase/BigQuery event path already type-agnostic?

**Question**: Does anything in the current `Assessment`/`AnalyticsIntegration` code path prevent Spelling assessment events from already reaching Firebase Analytics correctly?

**Finding**: No. `Assessment.handleAnswerButtonPress` (`src/assessment/assessment.ts:307`) calls `logPuzzleCompletedEvent` unconditionally on every answer (gated only by `bucketGenMode === RandomBST`, which is the mode every live assessment — including Spelling, per FM-978's requirement to reuse the existing binary-search algorithm — already uses). Both `TapToAnswerController` (`src/ui/tap-to-answer-controller.ts`) and `DragToAnswerController` (`src/ui/drag-drop/drag-to-answer-controller.ts`) — Spelling is the first assessment type to use the tap variant — invoke the identical `AssessmentUI.onAnswer` contract callback (`src/ui/assessment-ui.ts:6`), which `Assessment.setupUIHandlers()` (`assessment.ts:82-91`) wires to the same `handleAnswerButtonPress`. `logBucketCompletedEvent` and `LogCompletedEvent`/`onEnd()` are likewise reached through UI-agnostic, type-agnostic code paths.

**Decision**: User Story 1 (Firebase/BigQuery events) requires no new production code to make events *fire* — it requires (a) regression-test coverage proving the tap-to-answer path produces the same event as the drag path (nothing today asserts this), and (b) the one small addition below (§2) so events are *attributable* to Spelling once queried in BigQuery (User Story 2).

**Alternatives considered**: Adding an explicit `assessmentType` branch inside `handleAnswerButtonPress`/`logPuzzleCompletedEvent` — rejected as unnecessary; the events already fire identically regardless of type, so branching would only add risk of accidentally diverging Spelling's event shape from other types (violating FR-001/FR-007).

## 2. How should Spelling events become distinguishable in BigQuery (FR-006)?

**Question**: What field, if any, lets an analyst filter "Spelling only" out of the shared `answered`/`bucketCompleted`/`completed` event stream?

**Finding**: No existing field does this reliably. `CommonEventProperties.app` and `.lang` (`src/analytics/analytics-event-interface.ts:4-25`) are derived from the data URL's naming convention (`getAppTypeFromDataURL`/`getAppLanguageFromDataURL`, `src/utils/urlUtils.ts:74-102` — last/second-to-last hyphen-delimited segment of the URL), not from the assessment JSON's `assessmentType` field, and are not guaranteed unique per assessment type.

**Decision**: Extend the existing "common analytics properties" module (`src/utils/AnalyticsUtils.ts`) — which already holds `cr_user_id`, `language`, `app`, `user_source`, `content_version`, `app_version` as module-level state set once via `setCommonAnalyticsEventsProperties(...)` — with one more field, `assessmentType`. Because `AnalyticsIntegration.createBaseEventData()` (`src/analytics/analytics-integration.ts:32-43`) already spreads `getCommonAnalyticsEventsProperties()` into **every** tracked event automatically, this single addition makes `assessmentType` appear on `Opened`, `UserLocation`, `Initialized`, `Answered`, `BucketCompleted`, and `Completed` alike, for **every** assessment type (not just Spelling) — satisfying FR-006 (distinguishable) and FR-007 (purely additive, uniform) at once, with no change needed inside `assessment.ts`'s three tracking call sites.

`App.ts` already reads the raw value at `initializeGame()` (`App.ts:315`, `const assessmentType = data['assessmentType'];`) and already forwards it to the UI layer (`App.ts:345`). It needs one more forwarding edge: into `setCommonProperties()` → `setCommonAnalyticsEventsProperties(...)` (`App.ts:405-413`), which currently doesn't receive it.

**Alternatives considered**:
- Threading `assessmentType` through `Assessment`'s constructor and duplicating it into each of the three `track()` call sites — rejected: three edit points instead of one, and inconsistent with `Opened`/`Initialized`/`UserLocation` (fired from `App.ts`, not `Assessment`) which would then lack the field entirely.
- A Spelling-only special-cased field/event — rejected: violates the spec's explicit requirement that this be additive and uniform across types, and duplicates the `app`/`lang` pattern's own known limitation.

## 3. Testing approach

**Decision**: `test/analytics/analyticsIntegration.test.ts` gains a case asserting `AnalyticsUtils.getCommonAnalyticsEventsProperties` mocked to return `assessmentType: 'spelling'`, then `track(AnalyticsEventsType.ANSWERED, {...})` results in `trackCustomEvent` being called with a payload containing `assessmentType: 'spelling'` alongside the existing fields (same assertion style the file already uses for `INITIALIZE`). `test/utils/AnalyticsUtils.test.ts` gains a case asserting `assessmentType` round-trips through `setCommonAnalyticsEventsProperties`/`getCommonAnalyticsEventsProperties`, and that the six pre-existing returned fields are unchanged (FR-007). `test/assessment/assessment.test.ts` gains a happy-path scenario asserting the `answered` and `bucketCompleted` events fire with an unchanged, complete shape regardless of which UI adapter (tap or drag) produced the call — the callback signature (`onAnswer`) is UI-agnostic, so a single assertion at `handleAnswerButtonPress`/`tryMoveBucket` covers both interaction paths by construction.

## 4. Out-of-scope items noted but not addressed

- `AnalyticsIntegration.sendDataToThirdParty`'s existing call site in `assessment.ts` (`LogCompletedEvent`) passes `this.commonProperties?.app` as the `assessmentType` parameter, not the actual assessment type — a pre-existing defect in the third-party (Synapse) XHR integration, unrelated to Firebase/BigQuery reporting and outside FM-986's acceptance criteria. Left unchanged; flagged here for visibility.
- `bucketCompleted`/`answered` events firing only under `BucketGenMode.RandomBST` (not `LinearArrayBased`) is pre-existing, shared behavior across all assessment types (a developer-tooling mode), not something Spelling introduces or that FM-986 asks to change (see spec.md Edge Cases).
- **Completion events to Firestore** (mentioned in FM-986's title, not in its formal AC): `App.ts`'s existing `game.subscribe('ENDED', ...)` handler already calls `AndroidInterface.logUserSessionsData({ type: assessmentType || appType, lang, score, max_score, time_spent, event_type: 'activity_completed' })` for every assessment type when `enableAndroidSummary` is set, and the Android host app already persists that into Firestore. A separate, direct-from-JS `FirestoreIntegration` module was drafted and then removed after review, since it duplicated this already-integrated path. No further Firestore work is in scope for this feature.
