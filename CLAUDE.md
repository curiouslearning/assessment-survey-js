# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev                # webpack-dev-server on port 8081

# Build
npm run build:standalone  # production webpack bundle → build/
npm run build:package     # ESM + type declarations → dist/ (published to npm)
npm run build:all         # both of the above

# Test
npm test                  # jest (all tests)
npx jest test/path/to/test.test.ts  # single test file

# Format
npm run format            # prettier --write .
```

## Architecture

This library is a self-contained **assessment/survey player** that supports two modes: adaptive testing (`Assessment`) and linear questionnaire (`Survey`). It ships as both a standalone webpack bundle and an importable npm package (`@curiouslearning/assessment-survey`).

### Entry Points

- [src/index.ts](src/index.ts) — npm package exports (`App`, web component)
- [src/standalone.ts](src/standalone.ts) — standalone app bootstrap
- [src/web-component.ts](src/web-component.ts) — `<assessment-survey-player>` custom element
- [src/App.ts](src/App.ts) — main application controller; orchestrates all subsystems

### Core Data Flow

1. `App.spinUp()` initializes feature flags, resolves UI mode, mounts DOM template
2. `jsonUtils` fetches the data JSON (assessment or survey type) from `dataURL`
3. Either `Assessment` or `Survey` is instantiated and `game.Run(app)` is called
4. On game end, `App` forwards summary data to all registered `hostIntegrationAdapters`

### Game Logic

**`Assessment`** ([src/assessment/assessment.ts](src/assessment/assessment.ts)) — adaptive testing engine:
- Organizes questions into *buckets* (competency levels)
- Uses a binary search tree (BST) to navigate buckets; the search traverses until a ceiling bucket is found
- Search progresses through stages: `BinarySearch → LinearSearchUp / LinearSearchDown`
- Two bucket generation modes: `RandomBST` and `LinearArrayBased`
- Final score derives from the *basal* bucket (highest bucket with all-correct answers)

**`Survey`** ([src/survey/survey.ts](src/survey/survey.ts)) — simple linear iteration; no adaptive algorithm.

Both extend **`BaseQuiz`** ([src/baseQuiz.ts](src/baseQuiz.ts)), which implements a local PubSub (subscribe/publish) and exposes dev-mode controls.

### UI Architecture

There are two interchangeable UI implementations behind the `AssessmentUI` interface ([src/ui/assessment-ui.ts](src/ui/assessment-ui.ts)):

| Mode | Class | Activation |
|---|---|---|
| Legacy | `LegacyAssessmentUIAdapter` → `UIController` | default |
| New drag-drop | `DragDropAssessmentUI` | feature flag `drag-drop-assessment-ui` |

Both share the same DOM template structure (element IDs like `gameWrap`, `qWrap`, `aWrap`, `answerButton1`–`answerButton6`). The feature flag is resolved asynchronously via `@curiouslearning/features` during `App.spinUp()`.

### Key Subsystems

- **Analytics** ([src/analytics/](src/analytics/)) — Firebase + Statsig via `@curiouslearning/analytics`. Singleton `AnalyticsIntegration` emits events: `Initialized`, `Opened`, `BucketCompleted`, `Answered`, `Completed`.
- **Audio** ([src/components/audioController.ts](src/components/audioController.ts)) — preloads and caches audio assets; gated by user interaction unlock. [src/services/drag-drop-audio-controller.ts](src/services/drag-drop-audio-controller.ts) layers drag-and-drop SFX (drag start, return, correct drop) on top of it via the app event bus.
- **App Event Bus** ([src/services/app-event-bus.ts](src/services/app-event-bus.ts)) — PubSub (from `@curiouslearning/core`) singleton carrying drag-and-drop interaction events (`ON_DRAG_START`, `ON_DRAG_RETURN`, `ANSWERED_CORRECTLY`, `DROP_ELEMENT_INTERACTION`) between the drag-drop UI and its audio controller. Distinct from the `BroadcastChannel` in [src/App.ts](src/App.ts), which is used for service-worker cache messaging.
- **DOM Templates** ([src/ui/dom-template/](src/ui/dom-template/)) — template engine that mounts stylesheets and HTML sections. Sections live in `sections/legacy/`, `sections/drag-drop/`, and `sections/shared/`.
- **Feature Flags** — `@curiouslearning/features` (Statsig); initialized async before game starts.
- **Unity Bridge** ([src/utils/unityBridge.ts](src/utils/unityBridge.ts)) — optional integration for Unity game host.
- **Service Worker** — Workbox; `enableServiceWorker` config flag; `wb:inject` injects the manifest post-build.

### Configuration (`AppStartupConfig`)

Key fields passed to `new App(config)`:
- `dataURL` / `dataBaseUrl` — where to fetch assessment/survey JSON
- `assetBaseUrl` — base path for images and audio
- `assessmentUIMode` — `"legacy"` | `"new-ui"` (can be overridden by feature flag)
- `hostIntegrationAdapters` — callbacks: `onLoaded`, `onClose`, `onSummaryData`, `onComplete`, `onRewardTrigger`, `onAssessmentCompleted`
- `enableServiceWorker`, `enableUnityBridge`, `enableAndroidSummary`, `enableParentPostMessage` — opt-in integrations
- `analyticsConfig` — Firebase + Statsig credentials

### Testing Notes

Tests live under [test/](test/) (mirroring `src/` structure, e.g. `test/assessment/assessment.test.ts`), not alongside source files. Jest + ts-jest run in a jsdom environment (`jest.config.js`), with path aliases resolved via `pathsToModuleNameMapper` against `tsconfig.json`. `@curiouslearning/core` and `@curiouslearning/features` are mapped to hand-written mocks in [test/_mocks/](test/_mocks/); `@curiouslearning/analytics` resolves to its real built `dist`. [jest.setup.js](jest.setup.js) globally mocks `BroadcastChannel`, `UnityBridge`, and `fetch`.
