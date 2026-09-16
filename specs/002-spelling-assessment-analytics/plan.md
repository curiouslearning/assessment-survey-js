# Implementation Plan: Spelling Assessment Analytics Reporting

**Branch**: `002-spelling-assessment-analytics` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-spelling-assessment-analytics/spec.md` (Jira FM-986)

## Summary

Investigation (research.md §1) found the existing Firebase Analytics event path (`Assessment` → `AnalyticsIntegration`) is already type-agnostic: `answered`, `bucketCompleted`, and `completed` events already fire identically regardless of assessment type or answer-interaction mechanism (tap-to-answer, new for Spelling, funnels through the same `AssessmentUI.onAnswer` contract as drag-to-answer). So User Story 1 is primarily a regression-test gap to close, not new production code. The one real gap is attribution (User Story 3): nothing today lets an analyst filter Spelling out of the shared event/record stream. The plan adds a single, additive `assessmentType` field to the existing "common analytics properties" module (already spread into every Firebase event automatically) and threads the already-read JSON value into it — a one-line producer-side change with no per-event-type edits. Separately (User Story 2), it adds a new, self-contained `FirestoreIntegration` module (no Firestore integration exists in this codebase today) that writes one best-effort, fire-and-forget completion record per finished Spelling session, called from the existing `Assessment.onEnd()`/`LogCompletedEvent()` lifecycle hook alongside the pre-existing Firebase `completed` event — never blocking or risking the learner's completion experience.

## Technical Context

**Language/Version**: TypeScript ~4.8.3 (strict mode), same dual-target build as the rest of the repo (webpack 5 standalone bundle + `tsc` ESM package).

**Primary Dependencies**: `firebase@^9.12.1` (already a direct dependency; this feature adds its first use of `firebase/firestore`'s modular API — `getFirestore`, `collection`, `addDoc`, `serverTimestamp` — alongside the existing `firebase/analytics` usage). No new npm dependency is added. `@curiouslearning/analytics@^1.3.1` (`AnalyticsIntegration`/`AnalyticsService`) is extended, not replaced — it has no Firestore strategy, so Firestore access is a small parallel module rather than routed through it (research.md §4).

**Storage**: Firestore (new for this codebase) — one collection, `assessmentCompletions`, one document per completed Spelling session (data-model.md). Firebase Analytics/BigQuery storage is pre-existing and unchanged in mechanism, gaining one additive field.

**Testing**: Jest + ts-jest, `test/` mirroring `src/` (existing convention). New: `test/analytics/firestoreIntegration.test.ts`. Extended: `test/utils/AnalyticsUtils.test.ts`, `test/analytics/analyticsIntegration.test.ts`, `test/assessment/assessment.test.ts`. Mocking precedent: `jest.mock('firebase/<module>', () => ({ ...jest.fn() }))` at module scope + `jest.spyOn` for isolation + exact-payload `toHaveBeenCalledWith` assertions (research.md §7).

**Target Platform**: Browser (standalone bundle) and Node.js (published npm package consumers, CI).

**Project Type**: Single project — existing npm library; no new project/module boundary beyond one new leaf file (`src/analytics/firestore-integration.ts`).

**Performance Goals**: N/A — one additional object key on already-fired events, one additional fire-and-forget network write at session end (not on the critical path of any user interaction).

**Constraints**:
- The Firestore write MUST NOT block, delay, or risk the learner-visible completion flow under any failure mode (FR-009) — enforced by making `writeCompletionRecord` synchronous-returning/fire-and-forget with an internal `.catch`.
- The new `assessmentType` common-property field MUST NOT alter any existing field's value or presence for any assessment type (FR-012) — enforced by appending (not inserting) the new parameter and only ever adding, never renaming, a key.
- No dependency version bump — `firebase@9.x`'s modular Firestore API is sufficient (research.md §4); the version mismatch with `@curiouslearning/analytics`'s nested `firebase@^11.4.0` is sidestepped by using an independently-named Firebase App via the app's own top-level `firebase` package, not the nested one.
- The Firestore write MUST be scoped to Spelling only for this feature (spec Assumptions) — enforced by gating on `commonProperties.assessmentType === 'spelling'` at the single call site, not by making the module itself Spelling-aware.

**Scale/Scope**: One new source file (`src/analytics/firestore-integration.ts`, ~40–60 lines). Edits: `src/utils/AnalyticsUtils.ts` (one new module-level field + setter param + getter key), `src/analytics/analytics-event-interface.ts` (one new optional field on `CommonEventProperties`), `src/analytics/analytics-integration.ts` (`createBaseEventData` includes the new field — one line), `src/App.ts` (thread `assessmentType` into `setCommonProperties()`; initialize `FirestoreIntegration` alongside `AnalyticsIntegration` in `spinUp()`), `src/assessment/assessment.ts` (new `firestoreIntegration` field set defensively in the constructor; gated call in `LogCompletedEvent()`). One new test file, three extended test files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Strict TypeScript, No `any` | `FirestoreIntegration`, `SpellingAssessmentCompletionRecord`, and the extended `CommonEventProperties`/`AnalyticsConfig` usages are all fully typed. The assessment JSON's `assessmentType` value was already untyped (`data['assessmentType']`, effectively `any` at that one JSON-parsing boundary) before this feature and remains so — this feature does not introduce a new `any`, it narrows the existing boundary value to `string \| undefined` the moment it enters `setCommonAnalyticsEventsProperties`'s typed parameter. | PASS |
| II. Hybrid Paradigm (OOP for state, FP for transforms) | `FirestoreIntegration` is a stateful, identity-based integration (owns a Firebase App/Firestore client instance) — correctly OOP, mirroring `AnalyticsIntegration`. The `assessmentType` threading is plain data plumbing through existing state containers (module-level common properties, already an accepted stateful pattern), not a transformation — no pure function needed or misused. | PASS |
| III. SOLID OOP | `FirestoreIntegration` has one responsibility (Firestore completion writes) and does not touch `AnalyticsIntegration`'s internals — Single Responsibility. It's additive via a new class, not by editing `AnalyticsIntegration`'s public contract — Open/Closed. No inheritance introduced (no base class). | PASS |
| IV. Pure Functions for FP code | No new FP-style function is introduced; `writeCompletionRecord`'s internal `addDoc(...).catch(...)` is I/O by design (it's an OOP method's side effect, not a function claimed to be pure). | PASS (N/A — no new pure functions in scope) |
| V. Composition & Orchestration Boundaries | `Assessment` gains one new field + one new gated call, composed the same way `analyticsIntegration` already is — no inheritance depth added, no long method chains (`this.firestoreIntegration?.writeCompletionRecord({...})` is a single call, not a chain). | PASS |
| VI. Gherkin-style testing, happy-path coverage | New/changed behavior (assessmentType round-trip, Firestore write on completion, Firestore write failure tolerance, tap-vs-drag event parity) each get a Given/When/Then-style spec per research.md §7 / quickstart.md. | PASS (planned, not yet written) |

No violations requiring the Complexity Tracking table.

*Post-Phase-1 re-check*: data-model.md and the two contracts confirm the design stays within one new leaf class (no inheritance, no mixed OOP/FP responsibilities) and a handful of additive edits to existing state containers — nothing introduced a new `any`, a new inheritance chain, or an impure function masquerading as pure. All rows above still hold.

## Project Structure

### Documentation (this feature)

```text
specs/002-spelling-assessment-analytics/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   ├── firestore-integration.md
│   └── analytics-event-assessment-type.md
└── tasks.md              # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── analytics/
│   ├── firestore-integration.ts       # NEW — FirestoreIntegration class + SpellingAssessmentCompletionRecord type
│   ├── analytics-event-interface.ts   # EDIT — CommonEventProperties gains `assessmentType?: string`
│   └── analytics-integration.ts       # EDIT — createBaseEventData() includes assessmentType (1 line)
├── utils/
│   └── AnalyticsUtils.ts              # EDIT — module-level assessmentType state + setter param + getter key
├── assessment/
│   └── assessment.ts                  # EDIT — new `firestoreIntegration` field (constructor, defensive try/catch);
│                                       #        gated writeCompletionRecord call in LogCompletedEvent()
└── App.ts                             # EDIT — thread assessmentType into setCommonProperties();
                                        #        FirestoreIntegration.initializeFirestore() in spinUp()

test/
├── analytics/
│   ├── firestoreIntegration.test.ts   # NEW — Gherkin-style spec for FirestoreIntegration
│   └── analyticsIntegration.test.ts   # EDIT — assessmentType present in tracked payload
├── utils/
│   └── AnalyticsUtils.test.ts         # EDIT — assessmentType round-trip
└── assessment/
    └── assessment.test.ts             # EDIT — tap-vs-drag event parity; Firestore gated-write + failure-tolerance specs
```

**Structure Decision**: Single-project layout (unchanged). This is a small, additive change to the existing `src/analytics/` and `src/utils/` subsystems plus one new leaf module (`src/analytics/firestore-integration.ts`) that mirrors an existing sibling (`analytics-integration.ts`) — no new top-level directory or package boundary is warranted.

## Complexity Tracking

*No Constitution violations — table not needed.*
