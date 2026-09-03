# Development Orchestration Plan — FM-979

Technical approach for executing the spike defined in [spec.md](./spec.md). This is the file to review before development starts.

## Known constraints (found during codebase review)

These are concrete, current facts about the two UI implementations that this spike must reconcile with reality, not assumptions:

- **Legacy UI** ([public/css/style.css:196-256](../../public/css/style.css)): `.answerContainer` is a 2-column grid, each column capped `minmax(0, 200px)`. `.answerButton` has `max-width: 200px`, `font-size: 1.5rem`, `overflow: hidden`, and **no `white-space`/`word-break` rule** — so there is no existing wrapping strategy, only clipping via `overflow: hidden`. A 9-character word at 1.5rem is a plausible overflow candidate in a 200px box.
- **Drag-drop UI** ([public/css/drag-drop-style.css:258-426](../../public/css/drag-drop-style.css)): reuses `.answerButton` as a base with `as-ui-mode-new` overrides; font sizing differs (e.g. `.dragging::before`/`::after` at 15px/9px). This has not been checked for overflow behavior yet — needs the same test pass as legacy.
- Text is set directly via DOM text content on `answerButton1`–`answerButton6` in [src/ui/uiController.ts](../../src/ui/uiController.ts) — no truncation/ellipsis/measurement logic exists anywhere in that path today.
- Both UIs share the same underlying element IDs (`gameWrap`, `qWrap`, `aWrap`, `answerButton1`–`6`) per [CLAUDE.md](../../CLAUDE.md), so the same harness can drive both by toggling UI mode.

## Approach

Since this is a spike (no shipped code change), "development" here means building a disposable but realistic rendering harness, not modifying `src/`. Do not touch assessment logic, bucket/BST code, or scoring — this is rendering-only.

1. **Build a minimal test data file** containing only the two longest-word buckets (`makaranta`, `jarrabawa` and their real foils, pulled from [public/data/hausa-spellings.json](../../public/data/hausa-spellings.json)) so the app can be pointed at it via `dataURL` without needing to page through the full 100-item assessment to reach bucket 10.
2. **Run the standalone dev server** (`npm run dev`) pointed at that trimmed data file, once with the default (legacy) UI and once with the `drag-drop-assessment-ui` feature flag / `assessmentUIMode: "new-ui"` config, per [App.ts](../../src/App.ts) startup config.
3. **Render both longest-word cases in both UI modes** at the primary target viewport (mobile width — check what the project's actual target device width is; if unknown, test at common small-phone widths e.g. 360px and 390px in addition to desktop) and capture screenshots.
4. **Record observations per case per UI mode**: does text clip (cut off, `overflow:hidden` behavior), does the container grow, does anything wrap, is it legible. Note whether the failure (if any) is specific to the two longest words or would also affect mid-length words given the fixed `200px` cap.
5. **Compare legacy vs. drag-drop** — they may behave differently since they don't share identical CSS overrides; the recommendation needs to cover both if the app can launch in either mode for this assessment.
6. **Draft the recommendation**: either "no changes needed" (with the screenshots as evidence) or "changes needed" with concrete scope (e.g., reduce `font-size` responsively, allow wrapping with `white-space: normal` + remove/adjust `overflow: hidden`, widen `max-width`, or auto-shrink font by text length) — sized so it can be handed directly to whoever picks up the follow-up implementation ticket.
7. **Post the recommendation to the parent epic** per the acceptance criteria (see Open Questions in spec.md — epic link needs confirming first).
8. **Clean up**: the trimmed test data file and any harness-only code created for this spike should not be merged into `main`/`develop` — either delete before PR or keep isolated under this `specs/FM-979-longer-word-ui-spike/` directory, not under `public/` or `src/`.

## Explicitly not doing

- Not modifying `.answerButton` CSS, `uiController.ts`, or `dragdrop-ui.ts` as part of this spike.
- Not adding automated visual-regression tests — this is a one-time manual evaluation whose output is a written recommendation.
