# Tasks: Spelling Assessment Analytics Reporting

**Input**: Design documents from `specs/002-spelling-assessment-analytics/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included and REQUIRED, not optional — Constitution Principle VI mandates at least one Gherkin-style happy-path spec for all new/changed behavior, and the Constitution's Quality Gates require `npm test` to pass with zero failures before any change is complete.

**Organization**: Tasks are grouped by user story (US1, US2 per spec.md). US1 and US2 touch disjoint files and have no dependency on each other, so both can be worked on fully in parallel.

**Note on scope**: An earlier version of this feature also included a User Story for writing completion records directly to Firestore from this library. That work was removed after review — completion data already reaches Firestore via the pre-existing `AndroidInterface` → native host bridge (see spec.md's Note and research.md §4) — so this feature is now Firebase Analytics/BigQuery attribution only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: US1 or US2, per spec.md
- File paths are exact and repo-root-relative

## Phase 1: Setup

**Purpose**: Confirm the change needs no new project setup.

- [X] T001 Confirm the app's existing `firebase@^9.12.1` dependency and Firebase Analytics wiring need no changes for this feature — no dependency changes required. No file edits; this is a verification-only task.

---

## Phase 2: Foundational

**Purpose**: Cross-cutting blocking prerequisites.

None — US1 and US2 touch disjoint files and have no shared infrastructure that isn't already story-scoped work.

---

## Phase 3: User Story 1 - Spelling events reach Firebase/BigQuery like every other assessment type (Priority: P1) 🎯 MVP

**Goal**: Prove — and lock in with regression tests — that `answered`/`bucketCompleted`/`completed` events already fire for Spelling assessments exactly as they do for every other assessment type, regardless of which answer interaction (tap-to-answer or drag-to-answer) produced them, and require no BigQuery export changes (research.md §1).

**Independent Test**: `npx jest test/assessment/assessment.test.ts` passes in isolation — no US2 code needs to exist first.

### Tests for User Story 1

- [X] T002 [P] [US1] Add a Gherkin-style test in `test/assessment/assessment.test.ts` — Given `handleAnswerButtonPress` is invoked with the same `(answerIndex, elapsedMs)` shape the `AssessmentUI.onAnswer` contract passes from **either** `TapToAnswerController` or `DragToAnswerController`, When the answer is processed, Then the resulting `AnalyticsEventsType.ANSWERED` payload passed to `analyticsIntegration.track` is byte-for-byte identical in shape either way (i.e., the event has no dependency on which UI controller produced the call).
- [X] T003 [P] [US1] Add a Gherkin-style test in `test/assessment/assessment.test.ts` — Given a session running under `BucketGenMode.RandomBST` (the mode every live assessment, including Spelling, uses per FM-978), When a bucket is passed/failed, Then `logBucketCompletedEvent` fires `AnalyticsEventsType.BUCKET_COMPLETED` with the existing, unchanged field set — confirming this feature introduces no type-specific branch into bucket-completion reporting.

**Checkpoint**: User Story 1 is fully verified and independently testable — no production code changes were needed for this story (research.md §1).

---

## Phase 4: User Story 2 - Spelling events are attributable, not lumped in with other types (Priority: P2)

**Goal**: Add one small, additive `assessmentType` field to the shared "common analytics properties" so it flows automatically into every Firebase Analytics event (`Opened`, `UserLocation`, `Initialized`, `Answered`, `BucketCompleted`, `Completed`) for every assessment type — satisfying FR-006/FR-007.

**Independent Test**: `npx jest test/utils/AnalyticsUtils.test.ts test/analytics/analyticsIntegration.test.ts` passes in isolation — no US1 code needs to exist first.

### Implementation for User Story 2

- [X] T004 [US2] In `src/utils/AnalyticsUtils.ts`: add a module-level `let assessmentType: string | undefined;`, append it as an optional 7th parameter to `setCommonAnalyticsEventsProperties(...)` (appended, not inserted, so no existing positional call site's other arguments shift), and include it as a key in `getCommonAnalyticsEventsProperties()`'s returned object.
- [X] T005 [P] [US2] In `src/analytics/analytics-event-interface.ts`: add `assessmentType?: string;` to `CommonEventProperties`.
- [X] T006 [US2] In `src/analytics/analytics-integration.ts`: include `assessmentType: commonProperties.assessmentType` in the object `createBaseEventData()` builds and returns. *(Depends on T004, T005.)*
- [X] T007 [US2] In `src/App.ts`: pass the `assessmentType` already read in `initializeGame()` (`const assessmentType = data['assessmentType'];`) through to `this.setCommonProperties(assessmentType)`, and update `setCommonProperties(assessmentType?: string)` to forward it as the new 7th argument to `setCommonAnalyticsEventsProperties(...)`. Do not remove or change the existing `this.assessmentUI.setAssessmentType?.(assessmentType);` call. *(Depends on T004.)*

### Tests for User Story 2

- [X] T008 [P] [US2] Add a Gherkin-style test in `test/utils/AnalyticsUtils.test.ts` — Given `setCommonAnalyticsEventsProperties(...)` is called with `'spelling'` as the new argument, When `getCommonAnalyticsEventsProperties()` is read, Then `.assessmentType === 'spelling'`; and a second scenario confirming all six pre-existing returned fields are unchanged (FR-007). *(Depends on T004.)*
- [X] T009 [P] [US2] Add a Gherkin-style test in `test/analytics/analyticsIntegration.test.ts` — Given `AnalyticsUtils.getCommonAnalyticsEventsProperties` is mocked to return `assessmentType: 'spelling'`, When `track(AnalyticsEventsType.ANSWERED, {...})` is called, Then `trackCustomEvent` is called with a payload containing `assessmentType: 'spelling'` alongside the existing fields (same assertion style the file already uses for `INITIALIZE`, per `analyticsIntegration.test.ts:44-63`). *(Depends on T006.)*

**Checkpoint**: Every assessment type's Firebase events now carry `assessmentType` when the JSON provides one; Spelling is filterable in BigQuery. Both user stories are independently testable and, together, fully satisfy spec.md's acceptance scenarios.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Repo-wide quality gates (Constitution: Quality Gates section) — not story-specific.

- [X] T010 [P] Run `npm run format` to keep the diff focused on substance.
- [X] T011 Run `npm run build:all` (both `build:standalone` and `build:package`) and confirm zero errors.
- [X] T012 Run `npm test` (full suite) and confirm zero failures, including all tasks above.
- [X] T013 Manually execute quickstart.md's "Manual/exploratory validation" checklist against a real or emulated Firebase project (DebugView event inspection, BigQuery query) — flagged as a manual follow-up outside automated CI, to be run once FM-981's Spelling content is available end-to-end.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Empty — nothing blocks either story.
- **User Story 1 (Phase 3)**: Depends only on Setup. Fully independent of US2.
- **User Story 2 (Phase 4)**: Depends only on Setup. Fully independent of US1.
- **Polish (Phase 5)**: Depends on both stories being complete.

### Parallel Opportunities

- T002 and T003 (US1) can run in parallel — different scenarios, same file, no shared mutable setup beyond the existing `beforeEach`.
- T005 (US2, `analytics-event-interface.ts`) can run in parallel with T004 (US2, `AnalyticsUtils.ts`) — different files.
- T008 and T009 (US2 tests) can run in parallel with each other once their respective implementation tasks (T004, T006) land.
- **US1 (Phase 3) and US2 (Phase 4) can be worked on fully in parallel by different people** — they touch disjoint files and have no dependency on each other.

---

## Implementation Strategy

### MVP First

1. Phase 1 (Setup) — trivial.
2. Phase 3 (User Story 1) — proves the core ask ("Spelling events reach Firebase/BigQuery") with zero production risk, since it's test-only. This alone closes FM-986's first acceptance-criteria scenario.
3. **STOP and VALIDATE**: run `npx jest test/assessment/assessment.test.ts`.

### Incremental Delivery

1. Phase 1 → Phase 3 (US1) → validate → this alone is demoable as "Spelling analytics parity confirmed."
2. Phase 4 (US2) → validate → Spelling (and every type) now filterable in BigQuery. This completes FM-986's formal acceptance criteria.
3. Phase 5 (Polish) → full quality gate, ready for review.
