import {
  calculateScore,
  getBasalBucketID,
  getCeilingBucketID,
  getCommonAnalyticsEventsProperties,
  getLocation,
  getMaxScore,
  setCommonAnalyticsEventsProperties,
  setLocationProperty,
} from '../../src/utils/AnalyticsUtils';

describe('AnalyticsUtils', () => {
  const buckets = [
    {
      bucketID: 1,
      tested: true,
      passed: false,
      numCorrect: 2,
      numTried: 5,
      numConsecutiveWrong: 3,
      score: 40,
      items: [{}, {}],
      usedItems: [],
    },
    {
      bucketID: 2,
      tested: true,
      passed: true,
      numCorrect: 5,
      numTried: 5,
      numConsecutiveWrong: 0,
      score: 100,
      items: [{}, {}, {}],
      usedItems: [],
    },
  ] as any;

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('stores and returns common analytics properties', () => {
    setCommonAnalyticsEventsProperties('user-1', 'english', 'assessment', 'campaign', 'v1', 'v2');
    setLocationProperty('11,22');

    expect(getCommonAnalyticsEventsProperties()).toEqual({
      cr_user_id: 'user-1',
      language: 'english',
      app: 'assessment',
      user_source: 'campaign',
      lat_lang: '11,22',
      content_version: 'v1',
      app_version: 'v2',
    });
  });

  it('returns the basal and ceiling bucket ids', () => {
    expect(getBasalBucketID(buckets)).toBe(1);
    expect(getCeilingBucketID(buckets)).toBe(2);
  });

  it('calculates score and max score', () => {
    expect(calculateScore(buckets, 1)).toBe(40);
    expect(getMaxScore(buckets, 2)).toBe(300);
    expect(getMaxScore([], 2)).toBe(0);
  });

  it('returns location when fetch succeeds', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ loc: '12.34,56.78' }),
    }) as any;

    await expect(getLocation()).resolves.toBe('12.34,56.78');
  });

  it('returns null when fetch response is not ok', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    }) as any;

    await expect(getLocation()).resolves.toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('location failed to update! encountered error: Bad Request');
  });

  it('returns null when fetch throws', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down')) as any;

    await expect(getLocation()).resolves.toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('location failed to update! encountered error: Network down');
  });
});
