# Quickstart: Configurable Build Base Path per Environment

Runnable validation that the feature works end-to-end. Assumes dependencies are installed
(`npm ci`). Commands are PowerShell-friendly (Windows dev environment).

## Prerequisites

- Node/npm installed; `npm ci` completed.
- Contracts: [build-scripts.md](./contracts/build-scripts.md),
  [produced-artifacts.md](./contracts/produced-artifacts.md).

## 1. Quality gates (Constitution Principle IV)

```powershell
npm run lint    # prettier --check .
npm test        # jest, including new *.spec.ts scenarios
```

Expected: all pass.

## 2. Test build carries the sub-path base path

```powershell
npm run build:test
Select-String -Path build/index.html -Pattern 'data-asset-base-url'
(Get-Content build/manifest.json -Raw | ConvertFrom-Json).start_url
Select-String -Path build -Pattern '__BASE_PATH__' -Recurse   # expect: no matches
```

Expected:
- `build/index.html` → `data-asset-base-url="/assessment-survey-js/assets"`.
- `manifest.json` `start_url` → `/assessment-survey-js/`.
- No `__BASE_PATH__` token remains anywhere in `build/`.

## 3. Dev and production builds keep the empty base path (no regression)

```powershell
npm run build:production
Select-String -Path build/index.html -Pattern 'data-asset-base-url'   # → "/assets"
(Get-Content build/manifest.json -Raw | ConvertFrom-Json).start_url    # → "/"

npm run build:dev
Select-String -Path build/index.html -Pattern 'data-asset-base-url'   # → "/assets"
```

Expected: values identical to the current committed `index.html` / `manifest.json` (FR-009,
FR-016, SC-002, SC-005).

## 4. Assets resolve under the base path (runtime)

Serve the test build from a sub-path to mimic the test environment:

```powershell
npm run build:test
npx live-server build --mount=/assessment-survey-js:./build
# open http://127.0.0.1:8080/assessment-survey-js/
```

Expected (DevTools → Network):
- Stylesheet, images, and other resolved assets are requested from
  `/assessment-survey-js/assets/...` — none fall back to the domain root (SC-006).

## 5. Offline fallback + PWA under the sub-path

With the test build still served at `/assessment-survey-js/`:

1. Load the page once (lets the service worker install and precache).
2. DevTools → Application → Service Workers: confirm the SW scope is `/assessment-survey-js/`.
3. DevTools → Network → set **Offline**, then refresh.

Expected:
- The cached application shell is served from `/assessment-survey-js/index.html` and the app still
  loads offline (SC-007) — no blank 503.
- DevTools → Application → Manifest shows the start URL under `/assessment-survey-js/` (SC-008).

## 6. Empty-base-path SW sanity (dev/prod unchanged)

```powershell
npm run build:production
npx live-server build   # served at root http://127.0.0.1:8080/
```

Expected: SW scope is `/`, offline fallback serves `/index.html` exactly as before this feature
(FR-016).

## Done when

- Steps 1–6 pass.
- Spec success criteria SC-001…SC-008 are observed.
