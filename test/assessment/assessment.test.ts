import { Assessment, BucketGenMode } from '../../src/assessment/assessment';
import { UIController } from '../../src/ui/uiController';
import { AudioController } from '../../src/components/audioController';
import { fetchAssessmentBuckets } from '../../src/utils/jsonUtils';

jest.mock('../../src/utils/jsonUtils', () => ({
  fetchAssessmentBuckets: jest.fn(),
}));

jest.mock('../../src/ui/uiController', () => ({
  UIController: {
    SetButtonPressAction: jest.fn(),
    SetStartAction: jest.fn(),
    SetExternalBucketControlsGenerationHandler: jest.fn(),
    SetFeedbackVisibile: jest.fn(),
    AddStar: jest.fn(),
    ReadyForNext: jest.fn(),
    ProgressChest: jest.fn(),
    ChangeStarImageAfterAnimation: jest.fn(),
    ShowQuestion: jest.fn(),
    ShowAudioAnimation: jest.fn(),
    getInstance: jest.fn(() => ({
      shownStarsCount: 0,
      answersContainer: { style: { visibility: 'hidden' } },
      buttons: [],
      shown: false,
      nextQuestion: null,
      questionsContainer: { innerHTML: '', style: { display: 'none' } },
      showOptions: jest.fn(),
      SetCorrectLabelVisibility: jest.fn(),
      SetAnimationSpeedMultiplier: jest.fn(),
      SetBucketControlsVisibility: jest.fn(),
    })),
  },
}));

jest.mock('../../src/components/audioController', () => ({
  AudioController: {
    PreloadBucket: jest.fn(),
    PlayAudio: jest.fn(),
  },
}));

jest.mock('../../src/analytics/analytics-integration', () => ({
  AnalyticsEventsType: {
    ANSWERED: 'answered',
    BUCKET_COMPLETED: 'bucketCompleted',
    COMPLETED: 'completed',
  },
  AnalyticsIntegration: {
    getInstance: jest.fn(() => ({
      track: jest.fn(),
      sendDataToThirdParty: jest.fn(),
    })),
  },
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

const mockBuckets = [
  {
    bucketID: 1,
    items: [
      { itemName: 'Alpha', itemText: 'Alpha' },
      { itemName: 'Beta', itemText: 'Beta' },
      { itemName: 'Gamma', itemText: 'Gamma' },
      { itemName: 'Delta', itemText: 'Delta' },
    ],
    usedItems: [],
    numTried: 0,
    numCorrect: 0,
    numConsecutiveWrong: 0,
    tested: false,
    passed: false,
    score: 0,
  },
  {
    bucketID: 2,
    items: [
      { itemName: 'Echo', itemText: 'Echo' },
      { itemName: 'Foxtrot', itemText: 'Foxtrot' },
      { itemName: 'Golf', itemText: 'Golf' },
      { itemName: 'Hotel', itemText: 'Hotel' },
    ],
    usedItems: [],
    numTried: 0,
    numCorrect: 0,
    numConsecutiveWrong: 0,
    tested: false,
    passed: false,
    score: 0,
  },
];

describe('Assessment Class', () => {
  let assessment: Assessment;

  beforeEach(() => {
    document.body.innerHTML = `
      <select id="devModeBucketGenSelect"></select>
      <div id="devModeBucketInfoContainer"></div>
    `;

    (fetchAssessmentBuckets as jest.Mock).mockResolvedValue(mockBuckets);
    assessment = new Assessment('test-data-url', { SendLoaded: jest.fn(), SendClose: jest.fn() });
    assessment['app'] = { GetDataURL: () => 'test-data-url', unityBridge: { SendClose: jest.fn() } } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    expect(assessment['bucketGenMode']).toBe(BucketGenMode.RandomBST);
    expect(assessment.currentNode).toBeUndefined();
    expect(assessment.bucketArray).toEqual([]);
    expect(assessment.questionNumber).toBe(0);
  });

  it('should load buckets correctly for RandomBST mode', async () => {
    await assessment.buildBuckets(BucketGenMode.RandomBST);

    expect(fetchAssessmentBuckets).toHaveBeenCalledWith('test-data-url');
    expect(assessment.buckets).toHaveLength(2);
    expect(assessment.currentBucket.bucketID).toBeDefined();
    expect(AudioController.PreloadBucket).toHaveBeenCalled();
  });

  it('should update bucket values after an answer is pressed', () => {
    assessment.currentBucket = { ...mockBuckets[0] } as any;
    assessment.currentQuestion = {
      answers: [{ answerName: 'Alpha' }, { answerName: 'Beta' }],
      correct: 'Alpha',
    } as any;

    assessment.handleAnswerButtonPress(1, 500);

    expect(assessment.currentBucket.numTried).toBe(1);
    expect(assessment.currentBucket.numCorrect).toBe(1);
    expect(assessment.currentBucket.numConsecutiveWrong).toBe(0);
    expect(UIController.AddStar).toHaveBeenCalled();
    expect(UIController.SetFeedbackVisibile).toHaveBeenCalledWith(true, true);
  });

  it('should generate bucket control buttons in dev mode', async () => {
    await assessment.buildBuckets(BucketGenMode.LinearArrayBased);
    assessment.isInDevMode = true;
    assessment['bucketGenMode'] = BucketGenMode.LinearArrayBased;

    const container = document.createElement('div');
    assessment.generateDevModeBucketControlsInContainer(container, jest.fn());

    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });

  it('should move the bucket in LinearArrayBased mode', async () => {
    await assessment.buildBuckets(BucketGenMode.LinearArrayBased);
    assessment['bucketGenMode'] = BucketGenMode.LinearArrayBased;
    assessment.currentLinearBucketIndex = 1;

    assessment.tryMoveBucket(false);

    expect(assessment.currentBucket.bucketID).toBe(2);
    expect(AudioController.PreloadBucket).toHaveBeenCalledWith(mockBuckets[1], 'test-data-url');
  });

  it('should build a new question with four answer options', async () => {
    await assessment.buildBuckets(BucketGenMode.RandomBST);
    const newQuestion = assessment.buildNewQuestion();

    expect(newQuestion?.qTarget).toBeDefined();
    expect(newQuestion?.answers).toHaveLength(4);
    expect(assessment.questionNumber).toBe(1);
  });

  it('should report whether questions are left based on current bucket state', () => {
    assessment.currentBucket = { ...mockBuckets[0], passed: false, numCorrect: 0, numConsecutiveWrong: 0, numTried: 0 } as any;
    expect(assessment.HasQuestionsLeft()).toBe(true);

    assessment.currentBucket = { ...mockBuckets[0], passed: true, numCorrect: 4, numConsecutiveWrong: 0, numTried: 5 } as any;
    expect(assessment.HasQuestionsLeft()).toBe(false);
  });
});
