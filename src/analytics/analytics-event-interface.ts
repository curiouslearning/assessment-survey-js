interface CommonEventProperties {
    clUserId: string;
    language: string;
    app: string;
    lat_lang: string;
    user_source: string;
    appVersion: string;
    contentVersion: string;
}

export interface Opened extends CommonEventProperties {

}
export interface UserLocation extends CommonEventProperties {

}
export interface SessionStart extends CommonEventProperties {
    type: string;


}
export interface PuzzleCompleted extends CommonEventProperties {
    type: string;
    dt: number;
    question_number: number;
    target: string;
    question: string;
    selected_answer: string;
    iscorrect: boolean;
    options: string;
    bucket: string;


}
export interface LevelCompleted extends CommonEventProperties {
    type: string;
    bucketNumber: number;
    numberTriedInBucket: number;
    numberCorrectInBucket: number;
    passedBucket: boolean;

}
export interface SessionEnd extends CommonEventProperties {
    type: string;
    score: number;
    maxScore: number;
    basalBucket: number;
    ceilingBucket: number;
    nextAssessment?: string;
    requiredScore?: number;
}