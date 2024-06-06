// this is where we can have the classes and functions for building the events
// to send to an analytics recorder (firebase? lrs?)

import { qData, answerData } from './questionData';
import { logEvent } from 'firebase/analytics';
import { bucket } from '../assessment/bucketData'


// Create a singleton class for the analytics events
export class AnalyticsEvents {

	protected static uuid: string;
	protected static userSource: string;
	protected static clat;
	protected static clon;
	protected static gana;
	protected static latlong;
	// var city, region, country;
	protected static dataURL;

	protected static appVersion;
	protected static contentVersion;

	static instance: AnalyticsEvents;

	private constructor() {
		// Initialize the class
	}

	static getInstance(): AnalyticsEvents {
		if (!AnalyticsEvents.instance) {
			AnalyticsEvents.instance = new AnalyticsEvents();
		}

		return AnalyticsEvents.instance;
	}

	// Get Location
	static getLocation(): void {
		console.log("starting to get location");
		fetch(`https://ipinfo.io/json?token=b6268727178610`).then((response) => {
			console.log("got location response");
			if(!response.ok) {
				throw Error(response.statusText);
			}
			return response.json()
		}).then((jsonResponse)  => {
			console.log(jsonResponse);
			AnalyticsEvents.latlong = jsonResponse.loc;
			var lpieces = AnalyticsEvents.latlong.split(",");
			var lat = parseFloat(lpieces[0]).toFixed(2);
			var lon = parseFloat(lpieces[1]).toFixed(1);
			AnalyticsEvents.clat = lat;
			AnalyticsEvents.clon = lon;
			AnalyticsEvents.latlong = "";
			lpieces = [];
			// city = jsonResponse.city;
			// region = jsonResponse.region;
			// country = jsonResponse.country;
			AnalyticsEvents.sendLocation();

			return {};
		}).catch((err) => {
			console.warn(`location failed to update! encountered error ${err.msg}`);
		});
	}
	
	// Link Analytics
	static linkAnalytics(newgana, dataurl): void {
		AnalyticsEvents.gana = newgana;
		AnalyticsEvents.dataURL = dataurl;
	}

	// Set UUID
	static setUuid(newUuid: string, newUserSource: string): void {
		AnalyticsEvents.uuid = newUuid;
		AnalyticsEvents.userSource = newUserSource;
	}

	// Send Init
	static sendInit(appVersion: string, contentVersion: string): void {
		AnalyticsEvents.appVersion = appVersion;
		AnalyticsEvents.contentVersion = contentVersion;

		AnalyticsEvents.getLocation();

		var eventString = "user " + AnalyticsEvents.uuid + " opened the assessment";

		console.log(eventString);

		logEvent(AnalyticsEvents.gana,"opened", {

		});
	}

	// Get App Language From Data URL
	static getAppLanguageFromDataURL(appType: string): string {
		// Check if app type is not empty and split the string by the hyphen then return the first element
		if (appType && appType !== "" && appType.includes("-")) {
			return appType.split("-")[0];
		}

		return "NotAvailable";
	}

	// Get App Type From Data URL
	static getAppTypeFromDataURL(appType: string): string {
		// Check if app type is not empty and split the string by the hyphen then return the last element
		if (appType && appType !== "" && appType.includes("-")) {
			return appType.split("-")[1];
		}

		return "NotAvailable";
	}

	// Send Location
	static sendLocation(): void {
		var eventString = "Sending User coordinates: " + AnalyticsEvents.uuid + " : " + AnalyticsEvents.clat + ", " + AnalyticsEvents.clon;
		console.log(eventString);

		logEvent(AnalyticsEvents.gana,"user_location", {
			user: AnalyticsEvents.uuid,
			lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
			app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
			latlong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
		});

		console.log("INITIALIZED EVENT SENT");
		console.log("App Language: " + AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL));
		console.log("App Type: " + AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL));
		console.log("App Version: " + AnalyticsEvents.appVersion);
		console.log("Content Version: " + AnalyticsEvents.contentVersion);

		logEvent(AnalyticsEvents.gana,"initialized", {
			type: "initialized",
			clUserId: AnalyticsEvents.uuid,
			userSource: AnalyticsEvents.userSource,
			latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
			appVersion: AnalyticsEvents.appVersion,
			contentVersion: AnalyticsEvents.contentVersion,
			// city: city,
			// region: region,
			// country: country,
			app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
			lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL)
		});
	}

	// Send Answered
	static sendAnswered(theQ: qData, theA: number, elapsed: number): void {
		var ans = theQ.answers[theA - 1];

		var iscorrect = null;
		var bucket = null;
		if ("correct" in theQ){
			if (theQ.correct != null){
				if (theQ.correct == ans.answerName){
					iscorrect = true;
				}
				else{
					iscorrect = false;
				}
			}
		}
		if ("bucket" in theQ){
			bucket = theQ.bucket;
		}
		var eventString = "user " + AnalyticsEvents.uuid + " answered " + theQ.qName + " with " + ans.answerName;
		eventString += ", all answers were [";
		var opts = "";
		for (var aNum in theQ.answers) {
			eventString += theQ.answers[aNum].answerName + ",";
			opts += theQ.answers[aNum].answerName + ",";

		}
		eventString += "] ";
		eventString += iscorrect;
		eventString += bucket;
		console.log(eventString);
		console.log("Answered App Version: " + AnalyticsEvents.appVersion);
		console.log("Content Version: " + AnalyticsEvents.contentVersion);

		logEvent(AnalyticsEvents.gana,"answered", {
			type: "answered",
			clUserId: AnalyticsEvents.uuid,
			userSource: AnalyticsEvents.userSource,
			latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
			// city: city,
			// region: region,
			// country: country,
			app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
			lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
			dt: elapsed,
			question_number: theQ.qNumber,
			target: theQ.qTarget,
			question: theQ.promptText,
			selected_answer: ans.answerName,
			iscorrect: iscorrect,
			options: opts,
			bucket: bucket,
			appVersion: AnalyticsEvents.appVersion,
			contentVersion: AnalyticsEvents.contentVersion
		});

	}

	// Send Bucket
	static sendBucket(tb: bucket, passed: boolean): void {
		var bn = tb.bucketID;
		var btried = tb.numTried;
		var bcorrect = tb.numCorrect;
		
		var eventString = "user " + AnalyticsEvents.uuid + " finished the bucket " + bn + " with " + bcorrect + " correct answers out of " + btried + " tried" + " and passed: " + passed;
		console.log(eventString);
		console.log("Bucket Completed App Version: " + AnalyticsEvents.appVersion);
		console.log("Content Version: " + AnalyticsEvents.contentVersion);

		logEvent(AnalyticsEvents.gana,"bucketCompleted", {
			type: "bucketCompleted",
			clUserId: AnalyticsEvents.uuid,
			userSource: AnalyticsEvents.userSource,
			latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
			// city: city,
			// region: region,
			// country: country,
			app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
			lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
			bucketNumber: bn,
			numberTriedInBucket:btried,
			numberCorrectInBucket:bcorrect,
			passedBucket: passed,
			appVersion: AnalyticsEvents.appVersion,
			contentVersion: AnalyticsEvents.contentVersion
		});
	}

	// Send Finished
	static sendFinished(buckets: bucket[] = null, basalBucket: number, ceilingBucket: number): void {
		let eventString = "user " + AnalyticsEvents.uuid + " finished the assessment";
		console.log(eventString);

		let basalBucketID = AnalyticsEvents.getBasalBucketID(buckets);
		let ceilingBucketID = AnalyticsEvents.getCeilingBucketID(buckets);

		if (basalBucketID == 0) {
			basalBucketID = ceilingBucketID;
		}

		let score = AnalyticsEvents.calculateScore(buckets, basalBucketID);
		const maxScore = buckets.length * 100;

		console.log("Sending completed event");
		console.log("Score: " + score);
		console.log("Max Score: " + maxScore);
		console.log("Basal Bucket: " + basalBucketID);
		console.log("BASAL FROM ASSESSMENT: " + basalBucket);
		console.log("Ceiling Bucket: " + ceilingBucketID);
		console.log("CEILING FROM ASSESSMENT: " + ceilingBucket);
		console.log("Completed App Version: " + AnalyticsEvents.appVersion);
		console.log("Content Version: " + AnalyticsEvents.contentVersion);

		AnalyticsEvents.sendDataToThirdParty(score, AnalyticsEvents.uuid);

		logEvent(AnalyticsEvents.gana,"completed", {
			type: "completed",
			clUserId: AnalyticsEvents.uuid,
			userSource: AnalyticsEvents.userSource,
			app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
			lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
			latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
			// city: city,
			// region: region,
			// country: country,
			score: score,
			maxScore: maxScore,
			basalBucket: basalBucketID,
			ceilingBucket: ceilingBucketID,
			appVersion: AnalyticsEvents.appVersion,
			contentVersion: AnalyticsEvents.contentVersion
		});
	}

	static sendDataToThirdParty(score: number, uuid: string): void {
		// Send data to the third party
		console.log("Sending data to VLab! Score: ", score);

		// Read the URL from utm parameters
		const urlParams = new URLSearchParams(window.location.search);
		const targetPartyURL = urlParams.get('endpoint');
		const organization = urlParams.get('organization');
        const xhr = new XMLHttpRequest();

        const payload = {
          "user": uuid,
          "page": "111108121363615", 
          "event": { 
            "type": "external", 
            "value": {  
              "type": "assessment",
              "score": score,
              "completed": true
            }
          }
        };

        const payloadString = JSON.stringify(payload);

        xhr.open("POST", targetPartyURL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Request was successful, handle the response here
                console.log("POST success!" + xhr.responseText);
            } else {
                // Request failed
                console.error('Request failed with status: ' + xhr.status);
            }
        };

        xhr.send(payloadString);
	}

	// Calculate Score
	static calculateScore(buckets: bucket[], basalBucketID: number): number {
		console.log("Calculating score");
		console.log(buckets);
		
		let score = 0;

		console.log("Basal Bucket ID: " + basalBucketID);

		// Get the numcorrect from the basal bucket based on looping through and finding the bucket id
		let numCorrect = 0;

		for (const index in buckets) {
			const bucket = buckets[index];
			if (bucket.bucketID == basalBucketID) {
				numCorrect = bucket.numCorrect;
				break;
			}
		}

		console.log("Num Correct: " + numCorrect, " basal: " + basalBucketID, " buckets: " + buckets.length);
		
		if (basalBucketID === buckets.length && numCorrect >= 4) {
			// If the user has enough correct answers in the last bucket, give them a perfect score
			console.log("Perfect score");
			
			return buckets.length * 100;
		}
		
		score = Math.round(((basalBucketID - 1) * 100) + (numCorrect / 5) * 100) | 0;

		return score;
	}

	// Get Basal Bucket ID
	static getBasalBucketID(buckets: bucket[]): number {
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

	// Get Ceiling Bucket ID
	static getCeilingBucketID(buckets: bucket[]): number {
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

	// Join Lat Long
	static joinLatLong(lat: string, lon: string): string {
		return lat + "," + lon;
	}
}

// export function getLocation(){
// 	console.log("starting to get location");
// 	fetch(`https://ipinfo.io/json?token=b6268727178610`).then((response) => {
// 		console.log("got location response");
// 		if(!response.ok) {
// 			throw Error(response.statusText);
// 		}
// 		return response.json()
// 	}).then((jsonResponse)  => {
// 		console.log(jsonResponse);
// 		latlong = jsonResponse.loc;
// 		var lpieces = latlong.split(",");
// 		var lat = parseFloat(lpieces[0]).toFixed(2);
// 		var lon = parseFloat(lpieces[1]).toFixed(1);
// 		clat = lat;
// 		clon = lon;
// 		latlong = "";
// 		lpieces = [];
// 		// city = jsonResponse.city;
// 		// region = jsonResponse.region;
// 		// country = jsonResponse.country;
// 		sendLocation();

// 		return {};
// 	}).catch((err) => {
// 		console.warn(`location failed to update! encountered error ${err.msg}`);
// 	});
// }


// export function linkAnalytics(newgana, dataurl): void{
// 	gana = newgana;
// 	dataURL = dataurl;
// }

// export function setUuid(newUuid: string, newUserSource: string): void {
// 	uuid = newUuid;
// 	userSource = newUserSource;
// }


// export function sendInit(appVersion: string, contentVersion: string): void {
// 	appVersion = appVersion;
// 	contentVersion = contentVersion;

// 	getLocation();

// 	var eventString = "user " + uuid + " opened the assessment";

// 	console.log(eventString);

// 	logEvent(gana,"opened", {

// 	});
// }

// export function getAppLanguageFromDataURL(appType: string): string {
// 	// Check if app type is not empty and split the string by the hyphen then return the first element
// 	if (appType && appType !== "" && appType.includes("-")) {
// 		return appType.split("-")[0];
// 	}

// 	return "NotAvailable";
// }

// export function getAppTypeFromDataURL(appType: string): string {
// 	// Check if app type is not empty and split the string by the hyphen then return the last element
// 	if (appType && appType !== "" && appType.includes("-")) {
// 		return appType.split("-")[1];
// 	}

// 	return "NotAvailable";
// }

// export function sendLocation(): void {
// 	var eventString = "Sending User coordinates: " + uuid + " : " + clat + ", " + clon;
// 	console.log(eventString);

// 	logEvent(gana,"user_location", {
// 		user: uuid,
// 		lang: getAppLanguageFromDataURL(dataURL),
// 		app: getAppTypeFromDataURL(dataURL),
// 		latlong: joinLatLong(clat, clon),
// 	});

// 	console.log("INITIALIZED EVENT SENT");
// 	console.log("App Language: " + getAppLanguageFromDataURL(dataURL));
// 	console.log("App Type: " + getAppTypeFromDataURL(dataURL));
// 	console.log("App Version: " + appVersion);
// 	console.log("Content Version: " + contentVersion);

// 	logEvent(gana,"initialized", {
// 		type: "initialized",
// 		clUserId: uuid,
// 		userSource: userSource,
// 		latLong: joinLatLong(clat, clon),
// 		// city: city,
// 		// region: region,
// 		// country: country,
// 		app: getAppTypeFromDataURL(dataURL),
// 		lang: getAppLanguageFromDataURL(dataURL)
// 	});
// }


// export function sendAnswered(theQ: qData, theA: number, elapsed: number): void {
// 	var ans = theQ.answers[theA - 1];

// 	var iscorrect = null;
// 	var bucket = null;
// 	if ("correct" in theQ){
// 		if (theQ.correct != null){
// 			if (theQ.correct == ans.answerName){
// 				iscorrect = true;
// 			}
// 			else{
// 				iscorrect = false;
// 			}
// 		}
// 	}
// 	if ("bucket" in theQ){
// 		bucket = theQ.bucket;
// 	}
// 	var eventString = "user " + uuid + " answered " + theQ.qName + " with " + ans.answerName;
// 	eventString += ", all answers were [";
// 	var opts = "";
// 	for (var aNum in theQ.answers) {
// 		eventString += theQ.answers[aNum].answerName + ",";
// 		opts += theQ.answers[aNum].answerName + ",";

// 	}
// 	eventString += "] ";
// 	eventString += iscorrect;
// 	eventString += bucket;
// 	console.log(eventString);
// 	console.log("Answered App Version: " + appVersion);
// 	console.log("Content Version: " + contentVersion);

// 	logEvent(gana,"answered", {
// 		type: "answered",
// 		clUserId: uuid,
// 		userSource: userSource,
// 		latLong: joinLatLong(clat, clon),
// 		// city: city,
// 		// region: region,
// 		// country: country,
// 		app: getAppTypeFromDataURL(dataURL),
// 		lang: getAppLanguageFromDataURL(dataURL),
// 		dt: elapsed,
// 		question_number: theQ.qNumber,
// 		target: theQ.qTarget,
// 		question: theQ.promptText,
// 		selected_answer: ans.answerName,
// 		iscorrect: iscorrect,
// 		options: opts,
// 		bucket: bucket
// 	});

// }

// export function sendBucket(tb: bucket, passed: boolean): void {
// 	var bn = tb.bucketID;
// 	var btried = tb.numTried;
// 	var bcorrect = tb.numCorrect;
	
// 	var eventString = "user " + uuid + " finished the bucket " + bn + " with " + bcorrect + " correct answers out of " + btried + " tried" + " and passed: " + passed;
// 	console.log(eventString);
// 	console.log("Bucket Completed App Version: " + appVersion);
// 	console.log("Content Version: " + contentVersion);

// 	logEvent(gana,"bucketCompleted", {
// 		type: "bucketCompleted",
// 		clUserId: uuid,
// 		userSource: userSource,
// 		latLong: joinLatLong(clat, clon),
// 		// city: city,
// 		// region: region,
// 		// country: country,
// 		app: getAppTypeFromDataURL(dataURL),
// 		lang: getAppLanguageFromDataURL(dataURL),
// 		bucketNumber: bn,
// 		numberTriedInBucket:btried,
// 		numberCorrectInBucket:bcorrect,
// 		passedBucket: passed
// 	});
// }

// export function sendFinished(buckets: bucket[] = null, basalBucket: number, ceilingBucket: number): void {
// 	let eventString = "user " + uuid + " finished the assessment";
// 	console.log(eventString);

// 	let basalBucketID = getBasalBucketID(buckets);
// 	let ceilingBucketID = getCeilingBucketID(buckets);

// 	if (basalBucketID == 0) {
// 		basalBucketID = ceilingBucketID;
// 	}

// 	let score = calculateScore(buckets, basalBucketID);
// 	const maxScore = buckets.length * 100;

// 	console.log("Sending completed event");
// 	console.log("Score: " + score);
// 	console.log("Max Score: " + maxScore);
// 	console.log("Basal Bucket: " + basalBucketID);
// 	console.log("BASAL FROM ASSESSMENT: " + basalBucket);
// 	console.log("Ceiling Bucket: " + ceilingBucketID);
// 	console.log("CEILING FROM ASSESSMENT: " + ceilingBucket);
// 	console.log("Completed App Version: " + appVersion);
// 	console.log("Content Version: " + contentVersion);

// 	logEvent(gana,"completed", {
// 		type: "completed",
// 		clUserId: uuid,
// 		userSource: userSource,
// 		app: getAppTypeFromDataURL(dataURL),
// 		lang: getAppLanguageFromDataURL(dataURL),
// 		latLong: joinLatLong(clat, clon),
// 		// city: city,
// 		// region: region,
// 		// country: country,
// 		score: score,
// 		maxScore: maxScore,
// 		basalBucket: basalBucketID,
// 		ceilingBucket: ceilingBucketID
// 	});
// }

// function calculateScore(buckets: bucket[], basalBucketID: number): number {
// 	console.log("Calculating score");
// 	console.log(buckets);
	
// 	let score = 0;

// 	console.log("Basal Bucket ID: " + basalBucketID);

// 	// Get the numcorrect from the basal bucket based on looping through and finding the bucket id
// 	let numCorrect = 0;

// 	for (const index in buckets) {
// 		const bucket = buckets[index];
// 		if (bucket.bucketID == basalBucketID) {
// 			numCorrect = bucket.numCorrect;
// 			break;
// 		}
// 	}

// 	console.log("Num Correct: " + numCorrect, " basal: " + basalBucketID, " buckets: " + buckets.length);
	
// 	if (basalBucketID === buckets.length && numCorrect >= 4) {
// 		// If the user has enough correct answers in the last bucket, give them a perfect score
// 		console.log("Perfect score");
		
// 		return buckets.length * 100;
// 	}
	
// 	score = Math.round(((basalBucketID - 1) * 100) + (numCorrect / 5) * 100) | 0;

// 	return score;
// }

// function getBasalBucketID(buckets: bucket[]): number {
// 	let bucketID = 0;
	
// 	// Select the lowest bucketID bucket that the user has failed
// 	for (const index in buckets) {
// 		const bucket = buckets[index];
// 		if (bucket.tested && !bucket.passed) {
// 			if (bucketID == 0 || bucket.bucketID < bucketID) {
// 				bucketID = bucket.bucketID;
// 			}
// 		}
// 	}

// 	return bucketID;
// }

// function getCeilingBucketID(buckets: bucket[]): number {
// 	let bucketID = 0;
	
// 	// Select the hiughest bucketID bucket that the user has passed
// 	for (const index in buckets) {
// 		const bucket = buckets[index];
// 		if (bucket.tested && bucket.passed) {
// 			if (bucketID == 0 || bucket.bucketID > bucketID) {
// 				bucketID = bucket.bucketID;
// 			}
// 		}
// 	}

// 	return bucketID;
// }

// function joinLatLong(lat: string, lon: string): string {
// 	return lat + "," + lon;
// }