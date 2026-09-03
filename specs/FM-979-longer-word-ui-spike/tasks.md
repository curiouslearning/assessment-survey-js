# Tasks — FM-979

Derived from [plan.md](./plan.md). Sequential; each step depends on the one before it.

1. [ ] Create a trimmed assessment JSON (2 buckets: `makaranta` + `jarrabawa` cases with real foils) for fast harness loading.
2. [ ] Run `npm run dev`, load the trimmed JSON via `dataURL`, confirm legacy UI reaches the answer screen for both cases.
3. [ ] Screenshot legacy UI for both cases at desktop width.
4. [ ] Screenshot legacy UI for both cases at mobile widths (360px, 390px, and the project's actual target width if different).
5. [ ] Repeat steps 2–4 with `drag-drop-assessment-ui` enabled / `assessmentUIMode: "new-ui"`.
6. [ ] For each screenshot, note: clipped text (yes/no), wraps (yes/no), font auto-shrinks (yes/no), legible (yes/no).
7. [ ] Decide verdict: no changes needed vs. changes needed.
8. [ ] If changes needed, write concrete scope (which CSS rules, which files, rough approach) — do not implement.
9. [ ] Write the recommendation and confirm/locate the parent epic to post it to (open question from spec.md).
10. [ ] Delete or isolate the trimmed test data file — do not leave it under `public/` or merge it into `main`/`develop`.
