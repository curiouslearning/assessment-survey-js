# Tasks: Show "l" as "L" and "a" as "A" in Hausa Letter Sounds

**Input**: `/specs/004-hausa-lettersounds-uppercase-l-a/`

## Phase 1: Cleanup

- [x] T001 Revert the earlier font-based changes (src/App.ts, public/css/*.css, workbox-config.js, test/src/App.test.ts) and delete src/utils/fontScopeUtils.ts, test/utils/fontScopeUtils.test.ts, public/css/AtkinsonHyperlegible-*

## Phase 2: User Stories 1 & 2 (P1) 🎯 MVP

- [x] T002 [US1] In public/data/hausa-lettersounds.json set the "l" items (buckets 6, 7) to `itemName`/`itemText` "L"
- [x] T003 [US2] In public/data/hausa-lettersounds.json set the "a" items (buckets 6, 7) to `itemName`/`itemText` "A"; leave "ai"/"au"
- [x] T004 Bump `contentVersion` to v0.4 in public/data/hausa-lettersounds.json

## Phase 3: User Story 3 (P1) + Verification

- [x] T005 [US3] Confirm no duplicate labels in any bucket and that `l.mp3`/`a.mp3` exist
- [x] T006 Validate the config with `validateAssessmentConfig` (0 errors, 0 warnings)
- [ ] T007 Run `npm test` and `npm run build:standalone`
- [ ] T008 Manual QA per quickstart.md, then deploy to test

## Dependencies

T001 → T002–T004 → T005–T008.
