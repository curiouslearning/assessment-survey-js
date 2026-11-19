# Implementation Plan: Close Every Standalone Assessment Once Completion Analytics Is Sent

**Branch**: `CLT-175-completed-analytics` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)

## Summary

Make the `completed` analytics event awaitable (`AnalyticsIntegration.trackWithDeliveryConfirmation`, using gtag `event_callback` + a 5 s cap), keep its promise on the assessment (`whenCompletionAnalyticsSettled()`), and have `App.closeHostAfterCompletion` close the CR screen only when both the 3 s end-screen minimum has elapsed and that promise has settled. The close call moves into a `finally` so a failure handing data to the CR app can't block it.

## Technical Context

TypeScript ~4.8 strict · Jest/ts-jest (jsdom) · no new dependencies · targets the CR Android WebView · no change to event payloads.

## Constitution Check

| Principle                 | Compliance                                                                                                                                                 | Status |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| I. No `any`               | gtag params typed as `GtagDeliveryParams`; no `any`/`@ts-ignore`                                                                                           | PASS   |
| II/IV. FP vs OOP          | `settleWithin(promise, ms)` / `waitFor(ms)` are small pure-ish helpers (timers injected through params where tested); state stays in `Assessment`/`App`    | PASS   |
| III/V. SOLID, composition | `BaseQuiz.whenCompletionAnalyticsSettled()` default + one override in `Assessment` (existing one-level inheritance); `App` depends on the quiz abstraction | PASS   |
| VI. Gherkin tests         | New Given/When/Then tests for the integration method, assessment promise and App close timing                                                              | PASS   |
| Quality gates             | `npm test`, `npm run build:all`                                                                                                                            | PASS   |

## Source changes

```text
src/analytics/analytics-integration.ts   # + trackWithDeliveryConfirmation()
src/baseQuiz.ts                          # + whenCompletionAnalyticsSettled() (resolved by default)
src/assessment/assessment.ts             # completed event tracked with confirmation; promise kept
src/utils/hostCloseUtils.ts              # + COMPLETED_ANALYTICS_MAX_WAIT_MS, waitFor()
src/App.ts                               # close waits for 3 s minimum AND analytics settled; finally
test/analytics/analyticsIntegration.test.ts
test/assessment/assessment.test.ts
test/src/App.test.ts
```

## Complexity Tracking

None.
