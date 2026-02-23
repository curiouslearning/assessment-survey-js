# Assessment, Survey re-implementation from Curious Learning in Typescript

## [ ] Building the Project

### - First we need to have a Typescript transpiler installed by using the following command:

`npm install -g typescript`

### - The Typescript config is already included in the project, now we need to install the typescript-bundle Typescript bundler tool to be able to use import statements and much more, by using the following command:

`npm install -g typescript-bundle`

### - In order to build the compile/transpile Typescript to Javascript let's use the following command:

`tsc`

### - Now we can move on to bundling the generated Javascript files into one bundle that can be referenced as a script on a page, by using the following command:

`tsc-bundle tsconfig.json`

## [ ] Running the Project

### - Currently the preferred way of running the project is by using the `live-server` command line application that creates a localhost server and hosts the project and enables, more on that [here](https://www.npmjs.com/package/live-server).

```

```

## npm package outputs

This repository now supports two build targets:

- Standalone app bundle (for direct hosting):
	- `npm run build:standalone`
- Package build (for npm distribution):
	- `npm run build:package`

The package build emits ESM JS + type declarations into `lib/`.

## Web component usage (host integration)

The package exports a custom element registration entry.

### Register globally

```ts
import '@curiouslearning/assessment-survey/register';
```

### Render component

```html
<assessment-survey-player
	data-key="zulu-lettersounds"
	user-id="123"
	user-source="host-app"
	asset-base-url="/assets/assessment-survey"
	skip-loading-screen="true"
	enable-service-worker="false"
	enable-unity-bridge="false"
	enable-android-summary="false"
	enable-parent-post-message="false"
></assessment-survey-player>
```

`skip-loading-screen` is recommended in host integration mode when the host app preloads and caches the selected language pack before mounting the component.

### Listen to events

```ts
const player = document.querySelector('assessment-survey-player');

player?.addEventListener('loaded', () => {
	console.log('Assessment loaded');
});

player?.addEventListener('completed', (event: Event) => {
	const customEvent = event as CustomEvent;
	console.log('Assessment completed', customEvent.detail);
});
```

## Load and cache only one selected language

Use a single language/content key at a time (for example: `zulu-lettersounds`).

- Resolve selected key in host app:
	- selectedKey = userSelectedLanguageKey ?? defaultLanguageKey
- Render component with only that key:
	- `data-key="<selectedKey>"`
- Preload and cache only this pack in host service worker:
	- `/assets/assessment-survey/data/<selectedKey>.json`
	- `/assets/assessment-survey/audio/<selectedKey>/**`
	- shared static assets once (`css`, `img`, `animation`)

Recommended host behavior:

- Do not precache all language folders.
- Warm only selected/default language at host startup.
- On language change, invalidate old key and warm new key.
- Track readiness marker by key and content version:
	- `assessment:<selectedKey>:<contentVersion>:ready`

