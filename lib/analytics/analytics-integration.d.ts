import { Answered, BucketCompleted, CommonEventProperties, Completed, Initialized, Opened, UserLocation } from "./analytics-event-interface";
import { BaseAnalyticsIntegration } from "./base-analytics-integration";
export declare const enum AnalyticsEventsType {
    INITIALIZE = "initialized",
    OPENED = "opened",
    USER_LOCATION = "user_location",
    BUCKET_COMPLETED = "bucketCompleted",
    ANSWERED = "answered",
    COMPLETED = "completed"
}
declare type EventDataMap = {
    [AnalyticsEventsType.INITIALIZE]: Initialized;
    [AnalyticsEventsType.OPENED]: Opened;
    [AnalyticsEventsType.USER_LOCATION]: UserLocation;
    [AnalyticsEventsType.BUCKET_COMPLETED]: BucketCompleted;
    [AnalyticsEventsType.ANSWERED]: Answered;
    [AnalyticsEventsType.COMPLETED]: Completed;
};
export declare class AnalyticsIntegration extends BaseAnalyticsIntegration {
    private static instance;
    protected constructor();
    private createBaseEventData;
    static initializeAnalytics(): Promise<void>;
    static getInstance(): AnalyticsIntegration;
    sendDataToThirdParty(score: number, uuid: string, requiredScore: Number, nextAssessment: string, assessmentType: string): void;
    initialize(): Promise<void>;
    track<T extends AnalyticsEventsType>(eventType: T, eventData: Partial<CommonEventProperties> & Omit<EventDataMap[T], keyof CommonEventProperties>): void;
}
export {};
