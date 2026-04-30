import { bucket } from '../assessment/bucketData';

export class TreeNode {
  value: number | bucket;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/** Generates a random binary search tree from a
 - If the start and end indices are the same, the function returns null
 - If the middle index is even, the function uses the exact middle point
 - Otherwise, the function randomly adds 0 or 1 to the middle index
 - Returns the root node of the generated binary search tree which contains the bucketIds if called properly
 - ex: let rootOfIds = sortedArrayToBST(this.buckets, this.buckets[0].bucketID - 1, this.buckets[this.buckets.length - 1].bucketID, usedIndices);
 */
export function sortedArrayToIDsBST(start, end, usedIndices) {
  if (start > end) return null;

  // Find a middle index that isn't used yet.
  const middle = Math.floor((start + end) / 2);
  let mid = middle;

  if (usedIndices.has(mid)) {
    let left = mid - 1;
    let right = mid + 1;
    let found = false;

    while (left >= start || right <= end) {
      if (right <= end && !usedIndices.has(right)) {
        mid = right;
        found = true;
        break;
      }
      if (left >= start && !usedIndices.has(left)) {
        mid = left;
        found = true;
        break;
      }
      right++;
      left--;
    }

    if (!found) {
      return null;
    }
  }

  if (mid === 0) return null;

  usedIndices.add(mid);

  const node = new TreeNode(mid);
  node.left = sortedArrayToIDsBST(start, mid - 1, usedIndices);
  node.right = sortedArrayToIDsBST(mid + 1, end, usedIndices);

  return node;
}
