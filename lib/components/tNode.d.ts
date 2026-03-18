import { bucket } from '../assessment/bucketData';
export declare class TreeNode {
    value: number | bucket;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(value: number);
}
/** Generates a random binary search tree from a
 - If the start and end indices are the same, the function returns null
 - If the middle index is even, the function uses the exact middle point
 - Otherwise, the function randomly adds 0 or 1 to the middle index
 - Returns the root node of the generated binary search tree which contains the bucketIds if called properly
 - ex: let rootOfIds = sortedArrayToBST(this.buckets, this.buckets[0].bucketID - 1, this.buckets[this.buckets.length - 1].bucketID, usedIndices);
 */
export declare function sortedArrayToIDsBST(start: any, end: any, usedIndices: any): TreeNode;
