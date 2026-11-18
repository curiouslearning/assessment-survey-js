# Feature Specification: Show "l" as "L" and "a" as "A" in Hausa Letter Sounds

**Feature Branch**: `CLT-176`

**Created**: 2026-11-16 (revised 2026-11-16)

**Status**: Draft

**Jira**: [CLT-176](https://curiouslearning.atlassian.net/browse/CLT-176)

**Input**: Developer direction: "Whenever lowercase l shows up in letter sounds, show it as uppercase L. Similarly, instead of small a, show uppercase A — only on letter sounds, not sight words. Only apply changes on Hausa letter sounds; don't change sight words or any other game types."

## Background

Local QA: in the assessment font, lowercase "l" (as in "lion") looks like uppercase "I" (as in "internet"), so when the audio says "L" a learner may think no option is correct. An earlier font-based fix was dropped in favour of a content-only change that does not alter the UI or font.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - "L" is unambiguous (Priority: P1)

When the audio says "L", the correct option is shown as uppercase "L", which cannot be confused with "I".

**Independent Test**: Play Hausa Letter Sounds to buckets 6–7; the "l" sound item shows "L" and is marked correct when tapped/dropped.

**Acceptance Scenarios**:

1. **Given** the Hausa Letter Sounds assessment, **When** the item whose sound is "l" is asked, **Then** its option is shown as "L" and the same "l" audio plays.
2. **Given** that question, **When** the learner picks "L", **Then** it is scored correct.

### User Story 2 - "a" shown as "A" (Priority: P1)

**Independent Test**: Same buckets; the "a" sound item shows "A".

**Acceptance Scenarios**:

1. **Given** the Hausa Letter Sounds assessment, **When** the item whose sound is "a" is asked, **Then** its option is shown as "A", the same "a" audio plays, and picking it is scored correct.
2. **Given** the options "ai" and "au", **Then** they stay lowercase.

### User Story 3 - Nothing else changes (Priority: P1)

**Independent Test**: Open Hausa Sight Words, Hausa Spellings and English Letter Sounds; compare with before.

**Acceptance Scenarios**:

1. **Given** Hausa Sight Words, Hausa Spellings, any other language, or any other game, **Then** nothing looks or behaves differently.
2. **Given** Hausa Letter Sounds, **Then** fonts and all other letters look exactly as before.

### Edge Cases

- Uppercase and lowercase variants never appear in the same bucket, so a question never shows two identical "L" or "A" options (verified: no duplicates in any bucket).
- Devices that cached the old content must pick up the new content (content version bump).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: In Hausa Letter Sounds only, the lowercase "l" item MUST be displayed as "L" and the lowercase "a" item as "A".
- **FR-002**: The audio for those items MUST stay the existing "l" and "a" sounds.
- **FR-003**: Picking the displayed "L"/"A" for those items MUST be scored correct.
- **FR-004**: "ai", "au" and all other items MUST be unchanged.
- **FR-005**: No code, font, stylesheet, or other assessment/game may change.
- **FR-006**: Devices with cached content MUST receive the update.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 answer options in Hausa Letter Sounds show lowercase "l" or single lowercase "a".
- **SC-002**: 100% of correct picks of the "L"/"A" options for these items are scored correct in QA.
- **SC-003**: 0 visual or behavioural changes in any other assessment or game.

## Assumptions

- After this change the "l" item and the existing "L" item share the same label and audio, so analytics will record both as "L" (same for "a"/"A"). Accepted, since learners can no longer tell them apart either.
- Deployment to test for QA uses the normal test build pipeline.
