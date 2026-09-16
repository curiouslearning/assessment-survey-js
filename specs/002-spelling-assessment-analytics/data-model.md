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

**Validation rule**: `assessmentType` is passed through as-is (already a free-form string in the current codebase, per FM-981 not yet having landed a typed enum); no new validation is introduced. `undefined`/missing resolves to `undefined` on the properties object and is simply omitted from event payloads that spread it in (existing behavior for any optional common property).

## Firebase Analytics Event Payloads (extended)

`src/analytics/analytics-event-interface.ts` — `CommonEventProperties`, spread into every event type by `AnalyticsIntegration.createBaseEventData()`.

| Field | Type | Status |
|---|---|---|
| `clUserId`, `lang`, `app`, `latLong`, `userSource`, `appVersion`, `contentVersion` | `string` | existing, unchanged |
| `assessmentType` | `string \| undefined` | **NEW**, additive — present on `Opened`, `UserLocation`, `Initialized`, `Answered`, `BucketCompleted`, `Completed` alike, for every assessment type (not Spelling-specific) |

No other event-interface field changes. `Answered`, `BucketCompleted`, `Completed` keep every field they have today (FR-001/003/004/012).

## Firestore Completion Record (new entity)

Collection: `assessmentCompletions`. One document per completed Spelling assessment session, auto-generated document ID (no idempotency key needed — see research.md §6).

| Field | Type | Required | Description |
|---|---|---|---|
| `clUserId` | `string` | yes | Learner/session identifier — same value already used as `Completed` event's `clUserId` / `sendDataToThirdParty`'s `uuid` param. |
| `assessmentType` | `string` | yes | The assessment type that produced this record (`'spelling'` for this feature's only caller; field exists so the mechanism is reusable, per spec Assumptions). |
| `lang` | `string` | yes | Content language (Hausa for this feature), same source as the `Completed` event's `lang`. |
| `score` | `number` | yes | Final score, identical value already sent to the `Completed` Firebase event and `sendDataToThirdParty`. |
| `maxScore` | `number` | yes | Maximum possible score, identical value already sent to the `Completed` Firebase event. |
| `basalBucket` | `number` | yes | Basal bucket ID, identical value already sent to the `Completed` Firebase event. |
| `ceilingBucket` | `number` | yes | Ceiling bucket ID, identical value already sent to the `Completed` Firebase event. |
| `completedAt` | Firestore server timestamp | yes | Set via `serverTimestamp()` inside `FirestoreIntegration.writeCompletionRecord`, not passed by the caller — guarantees a trustworthy completion time independent of client clock skew. |

**State/lifecycle**: Write-once, immutable. Created exactly once, at the moment `Assessment.LogCompletedEvent()` runs (i.e., the same moment the Firebase `Completed` event and third-party XHR already fire) — never updated or deleted by this feature. No relationship to other entities beyond sharing the same session's outcome data as the `Completed` event.

## `FirestoreIntegration` (new class, `src/analytics/firestore-integration.ts`)

Mirrors `AnalyticsIntegration`'s existing two-phase singleton shape (`src/analytics/analytics-integration.ts`).

| Member | Signature | Notes |
|---|---|---|
| `initializeFirestore` | `static (config?: AnalyticsConfig) => void` | Builds a dedicated, named Firebase App (`firebase/app`'s `initializeApp(config, 'assessment-survey-firestore')`) + `getFirestore(app)`; idempotent (no-ops if already initialized). |
| `getInstance` | `static () => FirestoreIntegration` | Throws if `initializeFirestore` hasn't run yet — same contract as `AnalyticsIntegration.getInstance()`. |
| `writeCompletionRecord` | `(record: SpellingAssessmentCompletionRecord) => void` | Fire-and-forget: internally `await`s `addDoc(...)` inside an async IIFE/promise chain with an internal `.catch(console.error)`; never throws to the caller (FR-009). |

`SpellingAssessmentCompletionRecord` (exported type, `src/analytics/firestore-integration.ts`): `{ clUserId: string; assessmentType: string; lang: string; score: number; maxScore: number; basalBucket: number; ceilingBucket: number }` — `completedAt` is intentionally excluded from the caller-supplied type since it's server-generated internally.

## `Assessment` (extended, no shape change to public constructor)

| Member | Status | Notes |
|---|---|---|
| `firestoreIntegration: FirestoreIntegration \| null` | **NEW** field | Set defensively in the constructor via `try { FirestoreIntegration.getInstance() } catch { null }`, mirroring the existing `analyticsIntegration` field exactly. |
| `LogCompletedEvent(...)` | **EDIT** | After computing `score`/`basalBucketID`/`ceilingBucketID` (unchanged), adds one gated call: `if (this.commonProperties?.assessmentType === 'spelling') { this.firestoreIntegration?.writeCompletionRecord({...}); }`. |
