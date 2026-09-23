import { Assessment, BucketGenMode } from '../../src/assessment/assessment';
import { AssessmentUI } from '../../src/ui/assessment-ui';
import { fetchAssessmentBuckets } from '../../src/utils/jsonUtils';

jest.mock('../../src/utils/jsonUtils', () => ({
  fetchAssessmentBuckets: jest.fn(),
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

// 3 buckets x 3 items, every item carrying authored foils (as Spelling content does).
const makeBuckets = () =>
  [1, 2, 3].map((bucketID) => ({
    bucketID,
    items: ['a', 'b', 'c'].map((letter) => {
      const word = `${letter}${bucketID}`;
      return { itemName: word, itemText: word, foils: [`${word}x`, `${word}y`, `${word}z`] };
    }),
    usedItems: [],
    numTried: 0,
    numCorrect: 0,
    numConsecutiveWrong: 0,
    tested: false,
    passed: false,
    score: 0,
  }));

const makeUI = (): jest.Mocked<AssessmentUI> =>
  ({
    configure: jest.fn(),
    setLoadingVisible: jest.fn(),
    setLoadingProgress: jest.fn(),
    setContentLoaded: jest.fn(),
    setGameReady: jest.fn(),
    setSkipStartScreen: jest.fn(),
    showLanding: jest.fn(),
    showEnd: jest.fn(),
    prepareQuestion: jest.fn(),
    revealQuestion: jest.fn(),
    showFeedback: jest.fn(),
    addStar: jest.fn(),
    changeStarImageAfterAnimation: jest.fn(),
    progressChest: jest.fn(),
    getShownStarsCount: jest.fn(() => 0),
    setBucketControlsVisibility: jest.fn(),
    setExternalBucketControlsGenerationHandler: jest.fn(),
  }) as any;

describe('Dev-mode bucket controls walkthrough (FM-992)', () => {
  let buckets: ReturnType<typeof makeBuckets>;
  let ui: jest.Mocked<AssessmentUI>;

  const createAssessment = async (assessmentType: string) => {
    const assessment = new Assessment('test-data-url', {}, ui, assessmentType);
    assessment.isInDevMode = true;
    assessment['app'] = {
      GetDataURL: () => 'test-data-url',
      notifyClose: jest.fn(),
      notifyAssessmentCompleted: jest.fn(),
    } as any;
    // Buckets load in the default (binary search) mode, as they do in the real app.
    await assessment.buildBuckets(BucketGenMode.RandomBST);
    return assessment;
  };

  const enableBucketControls = () => {
    const checkbox = document.getElementById('devModeBucketControlsShownCheckbox') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
  };

  const lastPreparedQuestion = () => ui.prepareQuestion.mock.calls[ui.prepareQuestion.mock.calls.length - 1][0];

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = `
      <select id="devModeBucketGenSelect"><option value="0"></option><option value="1"></option></select>
      <input id="devModeBucketControlsShownCheckbox" type="checkbox">
      <div id="devModeBucketInfoContainer"></div>
    `;
    buckets = makeBuckets();
    (fetchAssessmentBuckets as jest.Mock).mockResolvedValue(buckets);
    ui = makeUI();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Spelling', () => {
    it('forces sequential mode when bucket controls are enabled', async () => {
      const assessment = await createAssessment('spelling');

      enableBucketControls();

      expect(assessment['bucketGenMode']).toBe(BucketGenMode.LinearArrayBased);
      expect((document.getElementById('devModeBucketGenSelect') as HTMLSelectElement).value).toBe('1');
      expect(ui.setBucketControlsVisibility).toHaveBeenLastCalledWith(true);
    });

    it('presents every item in authored order with its authored foils, regardless of answers, then ends', async () => {
      const assessment = await createAssessment('spelling');
      enableBucketControls();
      const bstSpy = jest.spyOn(assessment, 'tryMoveBucketRandomBST');

      assessment.startAssessment();

      const presented: string[] = [];
      let answerCorrectly = true;
      while (!ui.showEnd.mock.calls.length) {
        const q = lastPreparedQuestion();
        const item = buckets.flatMap((b) => b.items).find((i) => i.itemName === q.qTarget)!;
        presented.push(q.qTarget);

        // Authored foils + correct answer, nothing else.
        expect(q.answers.map((a: any) => a.answerText).sort()).toEqual([item.itemText, ...item.foils].sort());

        // Alternate right/wrong answers: neither may influence what comes next.
        const idx = q.answers.findIndex((a: any) => (a.answerName === q.correct) === answerCorrectly);
        answerCorrectly = !answerCorrectly;
        assessment.handleAnswerButtonPress(idx + 1, 0);
        await jest.advanceTimersByTimeAsync(10000);

        if (presented.length > 20) throw new Error('walkthrough did not terminate');
      }

      expect(presented).toEqual(buckets.flatMap((b) => b.items.map((i) => i.itemName)));
      // Each question is auto-revealed since the play-button slot holds the item buttons.
      expect(ui.revealQuestion).toHaveBeenCalledTimes(presented.length);
      expect(bstSpy).not.toHaveBeenCalled();
    });

    it('turns bucket controls off if the tester switches back to binary search', async () => {
      const assessment = await createAssessment('spelling');
      enableBucketControls();

      const select = document.getElementById('devModeBucketGenSelect') as HTMLSelectElement;
      select.value = '0';
      select.dispatchEvent(new Event('change'));

      expect(assessment.isBucketControlsEnabled).toBe(false);
      expect((document.getElementById('devModeBucketControlsShownCheckbox') as HTMLInputElement).checked).toBe(false);
      expect(ui.setBucketControlsVisibility).toHaveBeenLastCalledWith(false);
    });
  });

  describe('non-Spelling types keep the original behavior', () => {
    it('does not force sequential mode when bucket controls are enabled', async () => {
      const assessment = await createAssessment('letter-sounds');

      enableBucketControls();

      expect(assessment['bucketGenMode']).toBe(BucketGenMode.RandomBST);
      expect(ui.setBucketControlsVisibility).toHaveBeenLastCalledWith(false);
    });

    it('re-presents the same item after answering in sequential mode with bucket controls', async () => {
      const assessment = await createAssessment('sight-words');
      const select = document.getElementById('devModeBucketGenSelect') as HTMLSelectElement;
      select.value = '1';
      select.dispatchEvent(new Event('change'));
      enableBucketControls();

      assessment.startAssessment();
      const first = lastPreparedQuestion().qTarget;
      assessment.handleAnswerButtonPress(1, 0);
      await jest.advanceTimersByTimeAsync(10000);

      expect(lastPreparedQuestion().qTarget).toBe(first);
      expect(ui.revealQuestion).not.toHaveBeenCalled();
    });
  });

  it('reports no linear questions left past the last bucket instead of throwing', async () => {
    const assessment = await createAssessment('letter-sounds');
    assessment['bucketGenMode'] = BucketGenMode.LinearArrayBased;
    assessment.currentBucket.passed = false;
    assessment.currentLinearBucketIndex = buckets.length;

    expect(() => assessment.HasQuestionsLeft()).not.toThrow();
    expect(assessment.HasQuestionsLeft()).toBe(false);
  });
});
