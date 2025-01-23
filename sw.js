importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

workbox.precaching.precacheAndRoute([{"revision":"76a23e80ae39c4a2aaa42c61e7ef3397","url":"animation/SoundButton.gif"},{"revision":"4c4db15bdb825e674e18abf4a348a957","url":"animation/Star.gif"},{"revision":"899ea8483c28270ca7835460bdd4da33","url":"coverage/lcov-report/base.css"},{"revision":"e3e16775ec854aa3ef7fadd09056943c","url":"coverage/lcov-report/block-navigation.js"},{"revision":"8c814a46f24208d0bc459bb2cf8b7b88","url":"coverage/lcov-report/favicon.png"},{"revision":"fbe517f913062784fafcc2f5a800bff4","url":"coverage/lcov-report/index.html"},{"revision":"31f0c9da5ac09f2563cab46ebc6e445a","url":"coverage/lcov-report/prettify.css"},{"revision":"6051903a2f7363ee232a01bd32f60b6a","url":"coverage/lcov-report/prettify.js"},{"revision":"fd08a5625d21e34b1d6d9c026f2728a9","url":"coverage/lcov-report/sort-arrow-sprite.png"},{"revision":"24cab317b3dc4f1852a276d6152ac6fe","url":"coverage/lcov-report/sorter.js"},{"revision":"d0bb84e2d4a72425ffd64dc757c088b4","url":"coverage/lcov-report/src/App.ts.html"},{"revision":"7292886ea54a36232f7c81f0e67572f2","url":"coverage/lcov-report/src/assessment/assessment.ts.html"},{"revision":"a53ef639eea99c996dad5685b545c408","url":"coverage/lcov-report/src/assessment/index.html"},{"revision":"44889448e84ff6f9b5d0d7c5c007c0c1","url":"coverage/lcov-report/src/baseQuiz.ts.html"},{"revision":"2563a4b5a455c1a09a7a9bbf11179b13","url":"coverage/lcov-report/src/components/analyticsEvents.ts.html"},{"revision":"20f9ec95d9cccf4bb99c7a56ef30b645","url":"coverage/lcov-report/src/components/audioController.ts.html"},{"revision":"df6bc8d48fa70453e53d3a0285905990","url":"coverage/lcov-report/src/components/cacheModel.ts.html"},{"revision":"18e691b3a0a784030793f90bd4de0d0e","url":"coverage/lcov-report/src/components/index.html"},{"revision":"3df1e0c36eadfca4c63afa19d94d18eb","url":"coverage/lcov-report/src/components/jsonUtils.ts.html"},{"revision":"2bcfb31442596e22f768697c4901dd08","url":"coverage/lcov-report/src/components/mathUtils.ts.html"},{"revision":"7873ab10dd6f72202109578ef097b174","url":"coverage/lcov-report/src/components/tNode.ts.html"},{"revision":"85024bdb484dadb7c11e26026ecd162c","url":"coverage/lcov-report/src/components/uiController.ts.html"},{"revision":"63dc7444e8023dbbf72e212da21ddf07","url":"coverage/lcov-report/src/components/unityBridge.ts.html"},{"revision":"6d650769822e44cfd72acfcc8b0093ba","url":"coverage/lcov-report/src/components/urlUtils.ts.html"},{"revision":"376b704231bee4a091287c1a624209c7","url":"coverage/lcov-report/src/index.html"},{"revision":"ae057ff7452f1f1bad532f00034e2ddc","url":"coverage/lcov-report/src/survey/index.html"},{"revision":"1d5b5625db36534366ad7fe22eb9c293","url":"coverage/lcov-report/src/survey/survey.ts.html"},{"revision":"3e1a164df7f07e0cd1eb52ea50f5cf2c","url":"css/style.css"},{"revision":"eae4a7be9f547209a3dc48904e55260a","url":"dist/audio/Correct.wav"},{"revision":"91e88a363e10ae85a31ae90c2bfb5405","url":"dist/bundle.js"},{"revision":"d6223ad2dfebbfe22e932087e0ec74f0","url":"dist/images/red_bird_256.webp"},{"revision":"2364a2746dbef47fa2601198fe4ed894","url":"img/bg_crayon-1.png"},{"revision":"0eb874baac10d2a76c7cc657c756acdf","url":"img/bg_v01.jpg"},{"revision":"56484ec92a16940b09c0d9fea2e4b11b","url":"img/chest.png"},{"revision":"1ef5344f23677707c7e36c73315a94f3","url":"img/chestprogression/TreasureChestOpen01.svg"},{"revision":"2aaa81018da01b60b5b6fb10d991459f","url":"img/chestprogression/TreasureChestOpen02.svg"},{"revision":"b4495f4118ae899401da67a38800a288","url":"img/chestprogression/TreasureChestOpen03.svg"},{"revision":"21330891658b0ce32e88c3c8b81ba30b","url":"img/chestprogression/TreasureChestOpen04.svg"},{"revision":"0ab4538bcfd8f9ed476513dedfc4758a","url":"img/hill_v01.png"},{"revision":"38e43cd7b492b624fc3da67dea7b0433","url":"img/loadingImg.gif"},{"revision":"dc33b481685304c43d152362955b01f9","url":"img/monster.png"},{"revision":"7a035d74af694190f3d233f90c6ce0ba","url":"img/peekingMonster.js"},{"revision":"170509d816893abd3325fab85f381e0c","url":"img/sound-play-button.svg"},{"revision":"1fad224fb52226167c2dc8dc26677d91","url":"img/SoundButton_Idle.png"},{"revision":"661436020109cdff73c212999abc4226","url":"img/star_after_animation.gif"},{"revision":"715c1be769f3bd2dddae2c9ef90123d1","url":"img/star.png"},{"revision":"84c3712df9d326804590b3f554d44565","url":"img/survey/apartment building.jpeg"},{"revision":"4a8225b84684850639993770826efe19","url":"img/survey/auto_rickshaw.jpeg"},{"revision":"c3b8df83a8fafeb717f28dafd7a5aeaa","url":"img/survey/basket.jpeg"},{"revision":"087f1040b937c6e30791ef76ea3a0cd8","url":"img/survey/car.jpeg"},{"revision":"bddb1d32c7021d01e3cb648671331d6d","url":"img/survey/ceiling fan.jpeg"},{"revision":"89dd029b859a2cf38b1811f9b4be1139","url":"img/survey/charcoal cooker.jpeg"},{"revision":"d78b298441c78cf34c6d2dd78cfdd989","url":"img/survey/desktop pc.jpeg"},{"revision":"34307d44a9b3e7fb50b3941d7c6695ce","url":"img/survey/Dining table.jpeg"},{"revision":"54f024e002924a258e0e1fc70b2448f9","url":"img/survey/eat outside.jpeg"},{"revision":"2459d28c2e23f95288b6890b64cc09cd","url":"img/survey/eating at table.jpeg"},{"revision":"5ff8a85390bbc9e50cc6b63a17dbc7ef","url":"img/survey/eating on the floor.jpeg"},{"revision":"1f5e0b2cde56beed98908c62e24db481","url":"img/survey/gas burners.jpeg"},{"revision":"ef7b937d5354165a9423cac50ae99ef9","url":"img/survey/getting water from river.jpeg"},{"revision":"50bfb6e3d861e14fd7ecbc8d942435fb","url":"img/survey/Hand fan Nigeria.jpeg"},{"revision":"537f045e49e98a41bb6cc44d7d56aa3a","url":"img/survey/hand fan.jpeg"},{"revision":"ab45e55d7a51b1e8edd4ad6763c19428","url":"img/survey/heat pump unit.jpeg"},{"revision":"df22285cb03342a93fa820e77d9c8667","url":"img/survey/hot plate.jpeg"},{"revision":"b3cdaad740cdca9f2c631ab568e3ae1c","url":"img/survey/indian stove.jpeg"},{"revision":"4a368123fc4593ce83a4f774b2642b5f","url":"img/survey/laptop_and_phone.jpg"},{"revision":"aac3cb7716d6b5b7867ec28981ba39c8","url":"img/survey/laptop.jpeg"},{"revision":"8ad42b8e35fda6e08fa6c33aa9df3dfb","url":"img/survey/minibus.jpeg"},{"revision":"1720d0a711eedc6f5cb0e2fc2a0fe658","url":"img/survey/motor scooter.jpeg"},{"revision":"ebe067e6890bf49c9924a5e5c43ca1d3","url":"img/survey/none.jpg"},{"revision":"252dc1b5911857560631135171ac98ed","url":"img/survey/over fire.jpeg"},{"revision":"6b5ac42e791f0bd4a999450119b5f831","url":"img/survey/public bus.jpeg"},{"revision":"220c6d894bc63602fc875ea01ca3f946","url":"img/survey/refrigerator.jpeg"},{"revision":"e1d162ec1f9ef7356d10be5f5e6126a8","url":"img/survey/revised_ceiling_fan_split_unit.jpeg"},{"revision":"05c4c35d3ae5f77848073053958a5092","url":"img/survey/revised_eating_on_the_floor.jpeg"},{"revision":"02a8576f10a19e03b3273aeeb8193d38","url":"img/survey/revised_minivan_with_people.jpeg"},{"revision":"dee232b4889f44d596e8116b8dbc9a6f","url":"img/survey/revised_open_fridge.jpeg"},{"revision":"1dbd0ab42033099d4fac2d5655e4a2af","url":"img/survey/revised_stainless_steel_containers.jpeg"},{"revision":"1f22fa5c1619b7f633fe7f684c1d796e","url":"img/survey/rondoval.jpeg"},{"revision":"336ca065811ac59aebfdda092ed03ec2","url":"img/survey/small house.jpeg"},{"revision":"042ea3c404951e6fe75bb60435336758","url":"img/survey/smartphone.jpeg"},{"revision":"78178ebaae70758c3a75985b1aeb72b6","url":"img/survey/standing fan.jpeg"},{"revision":"321125f152143b0660be5ab24c4bdc48","url":"img/survey/stove.jpeg"},{"revision":"0b46e7fd7a8fbe065740209239a6be13","url":"img/survey/tin containers.jpeg"},{"revision":"1434aa1d7042c7c31b03ef53b0b103c0","url":"img/survey/tin hut.jpeg"},{"revision":"6af01a0cf37445edcfeebdf96d3a19f8","url":"img/survey/walking.jpeg"},{"revision":"d4e29b2300d4e4970b6440ed98a8c255","url":"img/survey/wall ac unit.jpeg"},{"revision":"adb1177c631449dd7039fc9bf9362a3d","url":"img/survey/water from a truck.jpeg"},{"revision":"517d5b468681ebbfde5e9f04e97a1371","url":"img/survey/water from the pump.jpeg"},{"revision":"2b94de9a3c1ef4d51e227f77e414b2a2","url":"img/survey/water tap.jpeg"},{"revision":"08d306aebd1e6e15157faaa660194bbb","url":"img/survey/Well and buckets.jpeg"},{"revision":"ae434b307e990dfa970934ec9e1bd68e","url":"img/survey/Wood fire.jpeg"},{"revision":"412c9464d208a95d7c3577128de761bf","url":"img/survey/wooden hut.jpeg"},{"revision":"aa35bdb915f054fae9c38756f6c76b23","url":"index.html"},{"revision":"739a5f5d597f6641643207604a0920d1","url":"manifest.json"}], {
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
  } catch (error) {
    console.log("error", error);
  }
});

// Placeholder function to handle cache name
async function getCacheName(value) {
  // Implement logic for generating cache name based on the value
  return `cache-${version}-${value}`;
}
