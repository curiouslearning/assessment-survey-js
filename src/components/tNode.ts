// A binary tree node
export type TNode = {
  data: number;
  left: TNode;
  right: TNode;
};

export function sortedArrayToBST(array, start: number, end: number) {
    /* Base Case */
    if (start > end)
    {
        return null;
    }
    /* Get the middle element and make it root */
    var middle = parseInt(((start + end) / 2)+"");

    const ntNode: TNode = {
			data: array[middle],
			left: null,
			right: null
		}

    /* Recursively construct the left subtree and make it
     left child of root */
    ntNode.left = sortedArrayToBST(array, start, middle - 1);
    /* Recursively construct the right subtree and make it
     right child of root */
    ntNode.right = sortedArrayToBST(array, middle + 1, end);

    return ntNode;
}
