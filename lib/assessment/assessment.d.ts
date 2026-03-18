import { qData } from '../components/questionData';
import { App } from '../App';
import { bucket } from './bucketData';
import { BaseQuiz } from '../baseQuiz';
import { TreeNode } from '../components/tNode';
import { AnalyticsIntegration } from '../analytics/analytics-integration';
declare enum BucketGenMode {
    RandomBST = 0,
    LinearArrayBased = 1
}
export declare class Assessment extends BaseQuiz {
    unityBridge: any;
    analyticsIntegration: AnalyticsIntegration;
    currentNode: TreeNode;
    currentQuestion: qData;
    bucketArray: number[];
    questionNumber: number;
    commonProperties: any;
    buckets: bucket[];
    currentBucket: bucket;
    numBuckets: number;
    basalBucket: number;
    ceilingBucket: number;
    currentLinearBucketIndex: number;
    currentLinearTargetIndex: number;
    protected bucketGenMode: BucketGenMode;
    private MAX_STARS_COUNT_IN_LINEAR_MODE;
    constructor(dataURL: string, unityBridge: any);
    private setupUIHandlers;
    Run(applink: App): void;
    handleBucketGenModeChange(event: Event): void;
    handleCorrectLabelShownChange(): void;
    handleAnimationSpeedMultiplierChange(): void;
    handleBucketInfoShownChange(): void;
    handleBucketControlsShownChange(): void;
    generateDevModeBucketControlsInContainer: (container: HTMLElement, clickHandler: () => void) => void;
    updateBucketInfo: () => void;
    startAssessment: () => void;
    buildBuckets: (bucketGenMode: BucketGenMode) => Promise<void>;
    /**
     * Converts a binary search tree of numbers to a binary search tree of bucket objects
     * @param node Is a root node of a binary search tree
     * @param buckets Is an array of bucket objects
     * @returns A root node of a binary search tree where the value of each node is a bucket object
     */
    convertToBucketBST: (node: TreeNode, buckets: bucket[]) => TreeNode;
    initBucket: (bucket: bucket) => void;
    handleAnswerButtonPress: (answer: number, elapsed: number) => void;
    private logPuzzleCompletedEvent;
    private isAnswerCorrect;
    private updateFeedbackAfterAnswer;
    private updateCurrentBucketValuesAfterAnswering;
    onQuestionEnd: () => void;
    buildNewQuestion: () => any;
    private isLinearArrayExhausted;
    private selectTargetItem;
    private selectRandomUnusedItem;
    private generateFoils;
    private generateRandomFoil;
    private generateLinearFoil;
    private shuffleAnswerOptions;
    private createQuestion;
    tryMoveBucket: (passed: boolean) => void;
    tryMoveBucketRandomBST: (passed: boolean) => void;
    tryMoveBucketLinearArrayBased: (passed: boolean) => void;
    HasQuestionsLeft: () => boolean;
    private hasLinearQuestionsLeft;
    private handlePassedBucket;
    private handleFailedBucket;
    private passHighestBucket;
    private moveUpToNextBucket;
    private failLowestBucket;
    private moveDownToPreviousBucket;
    private logBucketCompletedEvent;
    onEnd(): void;
    private LogCompletedEvent;
}
export {};
