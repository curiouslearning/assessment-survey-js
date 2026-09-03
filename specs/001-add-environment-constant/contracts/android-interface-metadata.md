# Contract: `AndroidInterface` metadata payload

This is the payload contract this library sends to the Android host app via `@curiouslearning/core`'s `AndroidInterface`. Both call sites live in `src/App.ts`.

## Call site 1 — user-session logging (`game.subscribe('ENDED', ...)`, ~`src/App.ts:351`)

**Before**:
```ts
metadata: { app_version: appVersion }
```

**After**:
```ts
metadata: { app_version: appVersion, environment }
```

## Call site 2 — summary-data logging (`notifySummaryData`, ~`src/App.ts:572`)

**Before**:
```ts
metadata: { app_version: appVersion }
```

**After**:
```ts
metadata: { app_version: appVersion, environment }
```

## Guarantees

1. `environment` is always one of `'develop' | 'test' | 'production'` — never absent, empty, or any other value, whenever `AndroidInterface` is constructed (both sites are already gated by `enableAndroidSummary` / `appType === Assessment.TYPE`, unchanged by this feature — see spec.md Edge Cases).
2. No existing key (`app_version`, and whatever `cr_user_id`/`app_id` top-level fields already exist) changes name, type, or value as a result of this feature (FR-010).
3. Verified against the published `@curiouslearning/core@1.13.0` package that `metadata` is an open, arbitrary-string-keyed record (not a closed/strict interface) — adding `environment` is accepted by both its TypeScript type and its runtime Zod validator (research.md §4).
