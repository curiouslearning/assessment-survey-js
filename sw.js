importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

workbox.precaching.precacheAndRoute([{"revision":"21e7de14397dbfc9d9bd886dfeb51e9c","url":"tsconfig.package.json"},{"revision":"41c3f8006e85c9fe3f2d90d6ca95a599","url":"manifest.json"},{"revision":"fb0362719884a54cbd3a132777c52bc3","url":"jest.setup.js"},{"revision":"122a4e5603049a9e4cd4b2efac82d8a2","url":"jest.config.js"},{"revision":"04a5ae765fd422850de9ce2871dda6be","url":"index.html"},{"revision":"661436020109cdff73c212999abc4226","url":"img/star_after_animation.gif"},{"revision":"715c1be769f3bd2dddae2c9ef90123d1","url":"img/star.png"},{"revision":"1fad224fb52226167c2dc8dc26677d91","url":"img/SoundButton_Idle.png"},{"revision":"170509d816893abd3325fab85f381e0c","url":"img/sound-play-button.svg"},{"revision":"7b918bcc68f93f7ff17f658aa3146867","url":"img/peekingMonster.js"},{"revision":"dc33b481685304c43d152362955b01f9","url":"img/monster.png"},{"revision":"38e43cd7b492b624fc3da67dea7b0433","url":"img/loadingImg.gif"},{"revision":"0ab4538bcfd8f9ed476513dedfc4758a","url":"img/hill_v01.png"},{"revision":"56484ec92a16940b09c0d9fea2e4b11b","url":"img/chest.png"},{"revision":"0eb874baac10d2a76c7cc657c756acdf","url":"img/bg_v01.jpg"},{"revision":"2364a2746dbef47fa2601198fe4ed894","url":"img/bg_crayon-1.png"},{"revision":"412c9464d208a95d7c3577128de761bf","url":"img/survey/wooden hut.jpeg"},{"revision":"ae434b307e990dfa970934ec9e1bd68e","url":"img/survey/Wood fire.jpeg"},{"revision":"08d306aebd1e6e15157faaa660194bbb","url":"img/survey/Well and buckets.jpeg"},{"revision":"2b94de9a3c1ef4d51e227f77e414b2a2","url":"img/survey/water tap.jpeg"},{"revision":"517d5b468681ebbfde5e9f04e97a1371","url":"img/survey/water from the pump.jpeg"},{"revision":"adb1177c631449dd7039fc9bf9362a3d","url":"img/survey/water from a truck.jpeg"},{"revision":"d4e29b2300d4e4970b6440ed98a8c255","url":"img/survey/wall ac unit.jpeg"},{"revision":"6af01a0cf37445edcfeebdf96d3a19f8","url":"img/survey/walking.jpeg"},{"revision":"1434aa1d7042c7c31b03ef53b0b103c0","url":"img/survey/tin hut.jpeg"},{"revision":"0b46e7fd7a8fbe065740209239a6be13","url":"img/survey/tin containers.jpeg"},{"revision":"321125f152143b0660be5ab24c4bdc48","url":"img/survey/stove.jpeg"},{"revision":"78178ebaae70758c3a75985b1aeb72b6","url":"img/survey/standing fan.jpeg"},{"revision":"042ea3c404951e6fe75bb60435336758","url":"img/survey/smartphone.jpeg"},{"revision":"336ca065811ac59aebfdda092ed03ec2","url":"img/survey/small house.jpeg"},{"revision":"1f22fa5c1619b7f633fe7f684c1d796e","url":"img/survey/rondoval.jpeg"},{"revision":"1dbd0ab42033099d4fac2d5655e4a2af","url":"img/survey/revised_stainless_steel_containers.jpeg"},{"revision":"dee232b4889f44d596e8116b8dbc9a6f","url":"img/survey/revised_open_fridge.jpeg"},{"revision":"02a8576f10a19e03b3273aeeb8193d38","url":"img/survey/revised_minivan_with_people.jpeg"},{"revision":"05c4c35d3ae5f77848073053958a5092","url":"img/survey/revised_eating_on_the_floor.jpeg"},{"revision":"e1d162ec1f9ef7356d10be5f5e6126a8","url":"img/survey/revised_ceiling_fan_split_unit.jpeg"},{"revision":"220c6d894bc63602fc875ea01ca3f946","url":"img/survey/refrigerator.jpeg"},{"revision":"6b5ac42e791f0bd4a999450119b5f831","url":"img/survey/public bus.jpeg"},{"revision":"252dc1b5911857560631135171ac98ed","url":"img/survey/over fire.jpeg"},{"revision":"ebe067e6890bf49c9924a5e5c43ca1d3","url":"img/survey/none.jpg"},{"revision":"1720d0a711eedc6f5cb0e2fc2a0fe658","url":"img/survey/motor scooter.jpeg"},{"revision":"8ad42b8e35fda6e08fa6c33aa9df3dfb","url":"img/survey/minibus.jpeg"},{"revision":"4a368123fc4593ce83a4f774b2642b5f","url":"img/survey/laptop_and_phone.jpg"},{"revision":"aac3cb7716d6b5b7867ec28981ba39c8","url":"img/survey/laptop.jpeg"},{"revision":"b3cdaad740cdca9f2c631ab568e3ae1c","url":"img/survey/indian stove.jpeg"},{"revision":"df22285cb03342a93fa820e77d9c8667","url":"img/survey/hot plate.jpeg"},{"revision":"ab45e55d7a51b1e8edd4ad6763c19428","url":"img/survey/heat pump unit.jpeg"},{"revision":"537f045e49e98a41bb6cc44d7d56aa3a","url":"img/survey/hand fan.jpeg"},{"revision":"50bfb6e3d861e14fd7ecbc8d942435fb","url":"img/survey/Hand fan Nigeria.jpeg"},{"revision":"ef7b937d5354165a9423cac50ae99ef9","url":"img/survey/getting water from river.jpeg"},{"revision":"1f5e0b2cde56beed98908c62e24db481","url":"img/survey/gas burners.jpeg"},{"revision":"5ff8a85390bbc9e50cc6b63a17dbc7ef","url":"img/survey/eating on the floor.jpeg"},{"revision":"2459d28c2e23f95288b6890b64cc09cd","url":"img/survey/eating at table.jpeg"},{"revision":"54f024e002924a258e0e1fc70b2448f9","url":"img/survey/eat outside.jpeg"},{"revision":"34307d44a9b3e7fb50b3941d7c6695ce","url":"img/survey/Dining table.jpeg"},{"revision":"d78b298441c78cf34c6d2dd78cfdd989","url":"img/survey/desktop pc.jpeg"},{"revision":"89dd029b859a2cf38b1811f9b4be1139","url":"img/survey/charcoal cooker.jpeg"},{"revision":"bddb1d32c7021d01e3cb648671331d6d","url":"img/survey/ceiling fan.jpeg"},{"revision":"087f1040b937c6e30791ef76ea3a0cd8","url":"img/survey/car.jpeg"},{"revision":"c3b8df83a8fafeb717f28dafd7a5aeaa","url":"img/survey/basket.jpeg"},{"revision":"4a8225b84684850639993770826efe19","url":"img/survey/auto_rickshaw.jpeg"},{"revision":"84c3712df9d326804590b3f554d44565","url":"img/survey/apartment building.jpeg"},{"revision":"21330891658b0ce32e88c3c8b81ba30b","url":"img/chestprogression/TreasureChestOpen04.svg"},{"revision":"b4495f4118ae899401da67a38800a288","url":"img/chestprogression/TreasureChestOpen03.svg"},{"revision":"2aaa81018da01b60b5b6fb10d991459f","url":"img/chestprogression/TreasureChestOpen02.svg"},{"revision":"1ef5344f23677707c7e36c73315a94f3","url":"img/chestprogression/TreasureChestOpen01.svg"},{"revision":"f0cae6fc6fd5b7bbdb6bccbaaf7fd69c","url":"dist/bundle.js"},{"revision":"d6223ad2dfebbfe22e932087e0ec74f0","url":"dist/images/red_bird_256.webp"},{"revision":"eae4a7be9f547209a3dc48904e55260a","url":"dist/audio/Correct.wav"},{"revision":"3cd54bcb8eb59dd6ffdd3cf12b7043d3","url":"css/style.css"},{"revision":"e2f5129270684bf835820ca4433b4abb","url":"coverage/lcov-report/sorter.js"},{"revision":"fd08a5625d21e34b1d6d9c026f2728a9","url":"coverage/lcov-report/sort-arrow-sprite.png"},{"revision":"6051903a2f7363ee232a01bd32f60b6a","url":"coverage/lcov-report/prettify.js"},{"revision":"31f0c9da5ac09f2563cab46ebc6e445a","url":"coverage/lcov-report/prettify.css"},{"revision":"3808d5a7ae22719e4b80f1bbb1adf2c1","url":"coverage/lcov-report/index.html"},{"revision":"8c814a46f24208d0bc459bb2cf8b7b88","url":"coverage/lcov-report/favicon.png"},{"revision":"13c8dd65c9b9571b0b4960aeaf3fab0a","url":"coverage/lcov-report/block-navigation.js"},{"revision":"899ea8483c28270ca7835460bdd4da33","url":"coverage/lcov-report/base.css"},{"revision":"72c927dc9a3c62e1e0900ef43d65dfb5","url":"coverage/lcov-report/src/index.html"},{"revision":"04e0c3985ccf6bc8d452faf73e67043d","url":"coverage/lcov-report/src/baseQuiz.ts.html"},{"revision":"19ed47f53ee95b0235bc2a2228c288e6","url":"coverage/lcov-report/src/AssessmentElement.ts.html"},{"revision":"b929eadc386e24bb132515f9bbc1a73d","url":"coverage/lcov-report/src/assessment-survey.ts.html"},{"revision":"50361c85fee8b826ab09f0eea9a4e363","url":"coverage/lcov-report/src/App.ts.html"},{"revision":"5eec905a39bb932ff6a916a2dc0e4910","url":"coverage/lcov-report/src/utils/urlUtils.ts.html"},{"revision":"468bbc5b75161e074249c75fb3881b22","url":"coverage/lcov-report/src/utils/unityBridge.ts.html"},{"revision":"5592d04fe5d193da115b8fbad01294cd","url":"coverage/lcov-report/src/utils/mathUtils.ts.html"},{"revision":"2ee4342498bb0d65ab4f1e9becf8cb43","url":"coverage/lcov-report/src/utils/jsonUtils.ts.html"},{"revision":"dd32730a1aba5ddb153e964a2e8782e4","url":"coverage/lcov-report/src/utils/index.html"},{"revision":"220a40a23d44923e0189b49b17445108","url":"coverage/lcov-report/src/utils/AnalyticsUtils.ts.html"},{"revision":"28d842444351fba3702b395ab4b20563","url":"coverage/lcov-report/src/ui/uiController.ts.html"},{"revision":"72b1477c623b5afd8d627cdac0c2a09c","url":"coverage/lcov-report/src/ui/index.html"},{"revision":"f7fb01cf0815a0d92e16cb243def6662","url":"coverage/lcov-report/src/survey/survey.ts.html"},{"revision":"d0d464b6b39b7603c1f75ced12901522","url":"coverage/lcov-report/src/survey/index.html"},{"revision":"33d6a1ee01706960e9a283f1846a689a","url":"coverage/lcov-report/src/components/tNode.ts.html"},{"revision":"47cea4c41fda04be233931e2d10840fc","url":"coverage/lcov-report/src/components/index.html"},{"revision":"dbb4af34231de2682bc456f1730ed299","url":"coverage/lcov-report/src/components/cacheModel.ts.html"},{"revision":"41fe7cecf2db338ff30938af4540f8c9","url":"coverage/lcov-report/src/components/audioController.ts.html"},{"revision":"9c755702c7f10974a4e5222514cb8b3b","url":"coverage/lcov-report/src/assessment/index.html"},{"revision":"e86472dd4e20308a6b32d109a8eea043","url":"coverage/lcov-report/src/assessment/assessment.ts.html"},{"revision":"dcf65b685d978cb4d5d9da9b4aa88cb7","url":"coverage/lcov-report/src/analytics/index.html"},{"revision":"31f8bde58589fded65c68a6ab3fe2b34","url":"coverage/lcov-report/src/analytics/base-analytics-integration.ts.html"},{"revision":"2a3b7afa3284c5f97071a7dba9c190dd","url":"coverage/lcov-report/src/analytics/analyticsEvents.ts.html"},{"revision":"631575798d750a84ac8486a9530963e3","url":"coverage/lcov-report/src/analytics/analytics-integration.ts.html"},{"revision":"32245652044e873b012469263f6375d9","url":"coverage/lcov-report/src/analytics/analytics-config.ts.html"},{"revision":"4c4db15bdb825e674e18abf4a348a957","url":"animation/Star.gif"},{"revision":"76a23e80ae39c4a2aaa42c61e7ef3397","url":"animation/SoundButton.gif"}], {
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
