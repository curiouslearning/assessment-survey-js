# Quickstart: Validating Spelling Assessment Analytics Reporting

## Prerequisites

- FM-981 (Spelling assessment type scaffold) landed, or a local assessment JSON with `"appType": "assessment"` and `"assessmentType": "spelling"` available for manual testing (e.g. `public/data/hausa-spellings.json`).
- `npm install` run (no new dependencies added by this feature).

## Automated validation (primary)

```bash
npm test                                  # full suite, must stay green
npx jest test/analytics/analyticsIntegration.test.ts
npx jest test/assessment/assessment.test.ts
npx jest test/utils/AnalyticsUtils.test.ts
```

Expected: all green, with new/extended cases covering:
- `assessmentType` round-trips through `setCommonAnalyticsEventsProperties`/`getCommonAnalyticsEventsProperties` (contracts/analytics-event-assessment-type.md).
- `AnalyticsIntegration.track(...)` includes `assessmentType` in the merged payload sent to `trackCustomEvent`.
- `Assessment`'s answered/bucket-completed events are identical in shape when triggered via the tap-to-answer path vs. the drag-to-answer path (User Story 1, Scenario 4).

```bash
npm run build:all                         # build:standalone + build:package must both succeed
```

## Manual/exploratory validation (secondary — requires a real or emulated Firebase project)

1. `npm run dev`, load a Spelling assessment configuration (`assessmentType: "spelling"`) in the browser.
2. Open the Firebase console's DebugView (or the Network tab, filtering for Google Analytics collect requests) for the `ftm-b9d99` project while playing through a few items and completing the assessment.
3. Confirm `answered`, `bucketCompleted`, and `completed` events appear with an `assessmentType: "spelling"` parameter alongside the existing fields, structurally identical to events from a non-Spelling assessment run the same way.
4. Confirm — once the standard Firebase→BigQuery export runs (existing infra, not newly configured by this feature) — the same events are queryable in the linked BigQuery dataset with `assessmentType = 'spelling'` filterable, per SC-002/SC-003.

Completion-record delivery to Firestore is out of scope for this feature's manual validation — it runs through the pre-existing `AndroidInterface` → native host → Firestore path, unrelated to the Firebase Analytics/BigQuery work above.
