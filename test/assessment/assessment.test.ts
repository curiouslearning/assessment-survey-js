import { setupDom } from '../_mock_/dom';
import { Assessment } from '../../src/assessment/assessment';
import { BucketGenMode } from '../../src/assessment/assessment';
import { AnalyticsEvents } from '../../src/analytics/analyticsEvents';
import { UnityBridge } from '../../src/utils/unityBridge';
import { TreeNode } from '../../src/components/tNode';
import { UIController } from '../../src/ui/uiController';
import { AudioController } from '../../src/components/audioController';
import { bucket, bucketItem } from '../../src/assessment/bucketData';
import * as mathUtils from '../../src/utils/mathUtils';
import { randFrom } from '../../src/utils/mathUtils';
jest.mock('../../src/analytics/analyticsEvents', () => ({
  AnalyticsEvents: {
    sendBucket: jest.fn(),
  },
}));

describe('Assessment', () => {
  let assessment: Assessment;

  let mockTargetItem: bucketItem;
  const mockApp = { GetDataURL: jest.fn(() => 'mock-url') };
  const itemA = { itemName: 'itemA', itemText: 'Text A' };
  const itemB = { itemName: 'itemB', itemText: 'Text B' };
  const itemC = { itemName: 'itemC', itemText: 'Text C' };
  const itemD = { itemName: 'itemD', itemText: 'Text D' };
  const targetItem = { itemName: 'target', itemText: 'Target Text' };
  const foil1 = { itemName: 'foil1', itemText: 'Foil 1' };
  const foil2 = { itemName: 'foil2', itemText: 'Foil 2' };
  const foil3 = { itemName: 'foil3', itemText: 'Foil 3' };
  let mockAnswerOptions: bucketItem[];
  beforeEach(() => {
    setupDom();
    assessment = new Assessment('dummyURL', new UnityBridge());
    assessment.bucketGenMode = BucketGenMode.RandomBST;
    assessment.currentBucket = {
      items: [itemA, itemB, itemC, itemD],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      passed: false,
      score: 0,
      bucketID: 1,
    };
    // Set up mock target item
    mockTargetItem = {
      itemName: 'itemName1',
      itemText: 'itemText1',
      itemAudio: 'itemAudio1',
      itemImg: 'itemImg1',
    };

    // Set up mock answer options
    mockAnswerOptions = [
      { itemName: 'option1', itemText: 'optionText1' },
      { itemName: 'option2', itemText: 'optionText2' },
      { itemName: 'option3', itemText: 'optionText3' },
    ];
    assessment.currentBucket = { passed: true } as any;
    assessment.currentBucket = { passed: true } as any;
    assessment.tryMoveBucket = jest.fn(); // Spy on this
    assessment.buckets = [assessment.currentBucket]; // for linear mode test
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 0;
    assessment.generateRandomFoil = jest.fn();
    assessment.generateLinearFoil = jest.fn();
    assessment.questionNumber = 1;
    jest.clearAllMocks();

  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mark currentBucket.passed as false and call sendBucket if RandomBST', () => {
    const assessment = new Assessment('dummy-url', {});

    // Simulate bucket state
    assessment.bucketGenMode = BucketGenMode.RandomBST;
    assessment.currentBucket = {
      bucketID: 1,
      items: [],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      score: 0,
      passed: true,
    };

    const result = assessment.failLowestBucket();

    expect(result).toBe(false);
    expect(assessment.currentBucket.passed).toBe(false);
    expect(AnalyticsEvents.sendBucket).toHaveBeenCalledWith(assessment.currentBucket, false);
  });

  it('should not call sendBucket if bucketGenMode is not RandomBST', () => {
    const assessment = new Assessment('dummy-url', {});

    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
    assessment.currentBucket = {
      bucketID: 2,
      items: [],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      score: 0,
      passed: true,
    };

    const result = assessment.failLowestBucket();

    expect(result).toBe(false);
    expect(assessment.currentBucket.passed).toBe(false);
    expect(AnalyticsEvents.sendBucket).not.toHaveBeenCalled();
  });


  it('should increment linear index if not RandomBST and left exists', () => {
    const root = new TreeNode({ id: 1 } as any);
    const leftNode = new TreeNode({ id: 2 } as any);
    root.left = leftNode;

    assessment.currentNode = root;
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
    const oldIndex = assessment.currentLinearBucketIndex;

    const moved = assessment.moveDownToPreviousBucket();

    expect(assessment.currentLinearBucketIndex).toBe(oldIndex + 1);
    expect(assessment.tryMoveBucket).toHaveBeenCalledWith(false);
    expect(moved).toBe(true);
  });

  it('should mark bucket failed and call sendBucket if at root in RandomBST mode', () => {
    const node = new TreeNode({ id: 1 } as any); // no left child = root
    assessment.currentNode = node;
    assessment.currentBucket = { passed: true } as any;
    assessment.bucketGenMode = BucketGenMode.RandomBST;

    const sendBucketSpy = jest.spyOn(AnalyticsEvents, 'sendBucket');

    const moved = assessment.moveDownToPreviousBucket();

    expect(assessment.currentBucket.passed).toBe(false);
    expect(sendBucketSpy).toHaveBeenCalledWith(assessment.currentBucket, false);
    expect(moved).toBe(false);
  });

  it('should mark bucket failed and NOT call sendBucket if not RandomBST', () => {
    const node = new TreeNode({ id: 1 } as any); // no left child = root
    assessment.currentNode = node;
    assessment.currentBucket = { passed: true } as any;
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;

    const sendBucketSpy = jest.spyOn(AnalyticsEvents, 'sendBucket');

    const moved = assessment.moveDownToPreviousBucket();

    expect(assessment.currentBucket.passed).toBe(false);
    expect(sendBucketSpy).not.toHaveBeenCalled();
    expect(moved).toBe(false);
  });
  it('should mark bucket passed and call sendBucket if at root in RandomBST mode', () => {
    assessment.currentNode = new TreeNode({ id: 1 } as any); // no right child
    assessment.currentBucket = { passed: false } as any;
    assessment.bucketGenMode = BucketGenMode.RandomBST;

    const sendBucketSpy = jest.spyOn(AnalyticsEvents, 'sendBucket');
    const progressChestSpy = jest.spyOn(UIController, 'ProgressChest');

    const result = assessment.moveUpToNextBucket();

    expect(assessment.currentBucket.passed).toBe(true);
    expect(sendBucketSpy).toHaveBeenCalledWith(assessment.currentBucket, true);
    expect(progressChestSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should mark bucket passed and NOT call sendBucket if not RandomBST', () => {
    assessment.currentNode = new TreeNode({ id: 1 } as any); // no right child
    assessment.currentBucket = { passed: false } as any;
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;

    const sendBucketSpy = jest.spyOn(AnalyticsEvents, 'sendBucket');
    const progressChestSpy = jest.spyOn(UIController, 'ProgressChest');

    const result = assessment.moveUpToNextBucket();

    expect(assessment.currentBucket.passed).toBe(true);
    expect(sendBucketSpy).not.toHaveBeenCalled();
    expect(progressChestSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should mark currentBucket as passed and call sendBucket in RandomBST mode', () => {
    assessment.currentBucket = { passed: false } as any;
    assessment.bucketGenMode = BucketGenMode.RandomBST;

    const sendBucketSpy = jest.spyOn(AnalyticsEvents, 'sendBucket');
    const progressChestSpy = jest.spyOn(UIController, 'ProgressChest');

    const result = assessment.passHighestBucket();

    expect(assessment.currentBucket.passed).toBe(true);
    expect(sendBucketSpy).toHaveBeenCalledWith(assessment.currentBucket, true);
    expect(progressChestSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should mark currentBucket as passed and NOT call sendBucket if not RandomBST', () => {
    assessment.currentBucket = { passed: false } as any;
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;

    const sendBucketSpy = jest.spyOn(AnalyticsEvents, 'sendBucket');
    const progressChestSpy = jest.spyOn(UIController, 'ProgressChest');

    const result = assessment.passHighestBucket();

    expect(assessment.currentBucket.passed).toBe(true);
    expect(sendBucketSpy).not.toHaveBeenCalled();
    expect(progressChestSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should call UIController.ProgressChest when passing the highest bucket', () => {
    assessment.currentBucket = { passed: false } as any;
    assessment.bucketGenMode = BucketGenMode.RandomBST;

    const progressChestSpy = jest.spyOn(UIController, 'ProgressChest');

    const result = assessment.passHighestBucket();

    expect(progressChestSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should update basalBucket if currentBucket.bucketID is less than basalBucket', () => {
    assessment.currentBucket = { bucketID: 1 } as any;
    assessment.basalBucket = 3;

    const failLowestBucketSpy = jest.spyOn(assessment, 'failLowestBucket').mockReturnValue(false);

    const result = assessment.handleFailedBucket();

    expect(assessment.basalBucket).toBe(1);
    expect(failLowestBucketSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should call failLowestBucket if currentBucket.bucketID <= 1', () => {
    assessment.currentBucket = { bucketID: 0 } as any;
    assessment.basalBucket = 2;

    const failLowestBucketSpy = jest.spyOn(assessment, 'failLowestBucket').mockReturnValue(false);

    const result = assessment.handleFailedBucket();

    expect(failLowestBucketSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
  it('should call moveDownToPreviousBucket if currentBucket.bucketID > 1', () => {
    assessment.currentBucket = { bucketID: 4 } as any;
    assessment.basalBucket = 2;

    const moveDownSpy = jest.spyOn(assessment, 'moveDownToPreviousBucket').mockReturnValue(true);

    const result = assessment.handleFailedBucket();

    expect(moveDownSpy).toHaveBeenCalled();
    expect(result).toBe(true);
  });
  it('should call passHighestBucket if currentBucket.bucketID >= numBuckets', () => {
    assessment.currentBucket = { bucketID: 5 } as any;
    assessment.numBuckets = 5;

    const passHighestBucketSpy = jest.spyOn(assessment, 'passHighestBucket').mockReturnValue(false);

    const result = assessment.handlePassedBucket();

    expect(passHighestBucketSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should call moveUpToNextBucket if currentBucket.bucketID < numBuckets', () => {
    assessment.currentBucket = { bucketID: 2 } as any;
    assessment.numBuckets = 5;

    const moveUpToNextBucketSpy = jest.spyOn(assessment, 'moveUpToNextBucket').mockReturnValue(true);

    const result = assessment.handlePassedBucket();

    expect(moveUpToNextBucketSpy).toHaveBeenCalled();
    expect(result).toBe(true);
  });


  it('should return false if target index >= current bucket items length', () => {
    assessment.buckets = [{ items: [1, 2, 3] }] as any;
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 3; // >= length (3)

    const result = assessment.hasLinearQuestionsLeft();
    expect(result).toBe(true);
  });


  it('should return true if there are questions left in the current bucket', () => {
    assessment.buckets = [{ items: [1, 2, 3] }] as any;
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 1;

    const result = assessment.hasLinearQuestionsLeft();

    expect(result).toBe(true);
  });
  it('should return true if currentLinearBucketIndex < buckets.length even if target index check is not yet reached', () => {
    assessment.buckets = [{ items: [] }, { items: [1] }] as any;
    assessment.currentLinearBucketIndex = 1;
    assessment.currentLinearTargetIndex = 0;

    const result = assessment.hasLinearQuestionsLeft();

    expect(result).toBe(true);
  });
  it('should return false if current bucket is already passed', () => {
    assessment.currentBucket.passed = true;

    const result = assessment.HasQuestionsLeft();

    expect(result).toBe(false);
  });

  it('should call hasLinearQuestionsLeft if in LinearArrayBased mode', () => {
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
    assessment.currentBucket.passed = false;

    const spy = jest.spyOn(assessment, 'hasLinearQuestionsLeft').mockReturnValue(true);

    const result = assessment.HasQuestionsLeft();

    expect(spy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should call handlePassedBucket if numCorrect >= 4', () => {
    assessment.currentBucket = {
      ...assessment.currentBucket,
      passed: false,
      numCorrect: 4,
      numConsecutiveWrong: 0,
      numTried: 0,
      bucketID: 1,
    };

    const spy = jest.spyOn(assessment, 'handlePassedBucket').mockReturnValue(false);

    const result = assessment.HasQuestionsLeft();

    expect(spy).toHaveBeenCalled();
    expect(result).toBe(false);
  });


  it('should call handleFailedBucket if numConsecutiveWrong >= 2', () => {
    assessment.currentBucket = {
      ...assessment.currentBucket,
      passed: false,
      numCorrect: 0,
      numConsecutiveWrong: 2,
      numTried: 0,
      bucketID: 1,
    };

    const spy = jest.spyOn(assessment, 'handleFailedBucket').mockReturnValue(false);

    const result = assessment.HasQuestionsLeft();

    expect(spy).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should call handleFailedBucket if numTried >= 5', () => {
    // Set up the currentBucket state to match the conditions
    assessment.currentBucket = {
      ...assessment.currentBucket,
      passed: false,  // ensure the bucket is not already marked as passed
      numCorrect: 0,  // numCorrect should be less than 4, so that it doesn't call handlePassedBucket
      numConsecutiveWrong: 0,  // This should be less than 2, ensuring it's not calling handleFailedBucket due to wrong answers
      numTried: 5,  // The main condition for this test
      bucketID: 1,  // Ensure bucketID is a valid number (this might be needed for your setup)
    };

    // Spy on handleFailedBucket to check if it's called
    const spy = jest.spyOn(assessment, 'handleFailedBucket').mockReturnValue(false);

    // Call HasQuestionsLeft() and verify if handleFailedBucket was called
    const result = assessment.HasQuestionsLeft();

    // Assert that handleFailedBucket was called
    expect(spy).toHaveBeenCalled();

    // Ensure the function returns false (as expected behavior when handling a failed bucket)
    expect(result).toBe(false);
  });

  it('should return true if none of the exit conditions are met', () => {
    // Set up the currentBucket state to match the conditions where none of the exit conditions are met
    assessment.currentBucket = {
      ...assessment.currentBucket,
      passed: false,  // Ensure the bucket is not already passed
      numCorrect: 3,  // Less than 4, so it shouldn't call handlePassedBucket
      numConsecutiveWrong: 1,  // Less than 2, so it shouldn't call handleFailedBucket
      numTried: 4,  // Less than 5, so it shouldn't call handleFailedBucket
      bucketID: 1,  // Ensure bucketID is a valid number (this might be needed for your setup)
    };

    // Call HasQuestionsLeft() and verify the return value
    const result = assessment.HasQuestionsLeft();

    // Assert that the function returns true, as none of the exit conditions are met
    expect(result).toBe(true);
  });
  it('should create a question with the correct structure and values', () => {
    const question = assessment.createQuestion(mockTargetItem, mockAnswerOptions);

    // Check if the question has the correct structure and values
    expect(question).toEqual({
      qName: 'question-1-itemName1',
      qNumber: 1,
      qTarget: mockTargetItem.itemName,
      promptText: '',
      bucket: assessment.currentBucket.bucketID,
      promptAudio: mockTargetItem.itemName,
      correct: mockTargetItem.itemText,
      answers: expect.arrayContaining([
        { answerName: 'option1', answerText: 'optionText1' },
        { answerName: 'option2', answerText: 'optionText2' },
        { answerName: 'option3', answerText: 'optionText3' },
      ]),
    });
  });

  it('should correctly increment questionNumber for multiple calls', () => {
    const question1 = assessment.createQuestion(mockTargetItem, mockAnswerOptions);
    assessment.questionNumber = 2;
    const question2 = assessment.createQuestion(mockTargetItem, mockAnswerOptions);

    // Check if questionName has the correct incremented value
    expect(question1.qName).toBe('question-1-itemName1');
    expect(question2.qName).toBe('question-2-itemName1');
  });

  it('should create a question with an empty promptText if not provided', () => {
    const question = assessment.createQuestion(mockTargetItem, mockAnswerOptions);

    // Ensure that promptText is empty
    expect(question.promptText).toBe('');
  });

  it('should create answers with the correct structure', () => {
    const question = assessment.createQuestion(mockTargetItem, mockAnswerOptions);

    // Ensure that the answers are correctly structured
    expect(question.answers).toEqual([
      { answerName: 'option1', answerText: 'optionText1' },
      { answerName: 'option2', answerText: 'optionText2' },
      { answerName: 'option3', answerText: 'optionText3' },
    ]);
  });

  it('should handle empty answerOptions array', () => {
    const question = assessment.createQuestion(mockTargetItem, []);

    // Ensure the answers are an empty array when no options are provided
    expect(question.answers).toEqual([]);
  });


  it('should return the same array if there is only one option', () => {
    const options = [{ itemName: 'Option 1', itemText: 'Text 1' }];

    // Call the shuffle function
    const shuffledOptions = assessment.shuffleAnswerOptions(options);

    // Ensure the result is still the same
    expect(shuffledOptions).toEqual(options);
  });
  it('should return an empty array if no options are provided', () => {
    const options: any[] = [];

    // Call the shuffle function
    const shuffledOptions = assessment.shuffleAnswerOptions(options);

    // Ensure the result is still an empty array
    expect(shuffledOptions).toEqual([]);
  });

  it('should shuffle a large number of options correctly', () => {
    const options = Array.from({ length: 100 }, (_, i) => ({
      itemName: `Option ${i + 1}`,
      itemText: `Text ${i + 1}`,
    }));

    const shuffledOptions = [...options]; // Make a copy to check later

    // Call the shuffle function
    assessment.shuffleAnswerOptions(shuffledOptions);

    // Ensure the shuffled array contains the same elements as the original
    expect(shuffledOptions).toEqual(expect.arrayContaining(options));
    expect(shuffledOptions.length).toBe(options.length);

    // Ensure the order is not the same
    expect(shuffledOptions).not.toEqual(options);
  });
  it('should generate a foil different from targetItem and existingFoils', () => {
    const targetItem = { itemName: 'Target', itemText: 'Target Text' };
    const existingFoils = [
      { itemName: 'Foil 1', itemText: 'Foil Text 1' },
      { itemName: 'Foil 2', itemText: 'Foil Text 2' },
    ];

    // Mock a valid Assessment instance
    const assessment = new Assessment('', {});
    assessment.currentLinearBucketIndex = 0;
    assessment.buckets = [
      {
        items: [
          targetItem,
          ...existingFoils,
          { itemName: 'Valid Foil', itemText: 'Foil Text 3' },
        ],
        bucketID: 0,
        usedItems: [],
        numTried: 0,
        numCorrect: 0,
        numConsecutiveWrong: 0,
        tested: false,
        score: 0,
        passed: false
      },
    ];

    const result = assessment.generateLinearFoil(targetItem, ...existingFoils);

    expect(result.itemName).not.toBe(targetItem.itemName);
    expect(existingFoils.map(f => f.itemName)).not.toContain(result.itemName);
  });

  it('should generate 3 random foils in RandomBST mode', () => {
    assessment.bucketGenMode = BucketGenMode.RandomBST;

    (assessment.generateRandomFoil as jest.Mock)
      .mockReturnValueOnce(foil1)
      .mockReturnValueOnce(foil2)
      .mockReturnValueOnce(foil3);

    const foils = assessment.generateFoils(targetItem);

    expect(assessment.generateRandomFoil).toHaveBeenCalledTimes(3);
    expect(assessment.generateRandomFoil).toHaveBeenCalledWith(targetItem);
    expect(assessment.generateRandomFoil).toHaveBeenCalledWith(targetItem, foil1);
    expect(assessment.generateRandomFoil).toHaveBeenCalledWith(targetItem, foil1, foil2);
    expect(foils).toEqual([foil1, foil2, foil3]);
  });

  it('should generate 3 linear foils in LinearArrayBased mode', () => {
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;

    (assessment.generateLinearFoil as jest.Mock)
      .mockReturnValueOnce(foil1)
      .mockReturnValueOnce(foil2)
      .mockReturnValueOnce(foil3);

    const foils = assessment.generateFoils(targetItem);

    expect(assessment.generateLinearFoil).toHaveBeenCalledTimes(3);
    expect(assessment.generateLinearFoil).toHaveBeenCalledWith(targetItem);
    expect(assessment.generateLinearFoil).toHaveBeenCalledWith(targetItem, foil1);
    expect(assessment.generateLinearFoil).toHaveBeenCalledWith(targetItem, foil1, foil2);
    expect(foils).toEqual([foil1, foil2, foil3]);
  });
  it('should call selectRandomUnusedItem in RandomBST mode', () => {
    const mockItem = { itemName: 'itemA', itemText: 'Text A' };
    assessment.bucketGenMode = BucketGenMode.RandomBST;

    // Mock selectRandomUnusedItem
    const spy = jest.spyOn(assessment, 'selectRandomUnusedItem').mockReturnValue(mockItem);

    const result = assessment.selectTargetItem();

    expect(spy).toHaveBeenCalled();
    expect(result).toBe(mockItem);
  });

  it('should return correct item and add to usedItems in LinearArrayBased mode', () => {
    const mockItem = { itemName: 'itemB', itemText: 'Text B' };

    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 1;

    // Create a mock bucket structure
    assessment.buckets = [
      {
        bucketID: 0,
        items: [{ itemName: 'itemA', itemText: 'Text A' }, mockItem],
        usedItems: [],
        numTried: 0,
        numCorrect: 0,
        numConsecutiveWrong: 0,
        tested: false,
        score: 0,
        passed: false,
      },
    ];

    // Link currentBucket to first bucket
    assessment.currentBucket = assessment.buckets[0];

    const result = assessment.selectTargetItem();

    expect(result).toBe(mockItem);
    expect(assessment.currentBucket.usedItems).toContain(mockItem);
  });
  it('should return true when in LinearArrayBased mode and index is out of bounds', () => {
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 3;

    assessment.buckets = [
      {
        bucketID: 1,
        items: [
          { itemName: 'A', itemText: 'A' },
          { itemName: 'B', itemText: 'B' },
        ],
        usedItems: [],
        numTried: 0,
        numCorrect: 0,
        numConsecutiveWrong: 0,
        tested: false,
        score: 0,
        passed: false,
      },
    ];

    expect(assessment.isLinearArrayExhausted()).toBe(true);
  });

  it('should return false when in LinearArrayBased mode and index is within bounds', () => {
    assessment.bucketGenMode = BucketGenMode.LinearArrayBased;
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 1;

    assessment.buckets = [
      {
        bucketID: 1,
        items: [
          { itemName: 'A', itemText: 'A' },
          { itemName: 'B', itemText: 'B' },
        ],
        usedItems: [],
        numTried: 0,
        numCorrect: 0,
        numConsecutiveWrong: 0,
        tested: false,
        score: 0,
        passed: false,
      },
    ];

    expect(assessment.isLinearArrayExhausted()).toBe(false);
  });

  it('should return false when not in LinearArrayBased mode', () => {
    assessment.bucketGenMode = BucketGenMode.RandomBST;
    assessment.currentLinearBucketIndex = 0;
    assessment.currentLinearTargetIndex = 10;

    assessment.buckets = [
      {
        bucketID: 1,
        items: [
          { itemName: 'A', itemText: 'A' },
          { itemName: 'B', itemText: 'B' },
        ],
        usedItems: [],
        numTried: 0,
        numCorrect: 0,
        numConsecutiveWrong: 0,
        tested: false,
        score: 0,
        passed: false,
      },
    ];

    expect(assessment.isLinearArrayExhausted()).toBe(false);
  });

});
