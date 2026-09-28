# Contract: `assessmentType` on Firebase Analytics events

**Modules**: `src/utils/AnalyticsUtils.ts` (edit), `src/analytics/analytics-event-interface.ts` (edit), `src/analytics/analytics-integration.ts` (edit — reads the new common property only, no new method), `src/App.ts` (edit — one new argument threaded through)

## Behavioral contract

1. `setCommonAnalyticsEventsProperties(...)` MUST accept an additional, optional `assessmentType?: string` argument (7th parameter, appended — not inserted — to avoid reordering existing positional call sites' other arguments) and store it as module-level state, exactly like every other common property.
2. `getCommonAnalyticsEventsProperties()` MUST include `assessmentType` in its returned object (value `undefined` if never set — e.g., a `Survey` session, which never reads/sets `assessmentType` today).
3. `App.ts`'s `initializeGame()` MUST pass the `assessmentType` it already reads from the assessment JSON (`data['assessmentType']`, existing line) through to `setCommonProperties()` → `setCommonAnalyticsEventsProperties(...)`, in addition to (not instead of) its existing use forwarding to `assessmentUI.setAssessmentType?.(...)`.
4. `AnalyticsIntegration.createBaseEventData()` MUST include `assessmentType: commonProperties.assessmentType` in the object merged into every tracked event — no per-event-type special-casing.
5. This change MUST NOT alter the value or presence of any of the six existing common properties (`clUserId`, `lang`, `app`, `latLong`, `userSource`, `appVersion`, `contentVersion`) for any assessment type, Spelling or otherwise (FR-007).
6. For any assessment type whose JSON never sets `assessmentType` (i.e., every type until each type's own JSON is updated to carry it, which is outside this ticket's scope beyond Spelling), the field is simply absent/`undefined` on events — not a breaking change, not required to be backfilled by this feature.

## Verification

- `test/utils/AnalyticsUtils.test.ts` (new or extended): `setCommonAnalyticsEventsProperties(..., 'spelling')` → `getCommonAnalyticsEventsProperties().assessmentType === 'spelling'`.
- `test/analytics/analyticsIntegration.test.ts` (extended): `track(AnalyticsEventsType.ANSWERED, {...})` with a mocked `getCommonAnalyticsEventsProperties` returning `assessmentType: 'spelling'` → `trackCustomEvent` called with an object containing `assessmentType: 'spelling'` (same pattern the file already uses for `INITIALIZE`, per its existing test).
