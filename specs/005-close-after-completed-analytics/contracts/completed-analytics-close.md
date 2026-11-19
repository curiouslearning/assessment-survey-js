# Contract: completed analytics → close

1. `Assessment.onEnd()` → `LogCompletedEvent` → `analyticsIntegration.trackWithDeliveryConfirmation('completed', data, 5000)`
   - gtag receives `{...data, event_callback, event_timeout: 5000}`; recorded params are unchanged.
   - Resolves `'confirmed'` when gtag calls back, `'timed-out'` after 5000 ms otherwise.
2. `ENDED` → summary/session data to `window.Android.logMessage` (unchanged).
3. `App.closeHostAfterCompletion('assessment')` (standalone + bridge present only) waits for
   `Promise.all([waitFor(3000), game.whenCompletionAnalyticsSettled()])`, then calls `window.Android.closeWebView()` once.
4. Console markers (visible in `adb logcat` as `chromium`/WebView console lines):
   - `[CLT-175] completed analytics confirmed|timed-out; closing the assessment screen`
