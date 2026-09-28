# Feature Specification: Spelling Assessment Analytics Reporting

**Feature Branch**: `002-spelling-assessment-analytics`

**Created**: 2026-09-15

**Status**: Draft

**Input**: Jira FM-986 — "Analytics: report Spelling assessment events to BigQuery via Firebase" (subtask of epic FM-978 "Spelling Assessment (Hausa) — New Assessment Type"; blocked by FM-981 "New 'Spelling' assessment type scaffold"). "As a developer, I want Spelling assessment events reported to BigQuery via Firebase Analytics, so that assessment usage and performance data is available for analysis."

**Note**: FM-986's title also mentioned "and completion events to Firestore," but the ticket's formal acceptance criteria only cover Firebase Analytics → BigQuery reporting (see below). Completion data is already pushed to the native host app — and, on the Android side, from there into Firestore — via the existing `AndroidInterface.logUserSessionsData(...)` call in `App.ts`'s `game.subscribe('ENDED', ...)` handler, for every assessment type. This feature does not duplicate that path with a separate, direct-from-JS Firestore integration.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spelling assessment activity is visible in the same Firebase/BigQuery pipeline as every other assessment type (Priority: P1)

As a data analyst, when a learner works through a Spelling assessment, I need the same item-answered and bucket-changed events that every other assessment type already produces, so I can analyze Spelling usage and performance alongside existing assessment data without learning a new event schema.

**Why this priority**: This is the explicit, named ask in FM-986 and the reason the ticket exists. Nothing else in this feature has value without it.

**Independent Test**: Can be fully tested by playing a Spelling assessment session (using either the tap-to-answer or drag-to-answer interaction, since Spelling is the first assessment type to use tap-to-answer) end-to-end and asserting that item-answered and bucket-changed events are emitted with the exact same field structure Firebase Analytics already receives for other assessment types, with no missing or malformed events.

**Acceptance Scenarios**:

1. **Given** a learner is taking a Spelling assessment, **When** they answer an item (via either supported answer interaction), **Then** an "item answered" event is sent to Firebase Analytics with the same structure as the equivalent event from any other assessment type.
2. **Given** a learner progresses far enough to complete a competency bucket in a Spelling assessment, **When** the bucket is completed, **Then** a "bucket changed" event is sent to Firebase Analytics with the same structure as the equivalent event from any other assessment type.
3. **Given** Firebase Analytics events have been logged for a Spelling assessment session, **When** the standard Firebase-to-BigQuery export runs, **Then** those events are queryable in BigQuery the same way existing assessment types' events already are (no new export configuration required).
4. **Given** a Spelling assessment session using the tap-to-answer interaction (as opposed to the drag-to-answer interaction used by other assessment types), **When** an item is answered by tapping, **Then** the resulting event is indistinguishable in structure from one produced by a drag-to-answer interaction.

---

### User Story 2 - Spelling events are attributable to the Spelling assessment specifically, not lumped in with other assessment types (Priority: P2)

As a data analyst, when I query BigQuery, I need to be able to filter or group specifically on "Spelling" so that Spelling usage/performance can be reported on independently of other assessment types running in the same product/language context.

**Why this priority**: Implied by the acceptance criterion "queryable in BigQuery like other assessment types" — being present in the pipeline is necessary but not sufficient if analysts can't isolate Spelling-specific results. Ranked below Story 1 because the events existing at all is the prerequisite; being cleanly filterable is the refinement that makes the data actually useful.

**Independent Test**: Can be fully tested by running one Spelling assessment session and one session of an existing assessment type side by side, then confirming the BigQuery-bound events can be filtered to show only the Spelling session's data.

**Acceptance Scenarios**:

1. **Given** events from a Spelling assessment session and events from a non-Spelling assessment session both exist in the pipeline, **When** an analyst filters for Spelling specifically, **Then** only the Spelling session's events are returned.

---

### Edge Cases

- What happens if the Spelling assessment is played before its own type-scaffold work (FM-981) has fully landed, i.e. the assessment JSON doesn't yet carry a recognizable Spelling type marker? Reporting for that session should still degrade gracefully — no crash, and events fall back to whatever generic identification existing assessment types already use, rather than being silently dropped.
- What happens if a learner's Spelling assessment session runs while offline or with an unstable connection? Firebase Analytics events already tolerate best-effort/eventual delivery consistent with how existing analytics events behave today; this feature does not change that.
- What happens to bucket-changed reporting under the non-default bucket-generation mode (the linear/array-based traversal mode used for developer tooling rather than live assessments)? This feature does not change or extend reporting behavior for that mode; it is out of scope here as a pre-existing condition shared by all assessment types, not something newly introduced by Spelling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST emit an "item answered" analytics event to the existing Firebase Analytics pipeline for every answered item in a Spelling assessment, using the same event name and field structure already used for every other assessment type.
- **FR-002**: System MUST emit an "item answered" event with identical structure regardless of which answer interaction the learner used (tap-to-answer or drag-to-answer), so the interaction mechanism used for Spelling is invisible to downstream analytics consumers.
- **FR-003**: System MUST emit a "bucket changed" (bucket completed) analytics event to the existing Firebase Analytics pipeline when a Spelling assessment learner completes a competency bucket, using the same event name and field structure already used for every other assessment type.
- **FR-004**: System MUST emit a "completed" analytics event to the existing Firebase Analytics pipeline when a learner finishes a Spelling assessment, using the same event name and field structure already used for every other assessment type.
- **FR-005**: System MUST NOT require any change to the existing Firebase-to-BigQuery export configuration for Spelling assessment events to become queryable in BigQuery.
- **FR-006**: System MUST make Spelling-originated events distinguishable from other assessment types' events when queried, so an analyst can isolate Spelling-specific data. This MUST be achieved by consistently populating an assessment-type attribute already read from the assessment configuration (not by adding a Spelling-only special case), so every assessment type — not only Spelling — becomes equally filterable.
- **FR-007**: This feature MUST NOT remove, rename, or repurpose any existing field or reporting behavior of any existing (non-Spelling) assessment type; the one attribute added to satisfy FR-006 MUST be purely additive (present and populated the same way for every assessment type going forward) and MUST NOT change the value or meaning of any field already present today.

### Key Entities

- **Assessment Answered Event**: A Firebase Analytics event already produced for every assessment type when a learner answers an item; carries item/answer/timing details. For Spelling, must be identical in shape regardless of interaction method (tap vs. drag).
- **Bucket Completed Event**: A Firebase Analytics event already produced for every assessment type when a competency bucket is finished; carries bucket identity and pass/fail outcome.
- **Assessment Completed Event**: A Firebase Analytics event already produced for every assessment type at the end of a session; carries final score and basal/ceiling bucket outcome. Already flows into BigQuery via the standard export.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of item-answered and bucket-completed actions taken during a Spelling assessment session produce an analytics event structurally identical to the equivalent event from any other assessment type, verified by automated test coverage.
- **SC-002**: An analyst can query BigQuery for Spelling assessment activity (answered/bucket/completed events) using the same query patterns already used for existing assessment types, with zero additional export or pipeline configuration.
- **SC-003**: An analyst or stakeholder can isolate "Spelling only" results from BigQuery event data without needing to cross-reference a separate system to know which rows belong to Spelling.

## Assumptions

- FM-981 (the Spelling assessment type scaffold) lands before or alongside this feature; this feature reuses whatever assessment-type identification FM-981 introduces (the `AssessmentType.Spelling` constant, once landed) rather than introducing its own separate type marker.
- "Same event structure used by other assessment types" means Spelling's answered/bucket-completed/completed events carry exactly the same fields, in the same shape, as every other assessment type's events — no Spelling-only fields and no Spelling-only omissions. Today, no field on those events reliably distinguishes one assessment type's content from another's (the existing common fields identify product/language, not assessment type), so satisfying FR-006 requires adding one small, additive, type-agnostic attribute to the shared event structure — applied uniformly to all assessment types, not special-cased for Spelling — rather than inventing a parallel, Spelling-specific reporting path.
- This feature does not change reporting behavior for the non-default, developer-tooling bucket-generation mode; it only needs to work correctly under the same adaptive bucket-generation mode already shared by all live assessment types (including Spelling, per FM-978's requirement to reuse the existing binary-search leveling algorithm).
- Completion data reaching Firestore (referenced in FM-986's title) is out of scope for this feature: it is already handled by the existing `AndroidInterface` bridge from `App.ts`, which already logs `event_type: 'activity_completed'` session data (including `type: assessmentType`) for every assessment type today. No new, JS-side Firestore integration is introduced or required.
