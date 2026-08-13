import { precacheAndRoute } from 'workbox-precaching';
import {
  registerUpdateNotifier,
  registerNavigationFallback,
  cacheUrlsWithProgress,
  isCacheBustRequest,
} from '@curiouslearning/sw';

// The app's tsconfig only includes the "dom" lib (browser main-thread), not
// "webworker" — mixing both in one TS program causes global redeclaration
// conflicts (both declare incompatible globals like `self`). Rather than add
// a second tsconfig + webpack rule just for this file, declare the minimal
// worker-scope surface this file actually uses. `ServiceWorkerRegistration`,
// `MessageEvent`, `BroadcastChannel`, `Cache`/`caches`, `Response`, `URL`, and
// `Location` all already come from "dom", since the main thread uses them too.
interface ServiceWorkerSelf extends EventTarget {
  __WB_MANIFEST: Array<string | { url: string; revision: string | null }>;
  location: Location;
  registration: ServiceWorkerRegistration;
  skipWaiting(): Promise<void>;
  clients: {
    claim(): Promise<void>;
    matchAll(options?: {
      includeUncontrolled?: boolean;
      type?: string;
    }): Promise<ReadonlyArray<{ postMessage(message: unknown): void }>>;
  };
  addEventListener(type: string, listener: (event: any) => any): void;
}

declare const self: ServiceWorkerSelf;

export interface CacheModelShape {
  appName: string;
  contentFilePath: string;
  audioVisualResources: Set<string> | string[];
}

precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/^data/, /^cr_user_id/],
});
// Assessments' previous `exclude` (lang/, coverage/, node_modules/, test/, public/) was a
// Workbox v4 precacheAndRoute option; it has no v7 runtime equivalent. It now maps to
// createInjectManifestOptions({ globIgnores: [...] }) in webpack.config.js instead (see §5.4).

registerNavigationFallback(); // '/index.html', enabled: true — same behavior as today

registerUpdateNotifier({ channelName: 'as-message-channel' });
// Explicit channelName so the update-ready signal rides the SAME BroadcastChannel
// Assessments already uses for the Cache/Activated handshake, instead of opening a
// second channel the client would also need to subscribe to. Safe to share: the
// package's ready message is a bare string, and Assessments' own messages are
// object-shaped, so neither side's listener ever matches the other's payload.

const channel = new BroadcastChannel('as-message-channel');

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  channel.postMessage({ command: 'Activated', data: {} });
});

channel.addEventListener('message', async (event: MessageEvent) => {
  if (event.data?.command === 'Cache') {
    await cacheTheBookJSONAndImages(event.data.data);
  }
});

export async function cacheTheBookJSONAndImages(data: { appData: CacheModelShape }): Promise<void> {
  const { appData } = data;
  // Preserve the existing lower-cased lookup key behavior from the hand-rolled loop
  // this replaces (cache.add(asset.toLowerCase())).
  const urls = [appData.contentFilePath, ...appData.audioVisualResources].map((url) => url.toLowerCase());

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

// Resolve a scope-relative URL for the offline shell fallback so the service
// worker works whether the app is served from the domain root or a sub-path
// (e.g. /assessment-survey-js). Mirrors resolveShellUrl in
// build-config/base-path.js. Under root scope this yields "/index.html", so the
// empty-base-path (dev/prod) behavior is unchanged.
function scopePath(file: string): string {
  try {
    return new URL(file, self.registration.scope).pathname;
  } catch (e) {
    return '/' + file;
  }
}

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Never intercept non-HTTP(S) protocols (chrome-extension, data, etc.)
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') return;

  // Never intercept cross-origin requests — external APIs (Firebase, Statsig,
  // Cloudflare, GTM) must reach the network directly.
  if (requestUrl.origin !== self.location.origin) return;

  // Never intercept the SW script itself — the browser's own update check must
  // reach the network.
  if (requestUrl.pathname.endsWith('/sw.js')) return;

  // cache-bust requests must bypass the SW cache entirely so App.ts can do a
  // live version check.
  if (isCacheBustRequest(event.request.url)) return;

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) return response;

        // Navigation fallback: serve the cached index.html for any same-origin
        // page navigation that isn't explicitly in the cache (handles / on refresh).
        if (event.request.mode === 'navigate') {
          return caches.match(scopePath('index.html')).then((fallback) => fallback || fetch(event.request));
        }

        return fetch(event.request);
      })
      .catch((error) => {
        console.log('Error while fetching:', event.request.url, error);
        // Navigation fallback when network is also unavailable.
        if (event.request.mode === 'navigate') {
          return caches
            .match(scopePath('index.html'))
            .then((fallback) => fallback || new Response('', { status: 503, statusText: 'Service Unavailable' }));
        }
        // Return a real Response so event.respondWith never receives undefined,
        // which would throw "Failed to convert value to 'Response'".
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});
