export declare type bucket = {
    bucketID: number;
    items: bucketItem[];
    usedItems: bucketItem[];
    bucketName?: string;
    numTried: number;
    numCorrect: number;
    numConsecutiveWrong: number;
    tested: boolean;
    score: number;
    passed: boolean;
};
export declare type bucketItem = {
    itemName: string;
    itemText: string;
    itemAudio?: string;
    itemImg?: string;
};
