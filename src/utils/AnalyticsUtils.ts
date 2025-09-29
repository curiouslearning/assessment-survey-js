import { bucket } from "../assessment/bucketData";

let cr_user_id: string;
let language: string;
let app: string;
let user_source: string;
let lat_lang: string;
let content_version: string;
let app_version: string;

export function setCommonAnalyticsEventsProperties(
    _cr_user_id: string,
    _language: string,
    _app: string,
    _user_source: string,
    _content_version: string,
    _app_version: string,

) {

    cr_user_id = _cr_user_id;
    language = _language;
    app = _app;
    user_source = _user_source;
    content_version = _content_version;
    app_version = _app_version;

}
export function setLocationProperty(_lat_lang: string) {
    lat_lang = _lat_lang;
}
export function getCommonAnalyticsEventsProperties() {
    return {
        cr_user_id,
        language,
        app,
        user_source,
        lat_lang,
        content_version,
        app_version,
    };
}
export function getBasalBucketID(buckets: bucket[]): number {
    let bucketID = 0;

    // Select the lowest bucketID bucket that the user has failed
    for (const index in buckets) {
        const bucket = buckets[index];
        if (bucket.tested && !bucket.passed) {
            if (bucketID == 0 || bucket.bucketID < bucketID) {
                bucketID = bucket.bucketID;
            }
        }
    }
    return bucketID;
}

export function calculateScore(buckets: bucket[], basalBucketID: number): number {
    console.log('Calculating score');
    console.log(buckets);

    let score = 0;

    console.log('Basal Bucket ID: ' + basalBucketID);

    // Get the numcorrect from the basal bucket based on looping through and finding the bucket id
    let numCorrect = 0;

    for (const index in buckets) {
        const bucket = buckets[index];
        if (bucket.bucketID == basalBucketID) {
            numCorrect = bucket.numCorrect;
            break;
        }
    }

    console.log('Num Correct: ' + numCorrect, ' basal: ' + basalBucketID, ' buckets: ' + buckets.length);

    if (basalBucketID === buckets.length && numCorrect >= 4) {
        // If the user has enough correct answers in the last bucket, give them a perfect score
        console.log('Perfect score');

        return buckets.length * 100;
    }

    score = Math.round((basalBucketID - 1) * 100 + (numCorrect / 5) * 100) | 0;

    return score;
}

export function getCeilingBucketID(buckets: bucket[]): number {
    let bucketID = 0;

    // Select the hiughest bucketID bucket that the user has passed
    for (const index in buckets) {
        const bucket = buckets[index];
        if (bucket.tested && bucket.passed) {
            if (bucketID == 0 || bucket.bucketID > bucketID) {
                bucketID = bucket.bucketID;
            }
        }
    }

    return bucketID;
}
// Get Location
export async function getLocation(): Promise<string | null> {
    console.log('starting to get location');
    try {
        const response = await fetch(`https://ipinfo.io/json?token=b6268727178610`);
        console.log('got location response');

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const jsonResponse = await response.json();
        console.log(jsonResponse);

        return jsonResponse.loc as string; // e.g. "37.3860,-122.0838"
    } catch (err: any) {
        console.warn(`location failed to update! encountered error: ${err.message}`);
        return null;
    }
}