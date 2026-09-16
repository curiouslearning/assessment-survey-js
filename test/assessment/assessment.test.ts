import { Assessment, BucketGenMode } from '../../src/assessment/assessment';
import { UIController } from '../../src/ui/uiController';
import { AudioController } from '../../src/components/audioController';
import { fetchAssessmentBuckets } from '../../src/utils/jsonUtils';
import { LegacyAssessmentUIAdapter } from '../../src/ui/legacy';

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

jest.mock('../../src/analytics/firestore-integration', () => ({
  FirestoreIntegration: {
    getInstance: jest.fn(() => ({
      writeCompletionRecord: jest.fn(),
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
    assessment = new Assessment('test-data-url', { SendLoaded: jest.fn(), SendClose: jest.fn() }, new LegacyAssessmentUIAdapter());
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

  it('uses authored foils exactly when the target item has them (FM-996)', () => {
    // Single-item bucket whose item carries authored foils (as spelling items do).
    assessment.currentBucket = {
      bucketID: 1,
      bucketName: 'b1',
      items: [{ itemName: 'makaranta', itemText: 'makaranta', foils: ['maƙaranta', 'mekaranta', 'mkaaranta'] }],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      passed: false,
      score: 0,
    } as any;
    assessment['bucketGenMode'] = BucketGenMode.RandomBST;

    const q = assessment.buildNewQuestion();

    // Exactly the target + its 3 authored foils — no random distractors.
    expect(q?.answers).toHaveLength(4);
    expect(q?.correct).toBe('makaranta');
    expect(q?.answers.map((a: any) => a.answerText).sort()).toEqual(
      ['makaranta', 'maƙaranta', 'mekaranta', 'mkaaranta'].sort()
    );
  });

  it('falls back to random foil generation when the item has no authored foils (FM-996)', () => {
    // Foil-less items (letter-sounds / sight-words) must behave exactly as before.
    assessment.currentBucket = {
      bucketID: 1,
      bucketName: 'b1',
      items: [
        { itemName: 'a', itemText: 'a' },
        { itemName: 'b', itemText: 'b' },
        { itemName: 'c', itemText: 'c' },
        { itemName: 'd', itemText: 'd' },
      ],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      passed: false,
      score: 0,
    } as any;
    assessment['bucketGenMode'] = BucketGenMode.RandomBST;

    const q = assessment.buildNewQuestion();

    // 4 options, all drawn from the bucket's own items (random generation), none authored.
    expect(q?.answers).toHaveLength(4);
    expect(q?.answers.map((a: any) => a.answerName).sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should report whether questions are left based on current bucket state', () => {
    assessment.currentBucket = { ...mockBuckets[0], passed: false, numCorrect: 0, numConsecutiveWrong: 0, numTried: 0 } as any;
    expect(assessment.HasQuestionsLeft()).toBe(true);

    assessment.currentBucket = { ...mockBuckets[0], passed: true, numCorrect: 4, numConsecutiveWrong: 0, numTried: 5 } as any;
    expect(assessment.HasQuestionsLeft()).toBe(false);
  });

  describe('Firebase Analytics event parity (FM-986)', () => {
    // TapToAnswerController and DragToAnswerController (src/ui/tap-to-answer-controller.ts,
    // src/ui/drag-drop/drag-to-answer-controller.ts) both call the identical
    // AssessmentUI.onAnswer({ answerIndex, elapsedMs }) contract, which Assessment always
    // routes through this single, UI-agnostic handleAnswerButtonPress entry point — so an
    // event emitted here is by construction identical regardless of which interaction
    // (tap, for Spelling, or drag, for every other assessment type) produced it.
    it('given any answer interaction, when handleAnswerButtonPress runs, then it emits a complete ANSWERED event with the same structure used by every assessment type', () => {
      assessment.currentBucket = { ...mockBuckets[0] } as any;
      assessment.currentQuestion = {
        qNumber: 3,
        qTarget: 'Alpha',
        promptText: 'prompt',
        bucket: 1,
        answers: [{ answerName: 'Alpha' }, { answerName: 'Beta' }],
        correct: 'Alpha',
      } as any;

      assessment.handleAnswerButtonPress(1, 750);

      expect(assessment.analyticsIntegration!.track).toHaveBeenCalledWith('answered', {
        type: 'answered',
        dt: 750,
        question_number: 3,
        target: 'Alpha',
        question: 'prompt',
        selected_answer: 'Alpha',
        iscorrect: true,
        options: 'Alpha,Beta,',
        bucket: 1,
      });
    });

    it('given a bucket is completed under RandomBST (the mode every live assessment type, including Spelling, uses), when the bucket transition happens, then it emits a complete BUCKET_COMPLETED event unchanged in shape', () => {
      assessment.currentBucket = { ...mockBuckets[0], numTried: 5, numCorrect: 4 } as any;
      assessment.currentNode = { value: mockBuckets[1] } as any;
      assessment['bucketGenMode'] = BucketGenMode.RandomBST;

      assessment.tryMoveBucket(true);

      expect(assessment.analyticsIntegration!.track).toHaveBeenCalledWith('bucketCompleted', {
        type: 'bucketCompleted',
        bucketNumber: 1,
        numberTriedInBucket: 5,
        numberCorrectInBucket: 4,
        passedBucket: true,
      });
    });
  });

  describe('Firestore completion recording (FM-986)', () => {
    const completionBuckets = [
      { bucketID: 1, tested: true, passed: true, numCorrect: 5, numTried: 5, numConsecutiveWrong: 0, score: 100, items: [{}, {}], usedItems: [] },
    ] as any;

    beforeEach(() => {
      assessment['app'].notifyAssessmentCompleted = jest.fn();
    });

    it('given the session assessmentType is "spelling", when LogCompletedEvent runs, then writeCompletionRecord is called exactly once with the completion data', () => {
      assessment.commonProperties = {
        cr_user_id: 'user-1',
        language: 'hausa',
        app: 'ftm',
        assessmentType: 'spelling',
      } as any;

      assessment['LogCompletedEvent'](completionBuckets, 1, 1);

      expect(assessment.firestoreIntegration!.writeCompletionRecord).toHaveBeenCalledTimes(1);
      expect(assessment.firestoreIntegration!.writeCompletionRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          clUserId: 'user-1',
          assessmentType: 'spelling',
          lang: 'hausa',
        })
      );
    });

    it.each([undefined, 'reading'])(
      'given the session assessmentType is %p (not spelling), when LogCompletedEvent runs, then writeCompletionRecord is NOT called',
      (assessmentType) => {
        assessment.commonProperties = { cr_user_id: 'user-1', language: 'english', app: 'ftm', assessmentType } as any;

        assessment['LogCompletedEvent'](completionBuckets, 1, 1);

        expect(assessment.firestoreIntegration!.writeCompletionRecord).not.toHaveBeenCalled();
      }
    );

    it('given firestoreIntegration is null (not initialized), when LogCompletedEvent runs for a spelling session, then no error is thrown and the Firebase COMPLETED event still fires', () => {
      assessment.firestoreIntegration = null;
      assessment.commonProperties = {
        cr_user_id: 'user-1',
        language: 'hausa',
        app: 'ftm',
        assessmentType: 'spelling',
      } as any;

      expect(() => assessment['LogCompletedEvent'](completionBuckets, 1, 1)).not.toThrow();

      expect(assessment.analyticsIntegration!.track).toHaveBeenCalledWith('completed', expect.any(Object));
    });
  });
});
