# Implementation Plan: Show "l" as "L" and "a" as "A" in Hausa Letter Sounds

**Branch**: `CLT-176` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

## Summary

Content-only change in `public/data/hausa-lettersounds.json`: for the two lowercase "l" items and the two lowercase "a" items (buckets 6 and 7), set both `itemName` and `itemText` to "L" / "A", and bump `contentVersion` v0.3 → v0.4. No code, CSS, or font changes.

## Technical Context

**Language/Version**: JSON content consumed by the TypeScript player

**Testing**: Jest (`validateAssessmentConfig`), manual QA

**Target Platform**: Curious Reader (Android WebView), browsers

**Constraints**: offline cache must refresh; scoring must stay correct

## Key findings (research)

- **Why both fields change**: answers are scored by comparing the option's `itemName` with the question's `correct`, which is the target's `itemText` (`assessment.ts` `createQuestion`; `uiController.ts`, `dragdrop-ui.ts`). If only `itemText` changed, "l" → "L" would never be scored correct.
- **Audio**: audio is looked up as `itemName.toLowerCase()`, so "L" → `l.mp3` and "A" → `a.mp3`, which are the same files as before (both exist in `public/assets/audio/hausa-lettersounds/`).
- **Duplicates**: foils come from the current bucket. Buckets 6/7 contain no other "L" or "A", so no question shows two identical options.
- **Cache refresh**: `App` compares `contentVersion` with the server copy and refreshes cached content when it differs, hence the bump.
- **Rejected**: the font-based approach (tailed "l" via a glyph subset) was dropped per developer direction to avoid UI/font changes.

## Constitution Check

| Principle | Status |
|---|---|
| I–V (typing, paradigms, SOLID, purity, composition) | N/A, no code change |
| VI (tests) | Config validated with `validateAssessmentConfig` (0 errors, 0 warnings) |
| Quality gates | `npm test` + `npm run build:standalone` must pass |

## Project Structure

```text
public/data/hausa-lettersounds.json   # only file changed
```
