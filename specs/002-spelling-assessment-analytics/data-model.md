# Data Model: Spelling Assessment Analytics Reporting

## Common Analytics Properties (extended)

`src/utils/AnalyticsUtils.ts` — module-level state, set once per session via `setCommonAnalyticsEventsProperties(...)`, read via `getCommonAnalyticsEventsProperties()`.

| Field | Type | Status | Source |
|---|---|---|---|
| `cr_user_id` | `string` | existing | `getUUID()` |
| `language` | `string` | existing | `getAppLanguageFromDataURL(dataURL)` |
| `app` | `string` | existing | `getAppTypeFromDataURL(dataURL)` |
| `user_source` | `string` | existing | `getUserSource()` |
| `content_version` | `string` | existing | module-level `contentVersion` |
| `app_version` | `string` | existing | module-level `appVersion` |
| `lat_lang` | `string` | existing (set separately via `setLocationProperty`) | `getLocation()` |
| `assessmentType` | `string \| undefined` | **NEW** | the assessment JSON's own `assessmentType` field (`data['assessmentType']`, already read at `App.ts:315`) |

**Validation rule**: `assessmentType` is passed through as-is (a free-form string, matching `AssessmentType.Spelling` once FM-981's typed constant is in scope); no new validation is introduced. `undefined`/missing resolves to `undefined` on the properties object and is simply omitted from event payloads that spread it in (existing behavior for any optional common property).

## Firebase Analytics Event Payloads (extended)

`src/analytics/analytics-event-interface.ts` — `CommonEventProperties`, spread into every event type by `AnalyticsIntegration.createBaseEventData()`.

| Field | Type | Status |
|---|---|---|
| `clUserId`, `lang`, `app`, `latLong`, `userSource`, `appVersion`, `contentVersion` | `string` | existing, unchanged |
| `assessmentType` | `string \| undefined` | **NEW**, additive — present on `Opened`, `UserLocation`, `Initialized`, `Answered`, `BucketCompleted`, `Completed` alike, for every assessment type (not Spelling-specific) |

No other event-interface field changes. `Answered`, `BucketCompleted`, `Completed` keep every field they have today (FR-001/003/004/007).

## Out of scope: completion records

FM-986's title mentioned "completion events to Firestore," but no new entity is introduced for it. Completion data for every assessment type — including `type` (the assessment type), `lang`, `score`, `max_score`, and `time_spent` — already reaches the native host app via `AndroidInterface.logUserSessionsData(...)`, called from `App.ts`'s `game.subscribe('ENDED', ...)` handler, and is persisted to Firestore on the Android side. This feature makes no changes to `Assessment`, and does not add a Firestore client or document schema of its own — see research.md §4.
