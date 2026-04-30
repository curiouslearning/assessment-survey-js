import { App } from '../../src/App';
import { Assessment } from '../../src/assessment/assessment';
import { Survey } from '../../src/survey/survey';
import { Workbox } from 'workbox-window';
import { UIController } from '../../src/ui/uiController';
import { fetchAppData, getDataURL } from '../../src/utils/jsonUtils';

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
