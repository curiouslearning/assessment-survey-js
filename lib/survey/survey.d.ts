import { qData } from '../components/questionData';
import { App } from '../App';
import { BaseQuiz } from '../baseQuiz';
export declare class Survey extends BaseQuiz {
    questionsData: qData[];
    currentQuestionIndex: number;
    constructor(dataURL: string, unityBridge: any);
    handleAnimationSpeedMultiplierChange(): void;
    handleBucketGenModeChange: () => void;
    handleCorrectLabelShownChange: () => void;
    handleBucketInfoShownChange: () => void;
    handleBucketControlsShownChange: () => void;
    Run(app: App): Promise<void>;
    startSurvey: () => void;
    onQuestionEnd: () => void;
    handleAnswerButtonPress: (answer: number, elapsed: number) => void;
    buildQuestionList: () => Promise<any>;
    HasQuestionsLeft(): boolean;
    buildNewQuestion(): qData;
}
