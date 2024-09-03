importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/^data/, /^cr_user_id/],
  exclude: [/^lang\//],
});

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
      // Assuming there's more to do with cacheName later
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
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      if (cacheName === workbox.core.cacheNames.precache) {
        // caches.delete(cacheName);
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.postMessage({ msg: 'UpdateFound' }));
        });
      }
    });
  });
});

channel.addEventListener('message', async (event) => {
  if (event.data.command === 'Cache') {
    console.log('Caching request received in the service worker with data:', event.data);
    cachingProgress = 0;
    await cacheTheBookJSONAndImages(event.data.data);
  }
});

function updateCachingProgress(bookName) {
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
}

async function cacheTheBookJSONAndImages(data) {
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
        updateCachingProgress(appData.appName);
      } catch (error) {
        if (debugCaching) {
          console.log('Error while caching an asset:', asset, error);
        }
      }
    })
  );
  console.log('After caching:', cachableAssets);
}

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.protocol === 'chrome-extension:') return;

  if (requestUrl.searchParams.has('cache-bust')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch((error) => {
        console.log('Error while fetching:', event.request.url, error);
      })
  );
});

// Placeholder function to handle cache name
async function getCacheName(value) {
  // Implement logic for generating cache name based on the value
  return `cache-${version}-${value}`;
}
