import { TreeNode, sortedArrayToIDsBST } from '../../src/components/tNode'; // Update the path if needed

describe('TreeNode', () => {
  it('should create a TreeNode with the given value', () => {
    const node = new TreeNode(5);
    expect(node.value).toBe(5);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });
});

describe('sortedArrayToIDsBST', () => {
  it('should return null if start > end', () => {
    const usedIndices = new Set<number>();
    const result = sortedArrayToIDsBST(10, 5, usedIndices);
    expect(result).toBeNull();
  });

  it('should create a valid binary search tree with unique values', () => {
    const usedIndices = new Set<number>();
    const start = 1;
    const end = 7;

    const result = sortedArrayToIDsBST(start, end, usedIndices);

    const traverseTree = (node: TreeNode | null): number[] => {
      if (!node) return [];
      return [...traverseTree(node.left), node.value as number, ...traverseTree(node.right)];
    };

    const resultArray = traverseTree(result);

    expect(resultArray).toHaveLength(end - start + 1); // Should include all numbers in the range
    expect(new Set(resultArray).size).toBe(resultArray.length); // No duplicates
    expect(resultArray).toEqual(resultArray.sort((a, b) => a - b)); // Should be sorted
  });

  it('should not reuse indices already in usedIndices', () => {
    const usedIndices = new Set<number>([3, 5]);
    const start = 1;
    const end = 7;

    const result = sortedArrayToIDsBST(start, end, usedIndices);

    const traverseTree = (node: TreeNode | null): number[] => {
      if (!node) return [];
      return [...traverseTree(node.left), node.value as number, ...traverseTree(node.right)];
    };

    const resultArray = traverseTree(result);

    expect(resultArray).not.toContain(3);
    expect(resultArray).not.toContain(5);
  });

  it('should handle edge cases like a single valid index range', () => {
    const usedIndices = new Set<number>();
    const start = 3;
    const end = 3;

    const result = sortedArrayToIDsBST(start, end, usedIndices);

    expect(result).toBeDefined();
    expect(result?.value).toBe(3);
    expect(result?.left).toBeNull();
    expect(result?.right).toBeNull();
  });

  it('should create a balanced tree when given a wide range', () => {
    const usedIndices = new Set<number>();
    const start = 1;
    const end = 15;

    const result = sortedArrayToIDsBST(start, end, usedIndices);

    const getDepth = (node: TreeNode | null): number => {
      if (!node) return 0;
      return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    };

    const leftDepth = getDepth(result?.left || null);
    const rightDepth = getDepth(result?.right || null);

    expect(Math.abs(leftDepth - rightDepth)).toBeLessThanOrEqual(1); // Tree is balanced
  });

  it('should return null when mid equals 0', () => {
    const usedIndices = new Set<number>();
    const start = 0;
    const end = 0;

    const result = sortedArrayToIDsBST(start, end, usedIndices);

    expect(result).toBeNull();
  });
});
