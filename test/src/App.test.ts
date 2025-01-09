import { App } from '../../src/App';
import { getDataFile, getUUID, getUserSource, getDataURL } from '../../src/components/urlUtils';
import { Survey } from '../../src/survey/survey';
import { Assessment } from '../../src/assessment/assessment';
import { Workbox } from 'workbox-window';
import { fetchAppData, getDataURL } from '../../src/components/jsonUtils';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { UIController } from '../../src/components/uiController';

// Mocking external dependencies
jest.mock('./components/urlUtils');
jest.mock('./survey/survey');
jest.mock('./assessment/assessment');
jest.mock('firebase/app');
jest.mock('firebase/analytics');
jest.mock('workbox-window');
jest.mock('./components/jsonUtils');
jest.mock('./components/uiController');

describe('App class', () => {
  let app: App;

  beforeEach(() => {
    // Mocking methods and properties
    getDataFile.mockReturnValue('mock-data-url');
    getUUID.mockReturnValue('mock-uuid');
    getUserSource.mockReturnValue('mock-source');
    getDataURL.mockReturnValue('mock-data-url');
    fetchAppData.mockResolvedValue({ appType: 'survey', assessmentType: 'mock-assessment' });
    logEvent.mockImplementation(() => {});
    UIController.SetFeedbackText.mockImplementation(() => {});
    Workbox.mockImplementation(() => ({
      register: jest.fn().mockResolvedValue({
        installing: { postMessage: jest.fn() },
      }),
    }));

    app = new App();
  });

  it('should initialize app correctly', () => {
    expect(app).toBeDefined();
    expect(app.dataURL).toBe('mock-data-url');
    expect(app.unityBridge).toBeDefined();
    expect(app.analytics).toBeDefined();
    expect(app.cacheModel).toBeDefined();
  });

  it('should call firebase initialization during construction', () => {
    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(getAnalytics).toHaveBeenCalledTimes(1);
    expect(logEvent).toHaveBeenCalledWith(expect.any(Object), 'notification_received');
    expect(logEvent).toHaveBeenCalledWith(expect.any(Object), 'test initialization event', {});
  });

  it('should spin up app and load data', async () => {
    const spyRun = jest.spyOn(app.game, 'Run').mockImplementation(() => {});
    await app.spinUp();

    // Wait for the async parts to finish
    expect(fetchAppData).toHaveBeenCalledWith('mock-data-url');
    expect(spyRun).toHaveBeenCalled();
    expect(UIController.SetFeedbackText).toHaveBeenCalled();
    expect(app.game).toBeInstanceOf(Survey);
  });

  it('should register service worker', async () => {
    await app.registerServiceWorker(app.game, 'mock-data-url');

    const wb = new Workbox();
    expect(wb.register).toHaveBeenCalled();
  });

  it('should handle service worker message for loading', () => {
    const progressBar = { style: { width: '' } };
    global.document.getElementById = jest.fn().mockReturnValue(progressBar);

    const event = {
      data: { msg: 'Loading', data: { progress: '50', bookName: 'book1' } },
    };

    handleLoadingMessage(event, 50);
    expect(progressBar.style.width).toBe('50%');
  });

  it('should handle service worker update found', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    handleUpdateFoundMessage();

    expect(confirmSpy).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should handle reading language data and notifying Android', () => {
    global.localStorage.setItem('book1', 'true');
    const mockAndroid = { cachedStatus: jest.fn() };
    global.window.Android = mockAndroid;

    readLanguageDataFromCacheAndNotifyAndroidApp('book1');

    expect(mockAndroid.cachedStatus).toHaveBeenCalledWith(true);
  });

  it('should handle service worker registration error gracefully', () => {
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate an error in registration
    const wb = new Workbox();
    wb.register.mockRejectedValue(new Error('Service worker registration failed'));

    app.registerServiceWorker(app.game, 'mock-data-url');
    expect(spyConsoleError).toHaveBeenCalledWith(
      'Service worker registration failed: Error: Service worker registration failed'
    );
  });
});
