export declare type qData = {
    qName: string;
    qNumber: number;
    qTarget: string;
    promptText: string;
    promptImg?: string;
    promptAudio?: string;
    answers: answerData[];
    correct?: string;
    bucket?: number;
};
export declare type answerData = {
    answerName: string;
    answerText?: string;
    answerImg?: string;
};
