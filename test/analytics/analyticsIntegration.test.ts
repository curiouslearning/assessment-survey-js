import { AnalyticsIntegration, AnalyticsEventsType } from '../../src/analytics/analytics-integration';
import * as AnalyticsUtils from '../../src/utils/AnalyticsUtils';
import { BaseAnalyticsIntegration } from '../../src/analytics/base-analytics-integration';

describe('AnalyticsIntegration', () => {
  const mockInitialize = function (this: any) {
    this.isInitialized = true;
    return Promise.resolve();
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    (AnalyticsIntegration as any).instance = null;
  });

  it('initializes analytics once and returns the singleton', async () => {
    const initializeSpy = jest.spyOn(BaseAnalyticsIntegration.prototype, 'initialize').mockImplementation(mockInitialize);

    await AnalyticsIntegration.initializeAnalytics();
    await AnalyticsIntegration.initializeAnalytics();

    expect(initializeSpy).toHaveBeenCalledTimes(1);
    expect(AnalyticsIntegration.getInstance()).toBeInstanceOf(AnalyticsIntegration);
  });

  it('throws when getInstance is called before initialization', () => {
    expect(() => AnalyticsIntegration.getInstance()).toThrow(
      'AnalyticsIntegration.initializeAnalytics() must be called before accessing the instance'
    );
  });

  it('tracks events with merged common properties', async () => {
    jest.spyOn(BaseAnalyticsIntegration.prototype, 'initialize').mockImplementation(mockInitialize);
    jest.spyOn(AnalyticsUtils, 'getCommonAnalyticsEventsProperties').mockReturnValue({
      cr_user_id: 'user-1',
      language: 'english',
      app: 'assessment',
      user_source: 'referral',
      lat_lang: '10,20',
      content_version: 'v1',
      app_version: 'v2',
    });

    const trackCustomEventSpy = jest
      .spyOn(BaseAnalyticsIntegration.prototype as any, 'trackCustomEvent')
      .mockImplementation(() => {});

    await AnalyticsIntegration.initializeAnalytics();
    const instance = AnalyticsIntegration.getInstance();

    instance.track(AnalyticsEventsType.INITIALIZE, { type: 'initialized' });

    expect(trackCustomEventSpy).toHaveBeenCalledWith('initialized', {
      clUserId: 'user-1',
      lang: 'english',
      app: 'assessment',
      latLong: '10,20',
      userSource: 'referral',
      appVersion: 'v2',
      contentVersion: 'v1',
      type: 'initialized',
    });
  });

  it('sends data to a third party when endpoint exists', async () => {
    jest.spyOn(BaseAnalyticsIntegration.prototype, 'initialize').mockImplementation(mockInitialize);
    await AnalyticsIntegration.initializeAnalytics();
    const instance = AnalyticsIntegration.getInstance();

    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { search: '?endpoint=https://example.com/api&organization=test' };

    const mockXHR = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      status: 200,
      responseText: 'ok',
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR as any) as any;

    instance.sendDataToThirdParty(88, 'uuid-1', 70, 'next-app', 'reading');

    expect(mockXHR.open).toHaveBeenCalledWith('POST', 'https://example.com/api', true);
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockXHR.send).toHaveBeenCalledWith(
      JSON.stringify({
        user: 'uuid-1',
        page: '111108121363615',
        event: {
          type: 'external',
          value: {
            type: 'assessment',
            subType: 'reading',
            score: 88,
            requiredScore: 70,
            nextAssessment: 'next-app',
            completed: true,
          },
        },
      })
    );

    (window as any).location = originalLocation;
  });

  it('logs an error and exits when endpoint is missing', async () => {
    jest.spyOn(BaseAnalyticsIntegration.prototype, 'initialize').mockImplementation(mockInitialize);
    await AnalyticsIntegration.initializeAnalytics();
    const instance = AnalyticsIntegration.getInstance();

    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { search: '' };

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    instance.sendDataToThirdParty(88, 'uuid-1', 70, 'next-app', 'reading');

    expect(errorSpy).toHaveBeenCalledWith('No target party URL found!');
    (window as any).location = originalLocation;
  });
});
