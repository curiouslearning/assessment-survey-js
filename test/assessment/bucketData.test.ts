import { bucket, bucketItem } from '../../src/assessment/bucketData';

describe('Bucket and Bucket Item Types Tests', () => {
  describe('Bucket Type Tests', () => {
    let testBucket: bucket;

    beforeEach(() => {
      testBucket = {
        bucketID: 1,
        items: [
          { itemName: 'Item 1', itemText: 'Test Item 1' },
          { itemName: 'Item 2', itemText: 'Test Item 2' },
        ],
        usedItems: [],
        numTried: 5,
        numCorrect: 3,
        numConsecutiveWrong: 2,
        tested: false,
        score: 80,
        passed: true,
      };
    });

    it('should initialize bucket with correct structure and values', () => {
      expect(testBucket.bucketID).toBe(1);
      expect(testBucket.items.length).toBe(2);
      expect(testBucket.numTried).toBe(5);
      expect(testBucket.numCorrect).toBe(3);
      expect(testBucket.numConsecutiveWrong).toBe(2);
      expect(testBucket.tested).toBe(false);
      expect(testBucket.score).toBe(80);
      expect(testBucket.passed).toBe(true);
    });

    it('should handle optional bucketName correctly', () => {
      testBucket.bucketName = 'Sample Bucket';
      expect(testBucket.bucketName).toBe('Sample Bucket');

      // Test with bucketName not set
      const bucketWithoutName: bucket = {
        bucketID: 2,
        items: [{ itemName: 'Item 3', itemText: 'Test Item 3' }],
        usedItems: [],
        numTried: 1,
        numCorrect: 1,
        numConsecutiveWrong: 0,
        tested: true,
        score: 100,
        passed: true,
      };
      expect(bucketWithoutName.bucketName).toBeUndefined();
    });

    it('should correctly initialize empty usedItems array', () => {
      expect(testBucket.usedItems).toEqual([]);
    });

    it('should update score and passed values', () => {
      testBucket.score = 90;
      testBucket.passed = false;
      expect(testBucket.score).toBe(90);
      expect(testBucket.passed).toBe(false);
    });
  });

  describe('Bucket Item Type Tests', () => {
    let testBucketItem: bucketItem;

    beforeEach(() => {
      testBucketItem = {
        itemName: 'Item 1',
        itemText: 'Test Item 1',
        itemAudio: 'audio1.mp3',
      };
    });

    it('should initialize bucket item with correct structure and values', () => {
      expect(testBucketItem.itemName).toBe('Item 1');
      expect(testBucketItem.itemText).toBe('Test Item 1');
      expect(testBucketItem.itemAudio).toBe('audio1.mp3');
    });

    it('should handle optional itemImg and itemAudio correctly', () => {
      const itemWithImg: bucketItem = {
        itemName: 'Item 2',
        itemText: 'Test Item 2',
        itemImg: 'image.png',
      };
      expect(itemWithImg.itemImg).toBe('image.png');

      // Test without itemImg
      const itemWithoutImg: bucketItem = {
        itemName: 'Item 3',
        itemText: 'Test Item 3',
      };
      expect(itemWithoutImg.itemImg).toBeUndefined();

      // Test without itemAudio
      const itemWithoutAudio: bucketItem = {
        itemName: 'Item 4',
        itemText: 'Test Item 4',
      };
      expect(itemWithoutAudio.itemAudio).toBeUndefined();
    });
  });
});
