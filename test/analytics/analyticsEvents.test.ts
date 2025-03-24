import { AnalyticsEvents } from '../../src/analytics/analyticsEvents'; // Adjust the import path as needed
import { logEvent } from 'firebase/analytics'; // Mock this in tests
import { bucket } from '../../src/assessment/bucketData'; // Ensure this is the correct path to the bucket type
import { qData } from '../../src/components/questionData';
// Mock dependencies
jest.mock('firebase/analytics', () => ({
  logEvent: jest.fn(),
}));

const mockBuckets: bucket[] = [
  {
    bucketID: 1,
    tested: true,
    passed: true,
    numCorrect: 3,
    items: [], // Add this
    usedItems: [], // Add this
    numTried: 5, // Add this
    numConsecutiveWrong: 1, // Add this
    score: 50, // Add this
  },
  {
    bucketID: 2,
    tested: true,
    passed: false,
    numCorrect: 2,
    items: [],
    usedItems: [],
    numTried: 4,
    numConsecutiveWrong: 2,
    score: 40,
  },
  {
    bucketID: 3,
    tested: true,
    passed: true,
    numCorrect: 5,
    items: [],
    usedItems: [],
    numTried: 3,
    numConsecutiveWrong: 0,
    score: 100,
  },
];

describe('AnalyticsEvents.joinLatLong', () => {
  it('should join latitude and longitude with a comma', () => {
    expect(AnalyticsEvents.joinLatLong('12.3456', '78.9101')).toBe('12.3456,78.9101');
  });

  it('should handle empty latitude and longitude', () => {
    expect(AnalyticsEvents.joinLatLong('', '')).toBe(',');
  });

  it('should work with negative latitude and longitude values', () => {
    expect(AnalyticsEvents.joinLatLong('-45.678', '-123.456')).toBe('-45.678,-123.456');
  });

  it('should work with whole number latitude and longitude', () => {
    expect(AnalyticsEvents.joinLatLong('10', '20')).toBe('10,20');
  });

  it('should work with extra spaces in latitude and longitude', () => {
    expect(AnalyticsEvents.joinLatLong('  40.7128  ', ' -74.0060  ')).toBe('  40.7128  , -74.0060  ');
  });
});

describe('AnalyticsEvents.getCeilingBucketID', () => {
  it('should return the highest bucketID where tested and passed are true', () => {
    const buckets: bucket[] = [
      { bucketID: 1, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true },
      { bucketID: 2, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true },
      { bucketID: 3, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true }
    ];
    expect(AnalyticsEvents.getCeilingBucketID(buckets)).toBe(3);
  });

  it('should return 0 if no bucket is tested and passed', () => {
    const buckets: bucket[] = [
      { bucketID: 1, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: false, score: 0, passed: true },
      { bucketID: 2, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false },
      { bucketID: 3, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: false, score: 0, passed: false }
    ];
    expect(AnalyticsEvents.getCeilingBucketID(buckets)).toBe(0);
  });

  it('should return 0 for an empty bucket list', () => {
    expect(AnalyticsEvents.getCeilingBucketID([])).toBe(0);
  });

  it('should handle cases where some buckets are tested and passed, while others are not', () => {
    const buckets: bucket[] = [
      { bucketID: 1, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true },
      { bucketID: 2, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: false, score: 0, passed: true },
      { bucketID: 3, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false },
      { bucketID: 4, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true }
    ];
    expect(AnalyticsEvents.getCeilingBucketID(buckets)).toBe(4);
  });

  it('should return the only bucketID if there is only one bucket that passed and tested', () => {
    const buckets: bucket[] = [
      { bucketID: 5, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true }
    ];
    expect(AnalyticsEvents.getCeilingBucketID(buckets)).toBe(5);
  });
});
describe('AnalyticsEvents.getBasalBucketID', () => {
  it('should return the lowest bucketID where tested is true and passed is false', () => {
    const buckets: bucket[] = [
      { bucketID: 5, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true },
      { bucketID: 2, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false },
      { bucketID: 3, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false }
    ];
    expect(AnalyticsEvents.getBasalBucketID(buckets)).toBe(2);
  });

  it('should return 0 if no bucket is tested and failed', () => {
    const buckets: bucket[] = [
      { bucketID: 1, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: false, score: 0, passed: false },
      { bucketID: 2, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true },
      { bucketID: 3, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: false, score: 0, passed: true }
    ];
    expect(AnalyticsEvents.getBasalBucketID(buckets)).toBe(0);
  });

  it('should return 0 for an empty bucket list', () => {
    expect(AnalyticsEvents.getBasalBucketID([])).toBe(0);
  });

  it('should return the lowest bucket ID when multiple tested and failed buckets exist', () => {
    const buckets: bucket[] = [
      { bucketID: 4, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false },
      { bucketID: 1, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false },
      { bucketID: 6, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: true }
    ];
    expect(AnalyticsEvents.getBasalBucketID(buckets)).toBe(1);
  });

  it('should return the only bucketID if there is only one tested and failed bucket', () => {
    const buckets: bucket[] = [
      { bucketID: 7, items: [], usedItems: [], numTried: 0, numCorrect: 0, numConsecutiveWrong: 0, tested: true, score: 0, passed: false }
    ];
    expect(AnalyticsEvents.getBasalBucketID(buckets)).toBe(7);
  });
});
describe('calculateScore', () => {
  it('should return a perfect score if basalBucketID is the last bucket and numCorrect is at least 4', () => {
    const buckets: bucket[] = [
      { bucketID: 1, numCorrect: 3, tested: true, passed: false, numTried: 5, numConsecutiveWrong: 2, score: 50, items: [], usedItems: [] },
      { bucketID: 2, numCorrect: 5, tested: true, passed: true, numTried: 5, numConsecutiveWrong: 0, score: 100, items: [], usedItems: [] },
      { bucketID: 3, numCorrect: 4, tested: true, passed: true, numTried: 5, numConsecutiveWrong: 1, score: 80, items: [], usedItems: [] }
    ];

    const result = AnalyticsEvents.calculateScore(buckets, 3);
    expect(result).toBe(300);
  });

  it('should return the correct score for a middle basal bucket', () => {
    const buckets: bucket[] = [
      { bucketID: 1, numCorrect: 5, tested: true, passed: true, numTried: 5, numConsecutiveWrong: 0, score: 100, items: [], usedItems: [] },
      { bucketID: 2, numCorrect: 3, tested: true, passed: false, numTried: 5, numConsecutiveWrong: 2, score: 60, items: [], usedItems: [] },
      { bucketID: 3, numCorrect: 2, tested: true, passed: false, numTried: 5, numConsecutiveWrong: 3, score: 40, items: [], usedItems: [] }
    ];

    const result = AnalyticsEvents.calculateScore(buckets, 2);
    expect(result).toBe(120); // (2 - 1) * 100 + (3/5) * 100
  });

  it('should return zero if the basal bucket is 1 with zero correct answers', () => {
    const buckets: bucket[] = [
      { bucketID: 1, numCorrect: 0, tested: true, passed: false, numTried: 5, numConsecutiveWrong: 5, score: 0, items: [], usedItems: [] },
      { bucketID: 2, numCorrect: 5, tested: true, passed: true, numTried: 5, numConsecutiveWrong: 0, score: 100, items: [], usedItems: [] }
    ];

    const result = AnalyticsEvents.calculateScore(buckets, 1);
    expect(result).toBe(0);
  });

  it('should correctly compute scores for varying numCorrect values', () => {
    const buckets: bucket[] = [
      { bucketID: 1, numCorrect: 2, tested: true, passed: false, numTried: 5, numConsecutiveWrong: 3, score: 40, items: [], usedItems: [] },
      { bucketID: 2, numCorrect: 5, tested: true, passed: true, numTried: 5, numConsecutiveWrong: 0, score: 100, items: [], usedItems: [] }
    ];

    const result = AnalyticsEvents.calculateScore(buckets, 1);
    expect(result).toBe(40); // (1 - 1) * 100 + (2/5) * 100
  });

  it('should return a rounded score when calculations involve fractions', () => {
    const buckets: bucket[] = [
      { bucketID: 1, numCorrect: 3, tested: true, passed: true, numTried: 5, numConsecutiveWrong: 2, score: 60, items: [], usedItems: [] },
      { bucketID: 2, numCorrect: 2, tested: true, passed: false, numTried: 5, numConsecutiveWrong: 3, score: 40, items: [], usedItems: [] }
    ];

    const result = AnalyticsEvents.calculateScore(buckets, 2);
    expect(result).toBe(120); // (2 - 1) * 100 + (2/5) * 100
  });
});
describe('sendDataToThirdParty', () => {
  let originalLocation: Location;
  let mockXHR: Partial<XMLHttpRequest> & { send: jest.Mock };

  beforeEach(() => {
    // Backup original window location
    originalLocation = window.location;

    // Mock window.location.search to simulate URL parameters
    delete (window as any).location;
    (window as any).location = {
      search: '?endpoint=https://example.com/api&organization=TestOrg',
    };

    // Mock XMLHttpRequest with all required properties
    mockXHR = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      onload: jest.fn(),
      status: 200,
      responseText: 'Success',
      readyState: 4,
    };

    // Mock the constructor and static properties of XMLHttpRequest
    global.XMLHttpRequest = jest.fn(() => mockXHR as unknown as XMLHttpRequest) as any;
    Object.assign(global.XMLHttpRequest, {
      UNSENT: 0,
      OPENED: 1,
      HEADERS_RECEIVED: 2,
      LOADING: 3,
      DONE: 4,
    });
  });

  afterEach(() => {
    // Restore original window location
    (window as any).location = originalLocation;
  });

  it('should send a valid request if endpoint exists', () => {
    const uuid = '12345-uuid';
    const score = 85;

    AnalyticsEvents.sendDataToThirdParty(score, uuid);

    expect(mockXHR.open).toHaveBeenCalledWith('POST', 'https://example.com/api', true);
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockXHR.send).toHaveBeenCalledWith(
      JSON.stringify({
        user: uuid,
        page: '111108121363615',
        event: {
          type: 'external',
          value: {
            type: 'assessment',
            subType: undefined, // Assuming `AnalyticsEvents.assessmentType` is undefined
            score: score,
            completed: true,
          },
        },
      })
    );
  });

  it('should log an error if endpoint is missing', () => {
    console.error = jest.fn();

    // Simulate no `endpoint` in URL params
    delete (window as any).location;
    (window as any).location = {
      search: '',
    };

    AnalyticsEvents.sendDataToThirdParty(90, 'test-uuid');

    expect(console.error).toHaveBeenCalledWith('No target party URL found!');
  });

  it('should log success if the request succeeds', () => {
    console.log = jest.fn();

    // Simulate a successful request
    (mockXHR.onload as Function)();

    expect(console.log).toHaveBeenCalledWith('POST success!' + 'Success');
  });
  it('should log an error if the request fails', () => {
    console.error = jest.fn();

    // Change the mocked status dynamically
    Object.defineProperty(mockXHR, 'status', { get: () => 400 });

    AnalyticsEvents.sendDataToThirdParty(60, 'test-uuid');

    // Simulate onload callback
    (mockXHR.onload as Function)();

    expect(console.error).toHaveBeenCalledWith('Request failed with status: ' + 400);
  });

  it('should handle exceptions during the request', () => {
    console.error = jest.fn();
    jest.spyOn(mockXHR, 'send').mockImplementation(() => {
      throw new Error('Network error');
    });

    AnalyticsEvents.sendDataToThirdParty(100, 'test-uuid');

    expect(console.error).toHaveBeenCalledWith('Failed to send data to target party: ', expect.any(Error));
  });
});
describe('sendFinished', () => {
  let mockPostMessage: jest.SpyInstance;
  let mockSendDataToThirdParty: jest.SpyInstance;
  let mockGetBasalBucketID: jest.SpyInstance;
  let mockGetCeilingBucketID: jest.SpyInstance;
  let mockCalculateScore: jest.SpyInstance;

  

  beforeEach(() => {
    mockPostMessage = jest.spyOn(window.parent, 'postMessage').mockImplementation(() => {});
    mockSendDataToThirdParty = jest.spyOn(AnalyticsEvents, 'sendDataToThirdParty').mockImplementation(() => {});
    mockGetBasalBucketID = jest.spyOn(AnalyticsEvents, 'getBasalBucketID').mockReturnValue(2);
    mockGetCeilingBucketID = jest.spyOn(AnalyticsEvents, 'getCeilingBucketID').mockReturnValue(3);
    mockCalculateScore = jest.spyOn(AnalyticsEvents, 'calculateScore').mockReturnValue(200);
    
    // Mock UUID and user source
    AnalyticsEvents.uuid = 'test-uuid';
    AnalyticsEvents.userSource = 'test-source';
    AnalyticsEvents.appVersion = '1.0.0';
    AnalyticsEvents.contentVersion = '2.0.0';

    // Mock app and language
    jest.spyOn(AnalyticsEvents, 'getAppTypeFromDataURL').mockReturnValue('assessment');
    jest.spyOn(AnalyticsEvents, 'getAppLanguageFromDataURL').mockReturnValue('en');
    jest.spyOn(AnalyticsEvents, 'joinLatLong').mockReturnValue('12.34,56.78');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log event and send data correctly', () => {
    AnalyticsEvents.sendFinished(mockBuckets, 2, 3);

    expect(mockGetBasalBucketID).toHaveBeenCalledWith(mockBuckets);
    expect(mockGetCeilingBucketID).toHaveBeenCalledWith(mockBuckets);
    expect(mockCalculateScore).toHaveBeenCalledWith(mockBuckets, 2);
    expect(mockSendDataToThirdParty).toHaveBeenCalledWith(200, 'test-uuid');
    
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'completed', expect.objectContaining({
      type: 'completed',
      clUserId: 'test-uuid',
      userSource: 'test-source',
      app: 'assessment',
      lang: 'en',
      latLong: '12.34,56.78',
      score: 200,
      maxScore: 300, // (mockBuckets.length * 100)
      basalBucket: 2,
      ceilingBucket: 3,
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
    }));
  });

  it('should send postMessage if window.parent exists', () => {
    AnalyticsEvents.sendFinished(mockBuckets, 2, 3);

    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'assessment_completed', score: 200 },
      'https://synapse.curiouscontent.org/'
    );
  });

  it('should handle missing basal bucket by setting it to ceiling bucket', () => {
    mockGetBasalBucketID.mockReturnValue(0);
    
    AnalyticsEvents.sendFinished(mockBuckets, 2, 3);

    expect(mockCalculateScore).toHaveBeenCalledWith(mockBuckets, 3); // Basal is replaced with ceiling
  });

  it('should not call postMessage if window.parent is undefined', () => {
    delete (window as any).parent;
    
    AnalyticsEvents.sendFinished(mockBuckets, 2, 3);

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('should handle an empty bucket list', () => {
    AnalyticsEvents.sendFinished([], 1, 2);

    expect(mockCalculateScore).toHaveBeenCalledWith([], 2);
    expect(mockSendDataToThirdParty).toHaveBeenCalledWith(200, 'test-uuid');
  });
});

describe('sendBucket', () => {
  let mockBucket: bucket;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock bucket object with required properties
    mockBucket = {
      bucketID: 1,
      numTried: 5,
      numCorrect: 3,
      tested: true,
      passed: true,
      items: [],
      usedItems: [],
      numConsecutiveWrong: 1,
      score: 60,
    };

    // Mock AnalyticsEvents properties
    AnalyticsEvents.uuid = 'test-user-123';
    AnalyticsEvents.gana = 'google-analytics-test';
    AnalyticsEvents.clat = '12.345';
    AnalyticsEvents.clon = '67.890';
    AnalyticsEvents.appVersion = '1.0.0';
    AnalyticsEvents.contentVersion = '2.0.0';
    AnalyticsEvents.getAppTypeFromDataURL = jest.fn(() => 'test-app');
    AnalyticsEvents.getAppLanguageFromDataURL = jest.fn(() => 'en');
    AnalyticsEvents.joinLatLong = jest.fn(() => '12.345,67.890');
  });

  it('should call logEvent with correct parameters when passed=true', () => {
    AnalyticsEvents.sendBucket(mockBucket, true);

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'bucketCompleted', {
      type: 'bucketCompleted',
      clUserId: 'test-user-123',
      userSource: AnalyticsEvents.userSource,
      latLong: '12.345,67.890',
      app: 'test-app',
      lang: 'en',
      bucketNumber: 1,
      numberTriedInBucket: 5,
      numberCorrectInBucket: 3,
      passedBucket: true,
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
    });
  });

  it('should call logEvent with correct parameters when passed=false', () => {
    AnalyticsEvents.sendBucket(mockBucket, false);

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'bucketCompleted', {
      type: 'bucketCompleted',
      clUserId: 'test-user-123',
      userSource: AnalyticsEvents.userSource,
      latLong: '12.345,67.890',
      app: 'test-app',
      lang: 'en',
      bucketNumber: 1,
      numberTriedInBucket: 5,
      numberCorrectInBucket: 3,
      passedBucket: false,
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
    });
  });

  it('should format event string correctly', () => {
    console.log = jest.fn();
    AnalyticsEvents.sendBucket(mockBucket, true);

    expect(console.log).toHaveBeenCalledWith(
      'user test-user-123 finished the bucket 1 with 3 correct answers out of 5 tried and passed: true'
    );
  });
});
describe('sendAnswered', () => {
  let mockQuestion: qData;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock question data
    mockQuestion = {
      qNumber: 1,
      qName: 'Test Question',
      promptText: 'What is 2+2?',
      qTarget: 'Math',
      correct: '4',
      bucket: 2,
      answers: [
        { answerName: '3' },
        { answerName: '4' }, // Correct answer
        { answerName: '5' },
      ],
    };

    // Mock AnalyticsEvents properties
    AnalyticsEvents.uuid = 'test-user-123';
    AnalyticsEvents.gana = 'google-analytics-test';
    AnalyticsEvents.clat = '12.345';
    AnalyticsEvents.clon = '67.890';
    AnalyticsEvents.appVersion = '1.0.0';
    AnalyticsEvents.contentVersion = '2.0.0';
    AnalyticsEvents.getAppTypeFromDataURL = jest.fn(() => 'test-app');
    AnalyticsEvents.getAppLanguageFromDataURL = jest.fn(() => 'en');
    AnalyticsEvents.joinLatLong = jest.fn(() => '12.345,67.890');
  });

  it('should call logEvent with correct parameters for a correct answer', () => {
    AnalyticsEvents.sendAnswered(mockQuestion, 2, 5000); // Answer index 2 (correct answer "4")

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'answered', {
      type: 'answered',
      clUserId: 'test-user-123',
      userSource: AnalyticsEvents.userSource,
      latLong: '12.345,67.890',
      app: 'test-app',
      lang: 'en',
      dt: 5000,
      question_number: 1,
      target: 'Math',
      question: 'What is 2+2?',
      selected_answer: '4',
      iscorrect: true,
      options: '3,4,5,',
      bucket: 2,
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
    });
  });

  it('should call logEvent with correct parameters for an incorrect answer', () => {
    AnalyticsEvents.sendAnswered(mockQuestion, 1, 3000); // Answer index 1 (incorrect answer "3")

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'answered', {
      type: 'answered',
      clUserId: 'test-user-123',
      userSource: AnalyticsEvents.userSource,
      latLong: '12.345,67.890',
      app: 'test-app',
      lang: 'en',
      dt: 3000,
      question_number: 1,
      target: 'Math',
      question: 'What is 2+2?',
      selected_answer: '3',
      iscorrect: false,
      options: '3,4,5,',
      bucket: 2,
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
    });
  });

  it('should handle missing `correct` field without crashing', () => {
    delete mockQuestion.correct; // Remove correct answer field
    AnalyticsEvents.sendAnswered(mockQuestion, 2, 4000); // Select answer "4"

    expect(logEvent).toHaveBeenCalledWith(
      'google-analytics-test',
      'answered',
      expect.objectContaining({
        selected_answer: '4',
        iscorrect: null, // Since correct answer is missing
      })
    );
  });

  it('should handle missing `bucket` field gracefully', () => {
    delete mockQuestion.bucket; // Remove bucket field
    AnalyticsEvents.sendAnswered(mockQuestion, 2, 4000); // Select answer "4"

    expect(logEvent).toHaveBeenCalledWith(
      'google-analytics-test',
      'answered',
      expect.objectContaining({
        bucket: null, // Since bucket is missing
      })
    );
  });

  it('should log correct console output', () => {
    console.log = jest.fn();
    AnalyticsEvents.sendAnswered(mockQuestion, 2, 5000);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('user test-user-123 answered Test Question with 4')
    );
  });
});
describe('sendLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock AnalyticsEvents properties
    AnalyticsEvents.uuid = 'test-user-123';
    AnalyticsEvents.gana = 'google-analytics-test';
    AnalyticsEvents.clat = '12.345';
    AnalyticsEvents.clon = '67.890';
    AnalyticsEvents.appVersion = '1.0.0';
    AnalyticsEvents.contentVersion = '2.0.0';
    AnalyticsEvents.getAppTypeFromDataURL = jest.fn(() => 'test-app');
    AnalyticsEvents.getAppLanguageFromDataURL = jest.fn(() => 'en');
    AnalyticsEvents.joinLatLong = jest.fn(() => '12.345,67.890');
  });

  it('should call logEvent twice (for user_location and initialized)', () => {
    AnalyticsEvents.sendLocation();

    expect(logEvent).toHaveBeenCalledTimes(2);

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'user_location', {
      user: 'test-user-123',
      lang: 'en',
      app: 'test-app',
      latlong: '12.345,67.890',
    });

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'initialized', {
      type: 'initialized',
      clUserId: 'test-user-123',
      userSource: AnalyticsEvents.userSource,
      latLong: '12.345,67.890',
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
      app: 'test-app',
      lang: 'en',
    });
  });

  it('should log correct console messages', () => {
    console.log = jest.fn();
    AnalyticsEvents.sendLocation();

    expect(console.log).toHaveBeenCalledWith(
      'Sending User coordinates: test-user-123 : 12.345, 67.890'
    );
    expect(console.log).toHaveBeenCalledWith('INITIALIZED EVENT SENT');
    expect(console.log).toHaveBeenCalledWith('App Language: en');
    expect(console.log).toHaveBeenCalledWith('App Type: test-app');
    expect(console.log).toHaveBeenCalledWith('App Version: 1.0.0');
    expect(console.log).toHaveBeenCalledWith('Content Version: 2.0.0');
  });

  it('should handle missing latitude and longitude gracefully', () => {
    AnalyticsEvents.clat = null;
    AnalyticsEvents.clon = null;
    AnalyticsEvents.joinLatLong = jest.fn(() => 'Unknown');

    AnalyticsEvents.sendLocation();

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'user_location', {
      user: 'test-user-123',
      lang: 'en',
      app: 'test-app',
      latlong: 'Unknown',
    });

    expect(logEvent).toHaveBeenCalledWith('google-analytics-test', 'initialized', {
      type: 'initialized',
      clUserId: 'test-user-123',
      userSource: AnalyticsEvents.userSource,
      latLong: 'Unknown',
      appVersion: '1.0.0',
      contentVersion: '2.0.0',
      app: 'test-app',
      lang: 'en',
    });
  });
});
describe('getAppTypeFromDataURL', () => {
  it('should return the last segment after the last hyphen', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('curious-reader-app')).toBe('app');
    expect(AnalyticsEvents.getAppTypeFromDataURL('ftm-assessment-game')).toBe('game');
  });

  it('should return "NotAvailable" for an empty string', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('')).toBe('NotAvailable');
  });

  it('should return "NotAvailable" when input is null or undefined', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL(null as unknown as string)).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppTypeFromDataURL(undefined as unknown as string)).toBe('NotAvailable');
  });

  it('should return "NotAvailable" if there is no hyphen', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('singleword')).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppTypeFromDataURL('anotherexample')).toBe('NotAvailable');
  });

  it('should handle cases with multiple hyphens and return the last segment', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('multiple-hyphen-separated-words')).toBe('words');
    expect(AnalyticsEvents.getAppTypeFromDataURL('this-is-a-test')).toBe('test');
  });

  it('should handle strings that start or end with a hyphen', () => {
    expect(AnalyticsEvents.getAppTypeFromDataURL('-leadinghyphen')).toBe('leadinghyphen');
    expect(AnalyticsEvents.getAppTypeFromDataURL('trailinghyphen-')).toBe('');
  });
});
describe('getAppLanguageFromDataURL', () => {
  it('should return everything except the last segment', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('english-assessment')).toBe('english');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('hindi-basic-app')).toBe('hindi-basic');
  });

  it('should return "NotAvailable" for an empty string', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('')).toBe('NotAvailable');
  });

  it('should return "NotAvailable" when input is null or undefined', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL(null as unknown as string)).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppLanguageFromDataURL(undefined as unknown as string)).toBe('NotAvailable');
  });

  it('should return the full language name before the last hyphen', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('spanish-reading-level')).toBe('spanish-reading');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('tamil-learning-activity')).toBe('tamil-learning');
  });

  it('should return "west-african-english" if "west-african" is in the language', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('west-african-storybook')).toBe('west-african-english');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('west-african-reading-level')).toBe('west-african-english');
  });

  it('should return "NotAvailable" if there is no hyphen', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('singleword')).toBe('NotAvailable');
  });

  it('should handle strings that start or end with a hyphen', () => {
    expect(AnalyticsEvents.getAppLanguageFromDataURL('-leadinghyphen')).toBe('NotAvailable');
    expect(AnalyticsEvents.getAppLanguageFromDataURL('trailinghyphen-')).toBe('trailinghyphen');
  });
});
describe('sendInit', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    jest.spyOn(AnalyticsEvents, 'getLocation').mockImplementation(() => {}); // Mock getLocation
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set appVersion and contentVersion correctly', () => {
    AnalyticsEvents.sendInit('1.0.0', '2.5.3');

    expect(AnalyticsEvents.appVersion).toBe('1.0.0');
    expect(AnalyticsEvents.contentVersion).toBe('2.5.3');
  });

  it('should call getLocation once', () => {
    AnalyticsEvents.sendInit('1.0.0', '2.5.3');

    expect(AnalyticsEvents.getLocation).toHaveBeenCalledTimes(1);
  });

  it('should log the correct event string', () => {
    AnalyticsEvents.sendInit('1.0.0', '2.5.3');

    expect(console.log).toHaveBeenCalledWith(
      `user ${AnalyticsEvents.uuid} opened the assessment`
    );
  });

  it('should call logEvent with the correct parameters', () => {
    AnalyticsEvents.sendInit('1.0.0', '2.5.3');

    expect(logEvent).toHaveBeenCalledWith(AnalyticsEvents.gana, 'opened', {});
  });
});
describe('setUuid', () => {
  it('should set uuid and userSource correctly', () => {
    AnalyticsEvents.setUuid('12345', 'testSource');

    expect(AnalyticsEvents.uuid).toBe('12345');
    expect(AnalyticsEvents.userSource).toBe('testSource');
  });
});
describe('setAssessmentType', () => {
  it('should set assessmentType correctly', () => {
    AnalyticsEvents.setAssessmentType('reading');

    expect(AnalyticsEvents.assessmentType).toBe('reading');
  });
});
describe('linkAnalytics', () => {
  it('should set gana and dataURL correctly', () => {
    const mockGana = 'mockGoogleAnalytics';
    const mockDataURL = 'https://example.com/data';

    AnalyticsEvents.linkAnalytics(mockGana, mockDataURL);

    expect(AnalyticsEvents.gana).toBe(mockGana);
    expect(AnalyticsEvents.dataURL).toBe(mockDataURL);
  });
});