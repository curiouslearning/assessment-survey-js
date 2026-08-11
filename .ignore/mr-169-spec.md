MR-169: Integrate @curiouslearning/sw into Assessments (assessment-survey-js)
Status: Draft for review Ticket: MR-169 — Integrate service worker package into Assessments Depends on: MR-168 — Extract FTM service worker fix into a standalone package (Done, published) Parent epic: MR-167 — Package FTM service worker update fix for reuse across sub-apps Repo: curiouslearning/assessment-survey-js Package: @curiouslearning/sw@1.0.0 (peer deps: workbox-core/workbox-precaching/workbox-routing ^7.4.1)


1. Summary
Assessments currently ships a hand-rolled service worker built against Workbox 4.3.1, loaded at runtime from a Google-hosted CDN via importScripts, with an update-notification bug class that @curiouslearning/sw was extracted specifically to fix (stale-cache reloads because "update available" fired before the new worker had actually taken control). This doc specifies:

Upgrading the precaching/routing layer to Workbox 7.4.1 (current latest), replacing the CDN importScripts pattern with npm-installed, bundled Workbox modules.
Replacing the custom update-notification logic (both worker- and client-side) with @curiouslearning/sw's registerUpdateNotifier / registerServiceWorkerUpdates.
Replacing the hand-rolled navigation fallback and bulk-asset-caching loop with registerNavigationFallback and cacheUrlsWithProgress.
Switching the build pipeline from workbox-cli's injectManifest (which cannot bundle node_modules imports into the SW script) to workbox-webpack-plugin's InjectManifest, using createInjectManifestOptions() — the pattern the package's own README documents.
Reconciling the two message-transport mechanisms Assessments currently runs in parallel (BroadcastChannel and native navigator.serviceWorker postMessage) so update-notification moves onto the package's BroadcastChannel-based contract without breaking the existing content-caching handshake.

Nothing about the content-caching protocol (Cache / Activated commands, Loading progress messages, cache-bust version checks) needs to change shape from the client's point of view — this is an internal implementation swap, not a wire-protocol change, except where noted in §5.


2. Current state (as of main)
2.1 Worker source — sw-src.js
Loads Workbox from CDN: importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'), wrapped in try/catch with a manual fallback install handler if the CDN is unreachable.
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, { ignoreURLParametersMatching, exclude }).
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL('index.html')) for SPA navigation fallback.
A BroadcastChannel('as-message-channel') used for the Cache (client → worker) / Activated (worker → client) content-caching handshake.
self.registration.addEventListener('updatefound', …) inspects caches.keys() for the Workbox precache name and, if found, messages all clients directly (client.postMessage({ msg: 'UpdateFound' })) — this runs on every updatefound, including first install, and is the exact bug class MR-168 fixed in the FTM copy of this file.
cacheTheBookJSONAndImages() hand-rolls a Promise.all over [contentFilePath, ...audioVisualResources], calling cache.add() per item and reporting progress via client.postMessage({ msg: 'Loading', data: { progress, bookName } }).
A manual fetch handler with same-origin/protocol guards, an sw.js-self exclusion, a cache-bust bypass, and a navigate-mode fallback to /index.html.
2.2 Client source — src/App.ts
import { Workbox } from 'workbox-window'; new Workbox('./sw.js', {}).register().
A module-level BroadcastChannel('as-message-channel') posts { command: 'Cache', data: { appData: this.cacheModel } } and listens for { command: 'Activated' } to re-trigger caching if nothing is cached yet.
A module-level navigator.serviceWorker message listener (handleServiceWorkerMessage) branches on event.data.msg: 'Loading' (legacy UIController progress path) and 'UpdateFound' (blocking confirm() → location.reload()).
An instance-bound swMessageHandler duplicates the 'Loading' branch for the new-UI assessmentUI progress path.
A cache-bust fetch against the content file drives the "is there new content" check independently of the SW update lifecycle — this stays as-is, it's orthogonal to this migration.
2.3 Build pipeline
webpack.config.js bundles the app entry (src/standalone.ts) only; it does not touch sw-src.js.
workbox-config.js (consumed by the workbox-cli package, not a webpack plugin) defines globDirectory: 'build/', globPatterns, globIgnores, maximumFileSizeToCacheInBytes: 10 MiB, swSrc: 'sw-src.js', swDest: 'build/sw.js'.
npm run build = build:standalone (webpack) → wb:inject (workbox injectManifest, a raw file copy + manifest string injection, no bundling/transpilation of sw-src.js itself).
package.json already lists workbox-core@^7.0.0 and workbox-window@^7.0.0 as dependencies — installed but effectively dead weight today, since the SW itself loads Workbox 4.3.1 from the CDN instead. This version skew (7.0.0 in node_modules, 4.3.1 actually running in the worker) is itself worth calling out as a latent bug independent of this ticket.
2.4 Why workbox-cli injectManifest won't work with an npm-imported SW helper
workbox-cli injectManifest only string-replaces the self.__WB_MANIFEST placeholder in swSrc and copies the file to swDest — it does not run a bundler over swSrc. @curiouslearning/sw's own README example uses workbox-webpack-plugin's InjectManifest, which runs a full webpack compilation (with its own resolver/loader chain) over swSrc, so import { registerUpdateNotifier } from '@curiouslearning/sw' — and Workbox's own package imports — resolve correctly. This is a required, not optional, part of the migration: without it, sw-src.ts cannot import any npm package at all.


3. @curiouslearning/sw@1.0.0 — API being consumed
Export
Side
Purpose
registerUpdateNotifier(options?)
worker
Replaces the updatefound listener. Computes isUpdate = !!self.registration.active synchronously at evaluation time, and only broadcasts the ready message after self.clients.claim() resolves — never on first install. Throws TypeError if called outside SW scope.
registerServiceWorkerUpdates(options)
client
Replaces new Workbox('./sw.js').register(). Registers the SW, opens a matching BroadcastChannel, and reacts per mode ('confirm' default / 'silent' / 'custom'). Also calls registration.update() once navigator.serviceWorker.ready resolves (callUpdateOnReady, default true).
cacheUrlsWithProgress(cache, urls, options?)
worker
Replaces the hand-rolled Promise.all bulk-cache loop. Per-item failures are tolerated (reported via onItemError, never reject the overall promise) — matches current behavior. Supports batchSize / delayBetweenBatchesMs / timeoutMs, which Assessments doesn't have today.
createInjectManifestOptions(overrides?)
build
Pure/synchronous. Merges { swSrc: 'src/sw-src.js', swDest: 'build/sw.js', globDirectory: 'build/', maximumFileSizeToCacheInBytes: 10 MiB } with app-specific overrides, for use with workbox-webpack-plugin's InjectManifest.
isCacheBustRequest(url)
worker
Pure/synchronous. Checks for the cache-bust query param — identical semantics to Assessments' inline check.
registerNavigationFallback(options?)
worker
Replaces registerNavigationRoute(getCacheKeyForURL(...)). Default fallbackUrl: '/index.html', enabled: true.
DEFAULT_CHANNEL_NAME / DEFAULT_READY_MESSAGE / CACHE_BUST_PARAM / SwMessageType / UpdateMode
both
Shared constants/types — import instead of redeclaring string literals.


Runtime behavior worth calling out explicitly (verified from the published build), since it drives the rewiring in §5:

registerUpdateNotifier posts the ready message as a bare string (channel.postMessage('UpdateReady')), not an object — different from Assessments' current { msg: 'UpdateFound' } object shape.
registerServiceWorkerUpdates's internal channel listener does event.data === readyMessage (strict equality against that bare string) — any other message shape on the same channel is silently ignored, which is what makes channel-sharing with Assessments' existing Cache/Activated protocol safe (see §5.2).
Neither function touches self.skipWaiting(), the install event, or any content-caching concern — those remain fully owned by Assessments' own code.


4. Target architecture
src/
  sw-src.ts                 (renamed from sw-src.js; now bundled, not raw-copied)
  App.ts                    (client-side registration + messaging, rewired)
webpack.config.js           (adds InjectManifest via workbox-webpack-plugin)
workbox-config.js           (removed — options move into webpack.config.js via createInjectManifestOptions())
package.json                (dependency changes — see §6)
4.1 src/sw-src.ts (new)
import { precacheAndRoute } from 'workbox-precaching';
import {
  registerUpdateNotifier,
  registerNavigationFallback,
  cacheUrlsWithProgress,
  isCacheBustRequest,
} from '@curiouslearning/sw';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/^data/, /^cr_user_id/],
});
// Assessments' existing `exclude` (lang/, coverage/, node_modules/, test/, public/) is a
// build-time glob concern, not a runtime precacheAndRoute option — it maps to
// createInjectManifestOptions({ globIgnores: [...] }) in webpack.config.js instead (§4.3).

registerNavigationFallback(); // '/index.html', enabled: true — same behavior as today

registerUpdateNotifier({ channelName: 'as-message-channel' });
// Explicit channelName so the update-ready signal rides the SAME BroadcastChannel
// Assessments already uses for the Cache/Activated handshake, instead of introducing
// a second channel the client would also need to open. See §5.2 for why this is safe.

const channel = new BroadcastChannel('as-message-channel');
const version = 1.6; // unchanged — still referenced by getCacheName() below if kept

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  channel.postMessage({ command: 'Activated', data: {} });
});
// Unchanged from today. registerUpdateNotifier() attaches its OWN 'activate' listener
// and also calls clients.claim() — calling it twice is harmless (idempotent) but if a
// cleaner single-claim path is preferred, this can be dropped in favor of composing off
// registerUpdateNotifier's activation promise; not required for correctness.

channel.addEventListener('message', async (event) => {
  if (event.data?.command === 'Cache') {
    await cacheTheBookJSONAndImages(event.data.data);
  }
});

async function cacheTheBookJSONAndImages(data: { appData: CacheModelShape }) {
  const { appData } = data;
  const urls = [appData.contentFilePath, ...appData.audioVisualResources];

  const cache = await caches.open(appData.appName);
  await cacheUrlsWithProgress(cache, urls, {
    onProgress: (progress) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ msg: 'Loading', data: { progress, bookName: appData.appName } })
        );
      });
    },
    onItemError: (url, error) => console.warn('Failed to cache asset:', url, error),
  });
}

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') return;
  if (requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.endsWith('/sw.js')) return;
  if (isCacheBustRequest(event.request.url)) return; // was: requestUrl.searchParams.has('cache-bust')

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html').then((fallback) => fallback || fetch(event.request));
      }
      return fetch(event.request);
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html').then(
          (fallback) => fallback || new Response('', { status: 503, statusText: 'Service Unavailable' })
        );
      }
      return new Response('', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});

What's deliberately dropped, and why:

The try/catch CDN-load fallback and its manual "install a minimal shell cache if Workbox failed to load" branch — gone, because Workbox is now bundled at build time, not fetched at runtime. There is no more "CDN unreachable" failure mode to guard against.
self.registration.addEventListener('updatefound', …) — replaced entirely by registerUpdateNotifier().
The workbox.core.cacheNames.precache cache-name comparison inside the old updatefound handler — no longer needed; registerUpdateNotifier doesn't inspect cache contents at all, it uses self.registration.active.
registerNavigationRoute(getCacheKeyForURL('index.html')) — replaced by registerNavigationFallback().
4.2 src/App.ts (rewired)
import { registerServiceWorkerUpdates } from '@curiouslearning/sw';
// Remove: import { Workbox } from 'workbox-window';

// ...inside registerServiceWorker(), replacing the `new Workbox(...).register()` block:

if ('serviceWorker' in navigator) {
  const registration = await registerServiceWorkerUpdates({
    swUrl: './sw.js',
    channelName: 'as-message-channel',
    mode: 'confirm', // package default; see §5.3 for the UX-copy tradeoff
  }).catch((err) => {
    console.log('Service worker registration failed: ' + err);
    return undefined;
  });

  if (registration) {
    this.handleServiceWorkerRegistation(registration);
  }

  // Loading-progress plumbing is UNCHANGED — still native postMessage, still both
  // the legacy handleServiceWorkerMessage() path and the instance-bound
  // swMessageHandler path for the new UI. Only the update-notification branch
  // inside handleServiceWorkerMessage() is removed (see below).

  navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
  // ...swMessageHandler wiring unchanged...

  await navigator.serviceWorker.ready;
  // ...cache-bust content-version check unchanged...
  // ...broadcastChannel Cache/Activated handshake unchanged...
}

// Module-level handler — remove the 'UpdateFound' branch entirely:
function handleServiceWorkerMessage(event): void {
  if (event.data.msg == 'Loading') {
    const progressValue = parseInt(event.data.data.progress);
    handleLoadingMessage(event, progressValue);
  }
  // 'UpdateFound' branch removed — registerServiceWorkerUpdates now owns this signal
  // end-to-end via its BroadcastChannel listener + built-in confirm()/reload.
}

// handleUpdateFoundMessage() can be deleted if mode: 'confirm' is adopted (§5.3),
// or kept and passed as `onUpdateAvailable` if mode: 'custom' is adopted instead.

this.handleServiceWorkerRegistation() (the registration.installing.postMessage({type:'Registartion', value:this.lang}) call) is unrelated to update-notification and stays exactly as-is — it fires off the registration object registerServiceWorkerUpdates resolves with, same as wb.register()'s resolved value did.
4.3 webpack.config.js
const { InjectManifest } = require('workbox-webpack-plugin');
const { createInjectManifestOptions } = require('@curiouslearning/sw');

// ...existing config...
plugins: [
  // ...existing CopyWebpackPlugin...
  new InjectManifest(createInjectManifestOptions({
    swSrc: path.resolve(__dirname, 'src', 'sw-src.ts'),
    swDest: 'sw.js', // relative to output.path (buildPath), matching current build/sw.js
    globDirectory: buildPath,
    globPatterns: [
      '**/*.{wav,mp3,gif,WAV,png,webp,otf,jpg,jpeg,js,json,css,html,svg}',
      '**/manifest.json',
    ],
    globIgnores: [
      'assets/audio/*/*.mp3',
      'assets/audio/*/*.wav',
    ],
    // maximumFileSizeToCacheInBytes: inherited from the package default (10 MiB) —
    // identical to today's explicit value, no override needed.
  })),
],

workbox-config.js is deleted; its swSrc/swDest/globDirectory/globPatterns/globIgnores/maximumFileSizeToCacheInBytes all move here as InjectManifest options via createInjectManifestOptions(). The workbox-*.js / workbox-*.js.map self-exclusion glob entries are dropped since workbox-cli (which generated those extra files at swDest's sibling location) is no longer in the pipeline.
sw-src.ts now goes through webpack's own module resolution/TS loader, so it can import both @curiouslearning/sw and workbox-precaching directly — this is the part that makes the whole migration possible (§2.4).
4.4 package.json
Add (dependencies):

@curiouslearning/sw@^1.0.0
workbox-precaching@^7.4.1
workbox-routing@^7.4.1
workbox-webpack-plugin@^7.4.1 (devDependency — build-time only)

Bump:

workbox-core: ^7.0.0 → ^7.4.1 (align with the package's peer-dependency requirement and with the CDN version actually being replaced)

Remove:

workbox-window (no longer used — registerServiceWorkerUpdates calls navigator.serviceWorker.register directly)
workbox-cli (replaced by workbox-webpack-plugin)

Scripts:

Delete wb:inject.
build becomes just build:standalone (webpack now emits sw.js itself via the InjectManifest plugin, in the same pass as the app bundle) — no more two-step build:standalone && wb:inject.
dev / the webpack-serve script: today's dev server has no SW-rebuild story at all (that's exclusive to npm run build), so this is also an opportunity to get InjectManifest running in watch mode for free, which Assessments doesn't have today. Flagging as a nice-to-have, not blocking this ticket.


5. Rewiring details & edge cases
5.1 Version-skew bug fixed as a side effect
Today node_modules has Workbox ^7.0.0/^7.0.0 (window/core) installed, but the SW itself runs Workbox 4.3.1 from the CDN — a 3-major-version skew that happens to work only because the CDN script is self-contained. This migration eliminates the skew entirely: everything is pinned to ^7.4.1 and bundled from node_modules.
5.2 Why sharing channelName: 'as-message-channel' between the package and the app's own protocol is safe
Assessments multiplexes two message shapes on this channel today: { command: 'Activated', data: {} } and { command: 'Cache', data: {...} }. @curiouslearning/sw adds a third, bare-string shape ('UpdateReady'). Cross-checked against both sides' listener logic:

The app's existing broadcastChannel.onmessage handler does event.data.command == 'Activated' — reading .command off a string primitive returns undefined in JS, so the package's bare-string message is silently ignored, no crash, no false match.
registerServiceWorkerUpdates's internal listener does event.data === readyMessage (strict equality) — the app's object-shaped messages will never strictly equal a string, so they're ignored the same way.

Net effect: one shared BroadcastChannel, three message shapes, zero cross-talk. This was verified against the package's actual compiled output, not just its README, since this is exactly the kind of thing that's easy to get wrong from documentation alone.

Alternative considered and rejected: leaving channelName unset (defaulting to DEFAULT_CHANNEL_NAME, 'sw-update-channel') would open a second BroadcastChannel purely for the update signal. This works too and arguably has cleaner separation of concerns, at the cost of one extra channel + one extra client-side subscription the app doesn't otherwise need. Recommendation is to reuse 'as-message-channel' as shown above, but this is a low-stakes call either way — flagging for reviewer preference.
5.3 Update-notification UX copy: 'confirm' mode vs 'custom' mode
Today's dialog copy is bespoke:

"Update Found.\nPlease accept the update by pressing Ok." (and a distinct, currently-unused "next launch" message on decline)

The package's built-in 'confirm' mode shows:

"A new version of this app is available. Reload now?"

Two options, both fully supported by the package:

Adopt mode: 'confirm' (recommended, shown in §4.2). Simplest integration, matches the pattern the package's own README calls out as behavior-preserving for both FTM and Assessments. Net change: dialog copy differs slightly; the reload-on-accept / no-op-on-decline behavior is identical.
Adopt mode: 'custom' + keep handleUpdateFoundMessage() as onUpdateAvailable, to preserve the exact current copy verbatim. Requires onUpdateAvailable to be provided (the package throws synchronously otherwise) and means the app still owns the confirm()/reload() call, not the package.

This doc defaults to option 1 for §4.2; swap to option 2 by changing mode: 'confirm' → mode: 'custom', onUpdateAvailable: handleUpdateFoundMessage if exact-copy preservation is a requirement.
5.4 globIgnores for language/coverage/test/public directories
The current sw-src.js's exclude: [/^lang\//, /coverage\//, /node_modules\//, /test\//, /public\//] was a precacheAndRoute runtime option in Workbox v4's workbox-sw wrapper. In Workbox 7, precacheAndRoute has no exclude option — the equivalent concept is a build-time glob exclusion, which is what workbox-config.js's globIgnores already partially covers (audio files only, today). Recommend folding the lang/, coverage/, node_modules/, test/, public/ patterns into globIgnores in the new createInjectManifestOptions() call in webpack.config.js (§4.3) so the precache manifest itself never contains those paths, which is strictly stronger than filtering them out at precacheAndRoute time.
5.5 cacheUrlsWithProgress behavior differences from today's hand-rolled loop
Same: unconditional concurrency (no batchSize passed) by default, individual failures tolerated and reported without rejecting the batch, progress computed as round(completed / total * 100).
New, opt-in, not required for this ticket: timeoutMs (per-item fetch timeout — today's loop has none, so a hung request can stall a Loading percentage indefinitely) and batchSize/delayBetweenBatchesMs (today's loop fires every asset concurrently with no throttling, which the FTM package's audio-heavy caching flows were specifically built to support). Recommend leaving both unset for parity in this ticket, and filing a fast-follow if Assessments wants to adopt throttling for large-content-set languages.
Behavior change to flag: the old code's per-item console.log('Error while caching an asset:', ...) only fired if (debugCaching), a module-level const debugCaching = true that was always true in practice (dead flag). onItemError in the new code always logs — net effect is unchanged in practice, but worth noting since the toggle itself is being removed.
5.6 sw-src.js → sw-src.ts
Renaming to .ts is not strictly required (the package ships plain JS-compatible ESM/CJS and works from a .js source), but is recommended since: (a) it lets the SW source pick up the package's .d.ts types directly rather than relying on JSDoc, (b) the rest of src/ is already TypeScript, and (c) ServiceWorkerGlobalScope typing catches the class of self.registration undefined-access bugs this whole package exists to prevent.


6. File-by-file change list
File
Change
sw-src.js → src/sw-src.ts
Rewritten per §4.1. Moves under src/ so webpack picks it up as a normal module graph entry via InjectManifest.
src/App.ts
Rewritten per §4.2. Drop workbox-window import, handleServiceWorkerMessage's 'UpdateFound' branch, and (if mode: 'confirm') handleUpdateFoundMessage.
webpack.config.js
Add InjectManifest plugin per §4.3.
workbox-config.js
Deleted — options folded into webpack.config.js.
package.json
Dependency/script changes per §4.4.
test/src/App.test.ts
Update mocks: replace any workbox-window/Workbox mock with a registerServiceWorkerUpdates mock; add coverage for the mode: 'confirm' reload path if not already present.
New: test/sw-src.spec.ts (or equivalent, colocated per the package's own convention)
Unit-test the rewritten cacheTheBookJSONAndImages against a mocked cacheUrlsWithProgress, and the fetch handler's isCacheBustRequest branch.



7. Acceptance criteria mapping (from MR-169)
Scenario
How this design satisfies it
Assessments picks up new content after update — cached user reconnects, SW serves new content instead of stale cache
Unaffected by this migration: the cache-bust content-version fetch in App.ts (§2.2, unchanged) is what actually detects new content and clears localStorage/caches; registerUpdateNotifier/registerServiceWorkerUpdates only fix the notification path (telling the user a new SW is ready), not the content-freshness check itself. Both together mean a reconnecting user both (a) gets fresh content via the existing version check and (b) gets a correctly-timed "update available" prompt instead of the pre-MR-168 bug's premature/on-install false positive.
Assessments still works offline — cached content loads with no connection
precacheAndRoute (Workbox 7.4.1, bundled) + registerNavigationFallback() preserve the existing precache-and-fallback-to-index.html behavior; the fetch handler's cache-first/network-fallback logic is carried over unchanged (§4.1).



8. Rollout / verification plan
Build verification: npm run build produces build/sw.js with the Workbox 7.4.1 manifest injected and no CDN importScripts call anywhere in the output; npm run typecheck passes with sw-src.ts included.
Fresh install: clear all site data, load the app, confirm content precaches and the app works with DevTools offline mode toggled on immediately after first load.
Update path: deploy a build, load it, deploy a second build, reload the tab (not close/reopen) — confirm the update dialog appears only after the new SW has activated and claimed clients (not on first install, not before activation) — this is the exact regression MR-168 was written to prevent, so it's the highest-value manual check in this rollout.
Bulk-caching UX: trigger the Cache handshake on a language with a large asset set, confirm Loading percentage messages still drive both the legacy UIController and assessmentUI progress paths identically to today, and confirm a deliberately-broken asset URL is tolerated (reported, doesn't block the rest of the batch) — same as current debugCaching behavior.
Cache-bust: confirm requests with ?cache-bust=… still bypass the SW cache entirely (network tab shows no SW interception) via isCacheBustRequest.
Existing test/src/App.test.ts / test/components/cacheModel.test.ts suites updated and green (see §6).
9. Open questions for reviewer
§5.2: reuse 'as-message-channel' for the update signal, or give the package its own dedicated channel?
§5.3: mode: 'confirm' (package-default copy) vs mode: 'custom' (preserve exact current dialog text)?
§5.5: adopt batchSize/timeoutMs throttling now, or fast-follow ticket?
Should workbox-core's version bump (^7.0.0 → ^7.4.1) and the InjectManifest dev-mode watch improvement (§4.4) be split into a separate, smaller PR ahead of the main rewire, to isolate risk?

