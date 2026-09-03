# Contract: `build:standalone` script surface

This is the CLI/script contract exposed to developers and CI (analogous to a CLI command schema — there is no HTTP/API surface in this feature).

## Scripts

| Script | `NODE_ENV` | Webpack `mode` | `environment` at runtime | Backward compatibility |
|---|---|---|---|---|
| `npm run build:standalone` | `production` | `production` | `production` | **Unchanged** — same behavior as before this feature; `npm run build` / `build:all` / existing CI jobs keep working with no changes. |
| `npm run build:standalone:develop` | `development` | `development` | `develop` | **New** |
| `npm run build:standalone:test` | `test` | `development` | `test` | **New** |
| `npm run dev` | `development` | `development` | `develop` | Unchanged behavior, just no longer passes a redundant `--mode` CLI flag (webpack.config.js now derives `mode` from `NODE_ENV` itself — see research.md §2). |

## Guarantees

1. Every script above produces a bundle whose loaded `environment` constant matches the table's third column — this is the automated check referenced by SC-001.
2. `build:standalone:test` output additionally resolves its own image/audio assets under `/assessment-survey-js/assets` (see the base-path contract below); `build:standalone` and `build:standalone:develop` output resolve assets under `/assets` exactly as today.
3. No script other than the three `build:standalone*` variants and `dev` changes behavior — `build:package`, `build:all`, `wb:inject`, `test`, `format` are untouched.

## Base path contract

| Mode | Asset base path baked into the bundle |
|---|---|
| `develop` | `/assets` |
| `production` | `/assets` |
| `test` | `/assessment-survey-js/assets` |

`index.html`'s *source* is identical across all three deploys (no per-environment templating, and the `data-asset-base-url` attribute mechanism itself is unchanged). The differing base path is injected into that attribute's value on the *copied* `build/index.html` by a `CopyWebpackPlugin` `transform` step in `webpack.config.js`, per build mode — not baked into the compiled bundle's JS as a fallback default. See research.md §3a.
