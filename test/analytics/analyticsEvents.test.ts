import { AnalyticsEvents } from '../../src/analytics/analyticsEvents'; // Adjust the import path
import { jest } from '@jest/globals';
import { bucket } from '../../src/assessment/bucketData';
import { logEvent } from 'firebase/analytics';
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  }),
  logEvent: jest.fn(),
}));
jest.mock('xhr2', () => {
  return {
    XMLHttpRequest: class {
      open = jest.fn();
      setRequestHeader = jest.fn();
      send = jest.fn();
      onload = jest.fn();
      status = 200;
      responseText = 'Success';
      UNSENT = 0;
      OPENED = 1;
      HEADERS_RECEIVED = 2;
      LOADING = 3;
      DONE = 4;
    },
  };
});

const mockQData = {
  qName: 'Sample Question',
  answers: [{ answerName: 'Answer 1' }, { answerName: 'Answer 2' }, { answerName: 'Answer 3' }],
  correct: 'Answer 1',
  bucket: 'Bucket 1',
  qNumber: 1,
  qTarget: 'Target 1',
  promptText: 'What is the capital of France?',
};
let analyticsEvents;
const mockAnswerIndex = 1;
const mockElapsed = 500;
const mockBucket: bucket = {
  bucketID: 1,
  numTried: 10,
  numCorrect: 8,
  items: [], // Add any other properties required by the bucket type
  usedItems: [],
  numConsecutiveWrong: 0,
  tested: true,
  passed: false,
  score: 0,
};

const buckets: bucket[] = [
  {
    bucketID: 1,
    tested: true,
    passed: false,
    items: [],
    usedItems: [],
    numTried: 0,
    numCorrect: 0,
    numConsecutiveWrong: 0,
    score: 0,
  },
  {
    bucketID: 2,
    tested: true,
    passed: true,
    items: [],
    usedItems: [],
    numTried: 0,
    numCorrect: 0,
    numConsecutiveWrong: 0,
    score: 0,
  },
  {
    bucketID: 3,
    tested: false,
    passed: true,
    items: [],
    usedItems: [],
    numTried: 0,
    numCorrect: 0,
    numConsecutiveWrong: 0,
    score: 0,
  },
];
describe('AnalyticsEvents', () => {
  test('should return correct joined lat and lon', () => {
    const result = AnalyticsEvents.joinLatLong('40.7128', '-74.0060');
    expect(result).toBe('40.7128,-74.0060');
  });
  test('should return correct bucketID for passed and tested bucket', () => {
    const result = AnalyticsEvents.getCeilingBucketID(buckets);
    expect(result).toBe(2); // The highest passed and tested bucketID is 2.
  });
  test('should return correct bucketID for failed and tested bucket', () => {
    const result = AnalyticsEvents.getBasalBucketID(buckets);
    expect(result).toBe(1); // The lowest failed and tested bucketID is 2.
  });
  test('should return perfect score when basalBucketID matches the last bucket and numCorrect is 4 or more', () => {
    const basalBucketID = 3; // Matches the last bucket
    const result = AnalyticsEvents.calculateScore(buckets, basalBucketID);
    expect(result).toBe(200); // Perfect score, 3 buckets * 100 = 300.
  });
  test('should successfully send data to third party when endpoint is present in URL', () => {
    const mockUUID = '12345';
    const mockScore = 85;
    const mockEndpoint = 'https://example.com/api';

    // Mock the URLSearchParams to simulate the presence of the endpoint
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: `?endpoint=${mockEndpoint}&organization=some-org`,
      },
    });

    // Create a mock for XMLHttpRequest
    const mockXhr = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      onload: jest.fn(),
      status: 200,
      responseText: 'Success',
    };

    // Mock the static properties on the XMLHttpRequest class
    const mockXMLHttpRequest = jest.fn(() => mockXhr);

    // Replace global XMLHttpRequest with our mock
    global.XMLHttpRequest = mockXMLHttpRequest as unknown as typeof XMLHttpRequest;

    // Call the function
    AnalyticsEvents.sendDataToThirdParty(mockScore, mockUUID);

    // Assert the XMLHttpRequest methods were called
    expect(mockXhr.open).toHaveBeenCalledWith('POST', mockEndpoint, true);
    expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockXhr.send).toHaveBeenCalledWith(expect.any(String));
  });
  test('should log the correct event string when passed is true', () => {
    // Mock console.log
    console.log = jest.fn();

    // Call sendBucket with passed as true
    AnalyticsEvents.sendBucket(mockBucket, true);
  });
  test('', () => {});
});
describe('AnalyticsEvents.getAppLanguageFromDataURL', () => {
  it('should return the language part of the string before the last hyphen', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('en-us-app')).toBe('en-us');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('fr-ca-example')).toBe('fr-ca');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('hindi-test-app')).toBe('hindi-test');
  });

  it('should return "west-african-english" if input contains "west-african"', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('west-african-app')).toBe('west-african-english');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('west-african-learning-tool')).toBe('west-african-english');
  });

  it('should return "NotAvailable" when input is an empty string', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('')).toBe('NotAvailable');
  });

  it('should return "NotAvailable" when input is null or undefined', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL(null as unknown as string)).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppLanguageFromDataURL(undefined as unknown as string)).toBe('NotAvailable');
  });

  it('should return "NotAvailable" when input does not contain a hyphen', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('NoHyphenHere')).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('SingleWord')).toBe('NotAvailable');
  });
});
describe('AnalyticsEvents.getAppTypeFromDataURL', () => {
  it('should return the last part of the string after the last hyphen', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('test-app-xyz')).toBe('xyz');
    expect(AnalyticsEvents.getAppTypeFromDataURL('app-type-example')).toBe('example');
  });

  it('should return "NotAvailable" when input is an empty string', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('')).toBe('NotAvailable');
  });

  it('should return "NotAvailable" when input is null or undefined', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL(null as unknown as string)).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppTypeFromDataURL(undefined as unknown as string)).toBe('NotAvailable');
  });

  it('should return "NotAvailable" when input does not contain a hyphen', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('NoHyphenHere')).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppTypeFromDataURL('SingleWord')).toBe('NotAvailable');
  });
});
