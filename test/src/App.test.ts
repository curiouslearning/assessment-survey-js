import { App } from '../../src/App';
import { Survey } from '../../src/survey/survey';
import { Assessment } from '../../src/assessment/assessment';
import { UnityBridge } from '../../src/components/unityBridge';
import { UIController } from '../../src/components/uiController';
import { fetchAppData, getDataURL } from '../../src/components/jsonUtils';
// import { CacheModel } from '../../src/components/cacheModel';
import { Workbox } from 'workbox-window';
// import { initializeApp } from 'firebase/app';

jest.mock('../../src/components/urlUtils', () => ({
  getUUID: jest.fn(),
  getUserSource: jest.fn(),
  getDataFile: jest.fn().mockReturnValue('mockDataFileURL'),
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

jest.mock('../../src/components/jsonUtils', () => ({
  fetchAppData: jest.fn().mockResolvedValue({
    appType: 'survey',
    assessmentType: 'mockAssessment',
    feedbackText: 'mock feedback',
    buckets: [],
    quizName: 'Luganda',
    contentVersion: 'v1.0',
  }),
  getDataURL: jest.fn().mockReturnValue('mockDataURL'),
}));

jest.mock('../../src/components/unityBridge', () => ({
  UnityBridge: jest.fn().mockImplementation(() => ({
    someMethod: jest.fn(),
  })),
}));

jest.mock('../../src/components/uiController', () => ({
  UIController: {
    SetFeedbackText: jest.fn(),
    SetContentLoaded: jest.fn(),
  },
}));

jest.mock('workbox-window', () => ({
  Workbox: jest.fn().mockImplementation(() => ({
    register: jest.fn().mockResolvedValue({
      installing: {
        postMessage: jest.fn(),
      },
    }),
  })),
}));
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  postMessage: jest.fn(),
  close: jest.fn(),
}));
describe('App', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct data URL', () => {
    expect(app.GetDataURL()).toBe('mockDataFileURL');
  });
  // it('should spin up the app correctly', async () => {
  //   await app.spinUp();
  //   console.log(fetchAppData);
  //   expect(fetchAppData).toHaveBeenCalledWith('mockDataURL');
  //   expect(UIController.SetFeedbackText).toHaveBeenCalledWith('mock feedback');
  //   expect(app.game).toBeInstanceOf(Survey);
  // });

  // it('should handle assessment type correctly', async () => {
  //   const mockData = {
  //     appType: 'assessment',
  //     assessmentType: 'mockAssessment',
  //     feedbackText: 'mock feedback',
  //     buckets: [{ items: [{ itemName: 'item1' }] }],
  //     quizName: 'English',
  //     contentVersion: 'v1.0',
  //   };
  //   // fetchAppData.mockResolvedValue(Promise.resolve(mockData));

  //   await app.spinUp();

  //   expect(fetchAppData).toHaveBeenCalledWith('mockDataFileURL');
  //   expect(app.game).toBeInstanceOf(Assessment);
  // });

  it('should register service worker correctly', async () => {
    const registerMock = jest.fn().mockResolvedValue({
      installing: {
        postMessage: jest.fn(),
      },
    });
    // Workbox.mockImplementationOnce(() => ({
    //   register: registerMock,
    // }));

    await app.registerServiceWorker(app.game, 'mockDataURL');

    expect(registerMock).toHaveBeenCalled();
  });

  it('should handle service worker message when loading', () => {
    const event = {
      data: {
        msg: 'Loading',
        data: { progress: '50' },
      },
    };
    const handleLoadingMessage = jest.fn();

    app['handleLoadingMessage'](event, 50);

    expect(handleLoadingMessage).toHaveBeenCalledWith(event, 50);
  });

  it('should handle service worker update found', () => {
    const handleUpdateFoundMessage = jest.fn();

    app['handleUpdateFoundMessage']();

    expect(handleUpdateFoundMessage).toHaveBeenCalled();
  });
});
