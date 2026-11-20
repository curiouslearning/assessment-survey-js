# Feature Specification: Close Every Standalone Assessment Once Completion Analytics Is Sent

**Feature Branch**: `CLT-175-completed-analytics`

**Created**: 2026-11-19

**Status**: Draft

**Input**: Jira CLT-175 follow-up — "Update the build for all assessments to close once the assessment is completed and the completed analytics is sent." Builds on the CLT-175 change already on `develop` (PR #339), which closes the standalone assessment in the CR app 3 seconds after it ends, on a fixed timer that does not know whether the `completed` analytics event has actually gone out.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Learner returns to CR home only after the completion is reported (Priority: P1)

A learner finishes any standalone assessment (letter sounds, sight words, spelling; any language) opened from the CR app. The assessment stays on its end screen until the "completed" analytics event has been handed off for sending, then closes and the learner lands on the CR app home screen.

**Why this priority**: Closing before the completion report goes out loses the single most important analytics record for the session.

**Independent Test**: In the CR app, finish a standalone assessment while watching device logs; the "completed" report is confirmed before the screen closes, and the CR home screen appears.

**Acceptance Scenarios**:

1. **Given** a learner on the last item of any standalone assessment in the CR app, **When** they answer it, **Then** the end screen is shown, the completed analytics event is sent, and only then the app returns to the CR home screen.
2. **Given** the completed analytics event is confirmed quickly, **When** the assessment ends, **Then** the end screen is still shown for at least 3 seconds before closing.
3. **Given** the completed analytics event cannot be confirmed (offline, analytics blocked or not loaded), **When** the assessment ends, **Then** the assessment still closes after a bounded wait (no more than 5 seconds after the end), and the event is handled exactly as today.

---

### User Story 2 - Embedded and non-assessment flows unchanged (Priority: P1)

Feed The Monster-embedded assessments, surveys and plain web browsers behave exactly as today.

**Acceptance Scenarios**:

1. **Given** the assessment is embedded in Feed The Monster, **When** it ends, **Then** it does not close the CR app screen.
2. **Given** a survey or a plain browser with no CR app bridge, **When** it ends, **Then** nothing closes.

### Edge Cases

- A failure while handing summary/session data to the CR app must not stop the close.
- The analytics library never reports back: the bounded wait applies.
- The CR app's close call fails: the failure is logged; the learner can still use the X button.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Every standalone assessment type MUST close the CR app screen once it is completed.
- **FR-002**: The close MUST wait until the completed analytics event has been confirmed as handed off for sending, or until a bounded wait of 5 seconds from the end has passed, whichever comes first.
- **FR-003**: The end screen MUST remain visible for at least 3 seconds before closing.
- **FR-004**: The completed analytics event's recorded content MUST NOT change.
- **FR-005**: Summary and session data MUST be handed to the CR app before the close, and a failure in that step MUST NOT prevent the close.
- **FR-006**: Embedded (Feed The Monster), survey and plain-browser behavior MUST NOT change.

## Success Criteria _(mandatory)_

- **SC-001**: 100% of completed standalone assessments in the CR app return to CR home within 6 seconds of the end screen appearing.
- **SC-002**: Completed-event counts for standalone sessions do not drop compared with the release before the close was introduced.
- **SC-003**: No behavior change reported in Feed The Monster QA.

## Assumptions

- "Sent" means the analytics library confirmed it handed the event off (or gave up after its own timeout); delivery to reporting dashboards later is outside the app's control.
- The CR app's close call works only with the CRcontainer fix that runs `closeWebView()` on the UI thread (branch `CLT-175-closewebview-ui-thread`); without it, the close fails silently as observed on 2026-11-18.
