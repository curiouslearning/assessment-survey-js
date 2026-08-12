# Contract: Build Scripts & BASE_PATH Input

Defines the command interface this feature exposes to developers and CI.

## npm scripts (added to `package.json`)

| Script | Base path | Behavior |
|--------|-----------|----------|
| `build:dev` | `""` | Development-mode build (equivalent to today's `build`/`dev` output layout) with empty base path |
| `build:test` | `/assessment-survey-js` | Production-mode build with the test sub-path base path |
| `build:production` | `""` | Production-mode build with empty base path — equivalent to today's `build` |

### Contract details

- Each script MUST set `BASE_PATH` for the build process (via `cross-env`) and MUST run the same
  underlying build pipeline as the current default build (standalone webpack build + `wb:inject`),
  so a base-path change never diverges the pipelines.
- `build:dev` MUST use `NODE_ENV=development`; `build:test` and `build:production` MUST use
  `NODE_ENV=production`.
- Invoking a build with no `BASE_PATH` set MUST behave as `BASE_PATH=""` (FR-002).
- The existing `build` script MUST continue to produce empty-base-path output (no regression); it MAY
  delegate to `build:production`.

### Expected script shape (illustrative, not prescriptive)

```jsonc
{
  "build:dev":        "cross-env NODE_ENV=development BASE_PATH= webpack -c webpack.config.js --mode=development && npm run wb:inject",
  "build:test":       "cross-env NODE_ENV=production  BASE_PATH=/assessment-survey-js webpack -c webpack.config.js --mode=production && npm run wb:inject",
  "build:production": "cross-env NODE_ENV=production  BASE_PATH= webpack -c webpack.config.js --mode=production && npm run wb:inject"
}
```

> The exact composition (whether each script chains `wb:inject` directly or reuses
> `build:standalone`) is an implementation choice for tasks; the observable contract is the base
> path and mode each script applies.

## Webpack input contract

- `webpack.config.js` MUST read `process.env.BASE_PATH` and treat unset/empty as `""`.
- The resolved base path MUST be injected into the copied `index.html` and `manifest.json` (see
  [produced-artifacts.md](./produced-artifacts.md)).

## Acceptance (maps to spec)

- Running `build:test` → produced artifact carries base path `/assessment-survey-js` (FR-005, SC-001).
- Running `build:dev` / `build:production` → produced artifact carries base path `""` (FR-003,
  FR-004, SC-002).
- Overriding `BASE_PATH` on any script changes the produced base path with no source edits (FR-007,
  SC-004).
