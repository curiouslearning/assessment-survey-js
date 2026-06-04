// Wrap CDN import so the rest of the SW still executes if the CDN is
// unreachable (e.g. DevTools offline on first SW activation).
try {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
  );
} catch (e) {
  console.warn('Failed to load workbox from CDN — SW will rely on manual cache matching.', e);
}

if (typeof workbox !== 'undefined') {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, {
    ignoreURLParametersMatching: [/^data/, /^cr_user_id/],
    exclude: [/^lang\//, /coverage\//, /node_modules\//, /test\//, /public\//],
  });

  // Serve index.html for any navigation request that isn't matched by a
  // precache entry (handles the / → index.html mapping on refresh).
  workbox.routing.registerNavigationRoute(
    workbox.precaching.getCacheKeyForURL('index.html')
  );
} else {
  // Workbox failed to load — install a minimal install handler so the SW still
  // precaches index.html and bundle.js manually, giving the app an offline shell.
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('app-shell-fallback').then((cache) =>
        cache.addAll(['/index.html', '/bundle.js'])
      ).catch((err) => console.warn('Fallback shell cache failed:', err))
    );
  });
}

const channel = new BroadcastChannel('as-message-channel');
const version = 1.6;
let cachingProgress = 0;
let cachableAssetsCount = 0;
const debugCaching = true;

self.addEventListener('message', async (event) => {
  console.log('Registration message received in the service worker');
  if (event.data.type === 'Registration') {
    if (!(await caches.keys()).length) {
      cachingProgress = 0;
      const cacheName = await getCacheName(event.data.value);
    }
  }
});

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
  channel.postMessage({ command: 'Activated', data: {} });
});

self.registration.addEventListener('updatefound', () => {
  if (typeof workbox === 'undefined') return;
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      if (cacheName === workbox.core.cacheNames.precache) {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.postMessage({ msg: 'UpdateFound' }));
        });
      }
    });
  });
});

channel.addEventListener('message', async (event) => {
  try {
    if (event.data.command === 'Cache') {
      console.log('Caching request received in the service worker with data:', event.data);
      cachingProgress = 0;
      await cacheTheBookJSONAndImages(event.data.data);
    }
  } catch (error) {
    console.log(error);
  }
});

function updateCachingProgress(bookName) {
  try {
    cachingProgress++;
    const progress = Math.round((cachingProgress / cachableAssetsCount) * 100);
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) =>
        client.postMessage({
          msg: 'Loading',
          data: { progress, bookName },
        })
      );
    });
  } catch (error) {
    console.log(error);
  }
}

async function cacheTheBookJSONAndImages(data) {
  try {
    console.log('Caching the book JSON and images', data);
    const appData = data.appData;
    const cachableAssets = [appData.contentFilePath, ...appData.audioVisualResources];
    cachableAssetsCount = cachableAssets.length;

    console.log('Cachable app assets:', cachableAssets);

    const cache = await caches.open(appData.appName);
    await Promise.all(
      cachableAssets.map(async (asset) => {
        try {
          await cache.add(asset.toLowerCase());
        } catch (error) {
          if (debugCaching) {
            console.log('Error while caching an asset:', asset, error);
          }
        } finally {
          updateCachingProgress(appData.appName);
        }
      })
    );
    console.log('After caching:', cachableAssets);
  } catch (error) {
    console.log("error", error);
  }
}

self.addEventListener('fetch', (event) => {
  try {
    const requestUrl = new URL(event.request.url);

    // Never intercept non-HTTP(S) protocols (chrome-extension, data, etc.)
    if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') return;

    // Never intercept cross-origin requests — external APIs (Firebase, Statsig,
    // Cloudflare, GTM) must reach the network directly; intercepting them offline
    // causes "Failed to convert value to 'Response'" crashes in the SW.
    if (requestUrl.origin !== self.location.origin) return;

    // Never intercept the SW script itself — the browser's update check must reach
    // the network (or fail gracefully). Returning 503 for sw.js would cause the
    // browser to treat the SW update as failed, breaking navigator.serviceWorker.ready.
    if (requestUrl.pathname.endsWith('/sw.js')) return;

    // cache-bust requests must bypass the SW cache entirely so App.ts can do a
    // live version check. Do NOT call event.respondWith — let the browser handle
    // the request natively; App.ts already catches the offline failure.
    if (requestUrl.searchParams.has('cache-bust')) return;

    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          if (response) return response;

          // Navigation fallback: serve the cached index.html for any same-origin
          // page navigation that isn't explicitly in the cache (handles / on refresh).
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html').then(
              (fallback) => fallback || fetch(event.request)
            );
          }

          return fetch(event.request);
        })
        .catch((error) => {
          console.log('Error while fetching:', event.request.url, error);
          // Navigation fallback when network is also unavailable.
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html').then(
              (fallback) => fallback || new Response('', { status: 503, statusText: 'Service Unavailable' })
            );
          }
          // Return a real Response so event.respondWith never receives undefined,
          // which would throw "Failed to convert value to 'Response'".
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        })
    );
  } catch (error) {
    console.log('fetch handler error:', error);
  }
});

// Placeholder function to handle cache name
async function getCacheName(value) {
  return `cache-${version}-${value}`;
}
