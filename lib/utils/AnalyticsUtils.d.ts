import { bucket } from "../assessment/bucketData";
export declare function setCommonAnalyticsEventsProperties(_cr_user_id: string, _language: string, _app: string, _user_source: string, _content_version: string, _app_version: string): void;
export declare function setLocationProperty(_lat_lang: string): void;
export declare function getCommonAnalyticsEventsProperties(): {
    cr_user_id: string;
    language: string;
    app: string;
    user_source: string;
    lat_lang: string;
    content_version: string;
    app_version: string;
};
export declare function getBasalBucketID(buckets: bucket[]): number;
export declare function calculateScore(buckets: bucket[], basalBucketID: number): number;
export declare function getCeilingBucketID(buckets: bucket[]): number;
export declare function getLocation(): Promise<string | null>;
