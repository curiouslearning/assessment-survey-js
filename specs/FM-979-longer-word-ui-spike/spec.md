# FM-979: Spike — UI support for longer spelled words

## Metadata

- **Jira**: [FM-979](https://curiouslearning.atlassian.net/browse/FM-979)
- **Type**: Spike (investigation, not a feature build)
- **Status**: In Progress
- **Priority**: High
- **Reporter**: Ben Burrage
- **Assignee**: Ashwin Nair
- **Branch**: `FM-979`

## User Story

As a developer,
I want to evaluate whether the current pick-1-of-4 answer UI can accommodate longer spelled words,
So that we know before implementation whether UI changes are needed.

## Background

The Hausa Spelling assessment (added under FM-983/FM-982) uses the existing pick-1-of-4 answer layout, where a prompt word is shown and the player picks the correctly spelled option among the target word and three foils. The Hausa word bank ([Google Sheet](https://docs.google.com/spreadsheets/d/1Ejk2hUBKrBfnaKm9JwNn8fJ31iNvJUdqUUEKDPSOP6Q/edit)) contains longer words than prior assessments used with this UI, so this spike checks whether the layout as-built still holds up.

From the current word bank ([public/data/hausa-spellings.json](../../public/data/hausa-spellings.json)), the two longest target words (9 characters, bucket 10) are:

| itemName / itemText | foils |
|---|---|
| `makaranta` | `maƙaranta`, `mekaranta`, `mkaaranta` |
| `jarrabawa` | `jarraɓawa`, `jarrabaaw`, `jerrabawa` |

These are the reference cases for the evaluation — all four options per case are the same length or close to it, so this is the worst case for the layout, not an average case.

## Acceptance Criteria

**Scenario: Longest expected Hausa spelling target rendered in current UI**
- Given the longest target word and its foils from the finalized Hausa Spelling item set
- When they are rendered in the existing pick-1-of-4 answer layout
- Then the team can determine whether text overflows, wraps awkwardly, or renders acceptably

**Scenario: Recommendation documented**
- Given the UI evaluation is complete
- When findings are reviewed
- Then a written recommendation (no changes needed, or changes needed with scope) is added to the epic

## Deliverable

This is a spike: the output is a **written recommendation**, not a shipped UI change. The recommendation itself is out of scope for this document and gets posted to the parent epic per the acceptance criteria — this spec exists to define what "evaluate" means concretely and to structure the investigation in [plan.md](./plan.md).

## In Scope

- Evaluating the **legacy** answer UI (`LegacyAssessmentUIAdapter` / `UIController`, `.answerButton` in [public/css/style.css](../../public/css/style.css)).
- Evaluating the **drag-drop** answer UI (`DragDropAssessmentUI`, `.answerButton` rules in [public/css/drag-drop-style.css](../../public/css/drag-drop-style.css)), since both are active UI modes behind the `drag-drop-assessment-ui` feature flag and either could serve this assessment.
- Rendering both longest-word cases (`makaranta`, `jarrabawa`) with their real foils, at realistic viewport sizes (mobile-first, since this is the primary target).
- Documenting concrete visual outcomes: clipped/hidden text, wrapping, font shrinking, or acceptable fit.

## Out of Scope

- Implementing any UI fix — that is scoped separately (FM-988 and/or a follow-up ticket) if this spike concludes changes are needed.
- Non-Hausa assessments/word banks.
- Audio, scoring, or bucket/BST logic — this spike is UI-rendering only.

## Open Questions

- No parent epic link was found on FM-979 in Jira — confirm where the recommendation should be posted.
