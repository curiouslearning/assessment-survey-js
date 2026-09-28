# Implementation Plan: Spelling Assessment Analytics Reporting

**Branch**: `002-spelling-assessment-analytics` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-spelling-assessment-analytics/spec.md` (Jira FM-986)

## Summary

Investigation (research.md §1) found the existing Firebase Analytics event path (`Assessment` → `AnalyticsIntegration`) is already type-agnostic: `answered`, `bucketCompleted`, and `completed` events already fire identically regardless of assessment type or answer-interaction mechanism (tap-to-answer, new for Spelling, funnels through the same `AssessmentUI.onAnswer` contract as drag-to-answer). So User Story 1 is primarily a regression-test gap to close, not new production code. The one real gap is attribution (User Story 2): nothing today lets an analyst filter Spelling out of the shared event stream. The plan adds a single, additive `assessmentType` field to the existing "common analytics properties" module (already spread into every Firebase event automatically) and threads the already-read JSON value into it — a one-line producer-side change with no per-event-type edits.

Completion data reaching Firestore (referenced in FM-986's title, but not in its formal acceptance criteria) is explicitly out of scope: `App.ts` already pushes session-completion data — including the assessment `type` — to the native host via `AndroidInterface.logUserSessionsData(...)` for every assessment type, and that path already reaches Firestore on the Android side. An earlier draft of this feature added a second, direct-from-JS `FirestoreIntegration` module; it was removed after review because it duplicated the already-integrated `AndroidInterface` path.

## Technical Context

**Language/Version**: TypeScript ~4.8.3 (strict mode), same dual-target build as the rest of the repo (webpack 5 standalone bundle + `tsc` ESM package).

**Primary Dependencies**: No new npm dependency is added. `@curiouslearning/analytics@^1.3.1` (`AnalyticsIntegration`/`AnalyticsService`) is extended by one additive field on its common-properties input — no new integration class.

**Storage**: None added by this feature. Firebase Analytics/BigQuery storage is pre-existing and unchanged in mechanism, gaining one additive field.

**Testing**: Jest + ts-jest, `test/` mirroring `src/` (existing convention). Extended: `test/utils/AnalyticsUtils.test.ts`, `test/analytics/analyticsIntegration.test.ts`, `test/assessment/assessment.test.ts`.

**Target Platform**: Browser (standalone bundle) and Node.js (published npm package consumers, CI).

**Project Type**: Single project — existing npm library; no new project/module boundary and no new source files.

**Performance Goals**: N/A — one additional object key on already-fired events; no new network calls.

**Constraints**:
- The new `assessmentType` common-property field MUST NOT alter any existing field's value or presence for any assessment type (FR-007) — enforced by appending (not inserting) the new parameter and only ever adding, never renaming, a key.

**Scale/Scope**: Edits only, no new source files: `src/utils/AnalyticsUtils.ts` (one new module-level field + setter param + getter key), `src/analytics/analytics-event-interface.ts` (one new optional field on `CommonEventProperties`), `src/analytics/analytics-integration.ts` (`createBaseEventData` includes the new field — one line), `src/App.ts` (thread `assessmentType` into `setCommonProperties()`). Two extended test files plus regression coverage added to `assessment.test.ts`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Strict TypeScript, No `any` | The extended `CommonEventProperties`/`AnalyticsConfig` usages are fully typed. The assessment JSON's `assessmentType` value was already untyped (`data['assessmentType']`, effectively `any` at that one JSON-parsing boundary) before this feature and remains so — this feature does not introduce a new `any`, it narrows the existing boundary value to `string \| undefined` the moment it enters `setCommonAnalyticsEventsProperties`'s typed parameter. | PASS |
| II. Hybrid Paradigm (OOP for state, FP for transforms) | The `assessmentType` threading is plain data plumbing through existing state containers (module-level common properties, already an accepted stateful pattern), not a transformation — no pure function needed or misused. | PASS |
| III. SOLID OOP | No new class is introduced. The one edit to `AnalyticsIntegration.createBaseEventData()` extends its existing single responsibility (building the common event payload) rather than adding a new one — Open/Closed is preserved by not branching per event type. | PASS |
| IV. Pure Functions for FP code | No new FP-style function is introduced. | PASS (N/A — no new pure functions in scope) |
| V. Composition & Orchestration Boundaries | No new composition — `App.ts` gains one additional forwarded argument on an existing method call, not a new call chain. | PASS |
| VI. Gherkin-style testing, happy-path coverage | New/changed behavior (assessmentType round-trip, tap-vs-drag event parity) each get a Given/When/Then-style spec per research.md §3 / quickstart.md. | PASS (planned, not yet written) |

No violations requiring the Complexity Tracking table.

*Post-Phase-1 re-check*: data-model.md and contracts/analytics-event-assessment-type.md confirm the design stays within a handful of additive edits to existing state containers — nothing introduced a new `any`, a new class, or an impure function masquerading as pure. All rows above still hold.

## Project Structure

### Documentation (this feature)

```text
specs/002-spelling-assessment-analytics/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── analytics-event-assessment-type.md
└── tasks.md              # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── analytics/
│   ├── analytics-event-interface.ts   # EDIT — CommonEventProperties gains `assessmentType?: string`
│   └── analytics-integration.ts       # EDIT — createBaseEventData() includes assessmentType (1 line)
├── utils/
│   └── AnalyticsUtils.ts              # EDIT — module-level assessmentType state + setter param + getter key
└── App.ts                             # EDIT — thread assessmentType into setCommonProperties()

test/
├── analytics/
│   └── analyticsIntegration.test.ts   # EDIT — assessmentType present in tracked payload
├── utils/
│   └── AnalyticsUtils.test.ts         # EDIT — assessmentType round-trip
└── assessment/
    └── assessment.test.ts             # EDIT — tap-vs-drag event parity, bucket-completed event parity
```

**Structure Decision**: Single-project layout (unchanged). This is a small, additive change confined to the existing `src/analytics/` and `src/utils/` subsystems plus one threading edit in `App.ts` — no new source file, class, or package boundary is warranted.

## Complexity Tracking

*No Constitution violations — table not needed.*
