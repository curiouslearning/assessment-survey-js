interface CommonEventProperties {
    clUserId: string;
    language: string;
    app: string;
    lat_lang: string;
    user_source: string;
}

export interface Opened extends CommonEventProperties {

}
export interface UserLocation extends CommonEventProperties {

}
export interface SessionStart extends CommonEventProperties {
    type: string;
    appVersion: Number;
    contentVersion: Number;


}
export interface PuzzleCompleted extends CommonEventProperties {
    type: string;
    dt: Number;
    question_number: Number;
    target: string;
    question: string;
    selected_answer: string;
    iscorrect: string;
    options: string;
    bucket: string;
    appVersion: string;
    contentVersion: Number;

}
export interface LevelCompleted extends CommonEventProperties {
    type: string;
    bucketNumber: Number;
    numberTriedInBucket: Number;
    numberCorrectInBucket: boolean;
    passedBucket: boolean;
    appVersion: Number;
    contentVersion: Number;
}
export interface SessionEnd extends CommonEventProperties {
    type: string;
    score: Number;
    maxScore: Number;
    basalBucket: Number;
    ceilingBucket: Number;
    appVersion: Number;
    contentVersion: Number;
}