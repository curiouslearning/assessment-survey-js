# Research

## R1. How can we know the `completed` event was sent?

- **Decision**: Pass gtag's reserved `event_callback` / `event_timeout` parameters with the `completed` event and resolve a promise when gtag calls back; cap with our own timer.
- **Rationale**: `@curiouslearning/analytics` `FirebaseStrategy.track(name, params)` calls Firebase `logEvent(analytics, name, params)`, which forwards the params object (spread, so functions survive) to `gtag('event', name, {...params, send_to})`. gtag invokes `event_callback` once the hit is dispatched, or after `event_timeout` ms if it could not be. Both keys are gtag-reserved and are not recorded as event parameters, so the stored event is unchanged. If gtag never loads (offline, blocked) the callback never fires, so our own timer (5 s) guarantees the close.
- **Alternatives**: fixed delay only (current develop; no knowledge of delivery); unloading the page to force a beacon flush (needs CRcontainer changes the user does not want); patching the shared analytics package (wider blast radius).

## R2. Timing

- Minimum end-screen time stays 3 s (`HOST_CLOSE_DELAY_MS`). Max wait for analytics confirmation: 5 s (`COMPLETED_ANALYTICS_MAX_WAIT_MS`), counted from the moment the event is tracked. Close at `max(3 s, min(confirmation, 5 s))`.

## R3. "All assessments"

- Every assessment type (letter sounds, sight words, spelling; all languages) runs through `Assessment.onEnd()` → `LogCompletedEvent` → `ENDED`, and the close is gated on `appType === 'assessment'`, so one change covers all of them. Surveys never emit the integration `completed` event and stay excluded.
