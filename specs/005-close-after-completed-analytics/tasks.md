# Tasks: Close Every Standalone Assessment Once Completion Analytics Is Sent

- [x] T001 Spec, research, plan, contract in `specs/005-close-after-completed-analytics/`
- [x] T002 [P] `trackWithDeliveryConfirmation` in `src/analytics/analytics-integration.ts` + tests in `test/analytics/analyticsIntegration.test.ts`
- [x] T003 `whenCompletionAnalyticsSettled()` in `src/baseQuiz.ts`; `Assessment.LogCompletedEvent` uses confirmation (`src/assessment/assessment.ts`) + tests in `test/assessment/assessment.test.ts`
- [x] T004 `COMPLETED_ANALYTICS_MAX_WAIT_MS`, `waitFor` in `src/utils/hostCloseUtils.ts`
- [x] T005 [US1] `App.closeHostAfterCompletion` waits for min end-screen time and analytics settled; close in `finally` (`src/App.ts`)
- [x] T006 [US1/US2] App tests: waits for analytics, bounded wait, embedded/survey unchanged (`test/src/App.test.ts`)
- [x] T007 `npm test`, `npm run build:all`
- [ ] T008 Manual QA on BrowserStack with a CR APK that includes the `closeWebView` UI-thread fix — owner: Ashwin
