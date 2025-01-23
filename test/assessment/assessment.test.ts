import { Assessment, BucketGenMode } from '../../src/assessment/assessment';
import { UIController } from '../../src/components/uiController';
import { AnalyticsEvents } from '../../src/components/analyticsEvents';
import { AudioController } from '../../src/components/audioController';
import { App } from '../../src/App';

jest.mock('../../src/components/uiController');
jest.mock('../../src/components/analyticsEvents');
jest.mock('../../src/components/audioController');
jest.mock('../../src/App');
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  }),
  logEvent: jest.fn(),
}));

describe('Assessment Class', () => {
  let assessment;
  let mockApp;

  beforeEach(() => {
    const mockSelectElement = document.createElement('select');
    mockSelectElement.id = 'expected-id'; // Ensure this matches `this.devModeBucketGenSelectId` in your class
    document.body.appendChild(mockSelectElement);
    mockApp = new App();
    assessment = new Assessment('http://test-url.com', {});
  });
  afterEach(() => {
    // Clean up the DOM
    document.body.innerHTML = '';
  });
  it('should initialize with default values', () => {
    expect(assessment.bucketGenMode).toBe(BucketGenMode.RandomBST);
    expect(assessment.currentNode).toBeUndefined();
    expect(assessment.bucketArray).toEqual([]);
    expect(assessment.questionNumber).toBe(0);
  });

  describe('buildBuckets', () => {
    it('should load buckets correctly for RandomBST mode', async () => {
      assessment.bucketGenMode = BucketGenMode.RandomBST;
      const result = await assessment.buildBuckets(BucketGenMode.RandomBST);

      // Check that bucket generation logic was executed (mocked)
      expect(result).toBeUndefined();
      expect(assessment.buckets).not.toHaveLength(0);
      expect(assessment.currentNode).toBeDefined();
    });

    it('should load buckets correctly for LinearArrayBased mode', async () => {
      assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
      const result = await assessment.buildBuckets(BucketGenMode.LinearArrayBased);

      // Check that the correct bucket generation logic is executed (mocked)
      expect(result).toBeUndefined();
      expect(assessment.currentLinearBucketIndex).toBe(0);
    });
  });

  describe('handleBucketGenModeChange', () => {
    it('should change bucketGenMode and rebuild buckets', async () => {
      // Simulate bucketGenMode change
      const event = { target: { value: BucketGenMode.LinearArrayBased } };
      assessment.handleBucketGenModeChange(event);

      // Wait for buckets to be rebuilt
      await assessment.buildBuckets(BucketGenMode.LinearArrayBased);

      expect(assessment.bucketGenMode).toBe(BucketGenMode.LinearArrayBased);
      expect(assessment.currentLinearBucketIndex).toBe(0);
    });
  });

  describe('handleAnswerButtonPress', () => {
    it('should update bucket values after an answer is pressed', () => {
      const answer = 1;
      const elapsed = 500;
      const mockQuestion = {
        answers: [{ answerName: 'Correct Answer' }],
        correct: 'Correct Answer',
      };

      assessment.currentBucket = { numTried: 0, numCorrect: 0, numConsecutiveWrong: 0 };
      assessment.currentQuestion = mockQuestion;
      assessment.handleAnswerButtonPress(answer, elapsed);

      expect(assessment.currentBucket.numTried).toBe(1);
      expect(assessment.currentBucket.numCorrect).toBe(1);
      expect(assessment.currentBucket.numConsecutiveWrong).toBe(0);
    });
  });

  describe('updateCurrentBucketValuesAfterAnswering', () => {
    it('should update the bucket state after answering correctly', () => {
      const mockQuestion = {
        answers: [{ answerName: 'Correct Answer' }],
        correct: 'Correct Answer',
      };

      assessment.currentBucket = { numTried: 0, numCorrect: 0, numConsecutiveWrong: 0 };
      assessment.updateCurrentBucketValuesAfterAnswering(1);

      expect(assessment.currentBucket.numTried).toBe(1);
      expect(assessment.currentBucket.numCorrect).toBe(1);
      expect(assessment.currentBucket.numConsecutiveWrong).toBe(0);
    });

    it('should update the bucket state after answering incorrectly', () => {
      const mockQuestion = {
        answers: [{ answerName: 'Correct Answer' }],
        correct: 'Correct Answer',
      };

      assessment.currentBucket = { numTried: 0, numCorrect: 0, numConsecutiveWrong: 0 };
      assessment.updateCurrentBucketValuesAfterAnswering(2); // Wrong answer

      expect(assessment.currentBucket.numTried).toBe(1);
      expect(assessment.currentBucket.numCorrect).toBe(0);
      expect(assessment.currentBucket.numConsecutiveWrong).toBe(1);
    });
  });

  describe('generateDevModeBucketControlsInContainer', () => {
    it('should generate bucket control buttons in dev mode', () => {
      // Enable dev mode and simulate bucket control creation
      assessment.isInDevMode = true;
      assessment.bucketGenMode = BucketGenMode.LinearArrayBased;

      const mockContainer = document.createElement('div');
      const mockClickHandler = jest.fn();

      assessment.generateDevModeBucketControlsInContainer(mockContainer, mockClickHandler);

      // Check that buttons were generated
      expect(mockContainer.innerHTML).not.toBe('');
      expect(mockContainer.querySelectorAll('button').length).toBeGreaterThan(0);
    });
  });

  describe('tryMoveBucket', () => {
    it('should move the bucket in RandomBST mode', () => {
      const passed = true;
      const mockBucket = { bucketID: 1, passed: false };
      assessment.currentBucket = mockBucket;

      assessment.tryMoveBucket(passed);

      expect(assessment.currentBucket.passed).toBe(true);
    });

    it('should move the bucket in LinearArrayBased mode', () => {
      const passed = true;
      const mockBucket = { bucketID: 1, passed: false };
      assessment.currentBucket = mockBucket;

      assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
      assessment.tryMoveBucket(passed);

      expect(assessment.currentBucket.passed).toBe(true);
    });
  });

  describe('buildNewQuestion', () => {
    it('should build a new question with shuffled answers', () => {
      const mockItem = { itemName: 'Item A', itemText: 'Item Text A' };
      const mockFoils = [
        { itemName: 'Foil 1', itemText: 'Foil Text 1' },
        { itemName: 'Foil 2', itemText: 'Foil Text 2' },
      ];

      assessment.currentBucket = { items: [mockItem] };
      const newQuestion = assessment.buildNewQuestion();

      expect(newQuestion).toHaveProperty('qTarget', 'Item A');
      expect(newQuestion.answers.length).toBe(4); // Target + 3 foils
    });
  });

  describe('HasQuestionsLeft', () => {
    it('should return true if there are still questions left', () => {
      assessment.currentBucket = { passed: false, numCorrect: 0, numConsecutiveWrong: 0, numTried: 0 };
      expect(assessment.HasQuestionsLeft()).toBe(true);
    });

    it('should return false if no questions are left', () => {
      assessment.currentBucket = { passed: true, numCorrect: 4, numConsecutiveWrong: 0, numTried: 5 };
      expect(assessment.HasQuestionsLeft()).toBe(false);
    });
  });
});
