import {
  fetchAppData,
  fetchAppType,
  fetchFeedback,
  fetchSurveyQuestions,
  fetchAssessmentBuckets,
  getDataURL,
  getCaseIndependentLangList,
} from '../../src/components/jsonUtils';

// Mock the global fetch function
global.fetch = jest.fn();

describe('JSON Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAppData', () => {
    it('should fetch and return data from the provided URL', async () => {
      const mockData = { key: 'value' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const url = 'appData';
      const data = await fetchAppData(url);

      expect(fetch).toHaveBeenCalledWith('/data/appData.json');
      expect(data).toEqual(mockData);
    });
  });

  describe('fetchAppType', () => {
    it('should fetch and return appType from the provided URL', async () => {
      const mockData = { appType: 'testApp' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const url = 'appType';
      const appType = await fetchAppType(url);

      expect(fetch).toHaveBeenCalledWith('/data/appType.json');
      expect(appType).toEqual('testApp');
    });
  });

  describe('fetchFeedback', () => {
    it('should fetch and return feedbackText from the provided URL', async () => {
      const mockData = { feedbackText: 'Test Feedback' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const url = 'feedback';
      const feedback = await fetchFeedback(url);

      expect(fetch).toHaveBeenCalledWith('/data/feedback.json');
      expect(feedback).toEqual('Test Feedback');
    });
  });

  describe('fetchSurveyQuestions', () => {
    it('should fetch and return questions from the provided URL', async () => {
      const mockData = { questions: ['Q1', 'Q2', 'Q3'] };
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const url = 'surveyQuestions';
      const questions = await fetchSurveyQuestions(url);

      expect(fetch).toHaveBeenCalledWith('/data/surveyQuestions.json');
      expect(questions).toEqual(['Q1', 'Q2', 'Q3']);
    });
  });

  describe('fetchAssessmentBuckets', () => {
    it('should fetch and return buckets from the provided URL', async () => {
      const mockData = { buckets: ['Bucket1', 'Bucket2'] };
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const url = 'assessmentBuckets';
      const buckets = await fetchAssessmentBuckets(url);

      expect(fetch).toHaveBeenCalledWith('/data/assessmentBuckets.json');
      expect(buckets).toEqual(['Bucket1', 'Bucket2']);
    });
  });

  describe('getDataURL', () => {
    it('should return the correct data URL', () => {
      const url = 'example';
      const dataUrl = getDataURL(url);

      expect(dataUrl).toBe('/data/example.json');
    });
  });

  describe('getCaseIndependentLangList', () => {
    it('should return the case-independent language list', () => {
      const langList = getCaseIndependentLangList();

      expect(langList).toEqual(['luganda']);
    });
  });
});
