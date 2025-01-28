import { App } from '../../src/App';
import { Assessment } from '../../src/assessment/assessment';
import { Survey } from '../../src/survey/survey';
import { Workbox } from 'workbox-window';
import { UIController } from '../../src/ui/uiController';

jest.mock('workbox-window', () => {
  return {
    Workbox: jest.fn().mockImplementation(() => {
      return {
        register: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

jest.mock('../../src/components/uiController', () => {
  return {
    UIController: {
      SetFeedbackText: jest.fn(),
      SetContentLoaded: jest.fn(),
    },
  };
});
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
    app = new App();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize the app with default properties', () => {
    expect(app).toBeDefined();
    expect(app.unityBridge).toBeDefined();
    expect(app.analytics).toBeDefined();
    expect(app.cacheModel).toBeDefined();
    expect(app.lang).toBe('english');
  });

  test('should set up the Firebase configuration', () => {
    expect(app.analytics).toBeDefined();
  });

  test('spinUp should fetch app data and initialize Survey for survey app type', async () => {
    const mockFetchAppData = jest.fn().mockResolvedValue({
      appType: 'survey',
      feedbackText: 'Test feedback',
      contentVersion: 'v1.0.0',
      assessmentType: 'test',
    });
    jest.spyOn(app, 'registerServiceWorker').mockResolvedValue();

    await mockFetchAppData.mockResolvedValue({
      appType: 'survey',
      feedbackText: 'Feedback text',
      contentVersion: 'v1.0.0',
    });
    app.spinUp();

    await mockFetchAppData;
    expect(UIController.SetFeedbackText).toHaveBeenCalledWith('Feedback text');
    expect(app.game).toBeInstanceOf(Survey);
  });

  test('spinUp should fetch app data and initialize Assessment for assessment app type', async () => {
    const mockFetchAppData = jest.fn().mockResolvedValue({
      appType: 'assessment',
      feedbackText: 'Test feedback',
      buckets: [],
      contentVersion: 'v1.0.0',
      quizName: 'Test Quiz',
    });
    jest.spyOn(app, 'registerServiceWorker').mockResolvedValue();

    await mockFetchAppData.mockResolvedValue({
      appType: 'assessment',
      feedbackText: 'Feedback text',
      contentVersion: 'v1.0.0',
    });

    app.spinUp();

    await mockFetchAppData;
    expect(UIController.SetFeedbackText).toHaveBeenCalledWith('Feedback text');
    expect(app.game).toBeInstanceOf(Assessment);
  });

  test('should register a service worker and handle successful registration', async () => {
    const mockHandleServiceWorkerRegistration = jest.spyOn(app, 'handleServiceWorkerRegistation');
    await app.registerServiceWorker(app.game, app.dataURL);
    expect(Workbox).toHaveBeenCalledWith('./sw.js', {});
    expect(mockHandleServiceWorkerRegistration).toHaveBeenCalled();
  });

  test('should log error when service worker registration fails', async () => {
    const errorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(Workbox.prototype, 'register').mockRejectedValue('Registration failed');

    await app.registerServiceWorker(app.game, app.dataURL);

    expect(errorSpy).toHaveBeenCalledWith('Service worker registration failed: Registration failed');
  });

  test('should handle service worker message events for loading updates', () => {
    const mockEvent = {
      data: {
        msg: 'Loading',
        data: {
          progress: '50',
          bookName: 'TestBook',
        },
      },
    };

    const mockLocalStorage = jest.spyOn(localStorage, 'setItem');
    handleServiceWorkerMessage(mockEvent);
    expect(mockLocalStorage).toHaveBeenCalledWith('TestBook', 'true');
  });

  test('should confirm and reload on update found message', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    handleUpdateFoundMessage();

    expect(confirmSpy).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });
});
function handleServiceWorkerMessage(mockEvent: {
  data: { msg: string; data: { progress: string; bookName: string } };
}) {
  throw new Error('Function not implemented.');
}
function handleUpdateFoundMessage() {
  throw new Error('Function not implemented.');
}
