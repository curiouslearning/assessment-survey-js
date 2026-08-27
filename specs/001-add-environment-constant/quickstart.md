# Quickstart: Validating the Build Environment Constant

Prerequisites: `npm install` has been run in the repo root.

## 1. Verify `environment` resolves correctly per build mode

```bash
npm run build:standalone:develop && grep -o "environment[^,}]*" build/bundle.js | head -1
npm run build:standalone:test    && grep -o "environment[^,}]*" build/bundle.js | head -1
npm run build:standalone         && grep -o "environment[^,}]*" build/bundle.js | head -1   # production (default/unchanged script)
```
Expected: the three runs report `develop`, `test`, and `production` respectively (SC-001). (Once minified, prefer asserting via the new `test/environment.test.ts` unit test rather than grepping bundle output — the grep above is a quick manual sanity check only.)

## 2. Verify the automated test suite resolves `test` with no extra config

```bash
npm test -- test/environment.test.ts
```
Expected: passes, asserting `environment === 'test'` with no environment variables set manually (Jest's own default covers this — User Story 1, Acceptance Scenario 4).

## 3. Verify the test-mode asset base path

```bash
npm run build:standalone:test
grep -o 'data-asset-base-url="[^"]*"' build/index.html   # expect: data-asset-base-url="/assessment-survey-js/assets"

npm run build:standalone:develop
grep -o 'data-asset-base-url="[^"]*"' build/index.html   # expect: data-asset-base-url="/assets" (unchanged)

npm run build:standalone
grep -o 'data-asset-base-url="[^"]*"' build/index.html   # expect: data-asset-base-url="/assets" (unchanged)
```
The attribute itself is never removed — the `CopyWebpackPlugin` transform in `webpack.config.js` rewrites its value per build mode (research.md §3a). Then serve `build/` under a `/assessment-survey-js/` sub-path locally (e.g. a static server rooted one directory above `build/`, aliased as `assessment-survey-js`) and confirm images/audio load without 404s for the `test` build. Repeat for `build:standalone:develop` / `build:standalone` and confirm assets still load from the root `/assets` path unchanged (User Story 2, Acceptance Scenarios 4–5).

## 4. Verify `AndroidInterface` metadata includes `environment`

```bash
npm test -- test/src/App.test.ts
```
Expected: the new/updated assertions confirm both `AndroidInterface` call sites' `metadata` objects include `environment` alongside the existing `app_version`, per [contracts/android-interface-metadata.md](./contracts/android-interface-metadata.md) (User Story 3).

## 5. Verify the CircleCI wiring (static review — no live pipeline run required for this step)

- Confirm `.circleci/config.yml`'s `s3-deploy` job now builds with `NODE_ENV=development` (or calls `build:standalone:develop`), `s3-deploy-prod` still builds with `NODE_ENV=production` (`build:standalone`), and a new `s3-deploy-test` job builds with `NODE_ENV=test` (`build:standalone:test`) and syncs to `s3://globallit-aws-s3-static-webapp-test-us-east-2/assessment-survey-js`.
- Confirm the `test` branch filter is present in `s3-deploy-workflow` alongside the existing `develop`/`main` filters, and that no npm-publish job/workflow was touched (SC-004).
- Confirm the `s3-deploy-test` job declares `context: [aws-context]` — without it, `AWS_TEST_REGION` won't resolve (it's context-scoped, not a plain project env var like `AWS_DEFAULT_REGION`/`AWS_PROD_REGION`).
- **Operational prerequisite** (outside this repo's tracked files): the `aws-context` CircleCI context must exist and contain `AWS_TEST_REGION`, and the access key used for the upload (existing shared `AWS_ACCESS_KEY`/`AWS_SECRET_ACCESS_KEY`, per current assumption) must have write permission scoped to the `assessment-survey-js/` prefix of the shared bucket, before the new job can run for real (research.md §5).

## Success criteria covered

Steps 1–5 above map directly to SC-001 through SC-005 in [spec.md](./spec.md#success-criteria-mandatory-outcomes).
