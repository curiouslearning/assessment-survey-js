# Feature Specification: Spelling Assessment Analytics Reporting

**Feature Branch**: `002-spelling-assessment-analytics`

**Created**: 2026-09-15

**Status**: Draft

**Input**: Jira FM-986 — "Analytics: report Spelling assessment events to BigQuery via Firebase and completion events to Firestore" (subtask of epic FM-978 "Spelling Assessment (Hausa) — New Assessment Type"; blocked by FM-981 "New 'Spelling' assessment type scaffold"). "As a developer, I want Spelling assessment events reported to BigQuery via Firebase Analytics, so that assessment usage and performance data is available for analysis."

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

### User Story 2 - A durable completion record is written when a learner finishes a Spelling assessment (Priority: P1)

As a product/operations stakeholder, when a learner finishes a Spelling assessment, I need a completion record written to a persistent store outside the Firebase Analytics event stream, so that completion status can be looked up directly and reliably (not just discovered later through a BigQuery export cycle).

**Why this priority**: Explicitly named in FM-986 ("completion events to Firestore") as a second, distinct deliverable from the Firebase/BigQuery reporting in User Story 1. Ranked P1 alongside Story 1 because the ticket calls out both as required, but this is independently buildable/testable once Story 1's event data (score, basal/ceiling bucket, etc.) is confirmed correct.

**Independent Test**: Can be fully tested by completing a Spelling assessment session end-to-end and asserting that exactly one completion record is written to the persistent store, containing the learner/session identity and outcome data, without needing any other part of this feature to exist first (Firebase Analytics can be mocked/stubbed independently).

**Acceptance Scenarios**:

1. **Given** a learner completes a Spelling assessment (reaches the natural end-of-assessment state), **When** the completion is processed, **Then** a completion record is written to the durable store containing, at minimum, a learner/session identifier, the assessment's outcome (score and basal/ceiling bucket), and a timestamp.
2. **Given** a learner abandons a Spelling assessment before reaching the natural end state (closes the app, navigates away), **When** no completion occurs, **Then** no completion record is written for that session.
3. **Given** the durable-store write fails (e.g., transient network error), **When** the failure occurs, **Then** the learner's in-app experience is unaffected (no crash, no blocked progression, no error shown to the learner) and the existing Firebase Analytics completion event still fires normally.
4. **Given** a completion record has already been written for a session, **When** the same completion is somehow processed twice (e.g., a duplicate event), **Then** the system does not silently create two conflicting records that would double-count completions for the same session.

---

### User Story 3 - Spelling events are attributable to the Spelling assessment specifically, not lumped in with other assessment types (Priority: P2)

As a data analyst, when I query BigQuery or the completion store, I need to be able to filter or group specifically on "Spelling" so that Spelling usage/performance can be reported on independently of other assessment types running in the same product/language context.

**Why this priority**: Implied by the acceptance criterion "queryable in BigQuery like other assessment types" — being present in the pipeline is necessary but not sufficient if analysts can't isolate Spelling-specific results. Ranked below Stories 1–2 because the events/records existing at all is the prerequisite; being cleanly filterable is the refinement that makes the data actually useful.

**Independent Test**: Can be fully tested by running one Spelling assessment session and one session of an existing assessment type side by side, then confirming both the BigQuery-bound events and the Firestore completion record can be filtered to show only the Spelling session's data.

**Acceptance Scenarios**:

1. **Given** events from a Spelling assessment session and events from a non-Spelling assessment session both exist in the pipeline, **When** an analyst filters for Spelling specifically, **Then** only the Spelling session's events are returned.
2. **Given** a completion record exists for a Spelling assessment session, **When** it is read from the durable store, **Then** it is identifiable as belonging to the Spelling assessment type without needing to cross-reference another system.

---

### Edge Cases

- What happens if the Spelling assessment is played before its own type-scaffold work (FM-981) has fully landed, i.e. the assessment JSON doesn't yet carry a recognizable Spelling type marker? Reporting for that session should still degrade gracefully — no crash, and events fall back to whatever generic identification existing assessment types already use, rather than being silently dropped.
- What happens if the same learner starts a second Spelling assessment session after already completing one? Each completed session produces its own completion record; prior records are not overwritten or merged.
- What happens if a learner's Spelling assessment session runs while offline or with an unstable connection? Firebase Analytics events and the Firestore completion write both already tolerate best-effort/eventual delivery consistent with how existing analytics events behave today; neither blocks or degrades gameplay.
- What happens if the durable completion store is unreachable for an extended period? Learner-facing behavior is unaffected (see User Story 2, Scenario 3); no requirement in this feature covers automatic retry/backfill of missed writes.
- What happens to bucket-changed reporting under the non-default bucket-generation mode (the linear/array-based traversal mode used for developer tooling rather than live assessments)? This feature does not change or extend reporting behavior for that mode; it is out of scope here as a pre-existing condition shared by all assessment types, not something newly introduced by Spelling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST emit an "item answered" analytics event to the existing Firebase Analytics pipeline for every answered item in a Spelling assessment, using the same event name and field structure already used for every other assessment type.
- **FR-002**: System MUST emit an "item answered" event with identical structure regardless of which answer interaction the learner used (tap-to-answer or drag-to-answer), so the interaction mechanism used for Spelling is invisible to downstream analytics consumers.
- **FR-003**: System MUST emit a "bucket changed" (bucket completed) analytics event to the existing Firebase Analytics pipeline when a Spelling assessment learner completes a competency bucket, using the same event name and field structure already used for every other assessment type.
- **FR-004**: System MUST emit a "completed" analytics event to the existing Firebase Analytics pipeline when a learner finishes a Spelling assessment, using the same event name and field structure already used for every other assessment type.
- **FR-005**: System MUST NOT require any change to the existing Firebase-to-BigQuery export configuration for Spelling assessment events to become queryable in BigQuery.
- **FR-006**: System MUST write a completion record to a durable store (Firestore) when — and only when — a learner reaches the natural end of a Spelling assessment session.
- **FR-007**: The completion record MUST include, at minimum: a learner/session identifier, the assessment's final score, the basal and ceiling bucket reached, and a timestamp of completion.
- **FR-008**: System MUST make Spelling-originated events and completion records distinguishable from other assessment types' events/records when queried, so an analyst can isolate Spelling-specific data. This MUST be achieved by consistently populating an assessment-type attribute already read from the assessment configuration (not by adding a Spelling-only special case), so every assessment type — not only Spelling — becomes equally filterable.
- **FR-009**: A failure to write the Firestore completion record MUST NOT prevent, delay, or visibly affect the learner's assessment-completion experience, and MUST NOT prevent the corresponding Firebase Analytics "completed" event from being sent.
- **FR-010**: System MUST NOT write a Firestore completion record for a session that does not reach the natural end-of-assessment state (no partial/abandoned-session records).
- **FR-011**: System MUST NOT write more than one completion record for the same completed assessment session.
- **FR-012**: This feature MUST NOT remove, rename, or repurpose any existing field or reporting behavior of any existing (non-Spelling) assessment type; the one attribute added to satisfy FR-008 MUST be purely additive (present and populated the same way for every assessment type going forward) and MUST NOT change the value or meaning of any field already present today.

### Key Entities

- **Assessment Answered Event**: A Firebase Analytics event already produced for every assessment type when a learner answers an item; carries item/answer/timing details. For Spelling, must be identical in shape regardless of interaction method (tap vs. drag).
- **Bucket Completed Event**: A Firebase Analytics event already produced for every assessment type when a competency bucket is finished; carries bucket identity and pass/fail outcome.
- **Assessment Completed Event**: A Firebase Analytics event already produced for every assessment type at the end of a session; carries final score and basal/ceiling bucket outcome. Already flows into BigQuery via the standard export.
- **Completion Record**: A new, durable (Firestore) record representing one finished Spelling assessment session; distinct from the Firebase Analytics "completed" event in that it is written to a queryable store outside the analytics export pipeline. Contains learner/session identity, outcome, timestamp, and enough type information to be filtered as "Spelling."

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of item-answered and bucket-completed actions taken during a Spelling assessment session produce an analytics event structurally identical to the equivalent event from any other assessment type, verified by automated test coverage.
- **SC-002**: An analyst can query BigQuery for Spelling assessment activity (answered/bucket/completed events) using the same query patterns already used for existing assessment types, with zero additional export or pipeline configuration.
- **SC-003**: 100% of learners who reach the end of a Spelling assessment session have exactly one corresponding completion record available in the durable store within the same delivery latency the existing Firebase Analytics "completed" event already experiences.
- **SC-004**: 0% of learners experience any visible delay, error, or blocked progression in the assessment UI as a result of analytics or completion-record reporting, including when the durable store is unreachable.
- **SC-005**: An analyst or stakeholder can isolate "Spelling only" results from both the BigQuery event data and the Firestore completion records without needing to cross-reference a separate system to know which rows belong to Spelling.

## Assumptions

- FM-981 (the Spelling assessment type scaffold) lands before or alongside this feature; this feature reuses whatever assessment-type identification FM-981 introduces (or, if FM-981 has not yet formalized a typed identifier, the existing free-form `assessmentType` string already read from the assessment JSON payload) rather than introducing its own separate type marker.
- "Same event structure used by other assessment types" means Spelling's answered/bucket-completed/completed events carry exactly the same fields, in the same shape, as every other assessment type's events — no Spelling-only fields and no Spelling-only omissions. Today, no field on those events reliably distinguishes one assessment type's content from another's (the existing common fields identify product/language, not assessment type), so satisfying FR-008 requires adding one small, additive, type-agnostic attribute to the shared event structure — applied uniformly to all assessment types, not special-cased for Spelling — rather than inventing a parallel, Spelling-specific reporting path.
- The Firestore completion record is scoped to the Spelling assessment type for this feature (matching FM-986's literal ask); extending the same completion-record mechanism to other assessment types is valuable future follow-up but not required for this feature to be complete.
- "Natural end of a Spelling assessment session" means the same completion lifecycle point that already triggers the existing Firebase Analytics "completed" event and third-party completion notification for other assessment types — no new definition of "done" is introduced.
- Learner/session identity for the completion record reuses whatever user identifier the existing analytics pipeline already has available at completion time (the same identifier already included in other analytics events' common properties); no new identity collection is introduced.
- Firestore write failures are handled as best-effort/non-blocking, consistent with how the existing analytics event pipeline already treats delivery (fire-and-forget, no learner-facing retry UI); no offline queue or guaranteed-delivery mechanism is required for this feature.
- This feature does not change reporting behavior for the non-default, developer-tooling bucket-generation mode; it only needs to work correctly under the same adaptive bucket-generation mode already shared by all live assessment types (including Spelling, per FM-978's requirement to reuse the existing binary-search leveling algorithm).
