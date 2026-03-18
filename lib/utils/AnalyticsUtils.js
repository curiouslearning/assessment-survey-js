var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let cr_user_id;
let language;
let app;
let user_source;
let lat_lang;
let content_version;
let app_version;
export function setCommonAnalyticsEventsProperties(_cr_user_id, _language, _app, _user_source, _content_version, _app_version) {
    cr_user_id = _cr_user_id;
    language = _language;
    app = _app;
    user_source = _user_source;
    content_version = _content_version;
    app_version = _app_version;
}
export function setLocationProperty(_lat_lang) {
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
export function getBasalBucketID(buckets) {
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
export function calculateScore(buckets, basalBucketID) {
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
export function getCeilingBucketID(buckets) {
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
export function getLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('starting to get location');
        try {
            const response = yield fetch(`https://ipinfo.io/json?token=b6268727178610`);
            console.log('got location response');
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const jsonResponse = yield response.json();
            console.log(jsonResponse);
            return jsonResponse.loc; // e.g. "37.3860,-122.0838"
        }
        catch (err) {
            console.warn(`location failed to update! encountered error: ${err.message}`);
            return null;
        }
    });
}
