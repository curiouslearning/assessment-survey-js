# Contract: `mr-75` feature-flag gate on `enableAndroidSummary` (standalone mode)

This is the internal contract governing when `AndroidInterface` is constructed at
both existing call sites in `src/App.ts` (`~line 368` user-session logging inside
`game.subscribe('ENDED', ...)`, and `~line 600` `notifySummaryData`), once the
`mr-75` remote feature flag is factored in. Unlike
[android-interface-metadata.md](./android-interface-metadata.md) (which governs the
*payload shape* sent to `AndroidInterface`), this contract governs *whether*
`AndroidInterface` is constructed at all.

## Inputs

| Input | Source | Notes |
|---|---|---|
| `platform` | `config.platform ?? 'standalone'`, resolved in `spinUp()` | `startStandaloneApp()` defaults this to `'standalone'`; the web component defaults it to `'ftm'`. |
| `enableAndroidSummary` (pre-flag) | `config.enableAndroidSummary ?? this.enableAndroidSummary ?? true`, set in `applyHostIntegrationConfig()` | Existing, unchanged assignment — this feature does not alter how the pre-flag value is computed. |
| `featureFlagsService.isFeatureEnabled('mr-75')` | `@curiouslearning/features`, evaluated after `featureFlagsService.initialize()` settles in `spinUp()` | Synchronous; safe-default `false` when the service is uninitialized or flag unresolved. |

## Output

`this.enableAndroidSummary` (effective, post-gate value) — the same instance field
already read by both `AndroidInterface` construction sites; no new field is
introduced.

## Behavior

```text
if platform === 'standalone':
    enableAndroidSummary := enableAndroidSummary AND isFeatureEnabled('mr-75')
else:
    enableAndroidSummary := enableAndroidSummary   # unchanged, flag not consulted
```

## Guarantees

1. The flag is evaluated exactly once per `spinUp()` call, after
   `featureFlagsService.initialize()` has settled (success or caught failure) —
   never before, and never re-evaluated mid-session (FR-014).
2. The flag can only narrow `true` → `false`; it MUST NOT turn a host's explicit
   `enableAndroidSummary: false` into effective `true` (FR-015).
3. Outside `platform === 'standalone'`, behavior is byte-identical to today — the
   flag is never read (FR-016).
4. If `featureFlagsService.initialize()` throws/fails, or `isFeatureEnabled('mr-75')`
   is otherwise unresolved, the flag is treated as disabled — fails closed, matching
   the existing `FEATURE_DRAG_DROP_UI` fallback behavior at the same call site
   (FR-017).
5. No existing call-site behavior for non-standalone consumers changes as a result
   of this feature (SC-007).
