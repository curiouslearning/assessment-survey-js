# Contract: Produced Artifacts

Defines the observable output guarantees of a build for a given base path. These are verifiable by
inspecting files in `build/` after a build, without running a browser.

## Inputs

- `basePath` — `""` (dev/production) or `/assessment-survey-js` (test).

## `build/index.html`

- MUST contain exactly one application root element carrying `data-asset-base-url`.
- Value MUST be `<basePath>/assets`:
  - basePath `""` → `data-asset-base-url="/assets"` (identical to current committed `index.html`).
  - basePath `/assessment-survey-js` → `data-asset-base-url="/assessment-survey-js/assets"`.
- No `__BASE_PATH__` placeholder token may remain in the produced file.
- All other static references (`bundle.js`, `assets/css/style.css`, `manifest.json`, loading image)
  remain relative and unchanged.

## `build/manifest.json`

- `start_url` MUST be `<basePath>/`:
  - basePath `""` → `"/"` (unchanged from current committed manifest).
  - basePath `/assessment-survey-js` → `"/assessment-survey-js/"`.
- The icon `src` remains relative (`assets/img/red_bird_256.webp`) and unchanged.
- No `__BASE_PATH__` placeholder token may remain in the produced file.

## `build/sw.js` (runtime behavior)

The service worker MUST resolve its offline fallbacks relative to its own registration scope, so:

- Offline navigation fallback serves the cached application shell under the scope
  (`<scope>index.html`), not a hard-coded root `/index.html`.
- The minimal fallback precache (used only when the Workbox CDN fails to load) caches the shell and
  bundle under the scope, not root-absolute paths.
- The precache manifest entries (injected by `workbox injectManifest`) remain relative and resolve
  against scope.

**Empty-base-path equivalence**: with basePath `""`, the scope is the origin root, so every SW
behavior above resolves to the same URLs as today (`/index.html`, `/bundle.js`) — no observable
change for dev/production (FR-016).

**Deployment precondition**: the build root (including `sw.js`) MUST be served under `<basePath>` so
`registration.scope` equals the base path (FR-017). For test this means hosting the build at
`/assessment-survey-js/`.

## Verification hooks (used by quickstart & tests)

| Check | Command / method |
|-------|------------------|
| index.html base URL | grep `data-asset-base-url` in `build/index.html` |
| manifest start_url | read `start_url` in `build/manifest.json` |
| no leftover token | grep `__BASE_PATH__` across `build/` returns nothing |
| SW scope-relative fallback | unit spec on the shell-URL derivation given a scope; runtime offline check in quickstart |
