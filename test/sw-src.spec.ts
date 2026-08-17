/**
 * Unit tests for src/sw-src.ts (MR-169 migration).
 *
 * `sw-src.ts` imports `workbox-precaching` and `@curiouslearning/sw` directly,
 * both of which ship ESM-only `main` entry points (workbox 7.x's npm packages
 * are bundler-only, not require()-able) — importing the real modules under
 * Jest's CommonJS transform throws `SyntaxError: Cannot use import statement
 * outside a module`. Both are mocked below so the module under test can be
 * required directly, same as any other unit test in this suite.
 */

const mockPrecacheAndRoute = jest.fn();
const mockRegisterUpdateNotifier = jest.fn();
const mockRegisterNavigationFallback = jest.fn();
const mockCacheUrlsWithProgress = jest.fn().mockResolvedValue(undefined);
const mockIsCacheBustRequest = jest.fn().mockReturnValue(false);

jest.mock('workbox-precaching', () => ({
  precacheAndRoute: mockPrecacheAndRoute,
}));

jest.mock('@curiouslearning/sw', () => ({
  registerUpdateNotifier: mockRegisterUpdateNotifier,
  registerNavigationFallback: mockRegisterNavigationFallback,
  cacheUrlsWithProgress: mockCacheUrlsWithProgress,
  isCacheBustRequest: mockIsCacheBustRequest,
}));

describe('sw-src', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let mockCache: { add: jest.Mock };
  let mockCachesOpen: jest.Mock;
  let mockCachesMatch: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockCacheUrlsWithProgress.mockResolvedValue(undefined);
    mockIsCacheBustRequest.mockReturnValue(false);

    // sw-src.ts registers 'install' / 'activate' / 'fetch' listeners on `self`
    // (an alias for the jsdom global in this environment) at module-evaluation
    // time. Spying before require() lets us capture and invoke them directly,
    // without needing a real ServiceWorkerGlobalScope / FetchEvent dispatch.
    addEventListenerSpy = jest.spyOn(self, 'addEventListener');

    mockCache = { add: jest.fn() };
    mockCachesOpen = jest.fn().mockResolvedValue(mockCache);
    mockCachesMatch = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, 'caches', {
      configurable: true,
      value: { open: mockCachesOpen, match: mockCachesMatch, delete: jest.fn() },
    });

    (self as any).clients = {
      claim: jest.fn().mockResolvedValue(undefined),
      matchAll: jest.fn().mockResolvedValue([]),
    };
    (self as any).skipWaiting = jest.fn();
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
  });

  function getListener(type: string): (event: any) => any {
    const call = addEventListenerSpy.mock.calls.find(([eventType]) => eventType === type);
    if (!call) {
      throw new Error(`No '${type}' listener was registered via self.addEventListener`);
    }
    return call[1];
  }

  describe('module evaluation', () => {
    it('wires up precaching, navigation fallback, and the update notifier on the shared channel', () => {
      require('../src/sw-src');

      expect(mockPrecacheAndRoute).toHaveBeenCalledWith(
        undefined, // self.__WB_MANIFEST is not set in this test environment
        expect.objectContaining({ ignoreURLParametersMatching: expect.any(Array) })
      );
      expect(mockRegisterNavigationFallback).toHaveBeenCalledWith({ fallbackUrl: '/index.html' });
      expect(mockRegisterUpdateNotifier).toHaveBeenCalledWith({ channelName: 'as-message-channel' });
    });
  });

  describe('cacheTheBookJSONAndImages', () => {
    it('opens the app cache and delegates to cacheUrlsWithProgress with the lower-cased content + audio-visual URLs', async () => {
      const { cacheTheBookJSONAndImages } = require('../src/sw-src');

      await cacheTheBookJSONAndImages({
        appData: {
          appName: 'TestApp',
          contentFilePath: '/Data/Content.JSON',
          audioVisualResources: ['/Assets/Audio/Hello.MP3', '/Assets/Img/Star.PNG'],
        },
      });

      expect(mockCachesOpen).toHaveBeenCalledWith('TestApp');
      expect(mockCacheUrlsWithProgress).toHaveBeenCalledWith(
        mockCache,
        ['/data/content.json', '/assets/audio/hello.mp3', '/assets/img/star.png'],
        expect.objectContaining({
          onProgress: expect.any(Function),
          onItemError: expect.any(Function),
        })
      );
    });

    it('accepts a Set for audioVisualResources (the real CacheModel shape) the same as an array', async () => {
      const { cacheTheBookJSONAndImages } = require('../src/sw-src');

      await cacheTheBookJSONAndImages({
        appData: {
          appName: 'TestApp',
          contentFilePath: '/content.json',
          audioVisualResources: new Set(['/a.mp3', '/b.mp3']),
        },
      });

      expect(mockCacheUrlsWithProgress).toHaveBeenCalledWith(
        mockCache,
        ['/content.json', '/a.mp3', '/b.mp3'],
        expect.anything()
      );
    });

    it('broadcasts a Loading progress message to every client via onProgress', async () => {
      const { cacheTheBookJSONAndImages } = require('../src/sw-src');
      const fakeClient = { postMessage: jest.fn() };
      (self as any).clients.matchAll.mockResolvedValue([fakeClient]);

      await cacheTheBookJSONAndImages({
        appData: { appName: 'TestApp', contentFilePath: '/content.json', audioVisualResources: [] },
      });

      const onProgress = mockCacheUrlsWithProgress.mock.calls[0][2].onProgress;
      onProgress(42);
      await Promise.resolve();
      await Promise.resolve();

      expect(fakeClient.postMessage).toHaveBeenCalledWith({
        msg: 'Loading',
        data: { progress: 42, bookName: 'TestApp' },
      });
    });

    it('tolerates and logs individual item failures via onItemError without rejecting', async () => {
      const { cacheTheBookJSONAndImages } = require('../src/sw-src');
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await cacheTheBookJSONAndImages({
        appData: { appName: 'TestApp', contentFilePath: '/content.json', audioVisualResources: [] },
      });

      const onItemError = mockCacheUrlsWithProgress.mock.calls[0][2].onItemError;
      const error = new Error('network error');
      onItemError('/broken-asset.mp3', error);

      expect(warnSpy).toHaveBeenCalledWith('Failed to cache asset:', '/broken-asset.mp3', error);
      warnSpy.mockRestore();
    });
  });

  describe('fetch handler', () => {
    it('lets cache-bust requests pass through to the network (does not call respondWith)', () => {
      require('../src/sw-src');
      mockIsCacheBustRequest.mockReturnValue(true);
      const fetchListener = getListener('fetch');

      const respondWith = jest.fn();
      fetchListener({
        request: { url: `${self.location.origin}/data/content.json?cache-bust=12345`, mode: 'same-origin' },
        respondWith,
      });

      expect(mockIsCacheBustRequest).toHaveBeenCalledWith(
        `${self.location.origin}/data/content.json?cache-bust=12345`
      );
      expect(respondWith).not.toHaveBeenCalled();
    });

    it('intercepts and calls respondWith for a normal same-origin request', () => {
      require('../src/sw-src');
      mockIsCacheBustRequest.mockReturnValue(false);
      const fetchListener = getListener('fetch');

      const respondWith = jest.fn();
      fetchListener({
        request: { url: `${self.location.origin}/assets/img/star.png`, mode: 'same-origin' },
        respondWith,
      });

      expect(respondWith).toHaveBeenCalledTimes(1);
      expect(respondWith.mock.calls[0][0]).toBeInstanceOf(Promise);
    });

    it('ignores the service worker script itself', () => {
      require('../src/sw-src');
      const fetchListener = getListener('fetch');

      const respondWith = jest.fn();
      fetchListener({
        request: { url: `${self.location.origin}/sw.js`, mode: 'same-origin' },
        respondWith,
      });

      expect(respondWith).not.toHaveBeenCalled();
    });

    it('ignores cross-origin requests', () => {
      require('../src/sw-src');
      const fetchListener = getListener('fetch');

      const respondWith = jest.fn();
      fetchListener({
        request: { url: 'https://firebaseapp.example.com/log', mode: 'cors' },
        respondWith,
      });

      expect(respondWith).not.toHaveBeenCalled();
    });
  });
});
