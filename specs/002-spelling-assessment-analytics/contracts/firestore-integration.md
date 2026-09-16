# Contract: `FirestoreIntegration`

**Module**: `src/analytics/firestore-integration.ts` (new)

## Public API

```ts
export interface SpellingAssessmentCompletionRecord {
  clUserId: string;
  assessmentType: string;
  lang: string;
  score: number;
  maxScore: number;
  basalBucket: number;
  ceilingBucket: number;
}

export class FirestoreIntegration {
  static initializeFirestore(config?: AnalyticsConfig): void;
  static getInstance(): FirestoreIntegration; // throws if initializeFirestore() not yet called
  writeCompletionRecord(record: SpellingAssessmentCompletionRecord): void; // fire-and-forget
}
```

## Behavioral contract

1. `initializeFirestore()` called more than once MUST NOT create more than one underlying Firebase App / Firestore client (idempotent singleton, matching `AnalyticsIntegration.initializeAnalytics()`).
2. `getInstance()` called before `initializeFirestore()` MUST throw synchronously (never return a broken/partial instance) — callers are expected to catch this the same way `Assessment`'s constructor already catches `AnalyticsIntegration.getInstance()`.
3. `writeCompletionRecord(record)`:
   - MUST return `void` synchronously (not a `Promise` the caller is expected to await) — the write happens in the background.
   - MUST NOT throw synchronously or produce an unhandled promise rejection under any failure of the underlying Firestore call (network error, permission error, offline).
   - On failure, MUST `console.error` the failure (for observability) and otherwise silently no-op — no retry, no learner-facing error, no effect on any other in-flight operation (FR-009).
   - On success, MUST write exactly one document to the `assessmentCompletions` collection containing all of `record`'s fields plus a `completedAt` server timestamp it generates itself (callers never pass a timestamp).

## Caller contract (`Assessment.LogCompletedEvent`)

- MUST only call `writeCompletionRecord` when the current session's `assessmentType` (from `this.commonProperties`) is `'spelling'` (FR-006/FR-010) — never for any other assessment type, and never for a session that didn't reach `onEnd()`.
- MUST call it at most once per session (satisfied by construction: `LogCompletedEvent` itself only runs once per `onEnd()`, which itself fires once per session lifecycle).
- MUST NOT `await` or otherwise block on it — gameplay/UI teardown (`this.ui.showEnd()`, `this.app.notifyClose()`) proceeds regardless of the write's outcome (FR-009).
- MUST tolerate `this.firestoreIntegration` being `null` (Firestore not initialized, e.g. in unit tests or when `config.analyticsConfig` was never supplied to `App.spinUp()`) via optional chaining — no error, no crash.
