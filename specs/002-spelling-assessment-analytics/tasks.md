# Tasks: Spelling Assessment Analytics Reporting

**Input**: Design documents from `specs/002-spelling-assessment-analytics/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included and REQUIRED, not optional — Constitution Principle VI mandates at least one Gherkin-style happy-path spec for all new/changed behavior, and the Constitution's Quality Gates require `npm test` to pass with zero failures before any change is complete.

**Organization**: Tasks are grouped by user story (US1, US2, US3 per spec.md). **Note on ordering**: spec.md ranks User Story 3 (P2) below User Stories 1 and 2 (both P1), but User Story 2's Firestore write is functionally gated on User Story 3's `assessmentType` plumbing existing (research.md §3, §6 — FR-006 requires the write to fire "when — and only when" `assessmentType === 'spelling'`). This tasks.md therefore implements **US1 → US3 → US2**, not strict priority order; each story remains independently testable in isolation (US1 and US3 need nothing from each other or from US2; US2's tests require US3's phase to be done first, which is called out explicitly below).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: US1, US2, or US3, per spec.md
- File paths are exact and repo-root-relative

## Phase 1: Setup

**Purpose**: Confirm the change needs no new project setup.

- [X] T001 Confirm `firebase@^9.12.1` (already in `package.json`) exposes the modular `firebase/firestore` API (`getFirestore`, `collection`, `addDoc`, `serverTimestamp`) this feature needs — no dependency changes required (research.md §4). No file edits; this is a verification-only task (`node -e "require('firebase/firestore')"` or equivalent from repo root).

---

## Phase 2: Foundational

**Purpose**: Cross-cutting blocking prerequisites.

None beyond what's captured in User Story 3 below (see the ordering note above and Dependencies & Execution Order) — there is no infrastructure shared by all three stories that isn't already story-scoped work.

---

## Phase 3: User Story 1 - Spelling events reach Firebase/BigQuery like every other assessment type (Priority: P1) 🎯 MVP

**Goal**: Prove — and lock in with regression tests — that `answered`/`bucketCompleted`/`completed` events already fire for Spelling assessments exactly as they do for every other assessment type, regardless of which answer interaction (tap-to-answer or drag-to-answer) produced them, and require no BigQuery export changes (research.md §1).

**Independent Test**: `npx jest test/assessment/assessment.test.ts` passes in isolation — no US2 or US3 code needs to exist first.

### Tests for User Story 1

- [X] T002 [P] [US1] Add a Gherkin-style test in `test/assessment/assessment.test.ts` — Given `handleAnswerButtonPress` is invoked with the same `(answerIndex, elapsedMs)` shape the `AssessmentUI.onAnswer` contract passes from **either** `TapToAnswerController` or `DragToAnswerController`, When the answer is processed, Then the resulting `AnalyticsEventsType.ANSWERED` payload passed to `analyticsIntegration.track` is byte-for-byte identical in shape either way (i.e., the event has no dependency on which UI controller produced the call).
- [X] T003 [P] [US1] Add a Gherkin-style test in `test/assessment/assessment.test.ts` — Given a session running under `BucketGenMode.RandomBST` (the mode every live assessment, including Spelling, uses per FM-978), When a bucket is passed/failed, Then `logBucketCompletedEvent` fires `AnalyticsEventsType.BUCKET_COMPLETED` with the existing, unchanged field set — confirming this feature introduces no type-specific branch into bucket-completion reporting.

**Checkpoint**: User Story 1 is fully verified and independently testable — no production code changes were needed for this story (research.md §1).

---

## Phase 4: User Story 3 - Spelling events/records are attributable, not lumped in with other types (Priority: P2, implemented before US2 — see ordering note)

**Goal**: Add one small, additive `assessmentType` field to the shared "common analytics properties" so it flows automatically into every Firebase Analytics event (`Opened`, `UserLocation`, `Initialized`, `Answered`, `BucketCompleted`, `Completed`) for every assessment type — satisfying FR-008/FR-012 — and becomes readable by `Assessment` for User Story 2's gating.

**Independent Test**: `npx jest test/utils/AnalyticsUtils.test.ts test/analytics/analyticsIntegration.test.ts` passes in isolation — no Firestore code (US2) needs to exist yet.

### Implementation for User Story 3

- [X] T004 [US3] In `src/utils/AnalyticsUtils.ts`: add a module-level `let assessmentType: string | undefined;`, append it as an optional 7th parameter to `setCommonAnalyticsEventsProperties(...)` (appended, not inserted, so no existing positional call site's other arguments shift), and include it as a key in `getCommonAnalyticsEventsProperties()`'s returned object.
- [X] T005 [P] [US3] In `src/analytics/analytics-event-interface.ts`: add `assessmentType?: string;` to `CommonEventProperties`.
- [X] T006 [US3] In `src/analytics/analytics-integration.ts`: include `assessmentType: commonProperties.assessmentType` in the object `createBaseEventData()` builds and returns. *(Depends on T004, T005.)*
- [X] T007 [US3] In `src/App.ts`: pass the `assessmentType` already read in `initializeGame()` (`const assessmentType = data['assessmentType'];`) through to `this.setCommonProperties(assessmentType)`, and update `setCommonProperties(assessmentType?: string)` to forward it as the new 7th argument to `setCommonAnalyticsEventsProperties(...)`. Do not remove or change the existing `this.assessmentUI.setAssessmentType?.(assessmentType);` call. *(Depends on T004.)*

### Tests for User Story 3

- [X] T008 [P] [US3] Add a Gherkin-style test in `test/utils/AnalyticsUtils.test.ts` — Given `setCommonAnalyticsEventsProperties(...)` is called with `'spelling'` as the new argument, When `getCommonAnalyticsEventsProperties()` is read, Then `.assessmentType === 'spelling'`; and a second scenario confirming all six pre-existing returned fields are unchanged (FR-012). *(Depends on T004.)*
- [X] T009 [P] [US3] Add a Gherkin-style test in `test/analytics/analyticsIntegration.test.ts` — Given `AnalyticsUtils.getCommonAnalyticsEventsProperties` is mocked to return `assessmentType: 'spelling'`, When `track(AnalyticsEventsType.ANSWERED, {...})` is called, Then `trackCustomEvent` is called with a payload containing `assessmentType: 'spelling'` alongside the existing fields (same assertion style the file already uses for `INITIALIZE`, per `analyticsIntegration.test.ts:44-63`). *(Depends on T006.)*

**Checkpoint**: Every assessment type's Firebase events now carry `assessmentType` when the JSON provides one; Spelling is filterable in BigQuery (User Story 3 delivered). `Assessment.commonProperties.assessmentType` is now available for User Story 2's gate.

---

## Phase 5: User Story 2 - A durable completion record is written when a learner finishes a Spelling assessment (Priority: P1)

**Goal**: Add the net-new `FirestoreIntegration` module and wire one best-effort, fire-and-forget completion-record write into `Assessment.onEnd()`/`LogCompletedEvent()`, gated to Spelling only, per data-model.md and contracts/firestore-integration.md.

**Independent Test**: `npx jest test/analytics/firestoreIntegration.test.ts` validates the new module entirely in isolation (mocking `firebase/app`/`firebase/firestore`); `test/assessment/assessment.test.ts`'s new scenarios validate the call site. **Depends on Phase 4 (US3) being complete** — without `commonProperties.assessmentType`, the gate in T013 has nothing to check against.

### Implementation for User Story 2

- [X] T010 [US2] Create `src/analytics/firestore-integration.ts`: export `SpellingAssessmentCompletionRecord` (`{ clUserId, assessmentType, lang, score, maxScore, basalBucket, ceilingBucket }`, all fields per data-model.md) and class `FirestoreIntegration` with `static initializeFirestore(config: AnalyticsConfig = firebaseConfig): void` (idempotent singleton; builds a distinctly-named Firebase App via `firebase/app`'s `initializeApp(config, 'assessment-survey-firestore')` + `firebase/firestore`'s `getFirestore(app)` — research.md §4), `static getInstance(): FirestoreIntegration` (throws if not yet initialized, mirroring `AnalyticsIntegration.getInstance()`), and `writeCompletionRecord(record: SpellingAssessmentCompletionRecord): void` (fire-and-forget — internally `addDoc(collection(firestore, 'assessmentCompletions'), { ...record, completedAt: serverTimestamp() })` with an internal `.catch(error => console.error(...))`, per contracts/firestore-integration.md).
- [X] T011 [US2] In `src/assessment/assessment.ts`: add `public firestoreIntegration: FirestoreIntegration | null;` field, set defensively in the constructor exactly like the existing `analyticsIntegration` field (`try { this.firestoreIntegration = FirestoreIntegration.getInstance(); } catch (_error) { this.firestoreIntegration = null; }`). *(Depends on T010.)*
- [X] T012 [US2] In `src/assessment/assessment.ts`'s `LogCompletedEvent(...)`: after `score`/`basalBucketID`/`ceilingBucketID` are computed, add `if (this.commonProperties?.assessmentType === 'spelling') { this.firestoreIntegration?.writeCompletionRecord({ clUserId: this.commonProperties?.cr_user_id, assessmentType: this.commonProperties.assessmentType, lang: this.commonProperties?.language, score, maxScore, basalBucket: basalBucketID, ceilingBucket: ceilingBucketID }); }` — placed alongside, not replacing, the existing `sendDataToThirdParty` and `AnalyticsEventsType.COMPLETED` calls. *(Depends on T011, and on T004/T007 from Phase 4 for `commonProperties.assessmentType` to ever be populated.)*
- [X] T013 [US2] In `src/App.ts`'s `spinUp()`: inside the existing `if (config.analyticsConfig) { ... }` block, immediately after `this.analyticsIntegration = AnalyticsIntegration.getInstance();`, add `FirestoreIntegration.initializeFirestore(config.analyticsConfig);` (same try/catch, same "only if analytics is configured" gate — no new `AppStartupConfig` field). *(Depends on T010.)*

### Tests for User Story 2

- [X] T014 [P] [US2] Create `test/analytics/firestoreIntegration.test.ts` with `jest.mock('firebase/app', ...)` and `jest.mock('firebase/firestore', ...)` at module scope (mirroring `test/analytics/analyticsIntegration.test.ts`'s pattern), resetting `(FirestoreIntegration as any).instance = null` between tests, covering: (a) happy path — `writeCompletionRecord` calls `addDoc` once with the record plus a `serverTimestamp()`-derived `completedAt`, targeting the `assessmentCompletions` collection; (b) `initializeFirestore()` called twice does not call `initializeApp` twice; (c) `getInstance()` before `initializeFirestore()` throws synchronously; (d) a rejected `addDoc` is caught internally (`console.error` spy assertion) and does not reject/throw back to the caller. *(Depends on T010.)*
- [X] T015 [P] [US2] Add Gherkin-style tests in `test/assessment/assessment.test.ts` (new `describe('Firestore completion recording')` block, mocking `FirestoreIntegration.getInstance` similarly to the existing `AnalyticsIntegration` mock): (a) Given `commonProperties.assessmentType === 'spelling'`, When a session reaches `onEnd()`, Then `writeCompletionRecord` is called exactly once with the documented shape; (b) Given `commonProperties.assessmentType` is `undefined` or any other value, When a session reaches `onEnd()`, Then `writeCompletionRecord` is NOT called; (c) Given `firestoreIntegration` is `null` (not initialized), When a session reaches `onEnd()`, Then no error is thrown and the rest of `onEnd()` (`ui.showEnd()`, `app.notifyClose()`, the `AnalyticsEventsType.COMPLETED` track call) still executes. *(Depends on T012.)*

**Checkpoint**: All three user stories are independently testable and, together, fully satisfy spec.md's acceptance scenarios.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Repo-wide quality gates (Constitution: Quality Gates section) — not story-specific.

- [X] T016 [P] Run `npm run format` to keep the diff focused on substance.
- [X] T017 Run `npm run build:all` (both `build:standalone` and `build:package`) and confirm zero errors.
- [X] T018 Run `npm test` (full suite) and confirm zero failures, including all tasks above.
- [X] T019 Manually execute quickstart.md's "Manual/exploratory validation" checklist against a real or emulated Firebase project (DebugView event inspection, Firestore console document check, simulated Firestore outage) — flagged as a manual follow-up outside automated CI, to be run once FM-981's Spelling content is available end-to-end.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Empty — nothing blocks all three stories simultaneously.
- **User Story 1 (Phase 3)**: Depends only on Setup. Fully independent of US2/US3.
- **User Story 3 (Phase 4)**: Depends only on Setup. Fully independent of US1/US2.
- **User Story 2 (Phase 5)**: Depends on Setup **and on Phase 4 (User Story 3) being complete** — T012's gate needs `commonProperties.assessmentType` to exist (T004/T007). This is the one real cross-story dependency in this feature; it is called out here rather than hidden.
- **Polish (Phase 6)**: Depends on all three stories being complete.

### Parallel Opportunities

- T002 and T003 (US1) can run in parallel — different scenarios, same file, no shared mutable setup beyond the existing `beforeEach`.
- T005 (US3, `analytics-event-interface.ts`) can run in parallel with T004 (US3, `AnalyticsUtils.ts`) — different files.
- T008 and T009 (US3 tests) can run in parallel with each other once their respective implementation tasks (T004, T006) land.
- T014 (US2, new Firestore test file) can run in parallel with T015 (US2, assessment.test.ts) once T010/T012 land — different files.
- **US1 (Phase 3) and US3 (Phase 4) can be worked on fully in parallel by different people** — they touch disjoint files and have no dependency on each other. US2 (Phase 5) must wait for US3.

---

## Implementation Strategy

### MVP First

1. Phase 1 (Setup) — trivial.
2. Phase 3 (User Story 1) — proves the core ask ("Spelling events reach Firebase/BigQuery") with zero production risk, since it's test-only. This alone closes FM-986's first acceptance-criteria scenario.
3. **STOP and VALIDATE**: run `npx jest test/assessment/assessment.test.ts`.

### Incremental Delivery

1. Phase 1 → Phase 3 (US1) → validate → this alone is demoable as "Spelling analytics parity confirmed."
2. Phase 4 (US3) → validate → Spelling (and every type) now filterable in BigQuery.
3. Phase 5 (US2, needs Phase 4 done) → validate → Firestore completion records land. This completes FM-986's second acceptance-criteria scenario ("completion events to Firestore").
4. Phase 6 (Polish) → full quality gate, ready for review.
