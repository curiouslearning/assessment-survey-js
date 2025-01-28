import { AnalyticsEvents } from '../../src/analytics/analyticsEvents';
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  }),
  logEvent: jest.fn(),
}));
describe('AnalyticsEvents', () => {
  let originalXMLHttpRequest: typeof XMLHttpRequest;
  beforeAll(() => {
    // Save the original XMLHttpRequest to restore later
    originalXMLHttpRequest = global.XMLHttpRequest;
  });

  afterAll(() => {
    // Restore the original XMLHttpRequest
    global.XMLHttpRequest = originalXMLHttpRequest;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Singleton Behavior
  test('should return the same instance for multiple calls to getInstance', () => {
    const instance1 = AnalyticsEvents.getInstance();
    const instance2 = AnalyticsEvents.getInstance();
    expect(instance1).toBe(instance2);
  });

  // Setters
  test('should set uuid and userSource', () => {
    AnalyticsEvents.setUuid('1234', 'testSource');
    expect(AnalyticsEvents['uuid']).toBe('1234');
    expect(AnalyticsEvents['userSource']).toBe('testSource');
  });

  test('should set assessment type', () => {
    AnalyticsEvents.setAssessmentType('testAssessment');
    expect(AnalyticsEvents['assessmentType']).toBe('testAssessment');
  });

  // Data Parsing
  test('should return the correct app language', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('english-us')).toBe('english');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('west-african-english')).toBe('west-african-english');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('')).toBe('NotAvailable');
  });

  test('should return the correct app type', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('english-us')).toBe('us');
    expect(AnalyticsEvents.getAppTypeFromDataURL('')).toBe('NotAvailable');
  });

  // Event Sending
  test('should log user location', () => {
    const mockLogEvent = jest.fn();
    jest.spyOn(global.console, 'log').mockImplementation();
    AnalyticsEvents['uuid'] = '1234';
    AnalyticsEvents['clat'] = '37.7749';
    AnalyticsEvents['clon'] = '-122.4194';
    AnalyticsEvents.sendLocation();
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      'user_location',
      expect.objectContaining({
        user: '1234',
        latlong: '37.7749,-122.4194',
      })
    );
  });

  test('should send answered event', () => {
    const mockLogEvent = jest.fn();
    jest.spyOn(global.console, 'log').mockImplementation();
    const mockQuestion = {
      qName: 'Q1',
      qNumber: 1,
      qTarget: 'target',
      answers: [{ answerName: 'Answer1' }],
      correct: 'Answer1',
      promptText: 'This is the prompt text',
    };
    AnalyticsEvents.sendAnswered(mockQuestion, 1, 3000);
    expect(mockLogEvent).toHaveBeenCalledWith(
      expect.anything(),
      'answered',
      expect.objectContaining({
        question: 'Q1',
        iscorrect: true,
      })
    );
  });

  // Scoring Logic
  test('should calculate the correct score', () => {
    const mockBuckets = [
      {
        bucketID: 1,
        numCorrect: 4,
        tested: true,
        passed: true,
        items: [], // Add items here
        usedItems: [], // Add used items here
        numTried: 0,
        numConsecutiveWrong: 0,
        score: 100,
      },
    ];
    const score = AnalyticsEvents.calculateScore(mockBuckets, 1);
    expect(score).toBe(100);
  });

  test('should return the correct basal bucket ID', () => {
    const mockBuckets = [
      {
        bucketID: 1,
        numCorrect: 4,
        tested: true,
        passed: true,
        items: [], // Add items here
        usedItems: [], // Add used items here
        numTried: 0,
        numConsecutiveWrong: 0,
        score: 100,
      },
    ];
    expect(AnalyticsEvents.getBasalBucketID(mockBuckets)).toBe(1);
  });

  // Mock External Dependencies
  test('should fetch location successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ loc: '37.7749,-122.4194' }),
    });
    await AnalyticsEvents.getLocation();
    expect(AnalyticsEvents['clat']).toBe('37.77');
    expect(AnalyticsEvents['clon']).toBe('-122.4');
  });

  test('should send data to third-party successfully', () => {
    const mockXMLHttpRequest = jest.fn().mockImplementation(() => ({
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status: 200,
      responseText: 'success',
      onreadystatechange: jest.fn(),
    }));

    // Add static properties
    Object.assign(mockXMLHttpRequest, {
      UNSENT: 0,
      OPENED: 1,
      HEADERS_RECEIVED: 2,
      LOADING: 3,
      DONE: 4,
    });

    global.XMLHttpRequest = mockXMLHttpRequest as unknown as typeof XMLHttpRequest;

    AnalyticsEvents.sendDataToThirdParty(100, '1234');
    expect(mockXMLHttpRequest).toHaveBeenCalled();
  });
});
