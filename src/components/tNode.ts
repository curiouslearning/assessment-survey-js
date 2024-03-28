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
    var middle = 0;

    if (array.length % 2 === 0) {
      // Rqandomly choose the middle element
      const randomMiddle = Math.random();
      const middleIndex = Math.floor(((start + end) / 2));

      if (randomMiddle < 0.5) {
        middle = middleIndex;
      } else {
        middle = middleIndex + 1;
      }
    } else {
      middle = parseInt(((start + end) / 2)+"");
    }

    console.log("Middle bucket: ", middle, "Start: ", start, "End: ", end, "Array: ", array.length);
    
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
