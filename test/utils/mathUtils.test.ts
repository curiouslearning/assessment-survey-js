import { randFrom, shuffleArray } from '../../src/utils/mathUtils';

describe('Array Utility Functions', () => {
  describe('randFrom', () => {
    it('should return an element from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = randFrom(array);
      expect(array).toContain(result); // Ensure the returned value is an element of the array
    });

    it('should return undefined for an empty array', () => {
      const array: any[] = [];
      const result = randFrom(array);
      expect(result).toBeUndefined();
    });

    it('should handle arrays with a single element', () => {
      const array = [42];
      const result = randFrom(array);
      expect(result).toBe(42); // Ensure the single element is returned
    });
  });

  describe('shuffleArray', () => {
    it('should shuffle the array', () => {
      const array = [1, 2, 3, 4, 5];
      const originalArray = [...array]; // Copy to compare after shuffle
      shuffleArray(array);
      expect(array).toHaveLength(originalArray.length); // Ensure no elements are added/removed
      expect(array).toEqual(expect.arrayContaining(originalArray)); // Check that all elements are still present
      expect(array).not.toEqual(originalArray); // High probability the order is different
    });

    it('should handle an empty array', () => {
      const array: any[] = [];
      shuffleArray(array);
      expect(array).toEqual([]); // Empty array should remain empty
    });

    it('should handle arrays with a single element', () => {
      const array = [42];
      shuffleArray(array);
      expect(array).toEqual([42]); // Single-element array should remain the same
    });

    it('should handle arrays with duplicate elements', () => {
      const array = [1, 2, 2, 3, 3, 3];
      const originalArray = [...array];
      shuffleArray(array);
      expect(array).toHaveLength(originalArray.length); // Ensure no elements are added/removed
      expect(array).toEqual(expect.arrayContaining(originalArray)); // Check that all elements are still present
    });
  });
});
