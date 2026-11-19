import { App, FEATURE_ANDROID_SUMMARY_STANDALONE } from '../../src/App';
import { Assessment } from '../../src/assessment/assessment';
import { Survey } from '../../src/survey/survey';
import { Workbox } from 'workbox-window';
import { UIController } from '../../src/ui/uiController';
import { fetchAppData, getDataURL } from '../../src/utils/jsonUtils';
import { AndroidInterface } from '@curiouslearning/core';
import { featureFlagsService } from '@curiouslearning/features';
import { environment } from '../../src/environment';

const mockWorkboxRegister = jest.fn();

jest.mock('../../src/utils/jsonUtils', () => ({
  fetchAppData: jest.fn().mockResolvedValue({
    appType: 'survey',
    feedbackText: 'Feedback text',
    contentVersion: 'v1.0.0',
    questions: [],
  }),
  fetchAssessmentBuckets: jest.fn().mockResolvedValue([
    {
      bucketID: 1,
      items: [
        { itemName: 'Alpha', itemText: 'Alpha' },
        { itemName: 'Beta', itemText: 'Beta' },
        { itemName: 'Gamma', itemText: 'Gamma' },
        { itemName: 'Delta', itemText: 'Delta' },
      ],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      passed: false,
      score: 0,
    },
  ]),
  getCaseIndependentLangList: jest.fn(() => []),
  getDataURL: jest.fn((url: string) => `/data/${url}.json`),
}));

jest.mock('workbox-window', () => ({
  Workbox: jest.fn().mockImplementation(() => ({
    register: mockWorkboxRegister,
  })),
}));

jest.mock('../../src/ui/uiController', () => ({
  UIController: {
    SetFeedbackText: jest.fn(),
    SetContentLoaded: jest.fn(),
    SetButtonPressAction: jest.fn(),
    SetStartAction: jest.fn(),
    SetExternalBucketControlsGenerationHandler: jest.fn(),
    ShowEnd: jest.fn(),
    getInstance: jest.fn(() => ({
      SetCorrectLabelVisibility: jest.fn(),
      SetAnimationSpeedMultiplier: jest.fn(),
      SetBucketControlsVisibility: jest.fn(),
      answersContainer: { style: {} },
      buttons: [],
      shownStarsCount: 0,
    })),
  },
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  }),
  logEvent: jest.fn(),
}));

describe('App Class', () => {
  let app: App;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loadingScreen"></div>
      <div id="progressBar"></div>
    `;

    jest.clearAllMocks();
    (AndroidInterface as any).instances = [];
    mockWorkboxRegister.mockResolvedValue({
      installing: { postMessage: jest.fn() },
    });

    (fetchAppData as jest.Mock).mockResolvedValue({
      appType: 'survey',
      feedbackText: 'Feedback text',
      contentVersion: 'v1.0.0',
      questions: [],
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      value: jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contentVersion: 'v1.0.0' }),
      }),
    });

    Object.defineProperty(global, 'caches', {
      configurable: true,
      value: { delete: jest.fn() },
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        addEventListener: jest.fn(),
        ready: Promise.resolve({}),
      },
    });

    app = new App();
  });

  test('should initialize the app with default properties', () => {
    expect(app).toBeDefined();
    expect(app.unityBridge).toBeDefined();
    expect(app.cacheModel).toBeDefined();
    expect(app.lang).toBe('english');
  });

  test('spinUp should fetch app data and initialize Survey for survey app type', async () => {
    jest.spyOn(app, 'registerServiceWorker').mockResolvedValue();

    await app.spinUp();

    expect(UIController.SetFeedbackText).toHaveBeenCalledWith('Feedback text');
    expect(app.game).toBeInstanceOf(Survey);
    expect(getDataURL).toHaveBeenCalledWith(app.dataURL);
  });

  test('spinUp should fetch app data and initialize Assessment for assessment app type', async () => {
    (fetchAppData as jest.Mock).mockResolvedValue({
      appType: 'assessment',
      feedbackText: 'Feedback text',
      buckets: [
        {
          bucketID: 1,
          items: [{ itemName: 'Alpha', itemText: 'Alpha' }],
          usedItems: [],
          numTried: 0,
          numCorrect: 0,
          numConsecutiveWrong: 0,
          tested: false,
          passed: false,
          score: 0,
        },
      ],
      contentVersion: 'v1.0.0',
      quizName: 'Test Quiz',
    });
    jest.spyOn(app, 'registerServiceWorker').mockResolvedValue();

    await app.spinUp();

    expect(UIController.SetFeedbackText).toHaveBeenCalledWith('Feedback text');
    expect(app.game).toBeInstanceOf(Assessment);
  });

  test('should register a service worker and handle successful registration', async () => {
    const mockHandleServiceWorkerRegistration = jest.spyOn(app, 'handleServiceWorkerRegistation');

    await app.registerServiceWorker(app.game, app.dataURL);
    await Promise.resolve();

    expect(Workbox).toHaveBeenCalledWith('./sw.js', {});
    expect(mockWorkboxRegister).toHaveBeenCalled();
    expect(mockHandleServiceWorkerRegistration).toHaveBeenCalled();
  });

  test('should log error when service worker registration fails', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockWorkboxRegister.mockRejectedValueOnce('Registration failed');

    await app.registerServiceWorker(app.game, app.dataURL);
    await Promise.resolve();

    expect(logSpy).toHaveBeenCalledWith('Service worker registration failed: Registration failed');
  });

  test('should handle service worker message events for loading updates', () => {
    const mockEvent = {
      data: {
        msg: 'Loading',
        data: {
          progress: '100',
          bookName: 'TestBook',
        },
      },
    };

    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    handleServiceWorkerMessage(mockEvent);
    expect(mockSetItem).toHaveBeenCalledWith('TestBook', 'true');
  });

  test('should confirm and reload on update found message', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const originalLocation = window.location;
    const reloadSpy = jest.fn();

    delete (window as any).location;
    (window as any).location = { reload: reloadSpy };

    handleUpdateFoundMessage();

    expect(confirmSpy).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();

    (window as any).location = originalLocation;
  });

  test('should notify completion, reward, and legacy assessment callbacks with the same payload', () => {
    const onComplete = jest.fn();
    const onRewardTrigger = jest.fn();
    const onAssessmentCompleted = jest.fn();

    app.hostIntegrationAdapters = {
      onComplete,
      onRewardTrigger,
      onAssessmentCompleted,
    };

    app.notifyAssessmentCompleted(300);

    const expectedPayload = { type: 'assessment_completed', score: 300 };

    expect(onComplete).toHaveBeenCalledWith(expectedPayload);
    expect(onRewardTrigger).toHaveBeenCalledWith(expectedPayload);
    expect(onAssessmentCompleted).toHaveBeenCalledWith(expectedPayload);
  });

  test('should notify close callback when configured', () => {
    const onClose = jest.fn();
    app.hostIntegrationAdapters = { onClose };

    app.notifyClose();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Given summary data is logged through AndroidInterface, When notifySummaryData runs, Then the metadata includes the current environment', () => {
    app.notifySummaryData({ app_type: 'assessment', score: 100, time_spent: 1000 });

    const instances = (AndroidInterface as any).instances;
    expect(instances).toHaveLength(1);
    expect(instances[0].metadata).toEqual({ app_version: expect.any(String), environment });
  });

  test('Given an assessment session ends, When user-session data is logged through AndroidInterface, Then the metadata includes the current environment', async () => {
    (fetchAppData as jest.Mock).mockResolvedValue({
      appType: 'assessment',
      feedbackText: 'Feedback text',
      buckets: [
        {
          bucketID: 1,
          items: [{ itemName: 'Alpha', itemText: 'Alpha' }],
          usedItems: [],
          numTried: 0,
          numCorrect: 0,
          numConsecutiveWrong: 0,
          tested: false,
          passed: false,
          score: 0,
        },
      ],
      contentVersion: 'v1.0.0',
      quizName: 'Test Quiz',
    });
    jest.spyOn(app, 'registerServiceWorker').mockResolvedValue();
    // Default platform ('standalone') now additionally requires the mr-75 flag (see
    // "AndroidInterface construction in standalone mode is gated by mr-75" below) —
    // enable it here so this test keeps exercising the metadata-shape behavior it targets.
    (featureFlagsService.isFeatureEnabled as jest.Mock).mockImplementation(
      (flag: string) => flag === FEATURE_ANDROID_SUMMARY_STANDALONE
    );

    await app.spinUp();
    app.game.onEnd();

    // game.onEnd() also triggers notifySummaryData's own AndroidInterface construction (a
    // separate call site) — isolate the user-session one by its distinguishing `debug` key.
    const instances = (AndroidInterface as any).instances;
    const sessionInstance = instances.find((instance: any) => 'debug' in instance);
    expect(sessionInstance).toBeDefined();
    expect(sessionInstance.metadata).toEqual({ app_version: expect.any(String), environment });
  });

  describe('Feature: standalone assessment closes the CR app screen on completion (CLT-175)', () => {
    const assessmentData = {
      appType: 'assessment',
      feedbackText: 'Feedback text',
      buckets: [
        {
          bucketID: 1,
          items: [{ itemName: 'Alpha', itemText: 'Alpha' }],
          usedItems: [],
          numTried: 0,
          numCorrect: 0,
          numConsecutiveWrong: 0,
          tested: false,
          passed: false,
          score: 0,
        },
      ],
      contentVersion: 'v1.0.0',
      quizName: 'Test Quiz',
    };
    const closeWebView = jest.fn();

    beforeEach(() => {
      (fetchAppData as jest.Mock).mockResolvedValue(assessmentData);
      Object.defineProperty(window, 'Android', { configurable: true, writable: true, value: { closeWebView } });
      closeWebView.mockClear();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      delete (window as unknown as { Android?: unknown }).Android;
    });

    test('Given the standalone page in the CR app, When the assessment ends, Then closeWebView is called after the end screen delay', async () => {
      const standaloneApp = new App({ closeHostOnComplete: true });

      standaloneApp.closeHostAfterCompletion('assessment');
      await jest.advanceTimersByTimeAsync(2999);
      expect(closeWebView).not.toHaveBeenCalled();
      await jest.advanceTimersByTimeAsync(1);

      expect(closeWebView).toHaveBeenCalledTimes(1);
    });

    test('Given an embedded player (closeHostOnComplete off), When the assessment ends, Then the screen is NOT closed', async () => {
      const embeddedApp = new App({ platform: 'ftm' });

      embeddedApp.closeHostAfterCompletion('assessment');
      await jest.advanceTimersByTimeAsync(10000);

      expect(closeWebView).not.toHaveBeenCalled();
    });

    test('Given the standalone page, When the game publishes ENDED, Then the screen closes after the delay', async () => {
      const standaloneApp = new App({ closeHostOnComplete: true });
      jest.spyOn(standaloneApp, 'registerServiceWorker').mockResolvedValue();
      jest.useRealTimers();
      await standaloneApp.spinUp({ closeHostOnComplete: true });
      jest.useFakeTimers();

      standaloneApp.game.publish('ENDED', standaloneApp.game);
      await jest.advanceTimersByTimeAsync(3000);

      expect(closeWebView).toHaveBeenCalledTimes(1);
    });

    test('Given the completed analytics event is not yet confirmed, When the end screen delay passes, Then the screen stays open until it is confirmed', async () => {
      // Given
      const standaloneApp = new App({ closeHostOnComplete: true });
      let confirmCompletedAnalytics: () => void = () => undefined;
      const completedAnalytics = new Promise<void>((resolve) => {
        confirmCompletedAnalytics = resolve;
      });
      standaloneApp.game = { whenCompletionAnalyticsSettled: () => completedAnalytics } as unknown as App['game'];

      // When
      standaloneApp.closeHostAfterCompletion('assessment');
      await jest.advanceTimersByTimeAsync(4000);

      // Then
      expect(closeWebView).not.toHaveBeenCalled();
      confirmCompletedAnalytics();
      await jest.advanceTimersByTimeAsync(0);
      expect(closeWebView).toHaveBeenCalledTimes(1);
    });

    test('Given the completion is reported twice, When closeHostAfterCompletion runs again, Then the screen is closed only once', async () => {
      const standaloneApp = new App({ closeHostOnComplete: true });

      standaloneApp.closeHostAfterCompletion('assessment');
      standaloneApp.closeHostAfterCompletion('assessment');
      await jest.advanceTimersByTimeAsync(3000);

      expect(closeWebView).toHaveBeenCalledTimes(1);
    });

    test('Given handing summary data to the CR app throws, When the game publishes ENDED, Then the screen still closes', async () => {
      const standaloneApp = new App({ closeHostOnComplete: true });
      jest.spyOn(standaloneApp, 'registerServiceWorker').mockResolvedValue();
      jest.useRealTimers();
      await standaloneApp.spinUp({ closeHostOnComplete: true });
      jest.useFakeTimers();
      jest.spyOn(standaloneApp, 'notifySummaryData').mockImplementation(() => {
        throw new Error('bridge failure');
      });

      expect(() => standaloneApp.game.publish('ENDED', standaloneApp.game)).toThrow('bridge failure');
      await jest.advanceTimersByTimeAsync(3000);

      expect(closeWebView).toHaveBeenCalledTimes(1);
    });
  });

  describe('AndroidInterface construction in standalone mode is gated by mr-75', () => {
    const assessmentAppData = {
      appType: 'assessment',
      feedbackText: 'Feedback text',
      buckets: [
        {
          bucketID: 1,
          items: [{ itemName: 'Alpha', itemText: 'Alpha' }],
          usedItems: [],
          numTried: 0,
          numCorrect: 0,
          numConsecutiveWrong: 0,
          tested: false,
          passed: false,
          score: 0,
        },
      ],
      contentVersion: 'v1.0.0',
      quizName: 'Test Quiz',
    };

    beforeEach(() => {
      (fetchAppData as jest.Mock).mockResolvedValue(assessmentAppData);
      jest.spyOn(app, 'registerServiceWorker').mockResolvedValue();
    });

    test('Given platform is standalone and the mr-75 flag is enabled, When notifySummaryData runs, Then AndroidInterface is constructed', async () => {
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockImplementation(
        (flag: string) => flag === FEATURE_ANDROID_SUMMARY_STANDALONE
      );

      await app.spinUp({ platform: 'standalone' });
      app.notifySummaryData({ app_type: 'assessment', score: 100, time_spent: 1000 });

      expect((AndroidInterface as any).instances).toHaveLength(1);
    });

    test('Given platform is standalone and the mr-75 flag is disabled, When notifySummaryData runs, Then AndroidInterface is NOT constructed', async () => {
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockReturnValue(false);

      await app.spinUp({ platform: 'standalone' });
      app.notifySummaryData({ app_type: 'assessment', score: 100, time_spent: 1000 });

      expect((AndroidInterface as any).instances).toHaveLength(0);
    });

    test('Given platform is standalone, enableAndroidSummary is explicitly false, and the mr-75 flag is enabled, When notifySummaryData runs, Then AndroidInterface is still NOT constructed', async () => {
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockImplementation(
        (flag: string) => flag === FEATURE_ANDROID_SUMMARY_STANDALONE
      );

      await app.spinUp({ platform: 'standalone', enableAndroidSummary: false });
      app.notifySummaryData({ app_type: 'assessment', score: 100, time_spent: 1000 });

      expect((AndroidInterface as any).instances).toHaveLength(0);
    });

    test('Given platform is not standalone, When the mr-75 flag is disabled, Then AndroidInterface is still constructed and the flag is never consulted for mr-75', async () => {
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockReturnValue(false);

      await app.spinUp({ platform: 'ftm' });
      app.notifySummaryData({ app_type: 'assessment', score: 100, time_spent: 1000 });

      expect((AndroidInterface as any).instances).toHaveLength(1);
      expect(featureFlagsService.isFeatureEnabled).not.toHaveBeenCalledWith(FEATURE_ANDROID_SUMMARY_STANDALONE);
    });

    test('Given featureFlagsService.initialize() fails, When platform is standalone, Then the mr-75 flag is treated as disabled and AndroidInterface is NOT constructed', async () => {
      (featureFlagsService.initialize as jest.Mock).mockRejectedValueOnce(new Error('flags unavailable'));
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockReturnValue(false);
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      await app.spinUp({ platform: 'standalone' });
      app.notifySummaryData({ app_type: 'assessment', score: 100, time_spent: 1000 });

      expect((AndroidInterface as any).instances).toHaveLength(0);
    });

    test('Given platform is standalone and the mr-75 flag is enabled, When an assessment session ends, Then the user-session AndroidInterface call site also fires', async () => {
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockImplementation(
        (flag: string) => flag === FEATURE_ANDROID_SUMMARY_STANDALONE
      );

      await app.spinUp({ platform: 'standalone' });
      app.game.onEnd();

      const sessionInstance = (AndroidInterface as any).instances.find((instance: any) => 'debug' in instance);
      expect(sessionInstance).toBeDefined();
    });

    test('Given platform is standalone and the mr-75 flag is disabled, When an assessment session ends, Then the user-session AndroidInterface call site does NOT fire', async () => {
      (featureFlagsService.isFeatureEnabled as jest.Mock).mockReturnValue(false);

      await app.spinUp({ platform: 'standalone' });
      app.game.onEnd();

      const sessionInstance = (AndroidInterface as any).instances.find((instance: any) => 'debug' in instance);
      expect(sessionInstance).toBeUndefined();
    });
  });
});

function handleServiceWorkerMessage(mockEvent: {
  data: { msg: string; data: { progress: string; bookName: string } };
}) {
  if (mockEvent.data.msg === 'Loading') {
    const progressValue = parseInt(mockEvent.data.data.progress, 10);
    if (progressValue >= 100) {
      localStorage.setItem(mockEvent.data.data.bookName, 'true');
    }
  }
  if (mockEvent.data.msg === 'UpdateFound') {
    handleUpdateFoundMessage();
  }
}

function handleUpdateFoundMessage() {
  const text = 'Update Found.\nPlease accept the update by pressing Ok.';
  if (window.confirm(text) === true) {
    window.location.reload();
  }
}
