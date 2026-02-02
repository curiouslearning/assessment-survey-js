"use strict";
(self["webpackChunkassessment_survey_js"] = self["webpackChunkassessment_survey_js"] || []).push([["src_App_ts"],{

/***/ "./src/App.ts"
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _utils_urlUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/urlUtils */ "./src/utils/urlUtils.ts");
/* harmony import */ var _survey_survey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./survey/survey */ "./src/survey/survey.ts");
/* harmony import */ var _assessment_assessment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assessment/assessment */ "./src/assessment/assessment.ts");
/* harmony import */ var _utils_unityBridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/unityBridge */ "./src/utils/unityBridge.ts");
/* harmony import */ var _utils_jsonUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/jsonUtils */ "./src/utils/jsonUtils.ts");
/* harmony import */ var workbox_window__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! workbox-window */ "./node_modules/workbox-window/build/workbox-window.prod.es5.mjs");
/* harmony import */ var _components_cacheModel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/cacheModel */ "./src/components/cacheModel.ts");
/* harmony import */ var _ui_uiController__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ui/uiController */ "./src/ui/uiController.ts");
/* harmony import */ var _analytics_analytics_integration__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./analytics/analytics-integration */ "./src/analytics/analytics-integration.ts");
/* harmony import */ var _utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/AnalyticsUtils */ "./src/utils/AnalyticsUtils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










const appVersion = 'v1.1.3';
let contentVersion = '';
let loadingScreen = document.getElementById('loadingScreen');
const progressBar = document.getElementById('progressBar');
const broadcastChannel = new BroadcastChannel('as-message-channel');
class App {
    constructor() {
        this.lang = 'english';
        this.unityBridge = new _utils_unityBridge__WEBPACK_IMPORTED_MODULE_3__.UnityBridge();
        console.log('Initializing app...');
        this.dataURL = (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_0__.getDataFile)();
        this.cacheModel = new _components_cacheModel__WEBPACK_IMPORTED_MODULE_6__["default"](this.dataURL, this.dataURL, new Set());
    }
    spinUp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield _analytics_analytics_integration__WEBPACK_IMPORTED_MODULE_8__.AnalyticsIntegration.initializeAnalytics();
            this.analyticsIntegration = _analytics_analytics_integration__WEBPACK_IMPORTED_MODULE_8__.AnalyticsIntegration.getInstance();
            window.addEventListener('load', () => {
                console.log('Window Loaded!');
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield (0,_utils_jsonUtils__WEBPACK_IMPORTED_MODULE_4__.fetchAppData)(this.dataURL).then((data) => {
                        console.log('Assessment/Survey ' + appVersion + ' initializing!');
                        console.log('App data loaded!');
                        console.log(data);
                        this.cacheModel.setContentFilePath((0,_utils_jsonUtils__WEBPACK_IMPORTED_MODULE_4__.getDataURL)(this.dataURL));
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_7__.UIController.SetFeedbackText(data['feedbackText']);
                        let appType = data['appType'];
                        let assessmentType = data['assessmentType'];
                        if (appType == 'survey') {
                            this.game = new _survey_survey__WEBPACK_IMPORTED_MODULE_1__.Survey(this.dataURL, this.unityBridge);
                        }
                        else if (appType == 'assessment') {
                            let buckets = data['buckets'];
                            for (let i = 0; i < buckets.length; i++) {
                                for (let j = 0; j < buckets[i].items.length; j++) {
                                    let audioItemURL;
                                    if (data['quizName'].includes('Luganda') ||
                                        data['quizName'].toLowerCase().includes('west african english')) {
                                        audioItemURL =
                                            '/audio/' + this.dataURL + '/' + buckets[i].items[j].itemName.toLowerCase().trim() + '.mp3';
                                    }
                                    else {
                                        audioItemURL = '/audio/' + this.dataURL + '/' + buckets[i].items[j].itemName.trim() + '.mp3';
                                    }
                                    this.cacheModel.addItemToAudioVisualResources(audioItemURL);
                                }
                            }
                            this.cacheModel.addItemToAudioVisualResources('/audio/' + this.dataURL + '/answer_feedback.mp3');
                            this.game = new _assessment_assessment__WEBPACK_IMPORTED_MODULE_2__.Assessment(this.dataURL, this.unityBridge);
                        }
                        this.game.unityBridge = this.unityBridge;
                        contentVersion = data['contentVersion'];
                        this.setCommonProperties();
                        this.logInitialAnalyticsEvents();
                        this.game.Run(this);
                    });
                    yield this.registerServiceWorker(this.game, this.dataURL);
                }))();
            });
        });
    }
    setCommonProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_9__.setCommonAnalyticsEventsProperties)((0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_0__.getUUID)(), (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_0__.getAppLanguageFromDataURL)(this.dataURL), (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_0__.getAppTypeFromDataURL)(this.dataURL), (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_0__.getUserSource)(), contentVersion, appVersion);
        });
    }
    logInitialAnalyticsEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const lat_lang = yield (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_9__.getLocation)();
            (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_9__.setLocationProperty)(lat_lang !== null && lat_lang !== void 0 ? lat_lang : 'NotAvailable');
            this.analyticsIntegration.track("opened", {});
            this.analyticsIntegration.track("user_location", {});
            this.analyticsIntegration.track("initialized", { type: "initialized" });
        });
    }
    registerServiceWorker(game_1) {
        return __awaiter(this, arguments, void 0, function* (game, dataURL = '') {
            console.log('Registering service worker...');
            if ('serviceWorker' in navigator) {
                let wb = new workbox_window__WEBPACK_IMPORTED_MODULE_5__.Workbox('./sw.js', {});
                wb.register()
                    .then((registration) => {
                    console.log('Service worker registered!');
                    this.handleServiceWorkerRegistation(registration);
                })
                    .catch((err) => {
                    console.log('Service worker registration failed: ' + err);
                });
                navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
                yield navigator.serviceWorker.ready;
                console.log('Cache Model: ');
                console.log(this.cacheModel);
                console.log('Checking for content version updates...' + dataURL);
                fetch(this.cacheModel.contentFilePath + '?cache-bust=' + new Date().getTime(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store',
                    },
                    cache: 'no-store',
                })
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (!response.ok) {
                        console.error('Failed to fetch the content file from the server!');
                        return;
                    }
                    const newContentFileData = yield response.json();
                    const aheadContentVersion = newContentFileData['contentVersion'];
                    console.log('No Cache Content version: ' + aheadContentVersion);
                    if (aheadContentVersion && contentVersion != aheadContentVersion) {
                        console.log('Content version mismatch! Reloading...');
                        localStorage.removeItem(this.cacheModel.appName);
                        caches.delete(this.cacheModel.appName);
                        handleUpdateFoundMessage();
                    }
                }))
                    .catch((error) => {
                    console.error('Error fetching the content file: ' + error);
                });
                if (localStorage.getItem(this.cacheModel.appName) == null) {
                    console.log('Caching!' + this.cacheModel.appName);
                    loadingScreen.style.display = 'flex';
                    broadcastChannel.postMessage({
                        command: 'Cache',
                        data: {
                            appData: this.cacheModel,
                        },
                    });
                }
                else {
                    progressBar.style.width = 100 + '%';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_7__.UIController.SetContentLoaded(true);
                    }, 1500);
                }
                broadcastChannel.onmessage = (event) => {
                    console.log(event.data.command + ' received from service worker!');
                    if (event.data.command == 'Activated' && localStorage.getItem(this.cacheModel.appName) == null) {
                        broadcastChannel.postMessage({
                            command: 'Cache',
                            data: {
                                appData: this.cacheModel,
                            },
                        });
                    }
                };
            }
            else {
                console.warn('Service workers are not supported in this browser.');
            }
        });
    }
    handleServiceWorkerRegistation(registration) {
        var _a;
        try {
            (_a = registration === null || registration === void 0 ? void 0 : registration.installing) === null || _a === void 0 ? void 0 : _a.postMessage({
                type: 'Registartion',
                value: this.lang,
            });
        }
        catch (err) {
            console.log('Service worker registration failed: ' + err);
        }
    }
    GetDataURL() {
        return this.dataURL;
    }
}
broadcastChannel.addEventListener('message', handleServiceWorkerMessage);
function handleServiceWorkerMessage(event) {
    if (event.data.msg == 'Loading') {
        let progressValue = parseInt(event.data.data.progress);
        handleLoadingMessage(event, progressValue);
    }
    if (event.data.msg == 'UpdateFound') {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>.,update Found');
        handleUpdateFoundMessage();
    }
}
function handleLoadingMessage(event, progressValue) {
    if (progressValue < 40 && progressValue >= 10) {
        progressBar.style.width = progressValue + '%';
    }
    else if (progressValue >= 100) {
        progressBar.style.width = 100 + '%';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            _ui_uiController__WEBPACK_IMPORTED_MODULE_7__.UIController.SetContentLoaded(true);
        }, 1500);
        localStorage.setItem(event.data.data.bookName, 'true');
        readLanguageDataFromCacheAndNotifyAndroidApp(event.data.data.bookName);
    }
}
function readLanguageDataFromCacheAndNotifyAndroidApp(bookName) {
    if (window.Android) {
        let isContentCached = localStorage.getItem(bookName) !== null;
        window.Android.cachedStatus(isContentCached);
    }
}
function handleUpdateFoundMessage() {
    let text = 'Update Found.\nPlease accept the update by pressing Ok.';
    if (confirm(text) == true) {
        window.location.reload();
    }
    else {
        text = 'Update will happen on the next launch.';
    }
}
const app = new App();
app.spinUp();


/***/ },

/***/ "./src/analytics/analytics-config.ts"
/*!*******************************************!*\
  !*** ./src/analytics/analytics-config.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   firebaseConfig: () => (/* binding */ firebaseConfig)
/* harmony export */ });
const firebaseConfig = {
    apiKey: 'AIzaSyB8c2lBVi26u7YRL9sxOP97Uaq3yN8hTl4',
    authDomain: 'ftm-b9d99.firebaseapp.com',
    databaseURL: 'https://ftm-b9d99.firebaseio.com',
    projectId: 'ftm-b9d99',
    storageBucket: 'ftm-b9d99.appspot.com',
    messagingSenderId: '602402387941',
    appId: '1:602402387941:web:7b1b1181864d28b49de10c',
    measurementId: 'G-FF1159TGCF',
};


/***/ },

/***/ "./src/analytics/analytics-integration.ts"
/*!************************************************!*\
  !*** ./src/analytics/analytics-integration.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnalyticsIntegration: () => (/* binding */ AnalyticsIntegration)
/* harmony export */ });
/* harmony import */ var _utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/AnalyticsUtils */ "./src/utils/AnalyticsUtils.ts");
/* harmony import */ var _base_analytics_integration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-analytics-integration */ "./src/analytics/base-analytics-integration.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class AnalyticsIntegration extends _base_analytics_integration__WEBPACK_IMPORTED_MODULE_1__.BaseAnalyticsIntegration {
    constructor() {
        super();
    }
    createBaseEventData() {
        const commonProperties = (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_0__.getCommonAnalyticsEventsProperties)();
        return {
            clUserId: commonProperties.cr_user_id,
            lang: commonProperties.language,
            app: commonProperties.app,
            latLong: commonProperties.lat_lang,
            userSource: commonProperties.user_source,
            appVersion: commonProperties.app_version,
            contentVersion: commonProperties.content_version,
        };
    }
    static initializeAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instance) {
                this.instance = new AnalyticsIntegration();
            }
            if (!this.instance.isAnalyticsReady()) {
                yield this.instance.initialize();
            }
        });
    }
    static getInstance() {
        if (!this.instance || !this.instance.isAnalyticsReady()) {
            throw new Error('AnalyticsIntegration.initializeAnalytics() must be called before accessing the instance');
        }
        return this.instance;
    }
    sendDataToThirdParty(score, uuid, requiredScore, nextAssessment, assessmentType) {
        console.log('Attempting to send score to a third party! Score: ', score);
        const urlParams = new URLSearchParams(window.location.search);
        const targetPartyURL = urlParams.get('endpoint');
        const organization = urlParams.get('organization');
        const xhr = new XMLHttpRequest();
        if (!targetPartyURL) {
            console.error('No target party URL found!');
            return;
        }
        const payload = {
            user: uuid,
            page: '111108121363615',
            event: {
                type: 'external',
                value: {
                    type: 'assessment',
                    subType: assessmentType,
                    score: score,
                    requiredScore: requiredScore,
                    nextAssessment: nextAssessment,
                    completed: true,
                },
            },
        };
        const payloadString = JSON.stringify(payload);
        try {
            xhr.open('POST', targetPartyURL, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('POST success!' + xhr.responseText);
                }
                else {
                    console.error('Request failed with status: ' + xhr.status);
                }
            };
            xhr.send(payloadString);
        }
        catch (error) {
            console.error('Failed to send data to target party: ', error);
        }
    }
    initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.initialize.call(this);
        });
    }
    track(eventType, eventData) {
        const baseData = this.createBaseEventData();
        let data = Object.assign(Object.assign({}, baseData), eventData);
        this.trackCustomEvent(eventType, data);
    }
}


/***/ },

/***/ "./src/analytics/analyticsEvents.ts"
/*!******************************************!*\
  !*** ./src/analytics/analyticsEvents.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnalyticsEvents: () => (/* binding */ AnalyticsEvents)
/* harmony export */ });
/* harmony import */ var firebase_analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/analytics */ "../node_modules/firebase/analytics/dist/esm/index.esm.js");
/* harmony import */ var _utils_urlUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/urlUtils */ "./src/utils/urlUtils.ts");


class AnalyticsEvents {
    constructor() {
    }
    static getInstance() {
        if (!AnalyticsEvents.instance) {
            AnalyticsEvents.instance = new AnalyticsEvents();
        }
        return AnalyticsEvents.instance;
    }
    static setAssessmentType(assessmentType) {
        AnalyticsEvents.assessmentType = assessmentType;
    }
    static getLocation() {
        console.log('starting to get location');
        fetch(`https://ipinfo.io/json?token=b6268727178610`)
            .then((response) => {
            console.log('got location response');
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
            .then((jsonResponse) => {
            console.log(jsonResponse);
            AnalyticsEvents.latlong = jsonResponse.loc;
            var lpieces = AnalyticsEvents.latlong.split(',');
            var lat = parseFloat(lpieces[0]).toFixed(2);
            var lon = parseFloat(lpieces[1]).toFixed(1);
            AnalyticsEvents.clat = lat;
            AnalyticsEvents.clon = lon;
            AnalyticsEvents.latlong = '';
            lpieces = [];
            AnalyticsEvents.sendLocation();
            return {};
        })
            .catch((err) => {
            console.warn(`location failed to update! encountered error ${err.msg}`);
        });
    }
    static linkAnalytics(newgana, dataurl) {
        AnalyticsEvents.gana = newgana;
        AnalyticsEvents.dataURL = dataurl;
    }
    static setUuid(newUuid, newUserSource) {
        AnalyticsEvents.uuid = newUuid;
        AnalyticsEvents.userSource = newUserSource;
    }
    static sendInit(appVersion, contentVersion) {
        AnalyticsEvents.appVersion = appVersion;
        AnalyticsEvents.contentVersion = contentVersion;
        AnalyticsEvents.getLocation();
        var eventString = 'user ' + AnalyticsEvents.uuid + ' opened the assessment';
        console.log(eventString);
        (0,firebase_analytics__WEBPACK_IMPORTED_MODULE_0__.logEvent)(AnalyticsEvents.gana, 'opened', {});
    }
    static getAppLanguageFromDataURL(appType) {
        if (appType && appType !== '' && appType.includes('-')) {
            let language = appType.split('-').slice(0, -1).join('-');
            if (language.includes('west-african')) {
                return 'west-african-english';
            }
            else {
                return language;
            }
        }
        return 'NotAvailable';
    }
    static getAppTypeFromDataURL(appType) {
        if (appType && appType !== '' && appType.includes('-')) {
            return appType.substring(appType.lastIndexOf('-') + 1);
        }
        return 'NotAvailable';
    }
    static sendLocation() {
        var eventString = 'Sending User coordinates: ' + AnalyticsEvents.uuid + ' : ' + AnalyticsEvents.clat + ', ' + AnalyticsEvents.clon;
        console.log(eventString);
        (0,firebase_analytics__WEBPACK_IMPORTED_MODULE_0__.logEvent)(AnalyticsEvents.gana, 'user_location', {
            user: AnalyticsEvents.uuid,
            lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
            app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
            latlong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
        });
        console.log('INITIALIZED EVENT SENT');
        console.log('App Language: ' + AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL));
        console.log('App Type: ' + AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL));
        console.log('App Version: ' + AnalyticsEvents.appVersion);
        console.log('Content Version: ' + AnalyticsEvents.contentVersion);
        (0,firebase_analytics__WEBPACK_IMPORTED_MODULE_0__.logEvent)(AnalyticsEvents.gana, 'initialized', {
            type: 'initialized',
            clUserId: AnalyticsEvents.uuid,
            userSource: AnalyticsEvents.userSource,
            latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
            appVersion: AnalyticsEvents.appVersion,
            contentVersion: AnalyticsEvents.contentVersion,
            app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
            lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
        });
    }
    static sendAnswered(theQ, theA, elapsed) {
        var ans = theQ.answers[theA - 1];
        var iscorrect = null;
        var bucket = null;
        if ('correct' in theQ) {
            if (theQ.correct != null) {
                if (theQ.correct == ans.answerName) {
                    iscorrect = true;
                }
                else {
                    iscorrect = false;
                }
            }
        }
        if ('bucket' in theQ) {
            bucket = theQ.bucket;
        }
        var eventString = 'user ' + AnalyticsEvents.uuid + ' answered ' + theQ.qName + ' with ' + ans.answerName;
        eventString += ', all answers were [';
        var opts = '';
        for (var aNum in theQ.answers) {
            eventString += theQ.answers[aNum].answerName + ',';
            opts += theQ.answers[aNum].answerName + ',';
        }
        eventString += '] ';
        eventString += iscorrect;
        eventString += bucket;
        console.log(eventString);
        console.log('Answered App Version: ' + AnalyticsEvents.appVersion);
        console.log('Content Version: ' + AnalyticsEvents.contentVersion);
        (0,firebase_analytics__WEBPACK_IMPORTED_MODULE_0__.logEvent)(AnalyticsEvents.gana, 'answered', {
            type: 'answered',
            clUserId: AnalyticsEvents.uuid,
            userSource: AnalyticsEvents.userSource,
            latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
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
            contentVersion: AnalyticsEvents.contentVersion,
        });
    }
    static sendBucket(tb, passed) {
        var bn = tb.bucketID;
        var btried = tb.numTried;
        var bcorrect = tb.numCorrect;
        var eventString = 'user ' +
            AnalyticsEvents.uuid +
            ' finished the bucket ' +
            bn +
            ' with ' +
            bcorrect +
            ' correct answers out of ' +
            btried +
            ' tried' +
            ' and passed: ' +
            passed;
        console.log(eventString);
        console.log('Bucket Completed App Version: ' + AnalyticsEvents.appVersion);
        console.log('Content Version: ' + AnalyticsEvents.contentVersion);
        (0,firebase_analytics__WEBPACK_IMPORTED_MODULE_0__.logEvent)(AnalyticsEvents.gana, 'bucketCompleted', {
            type: 'bucketCompleted',
            clUserId: AnalyticsEvents.uuid,
            userSource: AnalyticsEvents.userSource,
            latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon),
            app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL),
            lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL),
            bucketNumber: bn,
            numberTriedInBucket: btried,
            numberCorrectInBucket: bcorrect,
            passedBucket: passed,
            appVersion: AnalyticsEvents.appVersion,
            contentVersion: AnalyticsEvents.contentVersion,
        });
    }
    static sendFinished(buckets = null, basalBucket, ceilingBucket) {
        let eventString = 'user ' + AnalyticsEvents.uuid + ' finished the assessment';
        console.log(eventString);
        let nextAssessment = (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_1__.getNextAssessment)();
        let requiredScore = (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_1__.getRequiredScore)();
        let basalBucketID = AnalyticsEvents.getBasalBucketID(buckets);
        let ceilingBucketID = AnalyticsEvents.getCeilingBucketID(buckets);
        if (basalBucketID == 0) {
            basalBucketID = ceilingBucketID;
        }
        let score = AnalyticsEvents.calculateScore(buckets, basalBucketID);
        const maxScore = buckets.length * 100;
        console.log('Sending completed event');
        console.log('Score: ' + score);
        console.log('Max Score: ' + maxScore);
        console.log('Basal Bucket: ' + basalBucketID);
        console.log('BASAL FROM ASSESSMENT: ' + basalBucket);
        console.log('Ceiling Bucket: ' + ceilingBucketID);
        console.log('CEILING FROM ASSESSMENT: ' + ceilingBucket);
        console.log('Completed App Version: ' + AnalyticsEvents.appVersion);
        console.log('Content Version: ' + AnalyticsEvents.contentVersion);
        let isSynapseUser = false;
        let integerRequiredScore = 0;
        if (nextAssessment === 'null' && requiredScore === 'null') {
            isSynapseUser = true;
            integerRequiredScore = 0;
        }
        else if (Number(requiredScore) >= score && Number(requiredScore) != 0) {
            isSynapseUser = true;
            integerRequiredScore = Number(requiredScore);
            nextAssessment = 'null';
        }
        else if (Number(requiredScore) < score && Number(requiredScore) != 0) {
            isSynapseUser = true;
            integerRequiredScore = Number(requiredScore);
        }
        AnalyticsEvents.sendDataToThirdParty(score, AnalyticsEvents.uuid, integerRequiredScore, nextAssessment);
        if (window.parent) {
            window.parent.postMessage({
                type: 'assessment_completed',
                score: score,
            }, 'https://synapse.curiouscontent.org/');
        }
        const eventData = Object.assign({ type: 'completed', clUserId: AnalyticsEvents.uuid, userSource: AnalyticsEvents.userSource, app: AnalyticsEvents.getAppTypeFromDataURL(AnalyticsEvents.dataURL), lang: AnalyticsEvents.getAppLanguageFromDataURL(AnalyticsEvents.dataURL), latLong: AnalyticsEvents.joinLatLong(AnalyticsEvents.clat, AnalyticsEvents.clon), score: score, maxScore: maxScore, basalBucket: basalBucketID, ceilingBucket: ceilingBucketID, appVersion: AnalyticsEvents.appVersion, contentVersion: AnalyticsEvents.contentVersion }, (isSynapseUser && {
            nextAssessment: nextAssessment,
            requiredScore: integerRequiredScore
        }));
        (0,firebase_analytics__WEBPACK_IMPORTED_MODULE_0__.logEvent)(AnalyticsEvents.gana, 'completed', eventData);
    }
    static sendDataToThirdParty(score, uuid, requiredScore, nextAssessment) {
        console.log('Attempting to send score to a third party! Score: ', score);
        const urlParams = new URLSearchParams(window.location.search);
        const targetPartyURL = urlParams.get('endpoint');
        const organization = urlParams.get('organization');
        const xhr = new XMLHttpRequest();
        if (!targetPartyURL) {
            console.error('No target party URL found!');
            return;
        }
        const payload = {
            user: uuid,
            page: '111108121363615',
            event: {
                type: 'external',
                value: {
                    type: 'assessment',
                    subType: AnalyticsEvents.assessmentType,
                    score: score,
                    requiredScore: requiredScore,
                    nextAssessment: nextAssessment,
                    completed: true,
                },
            },
        };
        const payloadString = JSON.stringify(payload);
        try {
            xhr.open('POST', targetPartyURL, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('POST success!' + xhr.responseText);
                }
                else {
                    console.error('Request failed with status: ' + xhr.status);
                }
            };
            xhr.send(payloadString);
        }
        catch (error) {
            console.error('Failed to send data to target party: ', error);
        }
    }
    static calculateScore(buckets, basalBucketID) {
        console.log('Calculating score');
        console.log(buckets);
        let score = 0;
        console.log('Basal Bucket ID: ' + basalBucketID);
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
            console.log('Perfect score');
            return buckets.length * 100;
        }
        score = Math.round((basalBucketID - 1) * 100 + (numCorrect / 5) * 100) | 0;
        return score;
    }
    static getBasalBucketID(buckets) {
        let bucketID = 0;
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
    static getCeilingBucketID(buckets) {
        let bucketID = 0;
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
    static joinLatLong(lat, lon) {
        return lat + ',' + lon;
    }
}


/***/ },

/***/ "./src/analytics/base-analytics-integration.ts"
/*!*****************************************************!*\
  !*** ./src/analytics/base-analytics-integration.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseAnalyticsIntegration: () => (/* binding */ BaseAnalyticsIntegration)
/* harmony export */ });
/* harmony import */ var _curiouslearning_analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @curiouslearning/analytics */ "../node_modules/@curiouslearning/analytics/dist/index.js");
/* harmony import */ var _curiouslearning_analytics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_curiouslearning_analytics__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _analytics_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./analytics-config */ "./src/analytics/analytics-config.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class BaseAnalyticsIntegration {
    constructor() {
        this.isInitialized = false;
        this.analyticsService = new _curiouslearning_analytics__WEBPACK_IMPORTED_MODULE_0__.AnalyticsService();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized) {
                return;
            }
            try {
                this.firebaseStrategy = new _curiouslearning_analytics__WEBPACK_IMPORTED_MODULE_0__.FirebaseStrategy({
                    firebaseOptions: {
                        apiKey: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.apiKey,
                        authDomain: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.authDomain,
                        databaseURL: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.databaseURL,
                        projectId: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.projectId,
                        storageBucket: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.storageBucket,
                        messagingSenderId: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.messagingSenderId,
                        appId: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.appId,
                        measurementId: _analytics_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig.measurementId,
                    },
                    userProperties: {}
                });
                yield this.firebaseStrategy.initialize();
                this.analyticsService.register('firebase', this.firebaseStrategy);
                this.isInitialized = true;
                console.log("Analytics service initialized successfully with Firebase and Statsig");
            }
            catch (error) {
                console.error("Error while initializing analytics:", error);
                throw error;
            }
        });
    }
    trackCustomEvent(eventName, event) {
        if (!this.isInitialized) {
            console.warn("Analytics not initialized, queuing event:", eventName);
        }
        try {
            this.analyticsService.track(eventName, event);
        }
        catch (error) {
            console.error("Error while logging custom event:", error);
        }
    }
    get analytics() {
        return this.analyticsService;
    }
    get firebaseApp() {
        var _a;
        return (_a = this.firebaseStrategy) === null || _a === void 0 ? void 0 : _a.firebaseApp;
    }
    isAnalyticsReady() {
        return this.isInitialized;
    }
}


/***/ },

/***/ "./src/assessment/assessment.ts"
/*!**************************************!*\
  !*** ./src/assessment/assessment.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Assessment: () => (/* binding */ Assessment)
/* harmony export */ });
/* harmony import */ var _ui_uiController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/uiController */ "./src/ui/uiController.ts");
/* harmony import */ var _baseQuiz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../baseQuiz */ "./src/baseQuiz.ts");
/* harmony import */ var _utils_jsonUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/jsonUtils */ "./src/utils/jsonUtils.ts");
/* harmony import */ var _components_tNode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/tNode */ "./src/components/tNode.ts");
/* harmony import */ var _utils_mathUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/mathUtils */ "./src/utils/mathUtils.ts");
/* harmony import */ var _components_audioController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/audioController */ "./src/components/audioController.ts");
/* harmony import */ var _analytics_analytics_integration__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../analytics/analytics-integration */ "./src/analytics/analytics-integration.ts");
/* harmony import */ var _utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/AnalyticsUtils */ "./src/utils/AnalyticsUtils.ts");
/* harmony import */ var _utils_urlUtils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/urlUtils */ "./src/utils/urlUtils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









var searchStage;
(function (searchStage) {
    searchStage[searchStage["BinarySearch"] = 0] = "BinarySearch";
    searchStage[searchStage["LinearSearchUp"] = 1] = "LinearSearchUp";
    searchStage[searchStage["LinearSearchDown"] = 2] = "LinearSearchDown";
})(searchStage || (searchStage = {}));
var BucketGenMode;
(function (BucketGenMode) {
    BucketGenMode[BucketGenMode["RandomBST"] = 0] = "RandomBST";
    BucketGenMode[BucketGenMode["LinearArrayBased"] = 1] = "LinearArrayBased";
})(BucketGenMode || (BucketGenMode = {}));
class Assessment extends _baseQuiz__WEBPACK_IMPORTED_MODULE_1__.BaseQuiz {
    constructor(dataURL, unityBridge) {
        super();
        this.bucketGenMode = BucketGenMode.RandomBST;
        this.MAX_STARS_COUNT_IN_LINEAR_MODE = 20;
        this.generateDevModeBucketControlsInContainer = (container, clickHandler) => {
            if (this.isInDevMode && this.bucketGenMode === BucketGenMode.LinearArrayBased) {
                container.innerHTML = '';
                for (let i = 0; i < this.currentBucket.items.length; i++) {
                    let item = this.currentBucket.items[i];
                    let itemButton = document.createElement('button');
                    let index = i;
                    itemButton.innerText = item.itemName;
                    itemButton.style.margin = '2px';
                    itemButton.onclick = () => {
                        this.currentLinearTargetIndex = index;
                        this.currentBucket.usedItems = [];
                        console.log('Clicked on item ' + item.itemName + ' at index ' + this.currentLinearTargetIndex);
                        const newQ = this.buildNewQuestion();
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().answersContainer.style.visibility = 'hidden';
                        for (let b in _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().buttons) {
                            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().buttons[b].style.visibility = 'hidden';
                        }
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().shown = false;
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().nextQuestion = newQ;
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().questionsContainer.innerHTML = '';
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().questionsContainer.style.display = 'none';
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ShowQuestion(newQ);
                        _components_audioController__WEBPACK_IMPORTED_MODULE_5__.AudioController.PlayAudio(this.buildNewQuestion().promptAudio, _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().showOptions, _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ShowAudioAnimation);
                    };
                    container.append(itemButton);
                }
                let prevButton = document.createElement('button');
                prevButton.innerText = 'Prev Bucket';
                if (this.currentLinearBucketIndex == 0) {
                    prevButton.disabled = true;
                }
                prevButton.addEventListener('click', () => {
                    if (this.currentLinearBucketIndex > 0) {
                        this.currentLinearBucketIndex--;
                        this.currentLinearTargetIndex = 0;
                        this.tryMoveBucket(false);
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ReadyForNext(this.buildNewQuestion());
                        this.updateBucketInfo();
                    }
                    if (this.currentLinearBucketIndex == 0) {
                        prevButton.disabled = true;
                    }
                });
                let nextButton = document.createElement('button');
                nextButton.innerText = 'Next Bucket';
                if (this.currentLinearBucketIndex == this.buckets.length - 1) {
                    nextButton.disabled = true;
                }
                nextButton.addEventListener('click', () => {
                    if (this.currentLinearBucketIndex < this.buckets.length - 1) {
                        this.currentLinearBucketIndex++;
                        this.currentLinearTargetIndex = 0;
                        this.tryMoveBucket(false);
                        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ReadyForNext(this.buildNewQuestion());
                        this.updateBucketInfo();
                    }
                });
                let buttonsContainer = document.createElement('div');
                buttonsContainer.style.display = 'flex';
                buttonsContainer.style.flexDirection = 'row';
                buttonsContainer.style.justifyContent = 'center';
                buttonsContainer.style.alignItems = 'center';
                buttonsContainer.appendChild(prevButton);
                buttonsContainer.appendChild(nextButton);
                container.appendChild(buttonsContainer);
            }
        };
        this.updateBucketInfo = () => {
            if (this.currentBucket != null) {
                this.devModeBucketInfoContainer.innerHTML = `Bucket: ${this.currentBucket.bucketID}<br/>Correct: ${this.currentBucket.numCorrect}<br/>Tried: ${this.currentBucket.numTried}<br/>Failed: ${this.currentBucket.numConsecutiveWrong}`;
            }
        };
        this.startAssessment = () => {
            this.commonProperties = (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_7__.getCommonAnalyticsEventsProperties)();
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ReadyForNext(this.buildNewQuestion());
            if (this.isInDevMode) {
                this.hideDevModeButton();
            }
        };
        this.buildBuckets = (bucketGenMode) => __awaiter(this, void 0, void 0, function* () {
            if (this.buckets === undefined || this.buckets.length === 0) {
                const res = (0,_utils_jsonUtils__WEBPACK_IMPORTED_MODULE_2__.fetchAssessmentBuckets)(this.app.GetDataURL()).then((result) => {
                    this.buckets = result;
                    this.numBuckets = result.length;
                    console.log('buckets: ' + this.buckets);
                    this.bucketArray = Array.from(Array(this.numBuckets), (_, i) => i + 1);
                    console.log('empty array ' + this.bucketArray);
                    let usedIndices = new Set();
                    usedIndices.add(0);
                    let rootOfIDs = (0,_components_tNode__WEBPACK_IMPORTED_MODULE_3__.sortedArrayToIDsBST)(this.buckets[0].bucketID - 1, this.buckets[this.buckets.length - 1].bucketID, usedIndices);
                    let bucketsRoot = this.convertToBucketBST(rootOfIDs, this.buckets);
                    console.log('Generated the buckets root ----------------------------------------------');
                    console.log(bucketsRoot);
                    this.basalBucket = this.numBuckets + 1;
                    this.ceilingBucket = -1;
                    this.currentNode = bucketsRoot;
                    this.tryMoveBucket(false);
                });
                return res;
            }
            else {
                if (bucketGenMode === BucketGenMode.RandomBST) {
                    return new Promise((resolve, reject) => {
                        let usedIndices = new Set();
                        usedIndices.add(0);
                        let rootOfIDs = (0,_components_tNode__WEBPACK_IMPORTED_MODULE_3__.sortedArrayToIDsBST)(this.buckets[0].bucketID - 1, this.buckets[this.buckets.length - 1].bucketID, usedIndices);
                        let bucketsRoot = this.convertToBucketBST(rootOfIDs, this.buckets);
                        console.log('Generated the buckets root ----------------------------------------------');
                        console.log(bucketsRoot);
                        this.basalBucket = this.numBuckets + 1;
                        this.ceilingBucket = -1;
                        this.currentNode = bucketsRoot;
                        this.tryMoveBucket(false);
                        resolve();
                    });
                }
                else if (bucketGenMode === BucketGenMode.LinearArrayBased) {
                    return new Promise((resolve, reject) => {
                        this.currentLinearBucketIndex = 0;
                        this.currentLinearTargetIndex = 0;
                        this.tryMoveBucket(false);
                        resolve();
                    });
                }
            }
        });
        this.convertToBucketBST = (node, buckets) => {
            if (node === null)
                return node;
            let bucketId = node.value;
            node.value = buckets.find((bucket) => bucket.bucketID === bucketId);
            if (node.left !== null)
                node.left = this.convertToBucketBST(node.left, buckets);
            if (node.right !== null)
                node.right = this.convertToBucketBST(node.right, buckets);
            return node;
        };
        this.initBucket = (bucket) => {
            this.currentBucket = bucket;
            this.currentBucket.usedItems = [];
            this.currentBucket.numTried = 0;
            this.currentBucket.numCorrect = 0;
            this.currentBucket.numConsecutiveWrong = 0;
            this.currentBucket.tested = true;
            this.currentBucket.passed = false;
        };
        this.handleAnswerButtonPress = (answer, elapsed) => {
            if (this.bucketGenMode === BucketGenMode.RandomBST) {
                this.logPuzzleCompletedEvent(answer, elapsed, this.currentQuestion);
            }
            this.updateCurrentBucketValuesAfterAnswering(answer);
            this.updateFeedbackAfterAnswer(answer);
            setTimeout(() => {
                console.log('Completed first Timeout');
                this.onQuestionEnd();
            }, 2000 * this.animationSpeedMultiplier);
        };
        this.onQuestionEnd = () => {
            let questionEndTimeout = this.HasQuestionsLeft()
                ? 500 * this.animationSpeedMultiplier
                : 4000 * this.animationSpeedMultiplier;
            const endOperations = () => {
                _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetFeedbackVisibile(false, false);
                if (this.bucketGenMode === BucketGenMode.LinearArrayBased &&
                    _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().shownStarsCount < this.MAX_STARS_COUNT_IN_LINEAR_MODE) {
                    _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ChangeStarImageAfterAnimation();
                }
                else if (this.bucketGenMode === BucketGenMode.RandomBST) {
                    _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ChangeStarImageAfterAnimation();
                }
                if (this.HasQuestionsLeft()) {
                    if (this.bucketGenMode === BucketGenMode.LinearArrayBased && !this.isBucketControlsEnabled) {
                        if (this.currentLinearTargetIndex < this.buckets[this.currentLinearBucketIndex].items.length) {
                            this.currentLinearTargetIndex++;
                            this.currentBucket.usedItems = [];
                        }
                        if (this.currentLinearTargetIndex >= this.buckets[this.currentLinearBucketIndex].items.length &&
                            this.currentLinearBucketIndex < this.buckets.length) {
                            this.currentLinearBucketIndex++;
                            this.currentLinearTargetIndex = 0;
                            if (this.currentLinearBucketIndex < this.buckets.length) {
                                this.tryMoveBucket(false);
                            }
                            else {
                                console.log('No questions left');
                                this.onEnd();
                                return;
                            }
                        }
                    }
                    _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ReadyForNext(this.buildNewQuestion());
                }
                else {
                    console.log('No questions left');
                    this.onEnd();
                }
            };
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, questionEndTimeout);
            });
            timeoutPromise.then(() => {
                endOperations();
                if (this.isInDevMode) {
                    this.updateBucketInfo();
                }
            });
        };
        this.buildNewQuestion = () => {
            if (this.isLinearArrayExhausted()) {
                return null;
            }
            const targetItem = this.selectTargetItem();
            const foils = this.generateFoils(targetItem);
            const answerOptions = this.shuffleAnswerOptions([targetItem, ...foils]);
            const newQuestion = this.createQuestion(targetItem, answerOptions);
            this.currentQuestion = newQuestion;
            this.questionNumber += 1;
            return newQuestion;
        };
        this.isLinearArrayExhausted = () => {
            return (this.bucketGenMode === BucketGenMode.LinearArrayBased &&
                this.currentLinearTargetIndex >= this.buckets[this.currentLinearBucketIndex].items.length);
        };
        this.selectTargetItem = () => {
            let targetItem;
            if (this.bucketGenMode === BucketGenMode.RandomBST) {
                targetItem = this.selectRandomUnusedItem();
            }
            else if (this.bucketGenMode === BucketGenMode.LinearArrayBased) {
                targetItem = this.buckets[this.currentLinearBucketIndex].items[this.currentLinearTargetIndex];
                this.currentBucket.usedItems.push(targetItem);
            }
            return targetItem;
        };
        this.selectRandomUnusedItem = () => {
            let item;
            do {
                item = (0,_utils_mathUtils__WEBPACK_IMPORTED_MODULE_4__.randFrom)(this.currentBucket.items);
            } while (this.currentBucket.usedItems.includes(item));
            this.currentBucket.usedItems.push(item);
            return item;
        };
        this.generateFoils = (targetItem) => {
            let foil1, foil2, foil3;
            if (this.bucketGenMode === BucketGenMode.RandomBST) {
                foil1 = this.generateRandomFoil(targetItem);
                foil2 = this.generateRandomFoil(targetItem, foil1);
                foil3 = this.generateRandomFoil(targetItem, foil1, foil2);
            }
            else if (this.bucketGenMode === BucketGenMode.LinearArrayBased) {
                foil1 = this.generateLinearFoil(targetItem);
                foil2 = this.generateLinearFoil(targetItem, foil1);
                foil3 = this.generateLinearFoil(targetItem, foil1, foil2);
            }
            return [foil1, foil2, foil3];
        };
        this.generateRandomFoil = (targetItem, ...existingFoils) => {
            let foil;
            do {
                foil = (0,_utils_mathUtils__WEBPACK_IMPORTED_MODULE_4__.randFrom)(this.currentBucket.items);
            } while ([targetItem, ...existingFoils].includes(foil));
            return foil;
        };
        this.generateLinearFoil = (targetItem, ...existingFoils) => {
            let foil;
            do {
                foil = (0,_utils_mathUtils__WEBPACK_IMPORTED_MODULE_4__.randFrom)(this.buckets[this.currentLinearBucketIndex].items);
            } while ([targetItem, ...existingFoils].includes(foil));
            return foil;
        };
        this.shuffleAnswerOptions = (options) => {
            (0,_utils_mathUtils__WEBPACK_IMPORTED_MODULE_4__.shuffleArray)(options);
            return options;
        };
        this.createQuestion = (targetItem, answerOptions) => {
            return {
                qName: `question-${this.questionNumber}-${targetItem.itemName}`,
                qNumber: this.questionNumber,
                qTarget: targetItem.itemName,
                promptText: '',
                bucket: this.currentBucket.bucketID,
                promptAudio: targetItem.itemName,
                correct: targetItem.itemText,
                answers: answerOptions.map((option) => ({
                    answerName: option.itemName,
                    answerText: option.itemText,
                })),
            };
        };
        this.tryMoveBucket = (passed) => {
            if (this.bucketGenMode === BucketGenMode.RandomBST) {
                this.tryMoveBucketRandomBST(passed);
            }
            else if (this.bucketGenMode === BucketGenMode.LinearArrayBased) {
                this.tryMoveBucketLinearArrayBased(passed);
            }
        };
        this.tryMoveBucketRandomBST = (passed) => {
            const newBucket = this.currentNode.value;
            if (this.currentBucket != null) {
                this.currentBucket.passed = passed;
                this.logBucketCompletedEvent(this.currentBucket, passed);
            }
            console.log('new  bucket is ' + newBucket.bucketID);
            _components_audioController__WEBPACK_IMPORTED_MODULE_5__.AudioController.PreloadBucket(newBucket, this.app.GetDataURL());
            this.initBucket(newBucket);
        };
        this.tryMoveBucketLinearArrayBased = (passed) => {
            const newBucket = this.buckets[this.currentLinearBucketIndex];
            console.log('New Bucket: ' + newBucket.bucketID);
            _components_audioController__WEBPACK_IMPORTED_MODULE_5__.AudioController.PreloadBucket(newBucket, this.app.GetDataURL());
            this.initBucket(newBucket);
        };
        this.HasQuestionsLeft = () => {
            if (this.currentBucket.passed)
                return false;
            if (this.bucketGenMode === BucketGenMode.LinearArrayBased) {
                return this.hasLinearQuestionsLeft();
            }
            if (this.currentBucket.numCorrect >= 4) {
                return this.handlePassedBucket();
            }
            else if (this.currentBucket.numConsecutiveWrong >= 2 || this.currentBucket.numTried >= 5) {
                return this.handleFailedBucket();
            }
            return true;
        };
        this.hasLinearQuestionsLeft = () => {
            if (this.currentLinearBucketIndex >= this.buckets.length &&
                this.currentLinearTargetIndex >= this.buckets[this.currentLinearBucketIndex].items.length) {
                return false;
            }
            else {
                return true;
            }
        };
        this.handlePassedBucket = () => {
            console.log('Passed this bucket ' + this.currentBucket.bucketID);
            if (this.currentBucket.bucketID >= this.numBuckets) {
                return this.passHighestBucket();
            }
            else {
                return this.moveUpToNextBucket();
            }
        };
        this.handleFailedBucket = () => {
            console.log('Failed this bucket ' + this.currentBucket.bucketID);
            if (this.currentBucket.bucketID < this.basalBucket) {
                this.basalBucket = this.currentBucket.bucketID;
            }
            if (this.currentBucket.bucketID <= 1) {
                return this.failLowestBucket();
            }
            else {
                return this.moveDownToPreviousBucket();
            }
        };
        this.passHighestBucket = () => {
            console.log('Passed highest bucket');
            this.currentBucket.passed = true;
            if (this.bucketGenMode === BucketGenMode.RandomBST) {
                this.logBucketCompletedEvent(this.currentBucket, true);
            }
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ProgressChest();
            return false;
        };
        this.moveUpToNextBucket = () => {
            if (this.currentNode.right != null) {
                console.log('Moving to right node');
                if (this.bucketGenMode === BucketGenMode.RandomBST) {
                    this.currentNode = this.currentNode.right;
                }
                else {
                    this.currentLinearBucketIndex++;
                }
                this.tryMoveBucket(true);
            }
            else {
                console.log('Reached root node');
                this.currentBucket.passed = true;
                if (this.bucketGenMode === BucketGenMode.RandomBST) {
                    this.logBucketCompletedEvent(this.currentBucket, true);
                }
                _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ProgressChest();
                return false;
            }
            return true;
        };
        this.failLowestBucket = () => {
            console.log('Failed lowest bucket !');
            this.currentBucket.passed = false;
            if (this.bucketGenMode === BucketGenMode.RandomBST) {
                this.logBucketCompletedEvent(this.currentBucket, false);
            }
            return false;
        };
        this.moveDownToPreviousBucket = () => {
            console.log('Moving down bucket !');
            if (this.currentNode.left != null) {
                console.log('Moving to left node');
                if (this.bucketGenMode === BucketGenMode.RandomBST) {
                    this.currentNode = this.currentNode.left;
                }
                else {
                    this.currentLinearBucketIndex++;
                }
                this.tryMoveBucket(false);
            }
            else {
                console.log('Reached root node !');
                this.currentBucket.passed = false;
                if (this.bucketGenMode === BucketGenMode.RandomBST) {
                    this.logBucketCompletedEvent(this.currentBucket, false);
                }
                return false;
            }
            return true;
        };
        this.dataURL = dataURL;
        this.unityBridge = unityBridge;
        this.questionNumber = 0;
        console.log('app initialized');
        this.setupUIHandlers();
        this.analyticsIntegration = _analytics_analytics_integration__WEBPACK_IMPORTED_MODULE_6__.AnalyticsIntegration.getInstance();
    }
    setupUIHandlers() {
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetButtonPressAction(this.handleAnswerButtonPress);
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetStartAction(this.startAssessment);
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetExternalBucketControlsGenerationHandler(this.generateDevModeBucketControlsInContainer);
    }
    Run(applink) {
        this.app = applink;
        this.buildBuckets(this.bucketGenMode).then((result) => {
            console.log(this.currentBucket);
            this.unityBridge.SendLoaded();
        });
    }
    handleBucketGenModeChange(event) {
        this.bucketGenMode = parseInt(this.devModeBucketGenSelect.value);
        this.buildBuckets(this.bucketGenMode).then(() => {
        });
        this.updateBucketInfo();
    }
    handleCorrectLabelShownChange() {
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().SetCorrectLabelVisibility(this.isCorrectLabelShown);
    }
    handleAnimationSpeedMultiplierChange() {
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().SetAnimationSpeedMultiplier(this.animationSpeedMultiplier);
    }
    handleBucketInfoShownChange() {
        this.updateBucketInfo();
    }
    handleBucketControlsShownChange() {
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().SetBucketControlsVisibility(this.isBucketControlsEnabled);
    }
    logPuzzleCompletedEvent(answer, elapsed, theQ) {
        var ans = theQ.answers[answer - 1];
        let bucket = null;
        let options = '';
        let eventString = 'user ' + this.commonProperties.cr_user_id + ' answered ' + theQ.qName + ' with ' + ans.answerName;
        if ('bucket' in theQ) {
            bucket = theQ.bucket;
        }
        for (var aNum in theQ.answers) {
            eventString += theQ.answers[aNum].answerName + ',';
            options += theQ.answers[aNum].answerName + ',';
        }
        this.analyticsIntegration.track("answered", {
            type: 'answered',
            dt: elapsed,
            question_number: theQ.qNumber,
            target: theQ.qTarget,
            question: theQ.promptText,
            selected_answer: ans.answerName,
            iscorrect: this.isAnswerCorrect(answer),
            options: options,
            bucket: bucket,
        });
    }
    isAnswerCorrect(answer) {
        if (this.currentQuestion.answers[answer - 1].answerName == this.currentQuestion.correct) {
            return true;
        }
        else {
            return false;
        }
    }
    updateFeedbackAfterAnswer(answer) {
        if (this.bucketGenMode === BucketGenMode.LinearArrayBased &&
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.getInstance().shownStarsCount < this.MAX_STARS_COUNT_IN_LINEAR_MODE) {
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.AddStar();
        }
        else if (this.bucketGenMode === BucketGenMode.RandomBST) {
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.AddStar();
        }
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetFeedbackVisibile(true, this.currentQuestion.answers[answer - 1].answerName == this.currentQuestion.correct);
    }
    updateCurrentBucketValuesAfterAnswering(answer) {
        this.currentBucket.numTried += 1;
        if (this.currentQuestion.answers[answer - 1].answerName == this.currentQuestion.correct) {
            this.currentBucket.numCorrect += 1;
            this.currentBucket.numConsecutiveWrong = 0;
            console.log('Answered correctly');
        }
        else {
            this.currentBucket.numConsecutiveWrong += 1;
            console.log('Answered incorrectly, ' + this.currentBucket.numConsecutiveWrong);
        }
    }
    logBucketCompletedEvent(bucket, passed) {
        this.analyticsIntegration.track("bucketCompleted", {
            type: 'bucketCompleted',
            bucketNumber: bucket.bucketID,
            numberTriedInBucket: bucket.numTried,
            numberCorrectInBucket: bucket.numCorrect,
            passedBucket: passed,
        });
    }
    onEnd() {
        this.LogCompletedEvent(this.buckets, this.basalBucket, this.ceilingBucket);
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ShowEnd();
        this.app.unityBridge.SendClose();
    }
    LogCompletedEvent(buckets = null, basalBucket, ceilingBucket) {
        let basalBucketID = (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_7__.getBasalBucketID)(buckets);
        let ceilingBucketID = (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_7__.getCeilingBucketID)(buckets);
        if (basalBucketID == 0) {
            basalBucketID = ceilingBucketID;
        }
        let score = (0,_utils_AnalyticsUtils__WEBPACK_IMPORTED_MODULE_7__.calculateScore)(buckets, basalBucketID);
        let nextAssessment = (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_8__.getNextAssessment)();
        let requiredScore = (0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_8__.getRequiredScore)();
        let isSynapseUser = false;
        let integerRequiredScore = 0;
        if (nextAssessment === 'null' && requiredScore === 'null') {
            isSynapseUser = true;
            integerRequiredScore = 0;
        }
        else if (Number(requiredScore) >= score && Number(requiredScore) != 0) {
            isSynapseUser = true;
            integerRequiredScore = Number(requiredScore);
            nextAssessment = 'null';
        }
        else if (Number(requiredScore) < score && Number(requiredScore) != 0) {
            isSynapseUser = true;
            integerRequiredScore = Number(requiredScore);
        }
        this.analyticsIntegration.sendDataToThirdParty(score, this.commonProperties.cr_user_id, integerRequiredScore, nextAssessment, this.commonProperties.app);
        if (window.parent) {
            window.parent.postMessage({
                type: 'assessment_completed',
                score: score,
            }, 'https://synapse.curiouscontent.org/');
        }
        this.analyticsIntegration.track("completed", Object.assign({ type: 'completed', score: score, maxScore: buckets.length * 100, basalBucket: basalBucketID, ceilingBucket: ceilingBucketID }, (isSynapseUser && {
            nextAssessment: nextAssessment,
            requiredScore: integerRequiredScore
        })));
    }
}


/***/ },

/***/ "./src/baseQuiz.ts"
/*!*************************!*\
  !*** ./src/baseQuiz.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseQuiz: () => (/* binding */ BaseQuiz)
/* harmony export */ });
/* harmony import */ var _ui_uiController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui/uiController */ "./src/ui/uiController.ts");

class BaseQuiz {
    constructor() {
        this.devModeAvailable = false;
        this.isInDevMode = false;
        this.isCorrectLabelShown = false;
        this.isBucketInfoShown = false;
        this.isBucketControlsEnabled = false;
        this.animationSpeedMultiplier = 1;
        this.devModeToggleButtonContainerId = 'devModeModalToggleButtonContainer';
        this.devModeToggleButtonId = 'devModeModalToggleButton';
        this.devModeModalId = 'devModeSettingsModal';
        this.devModeBucketGenSelectId = 'devModeBucketGenSelect';
        this.devModeCorrectLabelShownCheckboxId = 'devModeCorrectLabelShownCheckbox';
        this.devModeBucketInfoShownCheckboxId = 'devModeBucketInfoShownCheckbox';
        this.devModeBucketInfoContainerId = 'devModeBucketInfoContainer';
        this.devModeBucketControlsShownCheckboxId = 'devModeBucketControlsShownCheckbox';
        this.devModeAnimationSpeedMultiplierRangeId = 'devModeAnimationSpeedMultiplierRange';
        this.devModeAnimationSpeedMultiplierValueId = 'devModeAnimationSpeedMultiplierValue';
        this.toggleDevModeModal = () => {
            if (this.devModeSettingsModal.style.display == 'block') {
                this.devModeSettingsModal.style.display = 'none';
            }
            else {
                this.devModeSettingsModal.style.display = 'block';
            }
        };
        this.isInDevMode =
            window.location.href.includes('localhost') ||
                window.location.href.includes('127.0.0.1') ||
                window.location.href.includes('assessmentdev');
        this.devModeToggleButtonContainer = document.getElementById(this.devModeToggleButtonContainerId);
        this.devModeSettingsModal = document.getElementById(this.devModeModalId);
        this.devModeBucketGenSelect = document.getElementById(this.devModeBucketGenSelectId);
        this.devModeBucketGenSelect.onchange = (event) => {
            this.handleBucketGenModeChange(event);
        };
        this.devModeToggleButton = document.getElementById(this.devModeToggleButtonId);
        this.devModeToggleButton.onclick = this.toggleDevModeModal;
        this.devModeCorrectLabelShownCheckbox = document.getElementById(this.devModeCorrectLabelShownCheckboxId);
        this.devModeCorrectLabelShownCheckbox.onchange = () => {
            this.isCorrectLabelShown = this.devModeCorrectLabelShownCheckbox.checked;
            this.handleCorrectLabelShownChange();
        };
        this.devModeBucketInfoShownCheckbox = document.getElementById(this.devModeBucketInfoShownCheckboxId);
        this.devModeBucketInfoShownCheckbox.onchange = () => {
            this.isBucketInfoShown = this.devModeBucketInfoShownCheckbox.checked;
            this.devModeBucketInfoContainer.style.display = this.isBucketInfoShown ? 'block' : 'none';
            this.handleBucketInfoShownChange();
        };
        this.devModeBucketControlsShownCheckbox = document.getElementById(this.devModeBucketControlsShownCheckboxId);
        this.devModeBucketControlsShownCheckbox.onchange = () => {
            this.isBucketControlsEnabled = this.devModeBucketControlsShownCheckbox.checked;
            this.handleBucketControlsShownChange();
        };
        this.devModeBucketInfoContainer = document.getElementById(this.devModeBucketInfoContainerId);
        this.devModeAnimationSpeedMultiplierRange = document.getElementById(this.devModeAnimationSpeedMultiplierRangeId);
        this.devModeAnimationSpeedMultiplierValue = document.getElementById(this.devModeAnimationSpeedMultiplierValueId);
        this.devModeAnimationSpeedMultiplierRange.onchange = () => {
            this.animationSpeedMultiplier = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
            if (this.animationSpeedMultiplier < 0.2) {
                this.animationSpeedMultiplier = 0.2;
                this.devModeAnimationSpeedMultiplierRange.value = '0.2';
            }
            this.devModeAnimationSpeedMultiplierValue.innerText = this.animationSpeedMultiplier.toString();
            this.handleAnimationSpeedMultiplierChange();
        };
        if (!this.isInDevMode) {
            this.devModeToggleButtonContainer.style.display = 'none';
        }
        else {
            this.devModeToggleButtonContainer.style.display = 'block';
        }
        this.animationSpeedMultiplier = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
    }
    hideDevModeButton() {
        this.devModeToggleButtonContainer.style.display = 'none';
    }
    onEnd() {
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ShowEnd();
        this.app.unityBridge.SendClose();
    }
}


/***/ },

/***/ "./src/components/audioController.ts"
/*!*******************************************!*\
  !*** ./src/components/audioController.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AudioController: () => (/* binding */ AudioController)
/* harmony export */ });
/* harmony import */ var _utils_jsonUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/jsonUtils */ "./src/utils/jsonUtils.ts");

class AudioController {
    constructor() {
        this.imageToCache = [];
        this.wavToCache = [];
        this.allAudios = {};
        this.allImages = {};
        this.dataURL = '';
        this.correctSoundPath = 'dist/audio/Correct.wav';
        this.feedbackAudio = null;
        this.correctAudio = null;
    }
    init() {
        this.feedbackAudio = new Audio();
        this.feedbackAudio.src = this.correctSoundPath;
        this.correctAudio = new Audio();
    }
    static PrepareAudioAndImagesForSurvey(questionsData, dataURL) {
        AudioController.getInstance().dataURL = dataURL;
        const feedbackSoundPath = 'audio/' + AudioController.getInstance().dataURL + '/answer_feedback.mp3';
        AudioController.getInstance().wavToCache.push(feedbackSoundPath);
        AudioController.getInstance().correctAudio.src = feedbackSoundPath;
        for (var questionIndex in questionsData) {
            let questionData = questionsData[questionIndex];
            if (questionData.promptAudio != null) {
                AudioController.FilterAndAddAudioToAllAudios(questionData.promptAudio.toLowerCase());
            }
            if (questionData.promptImg != null) {
                AudioController.AddImageToAllImages(questionData.promptImg);
            }
            for (var answerIndex in questionData.answers) {
                let answerData = questionData.answers[answerIndex];
                if (answerData.answerImg != null) {
                    AudioController.AddImageToAllImages(answerData.answerImg);
                }
            }
        }
        console.log(AudioController.getInstance().allAudios);
        console.log(AudioController.getInstance().allImages);
    }
    static AddImageToAllImages(newImageURL) {
        console.log('Add image: ' + newImageURL);
        let newImage = new Image();
        newImage.src = newImageURL;
        AudioController.getInstance().allImages[newImageURL] = newImage;
    }
    static FilterAndAddAudioToAllAudios(newAudioURL) {
        console.log('Adding audio: ' + newAudioURL);
        if (newAudioURL.includes('.wav')) {
            newAudioURL = newAudioURL.replace('.wav', '.mp3');
        }
        else if (newAudioURL.includes('.mp3')) {
        }
        else {
            newAudioURL = newAudioURL.trim() + '.mp3';
        }
        console.log('Filtered: ' + newAudioURL);
        let newAudio = new Audio();
        if ((0,_utils_jsonUtils__WEBPACK_IMPORTED_MODULE_0__.getCaseIndependentLangList)().includes(AudioController.getInstance().dataURL.split('-')[0])) {
            newAudio.src = 'audio/' + AudioController.getInstance().dataURL + '/' + newAudioURL;
        }
        else {
            newAudio.src = 'audio/' + AudioController.getInstance().dataURL + '/' + newAudioURL;
        }
        AudioController.getInstance().allAudios[newAudioURL] = newAudio;
        console.log(newAudio.src);
    }
    static PreloadBucket(newBucket, dataURL) {
        AudioController.getInstance().dataURL = dataURL;
        AudioController.getInstance().correctAudio.src =
            'audio/' + AudioController.getInstance().dataURL + '/answer_feedback.mp3';
        for (var itemIndex in newBucket.items) {
            var item = newBucket.items[itemIndex];
            AudioController.FilterAndAddAudioToAllAudios(item.itemName.toLowerCase());
        }
    }
    static PlayAudio(audioName, finishedCallback, audioAnim) {
        audioName = audioName.toLowerCase();
        console.log('trying to play ' + audioName);
        if (audioName.includes('.mp3')) {
            if (audioName.slice(-4) != '.mp3') {
                audioName = audioName.trim() + '.mp3';
            }
        }
        else {
            audioName = audioName.trim() + '.mp3';
        }
        console.log('Pre play all audios: ');
        console.log(AudioController.getInstance().allAudios);
        const playPromise = new Promise((resolve, reject) => {
            const audio = AudioController.getInstance().allAudios[audioName];
            if (audio) {
                audio.addEventListener('play', () => {
                    typeof audioAnim !== 'undefined' ? audioAnim(true) : null;
                });
                audio.addEventListener('ended', () => {
                    typeof audioAnim !== 'undefined' ? audioAnim(false) : null;
                    resolve();
                });
                audio.play().catch((error) => {
                    console.error('Error playing audio:', error);
                    resolve();
                });
            }
            else {
                console.warn('Audio file not found:', audioName);
                resolve();
            }
        });
        playPromise
            .then(() => {
            typeof finishedCallback !== 'undefined' ? finishedCallback() : null;
        })
            .catch((error) => {
            console.error('Promise error:', error);
        });
    }
    static GetImage(imageName) {
        return AudioController.getInstance().allImages[imageName];
    }
    static PlayDing() {
        AudioController.getInstance().feedbackAudio.play();
    }
    static PlayCorrect() {
        AudioController.getInstance().correctAudio.play();
    }
    static getInstance() {
        if (AudioController.instance == null) {
            AudioController.instance = new AudioController();
            AudioController.instance.init();
        }
        return AudioController.instance;
    }
}
AudioController.instance = null;


/***/ },

/***/ "./src/components/cacheModel.ts"
/*!**************************************!*\
  !*** ./src/components/cacheModel.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class CacheModel {
    constructor(appName, contentFilePath, audioVisualResources) {
        this.appName = appName;
        this.contentFilePath = contentFilePath;
        this.audioVisualResources = audioVisualResources;
    }
    setAppName(appName) {
        this.appName = appName;
    }
    setContentFilePath(contentFilePath) {
        this.contentFilePath = contentFilePath;
    }
    setAudioVisualResources(audioVisualResources) {
        this.audioVisualResources = audioVisualResources;
    }
    addItemToAudioVisualResources(item) {
        if (!this.audioVisualResources.has(item)) {
            this.audioVisualResources.add(item);
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CacheModel);


/***/ },

/***/ "./src/components/tNode.ts"
/*!*********************************!*\
  !*** ./src/components/tNode.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TreeNode: () => (/* binding */ TreeNode),
/* harmony export */   sortedArrayToIDsBST: () => (/* binding */ sortedArrayToIDsBST)
/* harmony export */ });
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
function sortedArrayToIDsBST(start, end, usedIndices) {
    if (start > end)
        return null;
    let mid;
    if ((start + end) % 2 === 0 && usedIndices.size !== 1) {
        mid = Math.floor((start + end) / 2);
        if (mid === 0)
            return null;
    }
    else {
        do {
            mid = Math.floor((start + end) / 2);
            mid += Math.floor(Math.random() * 2);
        } while (mid > end || usedIndices.has(mid));
    }
    usedIndices.add(mid);
    let node = new TreeNode(mid);
    node.left = sortedArrayToIDsBST(start, mid - 1, usedIndices);
    node.right = sortedArrayToIDsBST(mid + 1, end, usedIndices);
    return node;
}


/***/ },

/***/ "./src/survey/survey.ts"
/*!******************************!*\
  !*** ./src/survey/survey.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Survey: () => (/* binding */ Survey)
/* harmony export */ });
/* harmony import */ var _ui_uiController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/uiController */ "./src/ui/uiController.ts");
/* harmony import */ var _components_audioController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/audioController */ "./src/components/audioController.ts");
/* harmony import */ var _analytics_analyticsEvents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../analytics/analyticsEvents */ "./src/analytics/analyticsEvents.ts");
/* harmony import */ var _baseQuiz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../baseQuiz */ "./src/baseQuiz.ts");
/* harmony import */ var _utils_jsonUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/jsonUtils */ "./src/utils/jsonUtils.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class Survey extends _baseQuiz__WEBPACK_IMPORTED_MODULE_3__.BaseQuiz {
    constructor(dataURL, unityBridge) {
        super();
        this.handleBucketGenModeChange = () => {
            console.log('Bucket Gen Mode Changed');
        };
        this.handleCorrectLabelShownChange = () => {
            console.log('Correct Label Shown Changed');
        };
        this.handleBucketInfoShownChange = () => {
            console.log('Bucket Info Shown Changed');
        };
        this.handleBucketControlsShownChange = () => {
            console.log('Bucket Controls Shown Changed');
        };
        this.startSurvey = () => {
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ReadyForNext(this.buildNewQuestion());
        };
        this.onQuestionEnd = () => {
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetFeedbackVisibile(false, false);
            this.currentQuestionIndex += 1;
            setTimeout(() => {
                if (this.HasQuestionsLeft()) {
                    _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.ReadyForNext(this.buildNewQuestion());
                }
                else {
                    console.log('There are no questions left.');
                    this.onEnd();
                }
            }, 500);
        };
        this.handleAnswerButtonPress = (answer, elapsed) => {
            _analytics_analyticsEvents__WEBPACK_IMPORTED_MODULE_2__.AnalyticsEvents.sendAnswered(this.questionsData[this.currentQuestionIndex], answer, elapsed);
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetFeedbackVisibile(true, true);
            _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.AddStar();
            setTimeout(() => {
                this.onQuestionEnd();
            }, 2000);
        };
        this.buildQuestionList = () => {
            const surveyQuestions = (0,_utils_jsonUtils__WEBPACK_IMPORTED_MODULE_4__.fetchSurveyQuestions)(this.app.dataURL);
            return surveyQuestions;
        };
        console.log('Survey initialized');
        this.dataURL = dataURL;
        this.unityBridge = unityBridge;
        this.currentQuestionIndex = 0;
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetButtonPressAction(this.handleAnswerButtonPress);
        _ui_uiController__WEBPACK_IMPORTED_MODULE_0__.UIController.SetStartAction(this.startSurvey);
    }
    handleAnimationSpeedMultiplierChange() {
        console.log('Animation Speed Multiplier Changed');
    }
    Run(app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.app = app;
            this.buildQuestionList().then((result) => {
                this.questionsData = result;
                _components_audioController__WEBPACK_IMPORTED_MODULE_1__.AudioController.PrepareAudioAndImagesForSurvey(this.questionsData, this.app.GetDataURL());
                this.unityBridge.SendLoaded();
            });
        });
    }
    HasQuestionsLeft() {
        return this.currentQuestionIndex <= this.questionsData.length - 1;
    }
    buildNewQuestion() {
        var questionData = this.questionsData[this.currentQuestionIndex];
        return questionData;
    }
}


/***/ },

/***/ "./src/ui/uiController.ts"
/*!********************************!*\
  !*** ./src/ui/uiController.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UIController: () => (/* binding */ UIController)
/* harmony export */ });
/* harmony import */ var _components_audioController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/audioController */ "./src/components/audioController.ts");
/* harmony import */ var _utils_mathUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/mathUtils */ "./src/utils/mathUtils.ts");
/* harmony import */ var _utils_urlUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/urlUtils */ "./src/utils/urlUtils.ts");



class UIController {
    constructor() {
        this.landingContainerId = 'landWrap';
        this.gameContainerId = 'gameWrap';
        this.endContainerId = 'endWrap';
        this.starContainerId = 'starWrapper';
        this.chestContainerId = 'chestWrapper';
        this.questionsContainerId = 'qWrap';
        this.feedbackContainerId = 'feedbackWrap';
        this.answersContainerId = 'aWrap';
        this.answerButton1Id = 'answerButton1';
        this.answerButton2Id = 'answerButton2';
        this.answerButton3Id = 'answerButton3';
        this.answerButton4Id = 'answerButton4';
        this.answerButton5Id = 'answerButton5';
        this.answerButton6Id = 'answerButton6';
        this.playButtonId = 'pbutton';
        this.chestImgId = 'chestImage';
        this.nextQuestion = null;
        this.contentLoaded = false;
        this.shown = false;
        this.stars = [];
        this.shownStarsCount = 0;
        this.starPositions = Array();
        this.qAnsNum = 0;
        this.buttons = [];
        this.buttonsActive = false;
        this.devModeCorrectLabelVisibility = false;
        this.devModeBucketControlsEnabled = false;
        this.animationSpeedMultiplier = 1;
    }
    init() {
        this.landingContainer = document.getElementById(this.landingContainerId);
        this.gameContainer = document.getElementById(this.gameContainerId);
        this.endContainer = document.getElementById(this.endContainerId);
        this.starContainer = document.getElementById(this.starContainerId);
        this.chestContainer = document.getElementById(this.chestContainerId);
        this.questionsContainer = document.getElementById(this.questionsContainerId);
        this.feedbackContainer = document.getElementById(this.feedbackContainerId);
        this.answersContainer = document.getElementById(this.answersContainerId);
        this.answerButton1 = document.getElementById(this.answerButton1Id);
        this.answerButton2 = document.getElementById(this.answerButton2Id);
        this.answerButton3 = document.getElementById(this.answerButton3Id);
        this.answerButton4 = document.getElementById(this.answerButton4Id);
        this.answerButton5 = document.getElementById(this.answerButton5Id);
        this.answerButton6 = document.getElementById(this.answerButton6Id);
        this.playButton = document.getElementById(this.playButtonId);
        this.chestImg = document.getElementById(this.chestImgId);
        this.initializeStars();
        this.initEventListeners();
    }
    initializeStars() {
        for (let i = 0; i < 20; i++) {
            const newStar = document.createElement('img');
            newStar.id = 'star' + i;
            newStar.classList.add('topstarv');
            this.starContainer.appendChild(newStar);
            this.starContainer.innerHTML += '';
            if (i == 9) {
                this.starContainer.innerHTML += '<br>';
            }
            this.stars.push(i);
        }
        (0,_utils_mathUtils__WEBPACK_IMPORTED_MODULE_1__.shuffleArray)(this.stars);
    }
    SetAnimationSpeedMultiplier(multiplier) {
        UIController.getInstance().animationSpeedMultiplier = multiplier;
    }
    SetCorrectLabelVisibility(visible) {
        this.devModeCorrectLabelVisibility = visible;
        console.log('Correct label visibility set to ', this.devModeCorrectLabelVisibility);
    }
    SetBucketControlsVisibility(visible) {
        console.log('Bucket controls visibility set to ', visible);
        this.devModeBucketControlsEnabled = visible;
    }
    static OverlappingOtherStars(starPositions, x, y, minDistance) {
        if (starPositions.length < 1)
            return false;
        for (let i = 0; i < starPositions.length; i++) {
            const dx = starPositions[i].x - x;
            const dy = starPositions[i].y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }
    initEventListeners() {
        this.answerButton1.addEventListener('click', () => {
            this.answerButtonPress(1);
        });
        this.buttons.push(this.answerButton1);
        this.answerButton2.addEventListener('click', () => {
            this.answerButtonPress(2);
        });
        this.buttons.push(this.answerButton2);
        this.answerButton3.addEventListener('click', () => {
            this.answerButtonPress(3);
        });
        this.buttons.push(this.answerButton3);
        this.answerButton4.addEventListener('click', () => {
            this.answerButtonPress(4);
        });
        this.buttons.push(this.answerButton4);
        this.answerButton5.addEventListener('click', () => {
            this.answerButtonPress(5);
        });
        this.buttons.push(this.answerButton5);
        this.answerButton6.addEventListener('click', () => {
            this.answerButtonPress(6);
        });
        this.buttons.push(this.answerButton6);
        this.landingContainer.addEventListener('click', () => {
            if (localStorage.getItem((0,_utils_urlUtils__WEBPACK_IMPORTED_MODULE_2__.getDataFile)()) && UIController.getInstance().contentLoaded) {
                this.showGame();
            }
        });
    }
    showOptions() {
        if (!UIController.getInstance().shown) {
            const newQ = UIController.getInstance().nextQuestion;
            const buttons = UIController.getInstance().buttons;
            const animationSpeedMultiplier = UIController.getInstance().animationSpeedMultiplier;
            let animationDuration = 220 * animationSpeedMultiplier;
            const delayBforeOption = 150 * animationSpeedMultiplier;
            UIController.getInstance().shown = true;
            let optionsDisplayed = 0;
            buttons.forEach((button) => {
                button.style.visibility = 'hidden';
                button.style.animation = '';
                button.innerHTML = '';
            });
            setTimeout(() => {
                for (let i = 0; i < newQ.answers.length; i++) {
                    const curAnswer = newQ.answers[i];
                    const button = buttons[i];
                    const isCorrect = curAnswer.answerName === newQ.correct;
                    button.innerHTML = 'answerText' in curAnswer ? curAnswer.answerText : '';
                    if (isCorrect && UIController.getInstance().devModeCorrectLabelVisibility) {
                        const correctLabel = document.createElement('div');
                        correctLabel.classList.add('correct-label');
                        correctLabel.innerHTML = 'Correct';
                        button.appendChild(correctLabel);
                    }
                    button.style.visibility = 'hidden';
                    button.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';
                    setTimeout(() => {
                        button.style.visibility = 'visible';
                        button.style.boxShadow = '0px 6px 8px #606060';
                        button.style.animation = `zoomIn ${animationDuration * animationSpeedMultiplier}ms ease forwards`;
                        if ('answerImg' in curAnswer) {
                            const tmpimg = _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.GetImage(curAnswer.answerImg);
                            button.appendChild(tmpimg);
                        }
                        button.addEventListener('animationend', () => {
                            optionsDisplayed++;
                            if (optionsDisplayed === newQ.answers.length) {
                                UIController.getInstance().enableAnswerButton();
                            }
                        });
                    }, i * animationDuration * animationSpeedMultiplier * 0.3);
                }
            }, delayBforeOption);
            UIController.getInstance().qStart = Date.now();
        }
    }
    enableAnswerButton() {
        UIController.getInstance().buttonsActive = true;
    }
    static SetFeedbackText(nt) {
        console.log('Feedback text set to ' + nt);
        UIController.getInstance().feedbackContainer.innerHTML = nt;
    }
    showLanding() {
        this.landingContainer.style.display = 'flex';
        this.gameContainer.style.display = 'none';
        this.endContainer.style.display = 'none';
    }
    static ShowEnd() {
        UIController.getInstance().landingContainer.style.display = 'none';
        UIController.getInstance().gameContainer.style.display = 'none';
        UIController.getInstance().endContainer.style.display = 'flex';
    }
    showGame() {
        this.landingContainer.style.display = 'none';
        this.gameContainer.style.display = 'grid';
        this.endContainer.style.display = 'none';
        this.allStart = Date.now();
        this.startPressCallback();
    }
    static SetFeedbackVisibile(visible, isCorrect) {
        if (visible) {
            UIController.getInstance().feedbackContainer.classList.remove('hidden');
            UIController.getInstance().feedbackContainer.classList.add('visible');
            UIController.getInstance().buttonsActive = false;
            if (isCorrect) {
                UIController.getInstance().feedbackContainer.style.color = 'rgb(109, 204, 122)';
                _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.PlayCorrect();
            }
            else {
                UIController.getInstance().feedbackContainer.style.color = 'red';
            }
        }
        else {
            UIController.getInstance().feedbackContainer.classList.remove('visible');
            UIController.getInstance().feedbackContainer.classList.add('hidden');
            UIController.getInstance().buttonsActive = false;
        }
    }
    static ReadyForNext(newQ, reGenerateItems = true) {
        if (newQ === null) {
            return;
        }
        console.log('ready for next!');
        UIController.getInstance().answersContainer.style.visibility = 'hidden';
        for (var b in UIController.getInstance().buttons) {
            UIController.getInstance().buttons[b].style.visibility = 'hidden';
        }
        UIController.getInstance().shown = false;
        UIController.getInstance().nextQuestion = newQ;
        UIController.getInstance().questionsContainer.innerHTML = '';
        UIController.getInstance().questionsContainer.style.display = 'none';
        const isBucketControlsEnabled = UIController.getInstance().devModeBucketControlsEnabled;
        if (isBucketControlsEnabled) {
            UIController.getInstance().externalBucketControlsGenerationHandler(UIController.getInstance().playButton, () => {
                console.log('Call from inside click handler of external bucket controls');
                UIController.ShowQuestion();
                _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.PlayAudio(newQ.promptAudio, UIController.getInstance().showOptions, UIController.ShowAudioAnimation);
            });
        }
        else {
            UIController.getInstance().playButton.innerHTML =
                "<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='/img/SoundButton_Idle.png' type='image/svg+xml'> </img></button>";
            var nextQuestionButton = document.getElementById('nextqButton');
            nextQuestionButton.addEventListener('click', function () {
                UIController.ShowQuestion();
                _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.PlayAudio(newQ.promptAudio, UIController.getInstance().showOptions, UIController.ShowAudioAnimation);
            });
        }
    }
    static ShowAudioAnimation(playing = false) {
        if (!UIController.getInstance().devModeBucketControlsEnabled) {
            const playButtonImg = UIController.getInstance().playButton.querySelector('img');
            if (playing) {
                playButtonImg.src = 'animation/SoundButton.gif';
            }
            else {
                playButtonImg.src = '/img/SoundButton_Idle.png';
            }
        }
    }
    static ShowQuestion(newQuestion) {
        const isBucketControlsEnabled = UIController.getInstance().devModeBucketControlsEnabled;
        if (isBucketControlsEnabled) {
            UIController.getInstance().externalBucketControlsGenerationHandler(UIController.getInstance().playButton, () => {
                console.log('Call from inside click handler of external bucket controls #2');
                console.log('next question button pressed');
                console.log(newQuestion.promptAudio);
                if ('promptAudio' in newQuestion) {
                    _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.PlayAudio(newQuestion.promptAudio, undefined, UIController.ShowAudioAnimation);
                }
            });
        }
        else {
            UIController.getInstance().playButton.innerHTML =
                "<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='/img/SoundButton_Idle.png' type='image/svg+xml'> </img></button>";
            var nextQuestionButton = document.getElementById('nextqButton');
            nextQuestionButton.addEventListener('click', function () {
                console.log('next question button pressed');
                console.log(newQuestion.promptAudio);
                if ('promptAudio' in newQuestion) {
                    _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.PlayAudio(newQuestion.promptAudio, undefined, UIController.ShowAudioAnimation);
                }
            });
        }
        UIController.getInstance().answersContainer.style.visibility = 'visible';
        let qCode = '';
        UIController.getInstance().questionsContainer.innerHTML = '';
        if (typeof newQuestion == 'undefined') {
            newQuestion = UIController.getInstance().nextQuestion;
        }
        if ('promptImg' in newQuestion) {
            var tmpimg = _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.GetImage(newQuestion.promptImg);
            UIController.getInstance().questionsContainer.appendChild(tmpimg);
        }
        qCode += newQuestion.promptText;
        qCode += '<BR>';
        UIController.getInstance().questionsContainer.innerHTML += qCode;
        for (var buttonIndex in UIController.getInstance().buttons) {
            UIController.getInstance().buttons[buttonIndex].style.visibility = 'hidden';
        }
    }
    static AddStar() {
        var starToShow = document.getElementById('star' + UIController.getInstance().stars[UIController.getInstance().qAnsNum]);
        starToShow.src = '../animation/Star.gif';
        starToShow.classList.add('topstarv');
        starToShow.classList.remove('topstarh');
        starToShow.style.position = 'absolute';
        let containerWidth = UIController.getInstance().starContainer.offsetWidth;
        let containerHeight = UIController.getInstance().starContainer.offsetHeight;
        console.log('Stars Container dimensions: ', containerWidth, containerHeight);
        let randomX = 0;
        let randomY = 0;
        do {
            randomX = Math.floor(Math.random() * (containerWidth - containerWidth * 0.2));
            randomY = Math.floor(Math.random() * containerHeight);
        } while (UIController.OverlappingOtherStars(UIController.instance.starPositions, randomX, randomY, 28));
        const animationSpeedMultiplier = UIController.getInstance().animationSpeedMultiplier;
        starToShow.style.transform = 'scale(10)';
        starToShow.style.transition = `top ${1 * animationSpeedMultiplier}s ease, left ${1 * animationSpeedMultiplier}s ease, transform ${0.5 * animationSpeedMultiplier}s ease`;
        starToShow.style.zIndex = '500';
        starToShow.style.top = window.innerHeight / 2 + 'px';
        starToShow.style.left = UIController.instance.gameContainer.offsetWidth / 2 - starToShow.offsetWidth / 2 + 'px';
        setTimeout(() => {
            starToShow.style.transition = `top ${2 * animationSpeedMultiplier}s ease, left ${2 * animationSpeedMultiplier}s ease, transform ${2 * animationSpeedMultiplier}s ease`;
            if (randomX < containerWidth / 2 - 30) {
                const rotation = 5 + Math.random() * 8;
                console.log('Rotating star to the right', rotation);
                starToShow.style.transform = 'rotate(-' + rotation + 'deg) scale(1)';
            }
            else {
                const rotation = 5 + Math.random() * 8;
                console.log('Rotating star to the left', rotation);
                starToShow.style.transform = 'rotate(' + rotation + 'deg) scale(1)';
            }
            starToShow.style.left = 10 + randomX + 'px';
            starToShow.style.top = randomY + 'px';
            setTimeout(() => {
                starToShow.style.filter = 'drop-shadow(0px 0px 10px yellow)';
            }, 1900 * animationSpeedMultiplier);
        }, 1000 * animationSpeedMultiplier);
        UIController.instance.starPositions.push({ x: randomX, y: randomY });
        UIController.getInstance().qAnsNum += 1;
        UIController.getInstance().shownStarsCount += 1;
    }
    static ChangeStarImageAfterAnimation() {
        var starToShow = document.getElementById('star' + UIController.getInstance().stars[UIController.getInstance().qAnsNum - 1]);
        starToShow.src = '../img/star_after_animation.gif';
    }
    answerButtonPress(buttonNum) {
        const allButtonsVisible = this.buttons.every((button) => button.style.visibility === 'visible');
        console.log(this.buttonsActive, allButtonsVisible);
        if (this.buttonsActive === true) {
            _components_audioController__WEBPACK_IMPORTED_MODULE_0__.AudioController.PlayDing();
            const nPressed = Date.now();
            const dTime = nPressed - this.qStart;
            console.log('answered in ' + dTime);
            this.buttonPressCallback(buttonNum, dTime);
        }
    }
    static ProgressChest() {
        const chestImage = document.getElementById('chestImage');
        let currentImgSrc = chestImage.src;
        console.log('Chest Progression-->', chestImage);
        console.log('Chest Progression-->', chestImage.src);
        const currentImageNumber = parseInt(currentImgSrc.slice(-6, -4), 10);
        console.log('Chest Progression number-->', currentImageNumber);
        const nextImageNumber = (currentImageNumber % 4) + 1;
        const nextImageSrc = `img/chestprogression/TreasureChestOpen0${nextImageNumber}.svg`;
        chestImage.src = nextImageSrc;
    }
    static SetContentLoaded(value) {
        UIController.getInstance().contentLoaded = value;
    }
    static SetButtonPressAction(callback) {
        UIController.getInstance().buttonPressCallback = callback;
    }
    static SetStartAction(callback) {
        UIController.getInstance().startPressCallback = callback;
    }
    static SetExternalBucketControlsGenerationHandler(handler) {
        UIController.getInstance().externalBucketControlsGenerationHandler = handler;
    }
    static getInstance() {
        if (UIController.instance === null) {
            UIController.instance = new UIController();
            UIController.instance.init();
        }
        return UIController.instance;
    }
}
UIController.instance = null;


/***/ },

/***/ "./src/utils/AnalyticsUtils.ts"
/*!*************************************!*\
  !*** ./src/utils/AnalyticsUtils.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateScore: () => (/* binding */ calculateScore),
/* harmony export */   getBasalBucketID: () => (/* binding */ getBasalBucketID),
/* harmony export */   getCeilingBucketID: () => (/* binding */ getCeilingBucketID),
/* harmony export */   getCommonAnalyticsEventsProperties: () => (/* binding */ getCommonAnalyticsEventsProperties),
/* harmony export */   getLocation: () => (/* binding */ getLocation),
/* harmony export */   setCommonAnalyticsEventsProperties: () => (/* binding */ setCommonAnalyticsEventsProperties),
/* harmony export */   setLocationProperty: () => (/* binding */ setLocationProperty)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
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
function setCommonAnalyticsEventsProperties(_cr_user_id, _language, _app, _user_source, _content_version, _app_version) {
    cr_user_id = _cr_user_id;
    language = _language;
    app = _app;
    user_source = _user_source;
    content_version = _content_version;
    app_version = _app_version;
}
function setLocationProperty(_lat_lang) {
    lat_lang = _lat_lang;
}
function getCommonAnalyticsEventsProperties() {
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
function getBasalBucketID(buckets) {
    let bucketID = 0;
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
function calculateScore(buckets, basalBucketID) {
    console.log('Calculating score');
    console.log(buckets);
    let score = 0;
    console.log('Basal Bucket ID: ' + basalBucketID);
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
        console.log('Perfect score');
        return buckets.length * 100;
    }
    score = Math.round((basalBucketID - 1) * 100 + (numCorrect / 5) * 100) | 0;
    return score;
}
function getCeilingBucketID(buckets) {
    let bucketID = 0;
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
function getLocation() {
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
            return jsonResponse.loc;
        }
        catch (err) {
            console.warn(`location failed to update! encountered error: ${err.message}`);
            return null;
        }
    });
}


/***/ },

/***/ "./src/utils/jsonUtils.ts"
/*!********************************!*\
  !*** ./src/utils/jsonUtils.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchAppData: () => (/* binding */ fetchAppData),
/* harmony export */   fetchAppType: () => (/* binding */ fetchAppType),
/* harmony export */   fetchAssessmentBuckets: () => (/* binding */ fetchAssessmentBuckets),
/* harmony export */   fetchFeedback: () => (/* binding */ fetchFeedback),
/* harmony export */   fetchSurveyQuestions: () => (/* binding */ fetchSurveyQuestions),
/* harmony export */   getCaseIndependentLangList: () => (/* binding */ getCaseIndependentLangList),
/* harmony export */   getDataURL: () => (/* binding */ getDataURL)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchAppData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return loadData(url).then((data) => {
            return data;
        });
    });
}
function fetchAppType(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return loadData(url).then((data) => {
            return data['appType'];
        });
    });
}
function fetchFeedback(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return loadData(url).then((data) => {
            return data['feedbackText'];
        });
    });
}
function fetchSurveyQuestions(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return loadData(url).then((data) => {
            return data['questions'];
        });
    });
}
function fetchAssessmentBuckets(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return loadData(url).then((data) => {
            return data['buckets'];
        });
    });
}
function getDataURL(url) {
    return '/data/' + url + '.json';
}
function getCaseIndependentLangList() {
    return ['luganda'];
}
function loadData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var furl = getDataURL(url);
        return fetch(furl).then((response) => response.json());
    });
}


/***/ },

/***/ "./src/utils/mathUtils.ts"
/*!********************************!*\
  !*** ./src/utils/mathUtils.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   randFrom: () => (/* binding */ randFrom),
/* harmony export */   shuffleArray: () => (/* binding */ shuffleArray)
/* harmony export */ });
function randFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


/***/ },

/***/ "./src/utils/unityBridge.ts"
/*!**********************************!*\
  !*** ./src/utils/unityBridge.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UnityBridge: () => (/* binding */ UnityBridge)
/* harmony export */ });
class UnityBridge {
    constructor() {
        if (typeof Unity !== 'undefined') {
            this.unityReference = Unity;
        }
        else {
            this.unityReference = null;
        }
    }
    SendMessage(message) {
        if (this.unityReference !== null) {
            this.unityReference.call(message);
        }
    }
    SendLoaded() {
        if (this.unityReference !== null) {
            this.unityReference.call('loaded');
        }
        else {
            console.log('would call Unity loaded now');
        }
    }
    SendClose() {
        if (this.unityReference !== null) {
            this.unityReference.call('close');
        }
        else {
            console.log('would close Unity now');
        }
    }
}


/***/ },

/***/ "./src/utils/urlUtils.ts"
/*!*******************************!*\
  !*** ./src/utils/urlUtils.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAppLanguageFromDataURL: () => (/* binding */ getAppLanguageFromDataURL),
/* harmony export */   getAppType: () => (/* binding */ getAppType),
/* harmony export */   getAppTypeFromDataURL: () => (/* binding */ getAppTypeFromDataURL),
/* harmony export */   getDataFile: () => (/* binding */ getDataFile),
/* harmony export */   getNextAssessment: () => (/* binding */ getNextAssessment),
/* harmony export */   getRequiredScore: () => (/* binding */ getRequiredScore),
/* harmony export */   getUUID: () => (/* binding */ getUUID),
/* harmony export */   getUserSource: () => (/* binding */ getUserSource)
/* harmony export */ });
function getAppType() {
    const pathParams = getPathName();
    const appType = pathParams.get('appType');
    return appType;
}
function getUUID() {
    const pathParams = getPathName();
    var nuuid = pathParams.get('cr_user_id');
    if (nuuid == undefined) {
        console.log('no uuid provided');
        nuuid = 'WebUserNoID';
    }
    return nuuid;
}
function getUserSource() {
    const pathParams = getPathName();
    var nuuid = pathParams.get('userSource');
    if (nuuid == undefined) {
        console.log('no user source provided');
        nuuid = 'WebUserNoSource';
    }
    return nuuid;
}
function getDataFile() {
    const pathParams = getPathName();
    var data = pathParams.get('data');
    if (data == undefined) {
        console.log('default data file');
        data = 'zulu-lettersounds';
    }
    return data;
}
function getAppLanguageFromDataURL(appType) {
    if (appType && appType !== '' && appType.includes('-')) {
        let language = appType.split('-').slice(0, -1).join('-');
        if (language.includes('west-african')) {
            return 'west-african-english';
        }
        else {
            return language;
        }
    }
    return 'NotAvailable';
}
function getAppTypeFromDataURL(appType) {
    if (appType && appType !== '' && appType.includes('-')) {
        return appType.substring(appType.lastIndexOf('-') + 1);
    }
    return 'NotAvailable';
}
function getRequiredScore() {
    let pathParams = getPathName();
    return pathParams.get("requiredScore");
}
function getNextAssessment() {
    let pathParams = getPathName();
    return pathParams.get("nextAssessment");
}
function getPathName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
}


/***/ }

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMxQyxDQUFDO0FBRUQsU0FBUyxXQUFXO0lBQ2xCLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ25ELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9BcHAudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYW5hbHl0aWNzL2FuYWx5dGljcy1jb25maWcudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYW5hbHl0aWNzL2FuYWx5dGljcy1pbnRlZ3JhdGlvbi50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2FuYWx5dGljcy9iYXNlLWFuYWx5dGljcy1pbnRlZ3JhdGlvbi50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9hc3Nlc3NtZW50L2Fzc2Vzc21lbnQudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYmFzZVF1aXoudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvY29tcG9uZW50cy9hdWRpb0NvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvY29tcG9uZW50cy9jYWNoZU1vZGVsLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvdE5vZGUudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvc3VydmV5L3N1cnZleS50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91aS91aUNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvdXRpbHMvQW5hbHl0aWNzVXRpbHMudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvdXRpbHMvanNvblV0aWxzLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL3V0aWxzL21hdGhVdGlscy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91dGlscy91bml0eUJyaWRnZS50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91dGlscy91cmxVdGlscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQXBwIGNsYXNzIHRoYXQgcmVwcmVzZW50cyBhbiBlbnRyeSBwb2ludCBvZiB0aGUgYXBwbGljYXRpb24uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZ2V0VVVJRCwgZ2V0VXNlclNvdXJjZSwgZ2V0RGF0YUZpbGUsIGdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwsIGdldEFwcFR5cGVGcm9tRGF0YVVSTCB9IGZyb20gJy4vdXRpbHMvdXJsVXRpbHMnO1xyXG5pbXBvcnQgeyBTdXJ2ZXkgfSBmcm9tICcuL3N1cnZleS9zdXJ2ZXknO1xyXG5pbXBvcnQgeyBBc3Nlc3NtZW50IH0gZnJvbSAnLi9hc3Nlc3NtZW50L2Fzc2Vzc21lbnQnO1xyXG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vdXRpbHMvdW5pdHlCcmlkZ2UnO1xyXG5pbXBvcnQgeyBBbmFseXRpY3NFdmVudHMgfSBmcm9tICcuL2FuYWx5dGljcy9hbmFseXRpY3NFdmVudHMnO1xyXG5pbXBvcnQgeyBCYXNlUXVpeiB9IGZyb20gJy4vYmFzZVF1aXonO1xyXG5pbXBvcnQgeyBmZXRjaEFwcERhdGEsIGdldERhdGFVUkwgfSBmcm9tICcuL3V0aWxzL2pzb25VdGlscyc7XHJcbmltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tICdmaXJlYmFzZS9hcHAnO1xyXG5pbXBvcnQgeyBnZXRBbmFseXRpY3MsIGxvZ0V2ZW50IH0gZnJvbSAnZmlyZWJhc2UvYW5hbHl0aWNzJztcclxuaW1wb3J0IHsgV29ya2JveCB9IGZyb20gJ3dvcmtib3gtd2luZG93JztcclxuaW1wb3J0IENhY2hlTW9kZWwgZnJvbSAnLi9jb21wb25lbnRzL2NhY2hlTW9kZWwnO1xyXG5pbXBvcnQgeyBVSUNvbnRyb2xsZXIgfSBmcm9tICcuL3VpL3VpQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IEFuYWx5dGljc0V2ZW50c1R5cGUsIEFuYWx5dGljc0ludGVncmF0aW9uIH0gZnJvbSAnLi9hbmFseXRpY3MvYW5hbHl0aWNzLWludGVncmF0aW9uJztcclxuaW1wb3J0IHsgZ2V0TG9jYXRpb24sIGdldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMsIHNldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMsIHNldExvY2F0aW9uUHJvcGVydHkgfSBmcm9tICcuL3V0aWxzL0FuYWx5dGljc1V0aWxzJztcclxuXHJcbmNvbnN0IGFwcFZlcnNpb246IHN0cmluZyA9ICd2MS4xLjMnO1xyXG5cclxuLyoqXHJcbiAqIENvbnRlbnQgdmVyc2lvbiBmcm9tIHRoZSBkYXRhIGZpbGUgaW4gZm9ybWF0IHYwLjFcclxuICogR2V0cyBzZXQgd2hlbiB0aGUgY29udGVudCBpcyBsb2FkZWRcclxuICovXHJcbmxldCBjb250ZW50VmVyc2lvbjogc3RyaW5nID0gJyc7XHJcblxyXG5sZXQgbG9hZGluZ1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nU2NyZWVuJyk7XHJcbmNvbnN0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2dyZXNzQmFyJyk7XHJcbmNvbnN0IGJyb2FkY2FzdENoYW5uZWw6IEJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbCgnYXMtbWVzc2FnZS1jaGFubmVsJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICAvKiogQ291bGQgYmUgJ2Fzc2Vzc21lbnQnIG9yICdzdXJ2ZXknIGJhc2VkIG9uIHRoZSBkYXRhIGZpbGUgKi9cclxuICBwdWJsaWMgZGF0YVVSTDogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgdW5pdHlCcmlkZ2U7XHJcbiAgcHVibGljIGFuYWx5dGljcztcclxuICBwdWJsaWMgZ2FtZTogQmFzZVF1aXo7XHJcbiAgcHVibGljIGFuYWx5dGljc0ludGVncmF0aW9uOiBBbmFseXRpY3NJbnRlZ3JhdGlvbjtcclxuICBjYWNoZU1vZGVsOiBDYWNoZU1vZGVsO1xyXG5cclxuICBsYW5nOiBzdHJpbmcgPSAnZW5nbGlzaCc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51bml0eUJyaWRnZSA9IG5ldyBVbml0eUJyaWRnZSgpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgYXBwLi4uJyk7XHJcblxyXG4gICAgdGhpcy5kYXRhVVJMID0gZ2V0RGF0YUZpbGUoKTtcclxuICAgIHRoaXMuY2FjaGVNb2RlbCA9IG5ldyBDYWNoZU1vZGVsKHRoaXMuZGF0YVVSTCwgdGhpcy5kYXRhVVJMLCBuZXcgU2V0PHN0cmluZz4oKSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzcGluVXAoKSB7XHJcbiAgICBhd2FpdCBBbmFseXRpY3NJbnRlZ3JhdGlvbi5pbml0aWFsaXplQW5hbHl0aWNzKCk7XHJcbiAgICB0aGlzLmFuYWx5dGljc0ludGVncmF0aW9uID0gQW5hbHl0aWNzSW50ZWdyYXRpb24uZ2V0SW5zdGFuY2UoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnV2luZG93IExvYWRlZCEnKTtcclxuICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCBmZXRjaEFwcERhdGEodGhpcy5kYXRhVVJMKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQXNzZXNzbWVudC9TdXJ2ZXkgJyArIGFwcFZlcnNpb24gKyAnIGluaXRpYWxpemluZyEnKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdBcHAgZGF0YSBsb2FkZWQhJyk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNhY2hlTW9kZWwuc2V0Q29udGVudEZpbGVQYXRoKGdldERhdGFVUkwodGhpcy5kYXRhVVJMKSk7XHJcblxyXG4gICAgICAgICAgLy8gVE9ETzogV2h5IGRvIHdlIG5lZWQgdG8gc2V0IHRoZSBmZWVkYmFjayB0ZXh0IGhlcmU/XHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tUZXh0KGRhdGFbJ2ZlZWRiYWNrVGV4dCddKTtcclxuXHJcbiAgICAgICAgICBsZXQgYXBwVHlwZSA9IGRhdGFbJ2FwcFR5cGUnXTtcclxuICAgICAgICAgIGxldCBhc3Nlc3NtZW50VHlwZSA9IGRhdGFbJ2Fzc2Vzc21lbnRUeXBlJ107XHJcblxyXG4gICAgICAgICAgaWYgKGFwcFR5cGUgPT0gJ3N1cnZleScpIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lID0gbmV3IFN1cnZleSh0aGlzLmRhdGFVUkwsIHRoaXMudW5pdHlCcmlkZ2UpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChhcHBUeXBlID09ICdhc3Nlc3NtZW50Jykge1xyXG4gICAgICAgICAgICAvLyBHZXQgYW5kIGFkZCBhbGwgdGhlIGF1ZGlvIGFzc2V0cyB0byB0aGUgY2FjaGUgbW9kZWxcclxuXHJcbiAgICAgICAgICAgIGxldCBidWNrZXRzID0gZGF0YVsnYnVja2V0cyddO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWNrZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidWNrZXRzW2ldLml0ZW1zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXVkaW9JdGVtVVJMO1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRvIGxvd2VyIGNhc2UgZm9yIHRoZSBMdWdhbmRhbiBkYXRhXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgIGRhdGFbJ3F1aXpOYW1lJ10uaW5jbHVkZXMoJ0x1Z2FuZGEnKSB8fFxyXG4gICAgICAgICAgICAgICAgICBkYXRhWydxdWl6TmFtZSddLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3dlc3QgYWZyaWNhbiBlbmdsaXNoJylcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICBhdWRpb0l0ZW1VUkwgPVxyXG4gICAgICAgICAgICAgICAgICAgICcvYXVkaW8vJyArIHRoaXMuZGF0YVVSTCArICcvJyArIGJ1Y2tldHNbaV0uaXRlbXNbal0uaXRlbU5hbWUudG9Mb3dlckNhc2UoKS50cmltKCkgKyAnLm1wMyc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhdWRpb0l0ZW1VUkwgPSAnL2F1ZGlvLycgKyB0aGlzLmRhdGFVUkwgKyAnLycgKyBidWNrZXRzW2ldLml0ZW1zW2pdLml0ZW1OYW1lLnRyaW0oKSArICcubXAzJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlTW9kZWwuYWRkSXRlbVRvQXVkaW9WaXN1YWxSZXNvdXJjZXMoYXVkaW9JdGVtVVJMKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVNb2RlbC5hZGRJdGVtVG9BdWRpb1Zpc3VhbFJlc291cmNlcygnL2F1ZGlvLycgKyB0aGlzLmRhdGFVUkwgKyAnL2Fuc3dlcl9mZWVkYmFjay5tcDMnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBBc3Nlc3NtZW50KHRoaXMuZGF0YVVSTCwgdGhpcy51bml0eUJyaWRnZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5nYW1lLnVuaXR5QnJpZGdlID0gdGhpcy51bml0eUJyaWRnZTtcclxuXHJcbiAgICAgICAgICBjb250ZW50VmVyc2lvbiA9IGRhdGFbJ2NvbnRlbnRWZXJzaW9uJ107XHJcblxyXG4gICAgICAgICAgdGhpcy5zZXRDb21tb25Qcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAvLyBBbmFseXRpY3NFdmVudHMuc2VuZEluaXQoYXBwVmVyc2lvbiwgZGF0YVsnY29udGVudFZlcnNpb24nXSk7XHJcbiAgICAgICAgICB0aGlzLmxvZ0luaXRpYWxBbmFseXRpY3NFdmVudHMoKTtcclxuICAgICAgICAgIC8vIHRoaXMuY2FjaGVNb2RlbC5zZXRBcHBOYW1lKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lICsgJzonICsgZGF0YVtcImNvbnRlbnRWZXJzaW9uXCJdKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmdhbWUuUnVuKHRoaXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLnJlZ2lzdGVyU2VydmljZVdvcmtlcih0aGlzLmdhbWUsIHRoaXMuZGF0YVVSTCk7XHJcbiAgICAgIH0pKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgYXN5bmMgc2V0Q29tbW9uUHJvcGVydGllcygpIHtcclxuICAgIHNldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMoZ2V0VVVJRCgpLCBnZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKHRoaXMuZGF0YVVSTCksIGdldEFwcFR5cGVGcm9tRGF0YVVSTCh0aGlzLmRhdGFVUkwpLCBnZXRVc2VyU291cmNlKCksIGNvbnRlbnRWZXJzaW9uLCBhcHBWZXJzaW9uKTtcclxuICB9XHJcbiAgYXN5bmMgbG9nSW5pdGlhbEFuYWx5dGljc0V2ZW50cygpIHtcclxuICAgIGNvbnN0IGxhdF9sYW5nID0gYXdhaXQgZ2V0TG9jYXRpb24oKTtcclxuICAgIHNldExvY2F0aW9uUHJvcGVydHkobGF0X2xhbmcgPz8gJ05vdEF2YWlsYWJsZScpO1xyXG4gICAgdGhpcy5hbmFseXRpY3NJbnRlZ3JhdGlvbi50cmFjayhBbmFseXRpY3NFdmVudHNUeXBlLk9QRU5FRCwge30pXHJcblxyXG4gICAgdGhpcy5hbmFseXRpY3NJbnRlZ3JhdGlvbi50cmFjayhBbmFseXRpY3NFdmVudHNUeXBlLlVTRVJfTE9DQVRJT04sIHt9KTtcclxuXHJcbiAgICB0aGlzLmFuYWx5dGljc0ludGVncmF0aW9uLnRyYWNrKEFuYWx5dGljc0V2ZW50c1R5cGUuSU5JVElBTElaRSwgeyB0eXBlOiBcImluaXRpYWxpemVkXCIgfSlcclxuXHJcbiAgfVxyXG4gIGFzeW5jIHJlZ2lzdGVyU2VydmljZVdvcmtlcihnYW1lOiBCYXNlUXVpeiwgZGF0YVVSTDogc3RyaW5nID0gJycpIHtcclxuICAgIGNvbnNvbGUubG9nKCdSZWdpc3RlcmluZyBzZXJ2aWNlIHdvcmtlci4uLicpO1xyXG5cclxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XHJcbiAgICAgIGxldCB3YiA9IG5ldyBXb3JrYm94KCcuL3N3LmpzJywge30pO1xyXG5cclxuICAgICAgd2IucmVnaXN0ZXIoKVxyXG4gICAgICAgIC50aGVuKChyZWdpc3RyYXRpb24pID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RlcmVkIScpO1xyXG4gICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlV29ya2VyUmVnaXN0YXRpb24ocmVnaXN0cmF0aW9uKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJyArIGVycik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UpO1xyXG5cclxuICAgICAgYXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVhZHk7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnQ2FjaGUgTW9kZWw6ICcpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmNhY2hlTW9kZWwpO1xyXG5cclxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayBpZiB0aGVyZSdzIGEgbmV3IHZlcnNpb24gb2YgdGhlIGNvbnRlbnQgZmlsZSBhbmQgaW4gdGhhdCBjYXNlXHJcbiAgICAgIC8vIHJlbW92ZSB0aGUgbG9jYWxTdG9yYWdlIGNvbnRlbnQgbmFtZSBhbmQgdmVyc2lvbiB2YWx1ZVxyXG5cclxuICAgICAgY29uc29sZS5sb2coJ0NoZWNraW5nIGZvciBjb250ZW50IHZlcnNpb24gdXBkYXRlcy4uLicgKyBkYXRhVVJMKTtcclxuXHJcbiAgICAgIGZldGNoKHRoaXMuY2FjaGVNb2RlbC5jb250ZW50RmlsZVBhdGggKyAnP2NhY2hlLWJ1c3Q9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tc3RvcmUnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXHJcbiAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCB0aGUgY29udGVudCBmaWxlIGZyb20gdGhlIHNlcnZlciEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgbmV3Q29udGVudEZpbGVEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgY29uc3QgYWhlYWRDb250ZW50VmVyc2lvbiA9IG5ld0NvbnRlbnRGaWxlRGF0YVsnY29udGVudFZlcnNpb24nXTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBDYWNoZSBDb250ZW50IHZlcnNpb246ICcgKyBhaGVhZENvbnRlbnRWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGhlcmUgZm9yIHRoZSBjb250ZW50IHZlcnNpb24gdXBkYXRlc1xyXG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBhIG5ldyBjb250ZW50IHZlcnNpb24sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBjYWNoZWQgY29udGVudCBhbmQgcmVsb2FkXHJcbiAgICAgICAgICAvLyBXZSBhcmUgY29tcGFyaW5nIGhlcmUgdGhlIGNvbnRlbnRWZXJzaW9uIHdpdGggdGhlIGFoZWFkQ29udGVudFZlcnNpb25cclxuICAgICAgICAgIGlmIChhaGVhZENvbnRlbnRWZXJzaW9uICYmIGNvbnRlbnRWZXJzaW9uICE9IGFoZWFkQ29udGVudFZlcnNpb24pIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvbnRlbnQgdmVyc2lvbiBtaXNtYXRjaCEgUmVsb2FkaW5nLi4uJyk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lKTtcclxuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGNhY2hlIGZvciB0aHQgcGFydGljdWxhciBjb250ZW50XHJcbiAgICAgICAgICAgIGNhY2hlcy5kZWxldGUodGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpO1xyXG4gICAgICAgICAgICBoYW5kbGVVcGRhdGVGb3VuZE1lc3NhZ2UoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHRoZSBjb250ZW50IGZpbGU6ICcgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpID09IG51bGwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGluZyEnICsgdGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpO1xyXG4gICAgICAgIGxvYWRpbmdTY3JlZW4hLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICBjb21tYW5kOiAnQ2FjaGUnLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBhcHBEYXRhOiB0aGlzLmNhY2hlTW9kZWwsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByb2dyZXNzQmFyIS5zdHlsZS53aWR0aCA9IDEwMCArICclJztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGxvYWRpbmdTY3JlZW4hLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuU2V0Q29udGVudExvYWRlZCh0cnVlKTtcclxuICAgICAgICB9LCAxNTAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLmNvbW1hbmQgKyAnIHJlY2VpdmVkIGZyb20gc2VydmljZSB3b3JrZXIhJyk7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEuY29tbWFuZCA9PSAnQWN0aXZhdGVkJyAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNhY2hlTW9kZWwuYXBwTmFtZSkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIGNvbW1hbmQ6ICdDYWNoZScsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBhcHBEYXRhOiB0aGlzLmNhY2hlTW9kZWwsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1NlcnZpY2Ugd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTZXJ2aWNlV29ya2VyUmVnaXN0YXRpb24ocmVnaXN0cmF0aW9uOiBTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uIHwgdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZWdpc3RyYXRpb24/Lmluc3RhbGxpbmc/LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICB0eXBlOiAnUmVnaXN0YXJ0aW9uJyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5sYW5nLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJyArIGVycik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgR2V0RGF0YVVSTCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVVSTDtcclxuICB9XHJcbn1cclxuXHJcbmJyb2FkY2FzdENoYW5uZWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGhhbmRsZVNlcnZpY2VXb3JrZXJNZXNzYWdlKTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVNlcnZpY2VXb3JrZXJNZXNzYWdlKGV2ZW50KTogdm9pZCB7XHJcbiAgaWYgKGV2ZW50LmRhdGEubXNnID09ICdMb2FkaW5nJykge1xyXG4gICAgbGV0IHByb2dyZXNzVmFsdWUgPSBwYXJzZUludChldmVudC5kYXRhLmRhdGEucHJvZ3Jlc3MpO1xyXG4gICAgaGFuZGxlTG9hZGluZ01lc3NhZ2UoZXZlbnQsIHByb2dyZXNzVmFsdWUpO1xyXG4gIH1cclxuICBpZiAoZXZlbnQuZGF0YS5tc2cgPT0gJ1VwZGF0ZUZvdW5kJykge1xyXG4gICAgY29uc29sZS5sb2coJz4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Lix1cGRhdGUgRm91bmQnKTtcclxuICAgIGhhbmRsZVVwZGF0ZUZvdW5kTWVzc2FnZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlTG9hZGluZ01lc3NhZ2UoZXZlbnQsIHByb2dyZXNzVmFsdWUpOiB2b2lkIHtcclxuICBpZiAocHJvZ3Jlc3NWYWx1ZSA8IDQwICYmIHByb2dyZXNzVmFsdWUgPj0gMTApIHtcclxuICAgIHByb2dyZXNzQmFyIS5zdHlsZS53aWR0aCA9IHByb2dyZXNzVmFsdWUgKyAnJSc7XHJcbiAgfSBlbHNlIGlmIChwcm9ncmVzc1ZhbHVlID49IDEwMCkge1xyXG4gICAgcHJvZ3Jlc3NCYXIhLnN0eWxlLndpZHRoID0gMTAwICsgJyUnO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxvYWRpbmdTY3JlZW4hLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIFVJQ29udHJvbGxlci5TZXRDb250ZW50TG9hZGVkKHRydWUpO1xyXG4gICAgfSwgMTUwMCk7XHJcbiAgICAvLyBhZGQgYm9vayB3aXRoIGEgbmFtZSB0byBsb2NhbCBzdG9yYWdlIGFzIGNhY2hlZFxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oZXZlbnQuZGF0YS5kYXRhLmJvb2tOYW1lLCAndHJ1ZScpO1xyXG4gICAgcmVhZExhbmd1YWdlRGF0YUZyb21DYWNoZUFuZE5vdGlmeUFuZHJvaWRBcHAoZXZlbnQuZGF0YS5kYXRhLmJvb2tOYW1lKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRMYW5ndWFnZURhdGFGcm9tQ2FjaGVBbmROb3RpZnlBbmRyb2lkQXBwKGJvb2tOYW1lOiBzdHJpbmcpIHtcclxuICAvL0B0cy1pZ25vcmVcclxuICBpZiAod2luZG93LkFuZHJvaWQpIHtcclxuICAgIGxldCBpc0NvbnRlbnRDYWNoZWQ6IGJvb2xlYW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShib29rTmFtZSkgIT09IG51bGw7XHJcbiAgICAvL0B0cy1pZ25vcmVcclxuICAgIHdpbmRvdy5BbmRyb2lkLmNhY2hlZFN0YXR1cyhpc0NvbnRlbnRDYWNoZWQpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk6IHZvaWQge1xyXG4gIGxldCB0ZXh0ID0gJ1VwZGF0ZSBGb3VuZC5cXG5QbGVhc2UgYWNjZXB0IHRoZSB1cGRhdGUgYnkgcHJlc3NpbmcgT2suJztcclxuICBpZiAoY29uZmlybSh0ZXh0KSA9PSB0cnVlKSB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRleHQgPSAnVXBkYXRlIHdpbGwgaGFwcGVuIG9uIHRoZSBuZXh0IGxhdW5jaC4nO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xyXG5hcHAuc3BpblVwKCk7XHJcbiIsIi8vIEFuYWx5dGljcyBjb25maWd1cmF0aW9uIGZvciBBbmFseXRpY3MgYW5kIFN0YXRzaWdcclxuLy8gVXNlZCBieSBAY3VyaW91c2xlYXJuaW5nL2FuYWx5dGljcyBBbmFseXRpY3NTdHJhdGVneSBhbmQgU3RhdHNpZ1N0cmF0ZWd5XHJcblxyXG4vKipcclxuICogQW5hbHl0aWNzIGNvbmZpZ3VyYXRpb24gZm9yIGFuYWx5dGljc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgYXBpS2V5OiAnQUl6YVN5QjhjMmxCVmkyNnU3WVJMOXN4T1A5N1VhcTN5TjhoVGw0JyxcclxuICAgIGF1dGhEb21haW46ICdmdG0tYjlkOTkuZmlyZWJhc2VhcHAuY29tJyxcclxuICAgIGRhdGFiYXNlVVJMOiAnaHR0cHM6Ly9mdG0tYjlkOTkuZmlyZWJhc2Vpby5jb20nLFxyXG4gICAgcHJvamVjdElkOiAnZnRtLWI5ZDk5JyxcclxuICAgIHN0b3JhZ2VCdWNrZXQ6ICdmdG0tYjlkOTkuYXBwc3BvdC5jb20nLFxyXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6ICc2MDI0MDIzODc5NDEnLFxyXG4gICAgYXBwSWQ6ICcxOjYwMjQwMjM4Nzk0MTp3ZWI6N2IxYjExODE4NjRkMjhiNDlkZTEwYycsXHJcbiAgICBtZWFzdXJlbWVudElkOiAnRy1GRjExNTlUR0NGJyxcclxufTtcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBTdGF0c2lnIGNvbmZpZ3VyYXRpb24gZm9yIGFuYWx5dGljc1xyXG4vLyAgKi9cclxuLy8gZXhwb3J0IGNvbnN0IHN0YXRzaWdDb25maWcgPSB7XHJcbi8vICAgICAvLyBTdGF0c2lnIGNsaWVudC1zaWRlIEFQSSBrZXlcclxuLy8gICAgIGNsaWVudEtleTogXCJjbGllbnQtU1NtWTVrNUNzMzlHN0lJNzROZFdxUGZ2NWhRenJGaVVxQ2MzQzFJVTluYVwiLFxyXG5cclxuLy8gICAgIC8vIFVzZXIgSUQgZm9yIFN0YXRzaWcgdHJhY2tpbmcgKGNhbiBiZSBwc2V1ZG8tYW5vbnltb3VzKVxyXG4vLyAgICAgdXNlcklkOiBcImFub255bW91cy11c2VyXCIsXHJcbi8vIH07ICIsImltcG9ydCB7IGdldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMgfSBmcm9tIFwiLi4vdXRpbHMvQW5hbHl0aWNzVXRpbHNcIjtcclxuaW1wb3J0IHsgQW5zd2VyZWQsIEJ1Y2tldENvbXBsZXRlZCwgQ29tbW9uRXZlbnRQcm9wZXJ0aWVzLCBDb21wbGV0ZWQsIEluaXRpYWxpemVkLCBPcGVuZWQsIFVzZXJMb2NhdGlvbiB9IGZyb20gXCIuL2FuYWx5dGljcy1ldmVudC1pbnRlcmZhY2VcIjtcclxuaW1wb3J0IHsgQmFzZUFuYWx5dGljc0ludGVncmF0aW9uIH0gZnJvbSBcIi4vYmFzZS1hbmFseXRpY3MtaW50ZWdyYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjb25zdCBlbnVtIEFuYWx5dGljc0V2ZW50c1R5cGUge1xyXG4gICAgSU5JVElBTElaRSA9ICdpbml0aWFsaXplZCcsXHJcbiAgICBPUEVORUQgPSAnb3BlbmVkJyxcclxuICAgIFVTRVJfTE9DQVRJT04gPSAndXNlcl9sb2NhdGlvbicsXHJcbiAgICBCVUNLRVRfQ09NUExFVEVEID0gJ2J1Y2tldENvbXBsZXRlZCcsXHJcbiAgICBBTlNXRVJFRCA9ICdhbnN3ZXJlZCcsXHJcbiAgICBDT01QTEVURUQgPSAnY29tcGxldGVkJ1xyXG5cclxufVxyXG50eXBlIEV2ZW50RGF0YU1hcCA9IHtcclxuICAgIFtBbmFseXRpY3NFdmVudHNUeXBlLklOSVRJQUxJWkVdOiBJbml0aWFsaXplZDtcclxuICAgIFtBbmFseXRpY3NFdmVudHNUeXBlLk9QRU5FRF06IE9wZW5lZDtcclxuICAgIFtBbmFseXRpY3NFdmVudHNUeXBlLlVTRVJfTE9DQVRJT05dOiBVc2VyTG9jYXRpb247XHJcbiAgICBbQW5hbHl0aWNzRXZlbnRzVHlwZS5CVUNLRVRfQ09NUExFVEVEXTogQnVja2V0Q29tcGxldGVkO1xyXG4gICAgW0FuYWx5dGljc0V2ZW50c1R5cGUuQU5TV0VSRURdOiBBbnN3ZXJlZDtcclxuICAgIFtBbmFseXRpY3NFdmVudHNUeXBlLkNPTVBMRVRFRF06IENvbXBsZXRlZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFuYWx5dGljc0ludGVncmF0aW9uIGV4dGVuZHMgQmFzZUFuYWx5dGljc0ludGVncmF0aW9uIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBBbmFseXRpY3NJbnRlZ3JhdGlvbiB8IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVCYXNlRXZlbnREYXRhKCk6IENvbW1vbkV2ZW50UHJvcGVydGllcyB7XHJcbiAgICAgICAgY29uc3QgY29tbW9uUHJvcGVydGllcyA9IGdldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMoKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjbFVzZXJJZDogY29tbW9uUHJvcGVydGllcy5jcl91c2VyX2lkLFxyXG4gICAgICAgICAgICBsYW5nOiBjb21tb25Qcm9wZXJ0aWVzLmxhbmd1YWdlLFxyXG4gICAgICAgICAgICBhcHA6IGNvbW1vblByb3BlcnRpZXMuYXBwLFxyXG4gICAgICAgICAgICBsYXRMb25nOiBjb21tb25Qcm9wZXJ0aWVzLmxhdF9sYW5nLFxyXG4gICAgICAgICAgICB1c2VyU291cmNlOiBjb21tb25Qcm9wZXJ0aWVzLnVzZXJfc291cmNlLFxyXG4gICAgICAgICAgICBhcHBWZXJzaW9uOiBjb21tb25Qcm9wZXJ0aWVzLmFwcF92ZXJzaW9uLFxyXG4gICAgICAgICAgICBjb250ZW50VmVyc2lvbjogY29tbW9uUHJvcGVydGllcy5jb250ZW50X3ZlcnNpb24sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBpbml0aWFsaXplQW5hbHl0aWNzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gbmV3IEFuYWx5dGljc0ludGVncmF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UuaXNBbmFseXRpY3NSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5zdGFuY2UuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IEFuYWx5dGljc0ludGVncmF0aW9uIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UgfHwgIXRoaXMuaW5zdGFuY2UuaXNBbmFseXRpY3NSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQW5hbHl0aWNzSW50ZWdyYXRpb24uaW5pdGlhbGl6ZUFuYWx5dGljcygpIG11c3QgYmUgY2FsbGVkIGJlZm9yZSBhY2Nlc3NpbmcgdGhlIGluc3RhbmNlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZERhdGFUb1RoaXJkUGFydHkoc2NvcmU6IG51bWJlciwgdXVpZDogc3RyaW5nLCByZXF1aXJlZFNjb3JlOiBOdW1iZXIsIG5leHRBc3Nlc3NtZW50OiBzdHJpbmcsIGFzc2Vzc21lbnRUeXBlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvLyBTZW5kIGRhdGEgdG8gdGhlIHRoaXJkIHBhcnR5XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0F0dGVtcHRpbmcgdG8gc2VuZCBzY29yZSB0byBhIHRoaXJkIHBhcnR5ISBTY29yZTogJywgc2NvcmUpO1xyXG5cclxuICAgICAgICAvLyBSZWFkIHRoZSBVUkwgZnJvbSB1dG0gcGFyYW1ldGVyc1xyXG4gICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0UGFydHlVUkwgPSB1cmxQYXJhbXMuZ2V0KCdlbmRwb2ludCcpO1xyXG4gICAgICAgIGNvbnN0IG9yZ2FuaXphdGlvbiA9IHVybFBhcmFtcy5nZXQoJ29yZ2FuaXphdGlvbicpO1xyXG4gICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRhcmdldFBhcnR5VVJMKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIHRhcmdldCBwYXJ0eSBVUkwgZm91bmQhJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIHVzZXI6IHV1aWQsXHJcbiAgICAgICAgICAgIHBhZ2U6ICcxMTExMDgxMjEzNjM2MTUnLFxyXG4gICAgICAgICAgICBldmVudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2V4dGVybmFsJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Fzc2Vzc21lbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1YlR5cGU6IGFzc2Vzc21lbnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlOiBzY29yZSxcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFNjb3JlOiByZXF1aXJlZFNjb3JlLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHRBc3Nlc3NtZW50OiBuZXh0QXNzZXNzbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWRTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB0YXJnZXRQYXJ0eVVSTCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG5cclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVxdWVzdCB3YXMgc3VjY2Vzc2Z1bCwgaGFuZGxlIHRoZSByZXNwb25zZSBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BPU1Qgc3VjY2VzcyEnICsgeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcXVlc3QgZmFpbGVkXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXM6ICcgKyB4aHIuc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHhoci5zZW5kKHBheWxvYWRTdHJpbmcpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGRhdGEgdG8gdGFyZ2V0IHBhcnR5OiAnLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXplKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGF3YWl0IHN1cGVyLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB0cmFjazxUIGV4dGVuZHMgQW5hbHl0aWNzRXZlbnRzVHlwZT4oXHJcbiAgICAgICAgZXZlbnRUeXBlOiBULFxyXG4gICAgICAgIGV2ZW50RGF0YTogUGFydGlhbDxDb21tb25FdmVudFByb3BlcnRpZXM+ICYgT21pdDxFdmVudERhdGFNYXBbVF0sIGtleW9mIENvbW1vbkV2ZW50UHJvcGVydGllcz5cclxuICAgICk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGJhc2VEYXRhID0gdGhpcy5jcmVhdGVCYXNlRXZlbnREYXRhKCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7IC4uLmJhc2VEYXRhLCAuLi5ldmVudERhdGEgfSBhcyBFdmVudERhdGFNYXBbVF07XHJcblxyXG4gICAgICAgIHRoaXMudHJhY2tDdXN0b21FdmVudChldmVudFR5cGUsIGRhdGEpO1xyXG4gICAgfVxyXG59IiwiLy8gdGhpcyBpcyB3aGVyZSB3ZSBjYW4gaGF2ZSB0aGUgY2xhc3NlcyBhbmQgZnVuY3Rpb25zIGZvciBidWlsZGluZyB0aGUgZXZlbnRzXHJcbi8vIHRvIHNlbmQgdG8gYW4gYW5hbHl0aWNzIHJlY29yZGVyIChmaXJlYmFzZT8gbHJzPylcclxuXHJcbmltcG9ydCB7IHFEYXRhLCBhbnN3ZXJEYXRhIH0gZnJvbSAnLi4vY29tcG9uZW50cy9xdWVzdGlvbkRhdGEnO1xyXG5pbXBvcnQgeyBsb2dFdmVudCB9IGZyb20gJ2ZpcmViYXNlL2FuYWx5dGljcyc7XHJcbmltcG9ydCB7IGJ1Y2tldCB9IGZyb20gJy4uL2Fzc2Vzc21lbnQvYnVja2V0RGF0YSc7XHJcbmltcG9ydCB7IGdldE5leHRBc3Nlc3NtZW50LCBnZXRSZXF1aXJlZFNjb3JlIH0gZnJvbSAnLi4vdXRpbHMvdXJsVXRpbHMnO1xyXG5cclxuLy8gQ3JlYXRlIGEgc2luZ2xldG9uIGNsYXNzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50c1xyXG5leHBvcnQgY2xhc3MgQW5hbHl0aWNzRXZlbnRzIHtcclxuICBwcm90ZWN0ZWQgc3RhdGljIHV1aWQ6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgc3RhdGljIHVzZXJTb3VyY2U6IHN0cmluZztcclxuICBwcm90ZWN0ZWQgc3RhdGljIGNsYXQ7XHJcbiAgcHJvdGVjdGVkIHN0YXRpYyBjbG9uO1xyXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2FuYTtcclxuICBwcm90ZWN0ZWQgc3RhdGljIGxhdGxvbmc7XHJcbiAgLy8gdmFyIGNpdHksIHJlZ2lvbiwgY291bnRyeTtcclxuICBwcm90ZWN0ZWQgc3RhdGljIGRhdGFVUkw7XHJcblxyXG4gIHByb3RlY3RlZCBzdGF0aWMgYXBwVmVyc2lvbjtcclxuICBwcm90ZWN0ZWQgc3RhdGljIGNvbnRlbnRWZXJzaW9uO1xyXG5cclxuICBwcm90ZWN0ZWQgc3RhdGljIGFzc2Vzc21lbnRUeXBlOiBzdHJpbmc7XHJcblxyXG4gIHN0YXRpYyBpbnN0YW5jZTogQW5hbHl0aWNzRXZlbnRzO1xyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgY2xhc3NcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBbmFseXRpY3NFdmVudHMge1xyXG4gICAgaWYgKCFBbmFseXRpY3NFdmVudHMuaW5zdGFuY2UpIHtcclxuICAgICAgQW5hbHl0aWNzRXZlbnRzLmluc3RhbmNlID0gbmV3IEFuYWx5dGljc0V2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBBbmFseXRpY3NFdmVudHMuaW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0QXNzZXNzbWVudFR5cGUoYXNzZXNzbWVudFR5cGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgQW5hbHl0aWNzRXZlbnRzLmFzc2Vzc21lbnRUeXBlID0gYXNzZXNzbWVudFR5cGU7XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgTG9jYXRpb25cclxuICBzdGF0aWMgZ2V0TG9jYXRpb24oKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgdG8gZ2V0IGxvY2F0aW9uJyk7XHJcbiAgICBmZXRjaChgaHR0cHM6Ly9pcGluZm8uaW8vanNvbj90b2tlbj1iNjI2ODcyNzE3ODYxMGApXHJcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdnb3QgbG9jYXRpb24gcmVzcG9uc2UnKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKGpzb25SZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGpzb25SZXNwb25zZSk7XHJcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmxhdGxvbmcgPSBqc29uUmVzcG9uc2UubG9jO1xyXG4gICAgICAgIHZhciBscGllY2VzID0gQW5hbHl0aWNzRXZlbnRzLmxhdGxvbmcuc3BsaXQoJywnKTtcclxuICAgICAgICB2YXIgbGF0ID0gcGFyc2VGbG9hdChscGllY2VzWzBdKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgIHZhciBsb24gPSBwYXJzZUZsb2F0KGxwaWVjZXNbMV0pLnRvRml4ZWQoMSk7XHJcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmNsYXQgPSBsYXQ7XHJcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmNsb24gPSBsb247XHJcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmxhdGxvbmcgPSAnJztcclxuICAgICAgICBscGllY2VzID0gW107XHJcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRMb2NhdGlvbigpO1xyXG5cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBsb2NhdGlvbiBmYWlsZWQgdG8gdXBkYXRlISBlbmNvdW50ZXJlZCBlcnJvciAke2Vyci5tc2d9YCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gTGluayBBbmFseXRpY3NcclxuICBzdGF0aWMgbGlua0FuYWx5dGljcyhuZXdnYW5hLCBkYXRhdXJsKTogdm9pZCB7XHJcbiAgICBBbmFseXRpY3NFdmVudHMuZ2FuYSA9IG5ld2dhbmE7XHJcbiAgICBBbmFseXRpY3NFdmVudHMuZGF0YVVSTCA9IGRhdGF1cmw7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgVVVJRFxyXG4gIHN0YXRpYyBzZXRVdWlkKG5ld1V1aWQ6IHN0cmluZywgbmV3VXNlclNvdXJjZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBBbmFseXRpY3NFdmVudHMudXVpZCA9IG5ld1V1aWQ7XHJcbiAgICBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSA9IG5ld1VzZXJTb3VyY2U7XHJcbiAgfVxyXG5cclxuICAvLyBTZW5kIEluaXRcclxuICBzdGF0aWMgc2VuZEluaXQoYXBwVmVyc2lvbjogc3RyaW5nLCBjb250ZW50VmVyc2lvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbiA9IGFwcFZlcnNpb247XHJcbiAgICBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24gPSBjb250ZW50VmVyc2lvbjtcclxuXHJcbiAgICBBbmFseXRpY3NFdmVudHMuZ2V0TG9jYXRpb24oKTtcclxuXHJcbiAgICB2YXIgZXZlbnRTdHJpbmcgPSAndXNlciAnICsgQW5hbHl0aWNzRXZlbnRzLnV1aWQgKyAnIG9wZW5lZCB0aGUgYXNzZXNzbWVudCc7XHJcblxyXG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG5cclxuICAgIGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLCAnb3BlbmVkJywge30pO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IEFwcCBMYW5ndWFnZSBGcm9tIERhdGEgVVJMXHJcbiAgc3RhdGljIGdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoYXBwVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIC8vIENoZWNrIGlmIGFwcCB0eXBlIGlzIG5vdCBlbXB0eSBhbmQgc3BsaXQgdGhlIHN0cmluZyBieSB0aGUgaHlwaGVuIHRoZW4gcmV0dXJuIHRoZSBmaXJzdCBlbGVtZW50XHJcbiAgICBpZiAoYXBwVHlwZSAmJiBhcHBUeXBlICE9PSAnJyAmJiBhcHBUeXBlLmluY2x1ZGVzKCctJykpIHtcclxuICAgICAgbGV0IGxhbmd1YWdlOiBzdHJpbmcgPSBhcHBUeXBlLnNwbGl0KCctJykuc2xpY2UoMCwgLTEpLmpvaW4oJy0nKTtcclxuICAgICAgaWYgKGxhbmd1YWdlLmluY2x1ZGVzKCd3ZXN0LWFmcmljYW4nKSkge1xyXG4gICAgICAgIHJldHVybiAnd2VzdC1hZnJpY2FuLWVuZ2xpc2gnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsYW5ndWFnZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnTm90QXZhaWxhYmxlJztcclxuICB9XHJcblxyXG4gIC8vIEdldCBBcHAgVHlwZSBGcm9tIERhdGEgVVJMXHJcbiAgc3RhdGljIGdldEFwcFR5cGVGcm9tRGF0YVVSTChhcHBUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgLy8gQ2hlY2sgaWYgYXBwIHR5cGUgaXMgbm90IGVtcHR5IGFuZCBzcGxpdCB0aGUgc3RyaW5nIGJ5IHRoZSBoeXBoZW4gdGhlbiByZXR1cm4gdGhlIGxhc3QgZWxlbWVudFxyXG4gICAgaWYgKGFwcFR5cGUgJiYgYXBwVHlwZSAhPT0gJycgJiYgYXBwVHlwZS5pbmNsdWRlcygnLScpKSB7XHJcbiAgICAgIHJldHVybiBhcHBUeXBlLnN1YnN0cmluZyhhcHBUeXBlLmxhc3RJbmRleE9mKCctJykgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJ05vdEF2YWlsYWJsZSc7XHJcbiAgfVxyXG5cclxuICAvLyBTZW5kIExvY2F0aW9uXHJcbiAgc3RhdGljIHNlbmRMb2NhdGlvbigpOiB2b2lkIHtcclxuICAgIHZhciBldmVudFN0cmluZyA9XHJcbiAgICAgICdTZW5kaW5nIFVzZXIgY29vcmRpbmF0ZXM6ICcgKyBBbmFseXRpY3NFdmVudHMudXVpZCArICcgOiAnICsgQW5hbHl0aWNzRXZlbnRzLmNsYXQgKyAnLCAnICsgQW5hbHl0aWNzRXZlbnRzLmNsb247XHJcbiAgICBjb25zb2xlLmxvZyhldmVudFN0cmluZyk7XHJcblxyXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICd1c2VyX2xvY2F0aW9uJywge1xyXG4gICAgICB1c2VyOiBBbmFseXRpY3NFdmVudHMudXVpZCxcclxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG4gICAgICBhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG4gICAgICBsYXRsb25nOiBBbmFseXRpY3NFdmVudHMuam9pbkxhdExvbmcoQW5hbHl0aWNzRXZlbnRzLmNsYXQsIEFuYWx5dGljc0V2ZW50cy5jbG9uKSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdJTklUSUFMSVpFRCBFVkVOVCBTRU5UJyk7XHJcbiAgICBjb25zb2xlLmxvZygnQXBwIExhbmd1YWdlOiAnICsgQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpKTtcclxuICAgIGNvbnNvbGUubG9nKCdBcHAgVHlwZTogJyArIEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpKTtcclxuICAgIGNvbnNvbGUubG9nKCdBcHAgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uKTtcclxuICAgIGNvbnNvbGUubG9nKCdDb250ZW50IFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xyXG5cclxuICAgIGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLCAnaW5pdGlhbGl6ZWQnLCB7XHJcbiAgICAgIHR5cGU6ICdpbml0aWFsaXplZCcsXHJcbiAgICAgIGNsVXNlcklkOiBBbmFseXRpY3NFdmVudHMudXVpZCxcclxuICAgICAgdXNlclNvdXJjZTogQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UsXHJcbiAgICAgIGxhdExvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxyXG4gICAgICBhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcclxuICAgICAgY29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcclxuICAgICAgLy8gY2l0eTogY2l0eSxcclxuICAgICAgLy8gcmVnaW9uOiByZWdpb24sXHJcbiAgICAgIC8vIGNvdW50cnk6IGNvdW50cnksXHJcbiAgICAgIGFwcDogQW5hbHl0aWNzRXZlbnRzLmdldEFwcFR5cGVGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcbiAgICAgIGxhbmc6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gU2VuZCBBbnN3ZXJlZFxyXG4gIHN0YXRpYyBzZW5kQW5zd2VyZWQodGhlUTogcURhdGEsIHRoZUE6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB2YXIgYW5zID0gdGhlUS5hbnN3ZXJzW3RoZUEgLSAxXTtcclxuXHJcbiAgICB2YXIgaXNjb3JyZWN0ID0gbnVsbDtcclxuICAgIHZhciBidWNrZXQgPSBudWxsO1xyXG4gICAgaWYgKCdjb3JyZWN0JyBpbiB0aGVRKSB7XHJcbiAgICAgIGlmICh0aGVRLmNvcnJlY3QgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGVRLmNvcnJlY3QgPT0gYW5zLmFuc3dlck5hbWUpIHtcclxuICAgICAgICAgIGlzY29ycmVjdCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlzY29ycmVjdCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCdidWNrZXQnIGluIHRoZVEpIHtcclxuICAgICAgYnVja2V0ID0gdGhlUS5idWNrZXQ7XHJcbiAgICB9XHJcbiAgICB2YXIgZXZlbnRTdHJpbmcgPSAndXNlciAnICsgQW5hbHl0aWNzRXZlbnRzLnV1aWQgKyAnIGFuc3dlcmVkICcgKyB0aGVRLnFOYW1lICsgJyB3aXRoICcgKyBhbnMuYW5zd2VyTmFtZTtcclxuICAgIGV2ZW50U3RyaW5nICs9ICcsIGFsbCBhbnN3ZXJzIHdlcmUgWyc7XHJcbiAgICB2YXIgb3B0cyA9ICcnO1xyXG4gICAgZm9yICh2YXIgYU51bSBpbiB0aGVRLmFuc3dlcnMpIHtcclxuICAgICAgZXZlbnRTdHJpbmcgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyAnLCc7XHJcbiAgICAgIG9wdHMgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyAnLCc7XHJcbiAgICB9XHJcbiAgICBldmVudFN0cmluZyArPSAnXSAnO1xyXG4gICAgZXZlbnRTdHJpbmcgKz0gaXNjb3JyZWN0O1xyXG4gICAgZXZlbnRTdHJpbmcgKz0gYnVja2V0O1xyXG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG4gICAgY29uc29sZS5sb2coJ0Fuc3dlcmVkIEFwcCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24pO1xyXG4gICAgY29uc29sZS5sb2coJ0NvbnRlbnQgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbik7XHJcblxyXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICdhbnN3ZXJlZCcsIHtcclxuICAgICAgdHlwZTogJ2Fuc3dlcmVkJyxcclxuICAgICAgY2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxyXG4gICAgICB1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcclxuICAgICAgbGF0TG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXHJcbiAgICAgIC8vIGNpdHk6IGNpdHksXHJcbiAgICAgIC8vIHJlZ2lvbjogcmVnaW9uLFxyXG4gICAgICAvLyBjb3VudHJ5OiBjb3VudHJ5LFxyXG4gICAgICBhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG4gICAgICBsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcbiAgICAgIGR0OiBlbGFwc2VkLFxyXG4gICAgICBxdWVzdGlvbl9udW1iZXI6IHRoZVEucU51bWJlcixcclxuICAgICAgdGFyZ2V0OiB0aGVRLnFUYXJnZXQsXHJcbiAgICAgIHF1ZXN0aW9uOiB0aGVRLnByb21wdFRleHQsXHJcbiAgICAgIHNlbGVjdGVkX2Fuc3dlcjogYW5zLmFuc3dlck5hbWUsXHJcbiAgICAgIGlzY29ycmVjdDogaXNjb3JyZWN0LFxyXG4gICAgICBvcHRpb25zOiBvcHRzLFxyXG4gICAgICBidWNrZXQ6IGJ1Y2tldCxcclxuICAgICAgYXBwVmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24sXHJcbiAgICAgIGNvbnRlbnRWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNlbmQgQnVja2V0XHJcbiAgc3RhdGljIHNlbmRCdWNrZXQodGI6IGJ1Y2tldCwgcGFzc2VkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB2YXIgYm4gPSB0Yi5idWNrZXRJRDtcclxuICAgIHZhciBidHJpZWQgPSB0Yi5udW1UcmllZDtcclxuICAgIHZhciBiY29ycmVjdCA9IHRiLm51bUNvcnJlY3Q7XHJcblxyXG4gICAgdmFyIGV2ZW50U3RyaW5nID1cclxuICAgICAgJ3VzZXIgJyArXHJcbiAgICAgIEFuYWx5dGljc0V2ZW50cy51dWlkICtcclxuICAgICAgJyBmaW5pc2hlZCB0aGUgYnVja2V0ICcgK1xyXG4gICAgICBibiArXHJcbiAgICAgICcgd2l0aCAnICtcclxuICAgICAgYmNvcnJlY3QgK1xyXG4gICAgICAnIGNvcnJlY3QgYW5zd2VycyBvdXQgb2YgJyArXHJcbiAgICAgIGJ0cmllZCArXHJcbiAgICAgICcgdHJpZWQnICtcclxuICAgICAgJyBhbmQgcGFzc2VkOiAnICtcclxuICAgICAgcGFzc2VkO1xyXG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG4gICAgY29uc29sZS5sb2coJ0J1Y2tldCBDb21wbGV0ZWQgQXBwIFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbik7XHJcbiAgICBjb25zb2xlLmxvZygnQ29udGVudCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uKTtcclxuXHJcbiAgICBsb2dFdmVudChBbmFseXRpY3NFdmVudHMuZ2FuYSwgJ2J1Y2tldENvbXBsZXRlZCcsIHtcclxuICAgICAgdHlwZTogJ2J1Y2tldENvbXBsZXRlZCcsXHJcbiAgICAgIGNsVXNlcklkOiBBbmFseXRpY3NFdmVudHMudXVpZCxcclxuICAgICAgdXNlclNvdXJjZTogQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UsXHJcbiAgICAgIGxhdExvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxyXG4gICAgICAvLyBjaXR5OiBjaXR5LFxyXG4gICAgICAvLyByZWdpb246IHJlZ2lvbixcclxuICAgICAgLy8gY291bnRyeTogY291bnRyeSxcclxuICAgICAgYXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcclxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG4gICAgICBidWNrZXROdW1iZXI6IGJuLFxyXG4gICAgICBudW1iZXJUcmllZEluQnVja2V0OiBidHJpZWQsXHJcbiAgICAgIG51bWJlckNvcnJlY3RJbkJ1Y2tldDogYmNvcnJlY3QsXHJcbiAgICAgIHBhc3NlZEJ1Y2tldDogcGFzc2VkLFxyXG4gICAgICBhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcclxuICAgICAgY29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gU2VuZCBGaW5pc2hlZFxyXG4gIHN0YXRpYyBzZW5kRmluaXNoZWQoYnVja2V0czogYnVja2V0W10gPSBudWxsLCBiYXNhbEJ1Y2tldDogbnVtYmVyLCBjZWlsaW5nQnVja2V0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGxldCBldmVudFN0cmluZyA9ICd1c2VyICcgKyBBbmFseXRpY3NFdmVudHMudXVpZCArICcgZmluaXNoZWQgdGhlIGFzc2Vzc21lbnQnO1xyXG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG4gICAgbGV0IG5leHRBc3Nlc3NtZW50ID0gZ2V0TmV4dEFzc2Vzc21lbnQoKTtcclxuICAgIGxldCByZXF1aXJlZFNjb3JlID0gZ2V0UmVxdWlyZWRTY29yZSgpO1xyXG4gICAgbGV0IGJhc2FsQnVja2V0SUQgPSBBbmFseXRpY3NFdmVudHMuZ2V0QmFzYWxCdWNrZXRJRChidWNrZXRzKTtcclxuICAgIGxldCBjZWlsaW5nQnVja2V0SUQgPSBBbmFseXRpY3NFdmVudHMuZ2V0Q2VpbGluZ0J1Y2tldElEKGJ1Y2tldHMpO1xyXG5cclxuICAgIGlmIChiYXNhbEJ1Y2tldElEID09IDApIHtcclxuICAgICAgYmFzYWxCdWNrZXRJRCA9IGNlaWxpbmdCdWNrZXRJRDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2NvcmUgPSBBbmFseXRpY3NFdmVudHMuY2FsY3VsYXRlU2NvcmUoYnVja2V0cywgYmFzYWxCdWNrZXRJRCk7XHJcbiAgICBjb25zdCBtYXhTY29yZSA9IGJ1Y2tldHMubGVuZ3RoICogMTAwO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIGNvbXBsZXRlZCBldmVudCcpO1xyXG4gICAgY29uc29sZS5sb2coJ1Njb3JlOiAnICsgc2NvcmUpO1xyXG4gICAgY29uc29sZS5sb2coJ01heCBTY29yZTogJyArIG1heFNjb3JlKTtcclxuICAgIGNvbnNvbGUubG9nKCdCYXNhbCBCdWNrZXQ6ICcgKyBiYXNhbEJ1Y2tldElEKTtcclxuICAgIGNvbnNvbGUubG9nKCdCQVNBTCBGUk9NIEFTU0VTU01FTlQ6ICcgKyBiYXNhbEJ1Y2tldCk7XHJcbiAgICBjb25zb2xlLmxvZygnQ2VpbGluZyBCdWNrZXQ6ICcgKyBjZWlsaW5nQnVja2V0SUQpO1xyXG4gICAgY29uc29sZS5sb2coJ0NFSUxJTkcgRlJPTSBBU1NFU1NNRU5UOiAnICsgY2VpbGluZ0J1Y2tldCk7XHJcbiAgICBjb25zb2xlLmxvZygnQ29tcGxldGVkIEFwcCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24pO1xyXG4gICAgY29uc29sZS5sb2coJ0NvbnRlbnQgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbik7XHJcbiAgICBsZXQgaXNTeW5hcHNlVXNlciA9IGZhbHNlO1xyXG4gICAgbGV0IGludGVnZXJSZXF1aXJlZFNjb3JlID0gMDtcclxuICAgIGlmIChuZXh0QXNzZXNzbWVudCA9PT0gJ251bGwnICYmIHJlcXVpcmVkU2NvcmUgPT09ICdudWxsJykge1xyXG4gICAgICBpc1N5bmFwc2VVc2VyID0gdHJ1ZTtcclxuICAgICAgaW50ZWdlclJlcXVpcmVkU2NvcmUgPSAwO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoTnVtYmVyKHJlcXVpcmVkU2NvcmUpID49IHNjb3JlICYmIE51bWJlcihyZXF1aXJlZFNjb3JlKSAhPSAwKSB7XHJcbiAgICAgIGlzU3luYXBzZVVzZXIgPSB0cnVlO1xyXG4gICAgICBpbnRlZ2VyUmVxdWlyZWRTY29yZSA9IE51bWJlcihyZXF1aXJlZFNjb3JlKTtcclxuICAgICAgbmV4dEFzc2Vzc21lbnQgPSAnbnVsbCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChOdW1iZXIocmVxdWlyZWRTY29yZSkgPCBzY29yZSAmJiBOdW1iZXIocmVxdWlyZWRTY29yZSkgIT0gMCkge1xyXG4gICAgICBpc1N5bmFwc2VVc2VyID0gdHJ1ZTtcclxuICAgICAgaW50ZWdlclJlcXVpcmVkU2NvcmUgPSBOdW1iZXIocmVxdWlyZWRTY29yZSk7XHJcbiAgICB9XHJcbiAgICBBbmFseXRpY3NFdmVudHMuc2VuZERhdGFUb1RoaXJkUGFydHkoc2NvcmUsIEFuYWx5dGljc0V2ZW50cy51dWlkLCBpbnRlZ2VyUmVxdWlyZWRTY29yZSwgbmV4dEFzc2Vzc21lbnQpO1xyXG4gICAgLy8gQXR0ZW1wdCB0byBzZW5kIHRoZSBzY29yZSB0byB0aGUgcGFyZW50IGN1cmlvdXMgZnJhbWUgaWYgaXQgZXhpc3RzXHJcbiAgICBpZiAod2luZG93LnBhcmVudCkge1xyXG4gICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdhc3Nlc3NtZW50X2NvbXBsZXRlZCcsXHJcbiAgICAgICAgICBzY29yZTogc2NvcmUsXHJcbiAgICAgICAgICAvLyBtYXhTY29yZTogbWF4U2NvcmUsXHJcbiAgICAgICAgICAvLyBiYXNhbEJ1Y2tldDogYmFzYWxCdWNrZXRJRCxcclxuICAgICAgICAgIC8vIGNlaWxpbmdCdWNrZXQ6IGNlaWxpbmdCdWNrZXRJRCxcclxuICAgICAgICAgIC8vIGFwcFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uLFxyXG4gICAgICAgICAgLy8gY29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcclxuICAgICAgICB9LFxyXG4gICAgICAgICdodHRwczovL3N5bmFwc2UuY3VyaW91c2NvbnRlbnQub3JnLydcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgY29uc3QgZXZlbnREYXRhID0ge1xyXG4gICAgICB0eXBlOiAnY29tcGxldGVkJyxcclxuICAgICAgY2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxyXG4gICAgICB1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcclxuICAgICAgYXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcclxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG4gICAgICBsYXRMb25nOiBBbmFseXRpY3NFdmVudHMuam9pbkxhdExvbmcoQW5hbHl0aWNzRXZlbnRzLmNsYXQsIEFuYWx5dGljc0V2ZW50cy5jbG9uKSxcclxuICAgICAgc2NvcmU6IHNjb3JlLFxyXG4gICAgICBtYXhTY29yZTogbWF4U2NvcmUsXHJcbiAgICAgIGJhc2FsQnVja2V0OiBiYXNhbEJ1Y2tldElELFxyXG4gICAgICBjZWlsaW5nQnVja2V0OiBjZWlsaW5nQnVja2V0SUQsXHJcbiAgICAgIGFwcFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uLFxyXG4gICAgICBjb250ZW50VmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uLFxyXG4gICAgICAuLi4oaXNTeW5hcHNlVXNlciAmJiB7XHJcbiAgICAgICAgbmV4dEFzc2Vzc21lbnQ6IG5leHRBc3Nlc3NtZW50LFxyXG4gICAgICAgIHJlcXVpcmVkU2NvcmU6IGludGVnZXJSZXF1aXJlZFNjb3JlXHJcbiAgICAgIH0pLFxyXG4gICAgfTtcclxuICAgIGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLCAnY29tcGxldGVkJywgZXZlbnREYXRhKTtcclxuXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZERhdGFUb1RoaXJkUGFydHkoc2NvcmU6IG51bWJlciwgdXVpZDogc3RyaW5nLCByZXF1aXJlZFNjb3JlOiBOdW1iZXIsIG5leHRBc3Nlc3NtZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIC8vIFNlbmQgZGF0YSB0byB0aGUgdGhpcmQgcGFydHlcclxuICAgIGNvbnNvbGUubG9nKCdBdHRlbXB0aW5nIHRvIHNlbmQgc2NvcmUgdG8gYSB0aGlyZCBwYXJ0eSEgU2NvcmU6ICcsIHNjb3JlKTtcclxuXHJcbiAgICAvLyBSZWFkIHRoZSBVUkwgZnJvbSB1dG0gcGFyYW1ldGVyc1xyXG4gICAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIGNvbnN0IHRhcmdldFBhcnR5VVJMID0gdXJsUGFyYW1zLmdldCgnZW5kcG9pbnQnKTtcclxuICAgIGNvbnN0IG9yZ2FuaXphdGlvbiA9IHVybFBhcmFtcy5nZXQoJ29yZ2FuaXphdGlvbicpO1xyXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgaWYgKCF0YXJnZXRQYXJ0eVVSTCkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdObyB0YXJnZXQgcGFydHkgVVJMIGZvdW5kIScpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgdXNlcjogdXVpZCxcclxuICAgICAgcGFnZTogJzExMTEwODEyMTM2MzYxNScsXHJcbiAgICAgIGV2ZW50OiB7XHJcbiAgICAgICAgdHlwZTogJ2V4dGVybmFsJyxcclxuICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgdHlwZTogJ2Fzc2Vzc21lbnQnLFxyXG4gICAgICAgICAgc3ViVHlwZTogQW5hbHl0aWNzRXZlbnRzLmFzc2Vzc21lbnRUeXBlLFxyXG4gICAgICAgICAgc2NvcmU6IHNjb3JlLFxyXG4gICAgICAgICAgcmVxdWlyZWRTY29yZTogcmVxdWlyZWRTY29yZSxcclxuICAgICAgICAgIG5leHRBc3Nlc3NtZW50OiBuZXh0QXNzZXNzbWVudCxcclxuICAgICAgICAgIGNvbXBsZXRlZDogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBwYXlsb2FkU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB0YXJnZXRQYXJ0eVVSTCwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG5cclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xyXG4gICAgICAgICAgLy8gUmVxdWVzdCB3YXMgc3VjY2Vzc2Z1bCwgaGFuZGxlIHRoZSByZXNwb25zZSBoZXJlXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUE9TVCBzdWNjZXNzIScgKyB4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gUmVxdWVzdCBmYWlsZWRcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzOiAnICsgeGhyLnN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLnNlbmQocGF5bG9hZFN0cmluZyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBkYXRhIHRvIHRhcmdldCBwYXJ0eTogJywgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIFNjb3JlXHJcbiAgc3RhdGljIGNhbGN1bGF0ZVNjb3JlKGJ1Y2tldHM6IGJ1Y2tldFtdLCBiYXNhbEJ1Y2tldElEOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc29sZS5sb2coJ0NhbGN1bGF0aW5nIHNjb3JlJyk7XHJcbiAgICBjb25zb2xlLmxvZyhidWNrZXRzKTtcclxuXHJcbiAgICBsZXQgc2NvcmUgPSAwO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdCYXNhbCBCdWNrZXQgSUQ6ICcgKyBiYXNhbEJ1Y2tldElEKTtcclxuXHJcbiAgICAvLyBHZXQgdGhlIG51bWNvcnJlY3QgZnJvbSB0aGUgYmFzYWwgYnVja2V0IGJhc2VkIG9uIGxvb3BpbmcgdGhyb3VnaCBhbmQgZmluZGluZyB0aGUgYnVja2V0IGlkXHJcbiAgICBsZXQgbnVtQ29ycmVjdCA9IDA7XHJcblxyXG4gICAgZm9yIChjb25zdCBpbmRleCBpbiBidWNrZXRzKSB7XHJcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IGJ1Y2tldHNbaW5kZXhdO1xyXG4gICAgICBpZiAoYnVja2V0LmJ1Y2tldElEID09IGJhc2FsQnVja2V0SUQpIHtcclxuICAgICAgICBudW1Db3JyZWN0ID0gYnVja2V0Lm51bUNvcnJlY3Q7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnTnVtIENvcnJlY3Q6ICcgKyBudW1Db3JyZWN0LCAnIGJhc2FsOiAnICsgYmFzYWxCdWNrZXRJRCwgJyBidWNrZXRzOiAnICsgYnVja2V0cy5sZW5ndGgpO1xyXG5cclxuICAgIGlmIChiYXNhbEJ1Y2tldElEID09PSBidWNrZXRzLmxlbmd0aCAmJiBudW1Db3JyZWN0ID49IDQpIHtcclxuICAgICAgLy8gSWYgdGhlIHVzZXIgaGFzIGVub3VnaCBjb3JyZWN0IGFuc3dlcnMgaW4gdGhlIGxhc3QgYnVja2V0LCBnaXZlIHRoZW0gYSBwZXJmZWN0IHNjb3JlXHJcbiAgICAgIGNvbnNvbGUubG9nKCdQZXJmZWN0IHNjb3JlJyk7XHJcblxyXG4gICAgICByZXR1cm4gYnVja2V0cy5sZW5ndGggKiAxMDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2NvcmUgPSBNYXRoLnJvdW5kKChiYXNhbEJ1Y2tldElEIC0gMSkgKiAxMDAgKyAobnVtQ29ycmVjdCAvIDUpICogMTAwKSB8IDA7XHJcblxyXG4gICAgcmV0dXJuIHNjb3JlO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IEJhc2FsIEJ1Y2tldCBJRFxyXG4gIHN0YXRpYyBnZXRCYXNhbEJ1Y2tldElEKGJ1Y2tldHM6IGJ1Y2tldFtdKTogbnVtYmVyIHtcclxuICAgIGxldCBidWNrZXRJRCA9IDA7XHJcblxyXG4gICAgLy8gU2VsZWN0IHRoZSBsb3dlc3QgYnVja2V0SUQgYnVja2V0IHRoYXQgdGhlIHVzZXIgaGFzIGZhaWxlZFxyXG4gICAgZm9yIChjb25zdCBpbmRleCBpbiBidWNrZXRzKSB7XHJcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IGJ1Y2tldHNbaW5kZXhdO1xyXG4gICAgICBpZiAoYnVja2V0LnRlc3RlZCAmJiAhYnVja2V0LnBhc3NlZCkge1xyXG4gICAgICAgIGlmIChidWNrZXRJRCA9PSAwIHx8IGJ1Y2tldC5idWNrZXRJRCA8IGJ1Y2tldElEKSB7XHJcbiAgICAgICAgICBidWNrZXRJRCA9IGJ1Y2tldC5idWNrZXRJRDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVja2V0SUQ7XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgQ2VpbGluZyBCdWNrZXQgSURcclxuICBzdGF0aWMgZ2V0Q2VpbGluZ0J1Y2tldElEKGJ1Y2tldHM6IGJ1Y2tldFtdKTogbnVtYmVyIHtcclxuICAgIGxldCBidWNrZXRJRCA9IDA7XHJcblxyXG4gICAgLy8gU2VsZWN0IHRoZSBoaXVnaGVzdCBidWNrZXRJRCBidWNrZXQgdGhhdCB0aGUgdXNlciBoYXMgcGFzc2VkXHJcbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGJ1Y2tldHMpIHtcclxuICAgICAgY29uc3QgYnVja2V0ID0gYnVja2V0c1tpbmRleF07XHJcbiAgICAgIGlmIChidWNrZXQudGVzdGVkICYmIGJ1Y2tldC5wYXNzZWQpIHtcclxuICAgICAgICBpZiAoYnVja2V0SUQgPT0gMCB8fCBidWNrZXQuYnVja2V0SUQgPiBidWNrZXRJRCkge1xyXG4gICAgICAgICAgYnVja2V0SUQgPSBidWNrZXQuYnVja2V0SUQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1Y2tldElEO1xyXG4gIH1cclxuXHJcbiAgLy8gSm9pbiBMYXQgTG9uZ1xyXG4gIHN0YXRpYyBqb2luTGF0TG9uZyhsYXQ6IHN0cmluZywgbG9uOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGxhdCArICcsJyArIGxvbjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQW5hbHl0aWNzU2VydmljZSwgRmlyZWJhc2VTdHJhdGVneSwgU3RhdHNpZ1N0cmF0ZWd5IH0gZnJvbSAnQGN1cmlvdXNsZWFybmluZy9hbmFseXRpY3MnO1xyXG5pbXBvcnQgeyBmaXJlYmFzZUNvbmZpZyB9IGZyb20gXCIuL2FuYWx5dGljcy1jb25maWdcIjtcclxuXHJcbi8qKlxyXG4gKiBCYXNlIGNsYXNzIGZvciBpbnRlZ3JhdGluZyBhbmFseXRpY3MgcHJvdmlkZXJzLlxyXG4gKlxyXG4gKiBUaGlzIGNsYXNzIHNldHMgdXAgYW5kIG1hbmFnZXMgYW5hbHl0aWNzIHN0cmF0ZWdpZXMgKEZpcmViYXNlLCBTdGF0c2lnLCBldGMuKVxyXG4gKiB1c2luZyB0aGUgQ3VyaW91cyBMZWFybmluZyBBbmFseXRpY3MgU0RLLiBJdCBwcm92aWRlcyBpbml0aWFsaXphdGlvbiBsb2dpYyxcclxuICogY3VzdG9tIGV2ZW50IHRyYWNraW5nLCBhbmQgYWNjZXNzb3JzIGZvciBhbmFseXRpY3Mgc2VydmljZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFzZUFuYWx5dGljc0ludGVncmF0aW9uIHtcclxuICAgIHByaXZhdGUgYW5hbHl0aWNzU2VydmljZTogQW5hbHl0aWNzU2VydmljZTtcclxuICAgIHByaXZhdGUgZmlyZWJhc2VTdHJhdGVneTogRmlyZWJhc2VTdHJhdGVneTtcclxuICAgIHByaXZhdGUgc3RhdHNpZ1N0cmF0ZWd5OiBTdGF0c2lnU3RyYXRlZ3k7XHJcbiAgICBwcml2YXRlIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgQmFzZUFuYWx5dGljc0ludGVncmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEluaXRpYWxpemVzIHRoZSB7QGxpbmsgQW5hbHl0aWNzU2VydmljZX0sIGJ1dCBkb2VzIG5vdCBzdGFydCBhbnkgcHJvdmlkZXJzXHJcbiAgICAgKiB1bnRpbCB7QGxpbmsgaW5pdGlhbGl6ZX0gaXMgY2FsbGVkLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFuYWx5dGljc1NlcnZpY2UgPSBuZXcgQW5hbHl0aWNzU2VydmljZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFuYWx5dGljcyBpbnRlZ3JhdGlvbiBieSBzZXR0aW5nIHVwIGFuZCByZWdpc3RlcmluZyBwcm92aWRlcnMuXHJcbiAgICAgKlxyXG4gICAgICogLSBJbml0aWFsaXplcyBGaXJlYmFzZSBBbmFseXRpY3Mgd2l0aCB0aGUgcHJvdmlkZWQgY29uZmlndXJhdGlvbi5cclxuICAgICAqIC0gUmVnaXN0ZXJzIEZpcmViYXNlIGFzIGFuIGFuYWx5dGljcyBwcm92aWRlci5cclxuICAgICAqIC0gT3B0aW9uYWxseSwgY2FuIGluaXRpYWxpemUgU3RhdHNpZyAoY3VycmVudGx5IGNvbW1lbnRlZCBvdXQpLlxyXG4gICAgICpcclxuICAgICAqIEVuc3VyZXMgaW5pdGlhbGl6YXRpb24gb25seSBoYXBwZW5zIG9uY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYW5hbHl0aWNzIGhhdmUgYmVlbiBpbml0aWFsaXplZC5cclxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBpbml0aWFsaXphdGlvbiBmYWlscy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpemUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmViYXNlU3RyYXRlZ3kgPSBuZXcgRmlyZWJhc2VTdHJhdGVneSh7XHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZU9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBhcGlLZXk6IGZpcmViYXNlQ29uZmlnLmFwaUtleSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRoRG9tYWluOiBmaXJlYmFzZUNvbmZpZy5hdXRoRG9tYWluLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBmaXJlYmFzZUNvbmZpZy5kYXRhYmFzZVVSTCxcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IGZpcmViYXNlQ29uZmlnLnByb2plY3RJZCxcclxuICAgICAgICAgICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBmaXJlYmFzZUNvbmZpZy5zdG9yYWdlQnVja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBmaXJlYmFzZUNvbmZpZy5tZXNzYWdpbmdTZW5kZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBhcHBJZDogZmlyZWJhc2VDb25maWcuYXBwSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZW1lbnRJZDogZmlyZWJhc2VDb25maWcubWVhc3VyZW1lbnRJZCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB1c2VyUHJvcGVydGllczoge31cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZpcmViYXNlU3RyYXRlZ3kuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmFuYWx5dGljc1NlcnZpY2UucmVnaXN0ZXIoJ2ZpcmViYXNlJywgdGhpcy5maXJlYmFzZVN0cmF0ZWd5KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEV4YW1wbGUgb2YgU3RhdHNpZyBpbml0aWFsaXphdGlvbiAoY29tbWVudGVkIG91dClcclxuICAgICAgICAgICAgLy8gdGhpcy5zdGF0c2lnU3RyYXRlZ3kgPSBuZXcgU3RhdHNpZ1N0cmF0ZWd5KHtcclxuICAgICAgICAgICAgLy8gICAgIGNsaWVudEtleTogc3RhdHNpZ0NvbmZpZy5jbGllbnRLZXksXHJcbiAgICAgICAgICAgIC8vICAgICBzdGF0c2lnVXNlcjogeyB1c2VySUQ6IGdldFVVSUQoKSB8fCBzdGF0c2lnQ29uZmlnLnVzZXJJZCB9XHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAvLyBhd2FpdCB0aGlzLnN0YXRzaWdTdHJhdGVneS5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYW5hbHl0aWNzU2VydmljZS5yZWdpc3Rlcignc3RhdHNpZycsIHRoaXMuc3RhdHNpZ1N0cmF0ZWd5KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW5hbHl0aWNzIHNlcnZpY2UgaW5pdGlhbGl6ZWQgc3VjY2Vzc2Z1bGx5IHdpdGggRmlyZWJhc2UgYW5kIFN0YXRzaWdcIik7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHdoaWxlIGluaXRpYWxpemluZyBhbmFseXRpY3M6XCIsIGVycm9yKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhY2tzIGEgY3VzdG9tIGV2ZW50IHVzaW5nIHRoZSByZWdpc3RlcmVkIGFuYWx5dGljcyBwcm92aWRlcnMuXHJcbiAgICAgKlxyXG4gICAgICogSWYgYW5hbHl0aWNzIGFyZSBub3QgeWV0IGluaXRpYWxpemVkLCB0aGUgZXZlbnQgbWF5IGJlIHF1ZXVlZCBieSB0aGUgc2VydmljZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHRyYWNrLlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IHBheWxvYWQgY29udGFpbmluZyBldmVudCBkZXRhaWxzLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdHJhY2tDdXN0b21FdmVudChldmVudE5hbWU6IHN0cmluZywgZXZlbnQ6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0luaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkFuYWx5dGljcyBub3QgaW5pdGlhbGl6ZWQsIHF1ZXVpbmcgZXZlbnQ6XCIsIGV2ZW50TmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmFuYWx5dGljc1NlcnZpY2UudHJhY2soZXZlbnROYW1lLCBldmVudCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHdoaWxlIGxvZ2dpbmcgY3VzdG9tIGV2ZW50OlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdW5kZXJseWluZyB7QGxpbmsgQW5hbHl0aWNzU2VydmljZX0gaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FuYWx5dGljc1NlcnZpY2V9IFRoZSBhbmFseXRpY3Mgc2VydmljZSB1c2VkIGZvciBtYW5hZ2luZyBwcm92aWRlcnMuXHJcbiAgICAgKi9cclxuICAgIGdldCBhbmFseXRpY3MoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5hbHl0aWNzU2VydmljZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGluaXRpYWxpemVkIEZpcmViYXNlIGFwcCBpbnN0YW5jZSAoaWYgYXZhaWxhYmxlKS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7YW55IHwgdW5kZWZpbmVkfSBUaGUgRmlyZWJhc2UgYXBwIGluc3RhbmNlLCBvciB1bmRlZmluZWQgaWYgbm90IGluaXRpYWxpemVkLlxyXG4gICAgICovXHJcbiAgICBnZXQgZmlyZWJhc2VBcHAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlyZWJhc2VTdHJhdGVneT8uZmlyZWJhc2VBcHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhbmFseXRpY3MgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBhbmFseXRpY3MgYXJlIGluaXRpYWxpemVkLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0FuYWx5dGljc1JlYWR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzSW5pdGlhbGl6ZWQ7XHJcbiAgICB9XHJcbn1cclxuIiwiLy90aGlzIGlzIHdoZXJlIHRoZSBsb2dpYyBmb3IgaGFuZGxpbmcgdGhlIGJ1Y2tldHMgd2lsbCBnb1xyXG4vL1xyXG4vL29uY2Ugd2Ugc3RhcnQgYWRkaW5nIGluIHRoZSBhc3Nlc3NtZW50IGZ1bmN0aW9uYWxpdHlcclxuaW1wb3J0IHsgVUlDb250cm9sbGVyIH0gZnJvbSAnLi4vdWkvdWlDb250cm9sbGVyJztcclxuaW1wb3J0IHsgcURhdGEsIGFuc3dlckRhdGEgfSBmcm9tICcuLi9jb21wb25lbnRzL3F1ZXN0aW9uRGF0YSc7XHJcbmltcG9ydCB7IEFuYWx5dGljc0V2ZW50cyB9IGZyb20gJy4uL2FuYWx5dGljcy9hbmFseXRpY3NFdmVudHMnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuLi9BcHAnO1xyXG5pbXBvcnQgeyBidWNrZXQsIGJ1Y2tldEl0ZW0gfSBmcm9tICcuL2J1Y2tldERhdGEnO1xyXG5pbXBvcnQgeyBCYXNlUXVpeiB9IGZyb20gJy4uL2Jhc2VRdWl6JztcclxuaW1wb3J0IHsgZmV0Y2hBc3Nlc3NtZW50QnVja2V0cyB9IGZyb20gJy4uL3V0aWxzL2pzb25VdGlscyc7XHJcbmltcG9ydCB7IFRyZWVOb2RlLCBzb3J0ZWRBcnJheVRvSURzQlNUIH0gZnJvbSAnLi4vY29tcG9uZW50cy90Tm9kZSc7XHJcbmltcG9ydCB7IHJhbmRGcm9tLCBzaHVmZmxlQXJyYXkgfSBmcm9tICcuLi91dGlscy9tYXRoVXRpbHMnO1xyXG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IEFuYWx5dGljc0V2ZW50c1R5cGUsIEFuYWx5dGljc0ludGVncmF0aW9uIH0gZnJvbSAnLi4vYW5hbHl0aWNzL2FuYWx5dGljcy1pbnRlZ3JhdGlvbic7XHJcbmltcG9ydCB7IGNhbGN1bGF0ZVNjb3JlLCBnZXRCYXNhbEJ1Y2tldElELCBnZXRDZWlsaW5nQnVja2V0SUQsIGdldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMgfSBmcm9tICcuLi91dGlscy9BbmFseXRpY3NVdGlscyc7XHJcbmltcG9ydCB7IGdldE5leHRBc3Nlc3NtZW50LCBnZXRSZXF1aXJlZFNjb3JlIH0gZnJvbSAnLi4vdXRpbHMvdXJsVXRpbHMnO1xyXG5cclxuZW51bSBzZWFyY2hTdGFnZSB7XHJcbiAgQmluYXJ5U2VhcmNoLFxyXG4gIExpbmVhclNlYXJjaFVwLFxyXG4gIExpbmVhclNlYXJjaERvd24sXHJcbn1cclxuXHJcbmVudW0gQnVja2V0R2VuTW9kZSB7XHJcbiAgUmFuZG9tQlNULFxyXG4gIExpbmVhckFycmF5QmFzZWQsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBc3Nlc3NtZW50IGV4dGVuZHMgQmFzZVF1aXoge1xyXG4gIHB1YmxpYyB1bml0eUJyaWRnZTtcclxuICBwdWJsaWMgYW5hbHl0aWNzSW50ZWdyYXRpb246IEFuYWx5dGljc0ludGVncmF0aW9uO1xyXG4gIHB1YmxpYyBjdXJyZW50Tm9kZTogVHJlZU5vZGU7XHJcbiAgcHVibGljIGN1cnJlbnRRdWVzdGlvbjogcURhdGE7XHJcbiAgcHVibGljIGJ1Y2tldEFycmF5OiBudW1iZXJbXTtcclxuICBwdWJsaWMgcXVlc3Rpb25OdW1iZXI6IG51bWJlcjtcclxuICBwdWJsaWMgY29tbW9uUHJvcGVydGllcztcclxuICBwdWJsaWMgYnVja2V0czogYnVja2V0W107XHJcbiAgcHVibGljIGN1cnJlbnRCdWNrZXQ6IGJ1Y2tldDtcclxuICBwdWJsaWMgbnVtQnVja2V0czogbnVtYmVyO1xyXG4gIHB1YmxpYyBiYXNhbEJ1Y2tldDogbnVtYmVyO1xyXG4gIHB1YmxpYyBjZWlsaW5nQnVja2V0OiBudW1iZXI7XHJcblxyXG4gIHB1YmxpYyBjdXJyZW50TGluZWFyQnVja2V0SW5kZXg6IG51bWJlcjtcclxuICBwdWJsaWMgY3VycmVudExpbmVhclRhcmdldEluZGV4OiBudW1iZXI7XHJcblxyXG4gIHByb3RlY3RlZCBidWNrZXRHZW5Nb2RlOiBCdWNrZXRHZW5Nb2RlID0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1Q7XHJcblxyXG4gIHByaXZhdGUgTUFYX1NUQVJTX0NPVU5UX0lOX0xJTkVBUl9NT0RFID0gMjA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGRhdGFVUkw6IHN0cmluZywgdW5pdHlCcmlkZ2U6IGFueSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZGF0YVVSTCA9IGRhdGFVUkw7XHJcbiAgICB0aGlzLnVuaXR5QnJpZGdlID0gdW5pdHlCcmlkZ2U7XHJcbiAgICB0aGlzLnF1ZXN0aW9uTnVtYmVyID0gMDtcclxuICAgIGNvbnNvbGUubG9nKCdhcHAgaW5pdGlhbGl6ZWQnKTtcclxuICAgIHRoaXMuc2V0dXBVSUhhbmRsZXJzKCk7XHJcbiAgICB0aGlzLmFuYWx5dGljc0ludGVncmF0aW9uID0gQW5hbHl0aWNzSW50ZWdyYXRpb24uZ2V0SW5zdGFuY2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0dXBVSUhhbmRsZXJzKCk6IHZvaWQge1xyXG5cclxuICAgIFVJQ29udHJvbGxlci5TZXRCdXR0b25QcmVzc0FjdGlvbih0aGlzLmhhbmRsZUFuc3dlckJ1dHRvblByZXNzKTtcclxuICAgIFVJQ29udHJvbGxlci5TZXRTdGFydEFjdGlvbih0aGlzLnN0YXJ0QXNzZXNzbWVudCk7XHJcbiAgICBVSUNvbnRyb2xsZXIuU2V0RXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyKHRoaXMuZ2VuZXJhdGVEZXZNb2RlQnVja2V0Q29udHJvbHNJbkNvbnRhaW5lcik7XHJcbiAgfVxyXG4gIHB1YmxpYyBSdW4oYXBwbGluazogQXBwKTogdm9pZCB7XHJcbiAgICB0aGlzLmFwcCA9IGFwcGxpbms7XHJcbiAgICB0aGlzLmJ1aWxkQnVja2V0cyh0aGlzLmJ1Y2tldEdlbk1vZGUpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRCdWNrZXQpO1xyXG4gICAgICB0aGlzLnVuaXR5QnJpZGdlLlNlbmRMb2FkZWQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhbmRsZUJ1Y2tldEdlbk1vZGVDaGFuZ2UoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZVxyXG4gICAgdGhpcy5idWNrZXRHZW5Nb2RlID0gcGFyc2VJbnQodGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0LnZhbHVlKSBhcyBCdWNrZXRHZW5Nb2RlO1xyXG4gICAgdGhpcy5idWlsZEJ1Y2tldHModGhpcy5idWNrZXRHZW5Nb2RlKS50aGVuKCgpID0+IHtcclxuICAgICAgLy8gRmluaXNoZWQgYnVpbGRpbmcgYnVja2V0c1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnVwZGF0ZUJ1Y2tldEluZm8oKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBoYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSgpOiB2b2lkIHtcclxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLlNldENvcnJlY3RMYWJlbFZpc2liaWxpdHkodGhpcy5pc0NvcnJlY3RMYWJlbFNob3duKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTogdm9pZCB7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5TZXRBbmltYXRpb25TcGVlZE11bHRpcGxpZXIodGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhbmRsZUJ1Y2tldEluZm9TaG93bkNoYW5nZSgpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UoKTogdm9pZCB7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5TZXRCdWNrZXRDb250cm9sc1Zpc2liaWxpdHkodGhpcy5pc0J1Y2tldENvbnRyb2xzRW5hYmxlZCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2VuZXJhdGVEZXZNb2RlQnVja2V0Q29udHJvbHNJbkNvbnRhaW5lciA9IChjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGlja0hhbmRsZXI6ICgpID0+IHZvaWQpID0+IHtcclxuICAgIGlmICh0aGlzLmlzSW5EZXZNb2RlICYmIHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcbiAgICAgIC8vIENyZWF0ZSBidXR0b25zIGZvciB0aGUgY3VycmVudCBidWNrZXQgaXRlbXMsIHRoYXQgYXJlIGNsaWNrYWJsZSBhbmQgd2lsbCB0cmlnZ2VyIHRoZSBpdGVtIGF1ZGlvXHJcbiAgICAgIC8vIEFkZCAyIGJ1dHRvbnMsIG9uZSBmb3IgbW92aW5nIHVwIGFuZCBvbmUgZm9yIG1vdmluZyBkb3duIHRoZSBidWNrZXQgdHJlZVxyXG4gICAgICAvLyBFbXB0eSB0aGUgY29udGFpbmVyIGJlZm9yZSBhZGRpbmcgbmV3IGJ1dHRvbnNcclxuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3VycmVudEJ1Y2tldC5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zW2ldO1xyXG4gICAgICAgIGxldCBpdGVtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gaTtcclxuICAgICAgICBpdGVtQnV0dG9uLmlubmVyVGV4dCA9IGl0ZW0uaXRlbU5hbWU7XHJcbiAgICAgICAgaXRlbUJ1dHRvbi5zdHlsZS5tYXJnaW4gPSAnMnB4JztcclxuICAgICAgICBpdGVtQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50QnVja2V0LnVzZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQgb24gaXRlbSAnICsgaXRlbS5pdGVtTmFtZSArICcgYXQgaW5kZXggJyArIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4KTtcclxuICAgICAgICAgIC8vIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCksIGZhbHNlKTtcclxuICAgICAgICAgIGNvbnN0IG5ld1EgPSB0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKTtcclxuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuc3dlcnNDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgZm9yIChsZXQgYiBpbiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zKSB7XHJcbiAgICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNbYl0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd24gPSBmYWxzZTtcclxuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLm5leHRRdWVzdGlvbiA9IG5ld1E7XHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgIFVJQ29udHJvbGxlci5TaG93UXVlc3Rpb24obmV3USk7XHJcbiAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKFxyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKS5wcm9tcHRBdWRpbyxcclxuICAgICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd09wdGlvbnMsXHJcbiAgICAgICAgICAgIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb25cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAvLyBjbGlja0hhbmRsZXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoaXRlbUJ1dHRvbik7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQ3JlYXRlIDIgbW9yZSBidXR0b25zIGZvciBtb3ZpbmcgdXAgYW5kIGRvd24gdGhlIGJ1Y2tldCB0cmVlXHJcbiAgICAgIGxldCBwcmV2QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgIHByZXZCdXR0b24uaW5uZXJUZXh0ID0gJ1ByZXYgQnVja2V0JztcclxuICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID09IDApIHtcclxuICAgICAgICBwcmV2QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4LS07XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA9IDA7XHJcbiAgICAgICAgICB0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xyXG4gICAgICAgICAgVUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKSk7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUJ1Y2tldEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID09IDApIHtcclxuICAgICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGxldCBuZXh0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgIG5leHRCdXR0b24uaW5uZXJUZXh0ID0gJ05leHQgQnVja2V0JztcclxuICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID09IHRoaXMuYnVja2V0cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgbmV4dEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgbmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPCB0aGlzLmJ1Y2tldHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcclxuICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4ID0gMDtcclxuICAgICAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBBcHBlbmQgdGhlIGJ1dHRvbnMgdG8gdGhlIGNvbnRhaW5lclxyXG4gICAgICBsZXQgYnV0dG9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBidXR0b25zQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgIGJ1dHRvbnNDb250YWluZXIuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdyb3cnO1xyXG4gICAgICBidXR0b25zQ29udGFpbmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XHJcbiAgICAgIGJ1dHRvbnNDb250YWluZXIuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xyXG4gICAgICBidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZCdXR0b24pO1xyXG4gICAgICBidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKG5leHRCdXR0b24pO1xyXG5cclxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbnNDb250YWluZXIpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyB1cGRhdGVCdWNrZXRJbmZvID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudEJ1Y2tldCAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXIuaW5uZXJIVE1MID0gYEJ1Y2tldDogJHt0aGlzLmN1cnJlbnRCdWNrZXQuYnVja2V0SUR9PGJyLz5Db3JyZWN0OiAke3RoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0fTxici8+VHJpZWQ6ICR7dGhpcy5jdXJyZW50QnVja2V0Lm51bVRyaWVkfTxici8+RmFpbGVkOiAke3RoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nfWA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHN0YXJ0QXNzZXNzbWVudCA9ICgpID0+IHtcclxuICAgIHRoaXMuY29tbW9uUHJvcGVydGllcyA9IGdldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMoKTtcclxuICAgIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkpO1xyXG4gICAgaWYgKHRoaXMuaXNJbkRldk1vZGUpIHtcclxuICAgICAgdGhpcy5oaWRlRGV2TW9kZUJ1dHRvbigpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBidWlsZEJ1Y2tldHMgPSBhc3luYyAoYnVja2V0R2VuTW9kZTogQnVja2V0R2VuTW9kZSkgPT4ge1xyXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSB0aGUgYnVja2V0cyBsb2FkZWQsIGxvYWQgdGhlbSBhbmQgaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlLCB3aGljaCBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcclxuICAgIGlmICh0aGlzLmJ1Y2tldHMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmJ1Y2tldHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGZldGNoQXNzZXNzbWVudEJ1Y2tldHModGhpcy5hcHAuR2V0RGF0YVVSTCgpKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICB0aGlzLmJ1Y2tldHMgPSByZXN1bHQ7XHJcbiAgICAgICAgdGhpcy5udW1CdWNrZXRzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICBjb25zb2xlLmxvZygnYnVja2V0czogJyArIHRoaXMuYnVja2V0cyk7XHJcbiAgICAgICAgdGhpcy5idWNrZXRBcnJheSA9IEFycmF5LmZyb20oQXJyYXkodGhpcy5udW1CdWNrZXRzKSwgKF8sIGkpID0+IGkgKyAxKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnZW1wdHkgYXJyYXkgJyArIHRoaXMuYnVja2V0QXJyYXkpO1xyXG4gICAgICAgIGxldCB1c2VkSW5kaWNlcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xyXG4gICAgICAgIHVzZWRJbmRpY2VzLmFkZCgwKTtcclxuICAgICAgICBsZXQgcm9vdE9mSURzID0gc29ydGVkQXJyYXlUb0lEc0JTVChcclxuICAgICAgICAgIHRoaXMuYnVja2V0c1swXS5idWNrZXRJRCAtIDEsXHJcbiAgICAgICAgICB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELFxyXG4gICAgICAgICAgdXNlZEluZGljZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyb290T2ZJRHMpO1xyXG4gICAgICAgIGxldCBidWNrZXRzUm9vdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKHJvb3RPZklEcywgdGhpcy5idWNrZXRzKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGJ1Y2tldHNSb290KTtcclxuICAgICAgICB0aGlzLmJhc2FsQnVja2V0ID0gdGhpcy5udW1CdWNrZXRzICsgMTtcclxuICAgICAgICB0aGlzLmNlaWxpbmdCdWNrZXQgPSAtMTtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gYnVja2V0c1Jvb3Q7XHJcbiAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcclxuICAgICAgICAvLyBJZiB3ZSBoYXZlIHRoZSBidWNrZXRzIGxvYWRlZCwgd2UgY2FuIGluaXRpYWxpemUgdGhlIGN1cnJlbnQgbm9kZSwgd2hpY2ggaXMgdGhlIHN0YXJ0aW5nIHBvaW50XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIGxldCB1c2VkSW5kaWNlcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xyXG4gICAgICAgICAgdXNlZEluZGljZXMuYWRkKDApO1xyXG4gICAgICAgICAgbGV0IHJvb3RPZklEcyA9IHNvcnRlZEFycmF5VG9JRHNCU1QoXHJcbiAgICAgICAgICAgIHRoaXMuYnVja2V0c1swXS5idWNrZXRJRCAtIDEsXHJcbiAgICAgICAgICAgIHRoaXMuYnVja2V0c1t0aGlzLmJ1Y2tldHMubGVuZ3RoIC0gMV0uYnVja2V0SUQsXHJcbiAgICAgICAgICAgIHVzZWRJbmRpY2VzXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJHZW5lcmF0ZWQgdGhlIGJ1Y2tldHMgcm9vdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2cocm9vdE9mSURzKTtcclxuICAgICAgICAgIGxldCBidWNrZXRzUm9vdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKHJvb3RPZklEcywgdGhpcy5idWNrZXRzKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdHZW5lcmF0ZWQgdGhlIGJ1Y2tldHMgcm9vdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhidWNrZXRzUm9vdCk7XHJcbiAgICAgICAgICB0aGlzLmJhc2FsQnVja2V0ID0gdGhpcy5udW1CdWNrZXRzICsgMTtcclxuICAgICAgICAgIHRoaXMuY2VpbGluZ0J1Y2tldCA9IC0xO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IGJ1Y2tldHNSb290O1xyXG4gICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChidWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPSAwO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSAwO1xyXG4gICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnRzIGEgYmluYXJ5IHNlYXJjaCB0cmVlIG9mIG51bWJlcnMgdG8gYSBiaW5hcnkgc2VhcmNoIHRyZWUgb2YgYnVja2V0IG9iamVjdHNcclxuICAgKiBAcGFyYW0gbm9kZSBJcyBhIHJvb3Qgbm9kZSBvZiBhIGJpbmFyeSBzZWFyY2ggdHJlZVxyXG4gICAqIEBwYXJhbSBidWNrZXRzIElzIGFuIGFycmF5IG9mIGJ1Y2tldCBvYmplY3RzXHJcbiAgICogQHJldHVybnMgQSByb290IG5vZGUgb2YgYSBiaW5hcnkgc2VhcmNoIHRyZWUgd2hlcmUgdGhlIHZhbHVlIG9mIGVhY2ggbm9kZSBpcyBhIGJ1Y2tldCBvYmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgY29udmVydFRvQnVja2V0QlNUID0gKG5vZGU6IFRyZWVOb2RlLCBidWNrZXRzOiBidWNrZXRbXSkgPT4ge1xyXG4gICAgLy8gVHJhdmVyc2UgZWFjaCBlbGVtZW50IHRha2UgdGhlIHZhbHVlIGFuZCBmaW5kIHRoYXQgYnVja2V0IGluIHRoZSBidWNrZXRzIGFycmF5IGFuZCBhc3NpZ24gdGhhdCBidWNrZXQgaW5zdGVhZCBvZiB0aGUgbnVtYmVyIHZhbHVlXHJcbiAgICBpZiAobm9kZSA9PT0gbnVsbCkgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgbGV0IGJ1Y2tldElkID0gbm9kZS52YWx1ZTtcclxuICAgIG5vZGUudmFsdWUgPSBidWNrZXRzLmZpbmQoKGJ1Y2tldCkgPT4gYnVja2V0LmJ1Y2tldElEID09PSBidWNrZXRJZCk7XHJcbiAgICBpZiAobm9kZS5sZWZ0ICE9PSBudWxsKSBub2RlLmxlZnQgPSB0aGlzLmNvbnZlcnRUb0J1Y2tldEJTVChub2RlLmxlZnQsIGJ1Y2tldHMpO1xyXG4gICAgaWYgKG5vZGUucmlnaHQgIT09IG51bGwpIG5vZGUucmlnaHQgPSB0aGlzLmNvbnZlcnRUb0J1Y2tldEJTVChub2RlLnJpZ2h0LCBidWNrZXRzKTtcclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgaW5pdEJ1Y2tldCA9IChidWNrZXQ6IGJ1Y2tldCkgPT4ge1xyXG4gICAgdGhpcy5jdXJyZW50QnVja2V0ID0gYnVja2V0O1xyXG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnVzZWRJdGVtcyA9IFtdO1xyXG4gICAgdGhpcy5jdXJyZW50QnVja2V0Lm51bVRyaWVkID0gMDtcclxuICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0ID0gMDtcclxuICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nID0gMDtcclxuICAgIHRoaXMuY3VycmVudEJ1Y2tldC50ZXN0ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyA9IChhbnN3ZXI6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKSA9PiB7XHJcbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG5cclxuICAgICAgdGhpcy5sb2dQdXp6bGVDb21wbGV0ZWRFdmVudChhbnN3ZXIsIGVsYXBzZWQsIHRoaXMuY3VycmVudFF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlQ3VycmVudEJ1Y2tldFZhbHVlc0FmdGVyQW5zd2VyaW5nKGFuc3dlcik7XHJcbiAgICB0aGlzLnVwZGF0ZUZlZWRiYWNrQWZ0ZXJBbnN3ZXIoYW5zd2VyKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ0NvbXBsZXRlZCBmaXJzdCBUaW1lb3V0Jyk7XHJcbiAgICAgIHRoaXMub25RdWVzdGlvbkVuZCgpO1xyXG4gICAgfSwgMjAwMCAqIHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKTtcclxuICB9O1xyXG4gIHByaXZhdGUgbG9nUHV6emxlQ29tcGxldGVkRXZlbnQoYW5zd2VyOiBudW1iZXIsIGVsYXBzZWQ6IG51bWJlciwgdGhlUTogcURhdGEpIHtcclxuICAgIHZhciBhbnMgPSB0aGVRLmFuc3dlcnNbYW5zd2VyIC0gMV07XHJcbiAgICBsZXQgYnVja2V0ID0gbnVsbDtcclxuICAgIGxldCBvcHRpb25zID0gJyc7XHJcbiAgICBsZXQgZXZlbnRTdHJpbmcgPSAndXNlciAnICsgdGhpcy5jb21tb25Qcm9wZXJ0aWVzLmNyX3VzZXJfaWQgKyAnIGFuc3dlcmVkICcgKyB0aGVRLnFOYW1lICsgJyB3aXRoICcgKyBhbnMuYW5zd2VyTmFtZTtcclxuICAgIGlmICgnYnVja2V0JyBpbiB0aGVRKSB7XHJcbiAgICAgIGJ1Y2tldCA9IHRoZVEuYnVja2V0O1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgYU51bSBpbiB0aGVRLmFuc3dlcnMpIHtcclxuICAgICAgZXZlbnRTdHJpbmcgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyAnLCc7XHJcbiAgICAgIG9wdGlvbnMgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyAnLCc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFuYWx5dGljc0ludGVncmF0aW9uLnRyYWNrKEFuYWx5dGljc0V2ZW50c1R5cGUuQU5TV0VSRUQsIHtcclxuICAgICAgdHlwZTogJ2Fuc3dlcmVkJyxcclxuICAgICAgZHQ6IGVsYXBzZWQsXHJcbiAgICAgIHF1ZXN0aW9uX251bWJlcjogdGhlUS5xTnVtYmVyLFxyXG4gICAgICB0YXJnZXQ6IHRoZVEucVRhcmdldCxcclxuICAgICAgcXVlc3Rpb246IHRoZVEucHJvbXB0VGV4dCxcclxuICAgICAgc2VsZWN0ZWRfYW5zd2VyOiBhbnMuYW5zd2VyTmFtZSxcclxuICAgICAgaXNjb3JyZWN0OiB0aGlzLmlzQW5zd2VyQ29ycmVjdChhbnN3ZXIpLFxyXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgICBidWNrZXQ6IGJ1Y2tldCxcclxuICAgIH0pXHJcblxyXG4gIH1cclxuICBwcml2YXRlIGlzQW5zd2VyQ29ycmVjdChhbnN3ZXI6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFF1ZXN0aW9uLmFuc3dlcnNbYW5zd2VyIC0gMV0uYW5zd2VyTmFtZSA9PSB0aGlzLmN1cnJlbnRRdWVzdGlvbi5jb3JyZWN0KSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHVwZGF0ZUZlZWRiYWNrQWZ0ZXJBbnN3ZXIoYW5zd2VyOiBudW1iZXIpIHtcclxuICAgIGlmIChcclxuICAgICAgdGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiZcclxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50IDwgdGhpcy5NQVhfU1RBUlNfQ09VTlRfSU5fTElORUFSX01PREVcclxuICAgICkge1xyXG4gICAgICBVSUNvbnRyb2xsZXIuQWRkU3RhcigpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcbiAgICAgIFVJQ29udHJvbGxlci5BZGRTdGFyKCk7XHJcbiAgICB9XHJcbiAgICBVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tWaXNpYmlsZShcclxuICAgICAgdHJ1ZSxcclxuICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb24uYW5zd2Vyc1thbnN3ZXIgLSAxXS5hbnN3ZXJOYW1lID09IHRoaXMuY3VycmVudFF1ZXN0aW9uLmNvcnJlY3RcclxuICAgICk7XHJcbiAgfVxyXG4gIHByaXZhdGUgdXBkYXRlQ3VycmVudEJ1Y2tldFZhbHVlc0FmdGVyQW5zd2VyaW5nKGFuc3dlcjogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtVHJpZWQgKz0gMTtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbi5hbnN3ZXJzW2Fuc3dlciAtIDFdLmFuc3dlck5hbWUgPT0gdGhpcy5jdXJyZW50UXVlc3Rpb24uY29ycmVjdCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29ycmVjdCArPSAxO1xyXG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA9IDA7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBbnN3ZXJlZCBjb3JyZWN0bHknKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nICs9IDE7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBbnN3ZXJlZCBpbmNvcnJlY3RseSwgJyArIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHVibGljIG9uUXVlc3Rpb25FbmQgPSAoKSA9PiB7XHJcbiAgICBsZXQgcXVlc3Rpb25FbmRUaW1lb3V0ID0gdGhpcy5IYXNRdWVzdGlvbnNMZWZ0KClcclxuICAgICAgPyA1MDAgKiB0aGlzLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllclxyXG4gICAgICA6IDQwMDAgKiB0aGlzLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjtcclxuXHJcbiAgICBjb25zdCBlbmRPcGVyYXRpb25zID0gKCkgPT4ge1xyXG4gICAgICBVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tWaXNpYmlsZShmYWxzZSwgZmFsc2UpO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiZcclxuICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93blN0YXJzQ291bnQgPCB0aGlzLk1BWF9TVEFSU19DT1VOVF9JTl9MSU5FQVJfTU9ERVxyXG4gICAgICApIHtcclxuICAgICAgICBVSUNvbnRyb2xsZXIuQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcbiAgICAgICAgVUlDb250cm9sbGVyLkNoYW5nZVN0YXJJbWFnZUFmdGVyQW5pbWF0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuSGFzUXVlc3Rpb25zTGVmdCgpKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkICYmICF0aGlzLmlzQnVja2V0Q29udHJvbHNFbmFibGVkKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPCB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCsrO1xyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHJlc2V0IHRoZSB1c2VkIGl0ZW1zIGFycmF5IHdoZW4gd2UgbW92ZSB0byB0aGUgbmV4dCBxdWVzdGlvbiBpbiBsaW5lYXIgbW9kZVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zID0gW107XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA+PSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA8IHRoaXMuYnVja2V0cy5sZW5ndGhcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCsrO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA8IHRoaXMuYnVja2V0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICB0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBxdWVzdGlvbnMgbGVmdCcpO1xyXG4gICAgICAgICAgICAgIHRoaXMub25FbmQoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBxdWVzdGlvbnMgbGVmdCcpO1xyXG4gICAgICAgIHRoaXMub25FbmQoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDcmVhdGUgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlIHNwZWNpZmllZCB0aW1lb3V0XHJcbiAgICBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgcXVlc3Rpb25FbmRUaW1lb3V0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEV4ZWN1dGUgZW5kT3BlcmF0aW9ucyBhZnRlciB0aW1lb3V0UHJvbWlzZSByZXNvbHZlc1xyXG4gICAgdGltZW91dFByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgIGVuZE9wZXJhdGlvbnMoKTtcclxuXHJcbiAgICAgIC8vIENvbXBsZXRlZCBlbmQgb3BlcmF0aW9ucywgc2hvdWxkIHVwZGF0ZSBidWNrZXQgaW5mbyBpZiBpbiBkZXYgbW9kZVxyXG4gICAgICBpZiAodGhpcy5pc0luRGV2TW9kZSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIHB1YmxpYyBidWlsZE5ld1F1ZXN0aW9uID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuaXNMaW5lYXJBcnJheUV4aGF1c3RlZCgpKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRhcmdldEl0ZW0gPSB0aGlzLnNlbGVjdFRhcmdldEl0ZW0oKTtcclxuICAgIGNvbnN0IGZvaWxzID0gdGhpcy5nZW5lcmF0ZUZvaWxzKHRhcmdldEl0ZW0pO1xyXG4gICAgY29uc3QgYW5zd2VyT3B0aW9ucyA9IHRoaXMuc2h1ZmZsZUFuc3dlck9wdGlvbnMoW3RhcmdldEl0ZW0sIC4uLmZvaWxzXSk7XHJcblxyXG4gICAgY29uc3QgbmV3UXVlc3Rpb24gPSB0aGlzLmNyZWF0ZVF1ZXN0aW9uKHRhcmdldEl0ZW0sIGFuc3dlck9wdGlvbnMpO1xyXG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb24gPSBuZXdRdWVzdGlvbjtcclxuICAgIHRoaXMucXVlc3Rpb25OdW1iZXIgKz0gMTtcclxuXHJcbiAgICByZXR1cm4gbmV3UXVlc3Rpb247XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBpc0xpbmVhckFycmF5RXhoYXVzdGVkID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiZcclxuICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPj0gdGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcy5sZW5ndGhcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3RUYXJnZXRJdGVtID0gKCk6IGFueSA9PiB7XHJcbiAgICBsZXQgdGFyZ2V0SXRlbTtcclxuXHJcbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG4gICAgICB0YXJnZXRJdGVtID0gdGhpcy5zZWxlY3RSYW5kb21VbnVzZWRJdGVtKCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcbiAgICAgIHRhcmdldEl0ZW0gPSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zW3RoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4XTtcclxuICAgICAgdGhpcy5jdXJyZW50QnVja2V0LnVzZWRJdGVtcy5wdXNoKHRhcmdldEl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXRJdGVtO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0UmFuZG9tVW51c2VkSXRlbSA9ICgpOiBhbnkgPT4ge1xyXG4gICAgbGV0IGl0ZW07XHJcbiAgICBkbyB7XHJcbiAgICAgIGl0ZW0gPSByYW5kRnJvbSh0aGlzLmN1cnJlbnRCdWNrZXQuaXRlbXMpO1xyXG4gICAgfSB3aGlsZSAodGhpcy5jdXJyZW50QnVja2V0LnVzZWRJdGVtcy5pbmNsdWRlcyhpdGVtKSk7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnVzZWRJdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgcmV0dXJuIGl0ZW07XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZUZvaWxzID0gKHRhcmdldEl0ZW06IGFueSk6IGFueVtdID0+IHtcclxuICAgIGxldCBmb2lsMSwgZm9pbDIsIGZvaWwzO1xyXG5cclxuICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcbiAgICAgIGZvaWwxID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUZvaWwodGFyZ2V0SXRlbSk7XHJcbiAgICAgIGZvaWwyID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUZvaWwodGFyZ2V0SXRlbSwgZm9pbDEpO1xyXG4gICAgICBmb2lsMyA9IHRoaXMuZ2VuZXJhdGVSYW5kb21Gb2lsKHRhcmdldEl0ZW0sIGZvaWwxLCBmb2lsMik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcbiAgICAgIGZvaWwxID0gdGhpcy5nZW5lcmF0ZUxpbmVhckZvaWwodGFyZ2V0SXRlbSk7XHJcbiAgICAgIGZvaWwyID0gdGhpcy5nZW5lcmF0ZUxpbmVhckZvaWwodGFyZ2V0SXRlbSwgZm9pbDEpO1xyXG4gICAgICBmb2lsMyA9IHRoaXMuZ2VuZXJhdGVMaW5lYXJGb2lsKHRhcmdldEl0ZW0sIGZvaWwxLCBmb2lsMik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtmb2lsMSwgZm9pbDIsIGZvaWwzXTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGdlbmVyYXRlUmFuZG9tRm9pbCA9ICh0YXJnZXRJdGVtOiBhbnksIC4uLmV4aXN0aW5nRm9pbHM6IGFueVtdKTogYW55ID0+IHtcclxuICAgIGxldCBmb2lsO1xyXG4gICAgZG8ge1xyXG4gICAgICBmb2lsID0gcmFuZEZyb20odGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zKTtcclxuICAgIH0gd2hpbGUgKFt0YXJnZXRJdGVtLCAuLi5leGlzdGluZ0ZvaWxzXS5pbmNsdWRlcyhmb2lsKSk7XHJcbiAgICByZXR1cm4gZm9pbDtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGdlbmVyYXRlTGluZWFyRm9pbCA9ICh0YXJnZXRJdGVtOiBhbnksIC4uLmV4aXN0aW5nRm9pbHM6IGFueVtdKTogYW55ID0+IHtcclxuICAgIGxldCBmb2lsO1xyXG4gICAgZG8ge1xyXG4gICAgICBmb2lsID0gcmFuZEZyb20odGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcyk7XHJcbiAgICB9IHdoaWxlIChbdGFyZ2V0SXRlbSwgLi4uZXhpc3RpbmdGb2lsc10uaW5jbHVkZXMoZm9pbCkpO1xyXG4gICAgcmV0dXJuIGZvaWw7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBzaHVmZmxlQW5zd2VyT3B0aW9ucyA9IChvcHRpb25zOiBhbnlbXSk6IGFueVtdID0+IHtcclxuICAgIHNodWZmbGVBcnJheShvcHRpb25zKTtcclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlUXVlc3Rpb24gPSAodGFyZ2V0SXRlbTogYW55LCBhbnN3ZXJPcHRpb25zOiBhbnlbXSk6IGFueSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBxTmFtZTogYHF1ZXN0aW9uLSR7dGhpcy5xdWVzdGlvbk51bWJlcn0tJHt0YXJnZXRJdGVtLml0ZW1OYW1lfWAsXHJcbiAgICAgIHFOdW1iZXI6IHRoaXMucXVlc3Rpb25OdW1iZXIsXHJcbiAgICAgIHFUYXJnZXQ6IHRhcmdldEl0ZW0uaXRlbU5hbWUsXHJcbiAgICAgIHByb21wdFRleHQ6ICcnLFxyXG4gICAgICBidWNrZXQ6IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCxcclxuICAgICAgcHJvbXB0QXVkaW86IHRhcmdldEl0ZW0uaXRlbU5hbWUsXHJcbiAgICAgIGNvcnJlY3Q6IHRhcmdldEl0ZW0uaXRlbVRleHQsXHJcbiAgICAgIGFuc3dlcnM6IGFuc3dlck9wdGlvbnMubWFwKChvcHRpb24pID0+ICh7XHJcbiAgICAgICAgYW5zd2VyTmFtZTogb3B0aW9uLml0ZW1OYW1lLFxyXG4gICAgICAgIGFuc3dlclRleHQ6IG9wdGlvbi5pdGVtVGV4dCxcclxuICAgICAgfSkpLFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgdHJ5TW92ZUJ1Y2tldCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldFJhbmRvbUJTVChwYXNzZWQpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCkge1xyXG4gICAgICB0aGlzLnRyeU1vdmVCdWNrZXRMaW5lYXJBcnJheUJhc2VkKHBhc3NlZCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHRyeU1vdmVCdWNrZXRSYW5kb21CU1QgPSAocGFzc2VkOiBib29sZWFuKSA9PiB7XHJcbiAgICBjb25zdCBuZXdCdWNrZXQgPSB0aGlzLmN1cnJlbnROb2RlLnZhbHVlIGFzIGJ1Y2tldDtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gcGFzc2VkO1xyXG4gICAgICB0aGlzLmxvZ0J1Y2tldENvbXBsZXRlZEV2ZW50KHRoaXMuY3VycmVudEJ1Y2tldCwgcGFzc2VkKTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCduZXcgIGJ1Y2tldCBpcyAnICsgbmV3QnVja2V0LmJ1Y2tldElEKTtcclxuICAgIEF1ZGlvQ29udHJvbGxlci5QcmVsb2FkQnVja2V0KG5ld0J1Y2tldCwgdGhpcy5hcHAuR2V0RGF0YVVSTCgpKTtcclxuICAgIHRoaXMuaW5pdEJ1Y2tldChuZXdCdWNrZXQpO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyB0cnlNb3ZlQnVja2V0TGluZWFyQXJyYXlCYXNlZCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgIGNvbnN0IG5ld0J1Y2tldCA9IHRoaXMuYnVja2V0c1t0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleF07XHJcbiAgICBjb25zb2xlLmxvZygnTmV3IEJ1Y2tldDogJyArIG5ld0J1Y2tldC5idWNrZXRJRCk7XHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuUHJlbG9hZEJ1Y2tldChuZXdCdWNrZXQsIHRoaXMuYXBwLkdldERhdGFVUkwoKSk7XHJcbiAgICB0aGlzLmluaXRCdWNrZXQobmV3QnVja2V0KTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgSGFzUXVlc3Rpb25zTGVmdCA9ICgpID0+IHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc0xpbmVhclF1ZXN0aW9uc0xlZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0Lm51bUNvcnJlY3QgPj0gNCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVQYXNzZWRCdWNrZXQoKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50QnVja2V0Lm51bUNvbnNlY3V0aXZlV3JvbmcgPj0gMiB8fCB0aGlzLmN1cnJlbnRCdWNrZXQubnVtVHJpZWQgPj0gNSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVGYWlsZWRCdWNrZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGhhc0xpbmVhclF1ZXN0aW9uc0xlZnQgPSAoKTogYm9vbGVhbiA9PiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID49IHRoaXMuYnVja2V0cy5sZW5ndGggJiZcclxuICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPj0gdGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcy5sZW5ndGhcclxuICAgICkge1xyXG4gICAgICAvLyBObyBtb3JlIHF1ZXN0aW9ucyBsZWZ0XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlUGFzc2VkQnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ1Bhc3NlZCB0aGlzIGJ1Y2tldCAnICsgdGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEKTtcclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEID49IHRoaXMubnVtQnVja2V0cykge1xyXG4gICAgICAvLyBQYXNzZWQgdGhlIGhpZ2hlc3QgYnVja2V0XHJcbiAgICAgIHJldHVybiB0aGlzLnBhc3NIaWdoZXN0QnVja2V0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5tb3ZlVXBUb05leHRCdWNrZXQoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIGhhbmRsZUZhaWxlZEJ1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdGhpcyBidWNrZXQgJyArIHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCk7XHJcblxyXG4gICAgaWYgKHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCA8IHRoaXMuYmFzYWxCdWNrZXQpIHtcclxuICAgICAgdGhpcy5iYXNhbEJ1Y2tldCA9IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEIDw9IDEpIHtcclxuICAgICAgLy8gRmFpbGVkIHRoZSBsb3dlc3QgYnVja2V0XHJcbiAgICAgIHJldHVybiB0aGlzLmZhaWxMb3dlc3RCdWNrZXQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1vdmVEb3duVG9QcmV2aW91c0J1Y2tldCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcGFzc0hpZ2hlc3RCdWNrZXQgPSAoKTogYm9vbGVhbiA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnUGFzc2VkIGhpZ2hlc3QgYnVja2V0Jyk7XHJcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG4gICAgICB0aGlzLmxvZ0J1Y2tldENvbXBsZXRlZEV2ZW50KHRoaXMuY3VycmVudEJ1Y2tldCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgVUlDb250cm9sbGVyLlByb2dyZXNzQ2hlc3QoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIG1vdmVVcFRvTmV4dEJ1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnROb2RlLnJpZ2h0ICE9IG51bGwpIHtcclxuICAgICAgLy8gTW92ZSBkb3duIHRvIHRoZSByaWdodFxyXG4gICAgICBjb25zb2xlLmxvZygnTW92aW5nIHRvIHJpZ2h0IG5vZGUnKTtcclxuICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5jdXJyZW50Tm9kZS5yaWdodDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCsrO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldCh0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFJlYWNoZWQgcm9vdCBub2RlXHJcbiAgICAgIGNvbnNvbGUubG9nKCdSZWFjaGVkIHJvb3Qgbm9kZScpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcbiAgICAgICAgdGhpcy5sb2dCdWNrZXRDb21wbGV0ZWRFdmVudCh0aGlzLmN1cnJlbnRCdWNrZXQsIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBVSUNvbnRyb2xsZXIuUHJvZ3Jlc3NDaGVzdCgpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBmYWlsTG93ZXN0QnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ0ZhaWxlZCBsb3dlc3QgYnVja2V0ICEnKTtcclxuICAgIHRoaXMuY3VycmVudEJ1Y2tldC5wYXNzZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG4gICAgICB0aGlzLmxvZ0J1Y2tldENvbXBsZXRlZEV2ZW50KHRoaXMuY3VycmVudEJ1Y2tldCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIG1vdmVEb3duVG9QcmV2aW91c0J1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdNb3ZpbmcgZG93biBidWNrZXQgIScpO1xyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnROb2RlLmxlZnQgIT0gbnVsbCkge1xyXG4gICAgICAvLyBNb3ZlIGRvd24gdG8gdGhlIGxlZnRcclxuICAgICAgY29uc29sZS5sb2coJ01vdmluZyB0byBsZWZ0IG5vZGUnKTtcclxuICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5jdXJyZW50Tm9kZS5sZWZ0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4Kys7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFJlYWNoZWQgcm9vdCBub2RlXHJcbiAgICAgIGNvbnNvbGUubG9nKCdSZWFjaGVkIHJvb3Qgbm9kZSAhJyk7XHJcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5wYXNzZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcbiAgICAgICAgdGhpcy5sb2dCdWNrZXRDb21wbGV0ZWRFdmVudCh0aGlzLmN1cnJlbnRCdWNrZXQsIGZhbHNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH07XHJcbiAgcHJpdmF0ZSBsb2dCdWNrZXRDb21wbGV0ZWRFdmVudChidWNrZXQ6IGJ1Y2tldCwgcGFzc2VkOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmFuYWx5dGljc0ludGVncmF0aW9uLnRyYWNrKEFuYWx5dGljc0V2ZW50c1R5cGUuQlVDS0VUX0NPTVBMRVRFRCwge1xyXG4gICAgICB0eXBlOiAnYnVja2V0Q29tcGxldGVkJyxcclxuICAgICAgYnVja2V0TnVtYmVyOiBidWNrZXQuYnVja2V0SUQsXHJcbiAgICAgIG51bWJlclRyaWVkSW5CdWNrZXQ6IGJ1Y2tldC5udW1UcmllZCxcclxuICAgICAgbnVtYmVyQ29ycmVjdEluQnVja2V0OiBidWNrZXQubnVtQ29ycmVjdCxcclxuICAgICAgcGFzc2VkQnVja2V0OiBwYXNzZWQsXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG92ZXJyaWRlIG9uRW5kKCk6IHZvaWQge1xyXG4gICAgdGhpcy5Mb2dDb21wbGV0ZWRFdmVudCh0aGlzLmJ1Y2tldHMsIHRoaXMuYmFzYWxCdWNrZXQsIHRoaXMuY2VpbGluZ0J1Y2tldCk7XHJcbiAgICBVSUNvbnRyb2xsZXIuU2hvd0VuZCgpO1xyXG4gICAgdGhpcy5hcHAudW5pdHlCcmlkZ2UuU2VuZENsb3NlKCk7XHJcbiAgfVxyXG4gIHByaXZhdGUgTG9nQ29tcGxldGVkRXZlbnQoYnVja2V0czogYnVja2V0W10gPSBudWxsLCBiYXNhbEJ1Y2tldDogbnVtYmVyLCBjZWlsaW5nQnVja2V0OiBudW1iZXIpIHtcclxuICAgIGxldCBiYXNhbEJ1Y2tldElEID0gZ2V0QmFzYWxCdWNrZXRJRChidWNrZXRzKTtcclxuICAgIGxldCBjZWlsaW5nQnVja2V0SUQgPSBnZXRDZWlsaW5nQnVja2V0SUQoYnVja2V0cyk7XHJcbiAgICBpZiAoYmFzYWxCdWNrZXRJRCA9PSAwKSB7XHJcbiAgICAgIGJhc2FsQnVja2V0SUQgPSBjZWlsaW5nQnVja2V0SUQ7XHJcbiAgICB9XHJcbiAgICBsZXQgc2NvcmUgPSBjYWxjdWxhdGVTY29yZShidWNrZXRzLCBiYXNhbEJ1Y2tldElEKTtcclxuICAgIGxldCBuZXh0QXNzZXNzbWVudCA9IGdldE5leHRBc3Nlc3NtZW50KCk7XHJcbiAgICBsZXQgcmVxdWlyZWRTY29yZSA9IGdldFJlcXVpcmVkU2NvcmUoKTtcclxuICAgIGxldCBpc1N5bmFwc2VVc2VyID0gZmFsc2U7XHJcbiAgICBsZXQgaW50ZWdlclJlcXVpcmVkU2NvcmUgPSAwO1xyXG4gICAgaWYgKG5leHRBc3Nlc3NtZW50ID09PSAnbnVsbCcgJiYgcmVxdWlyZWRTY29yZSA9PT0gJ251bGwnKSB7XHJcbiAgICAgIGlzU3luYXBzZVVzZXIgPSB0cnVlO1xyXG4gICAgICBpbnRlZ2VyUmVxdWlyZWRTY29yZSA9IDA7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChOdW1iZXIocmVxdWlyZWRTY29yZSkgPj0gc2NvcmUgJiYgTnVtYmVyKHJlcXVpcmVkU2NvcmUpICE9IDApIHtcclxuICAgICAgaXNTeW5hcHNlVXNlciA9IHRydWU7XHJcbiAgICAgIGludGVnZXJSZXF1aXJlZFNjb3JlID0gTnVtYmVyKHJlcXVpcmVkU2NvcmUpO1xyXG4gICAgICBuZXh0QXNzZXNzbWVudCA9ICdudWxsJztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKE51bWJlcihyZXF1aXJlZFNjb3JlKSA8IHNjb3JlICYmIE51bWJlcihyZXF1aXJlZFNjb3JlKSAhPSAwKSB7XHJcbiAgICAgIGlzU3luYXBzZVVzZXIgPSB0cnVlO1xyXG4gICAgICBpbnRlZ2VyUmVxdWlyZWRTY29yZSA9IE51bWJlcihyZXF1aXJlZFNjb3JlKTtcclxuICAgIH1cclxuICAgIHRoaXMuYW5hbHl0aWNzSW50ZWdyYXRpb24uc2VuZERhdGFUb1RoaXJkUGFydHkoc2NvcmUsIHRoaXMuY29tbW9uUHJvcGVydGllcy5jcl91c2VyX2lkLCBpbnRlZ2VyUmVxdWlyZWRTY29yZSwgbmV4dEFzc2Vzc21lbnQsIHRoaXMuY29tbW9uUHJvcGVydGllcy5hcHApO1xyXG4gICAgaWYgKHdpbmRvdy5wYXJlbnQpIHtcclxuICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnYXNzZXNzbWVudF9jb21wbGV0ZWQnLFxyXG4gICAgICAgICAgc2NvcmU6IHNjb3JlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ2h0dHBzOi8vc3luYXBzZS5jdXJpb3VzY29udGVudC5vcmcvJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hbmFseXRpY3NJbnRlZ3JhdGlvbi50cmFjayhBbmFseXRpY3NFdmVudHNUeXBlLkNPTVBMRVRFRCwge1xyXG4gICAgICB0eXBlOiAnY29tcGxldGVkJyxcclxuICAgICAgc2NvcmU6IHNjb3JlLFxyXG4gICAgICBtYXhTY29yZTogYnVja2V0cy5sZW5ndGggKiAxMDAsXHJcbiAgICAgIGJhc2FsQnVja2V0OiBiYXNhbEJ1Y2tldElELFxyXG4gICAgICBjZWlsaW5nQnVja2V0OiBjZWlsaW5nQnVja2V0SUQsXHJcbiAgICAgIC4uLihpc1N5bmFwc2VVc2VyICYmIHtcclxuICAgICAgICBuZXh0QXNzZXNzbWVudDogbmV4dEFzc2Vzc21lbnQsXHJcbiAgICAgICAgcmVxdWlyZWRTY29yZTogaW50ZWdlclJlcXVpcmVkU2NvcmVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuaW1wb3J0IHsgQW5hbHl0aWNzRXZlbnRzIH0gZnJvbSAnLi9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzJztcclxuaW1wb3J0IHsgVUlDb250cm9sbGVyIH0gZnJvbSAnLi91aS91aUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vdXRpbHMvdW5pdHlCcmlkZ2UnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VRdWl6IHtcclxuICBwcm90ZWN0ZWQgYXBwOiBBcHA7XHJcbiAgcHVibGljIGRhdGFVUkw6IHN0cmluZztcclxuICBwdWJsaWMgdW5pdHlCcmlkZ2U6IFVuaXR5QnJpZGdlO1xyXG5cclxuICBwdWJsaWMgZGV2TW9kZUF2YWlsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc0luRGV2TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgaXNDb3JyZWN0TGFiZWxTaG93bjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc0J1Y2tldEluZm9TaG93bjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc0J1Y2tldENvbnRyb2xzRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBhbmltYXRpb25TcGVlZE11bHRpcGxpZXI6IG51bWJlciA9IDE7XHJcblxyXG4gIHB1YmxpYyBkZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVySWQ6IHN0cmluZyA9ICdkZXZNb2RlTW9kYWxUb2dnbGVCdXR0b25Db250YWluZXInO1xyXG4gIHB1YmxpYyBkZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHVibGljIGRldk1vZGVUb2dnbGVCdXR0b25JZDogc3RyaW5nID0gJ2Rldk1vZGVNb2RhbFRvZ2dsZUJ1dHRvbic7XHJcbiAgcHVibGljIGRldk1vZGVUb2dnbGVCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICBwdWJsaWMgZGV2TW9kZU1vZGFsSWQ6IHN0cmluZyA9ICdkZXZNb2RlU2V0dGluZ3NNb2RhbCc7XHJcbiAgcHVibGljIGRldk1vZGVTZXR0aW5nc01vZGFsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHVibGljIGRldk1vZGVCdWNrZXRHZW5TZWxlY3RJZDogc3RyaW5nID0gJ2Rldk1vZGVCdWNrZXRHZW5TZWxlY3QnO1xyXG4gIHB1YmxpYyBkZXZNb2RlQnVja2V0R2VuU2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudDtcclxuXHJcbiAgcHVibGljIGRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94SWQ6IHN0cmluZyA9ICdkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveCc7XHJcbiAgcHVibGljIGRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94SWQ6IHN0cmluZyA9ICdkZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3gnO1xyXG4gIHB1YmxpYyBkZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgcHVibGljIGRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVySWQ6IHN0cmluZyA9ICdkZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lcic7XHJcbiAgcHVibGljIGRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHVibGljIGRldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3hJZDogc3RyaW5nID0gJ2Rldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3gnO1xyXG4gIHB1YmxpYyBkZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICBwdWJsaWMgZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlSWQ6IHN0cmluZyA9ICdkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UnO1xyXG4gIHB1YmxpYyBkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2U6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gIHB1YmxpYyBkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWVJZDogc3RyaW5nID0gJ2Rldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZSc7XHJcbiAgcHVibGljIGRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pc0luRGV2TW9kZSA9XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCdsb2NhbGhvc3QnKSB8fFxyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnMTI3LjAuMC4xJykgfHxcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2Fzc2Vzc21lbnRkZXYnKTtcclxuICAgIHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lcklkKTtcclxuICAgIHRoaXMuZGV2TW9kZVNldHRpbmdzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVNb2RhbElkKTtcclxuXHJcbiAgICAvLyB0aGlzLmRldk1vZGVTZXR0aW5nc01vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgIC8vIFx0Ly8gQHRzLWlnbm9yZVxyXG4gICAgLy8gXHRjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgIC8vIFx0aWYgKGlkID09IHRoaXMuZGV2TW9kZU1vZGFsSWQpIHtcclxuICAgIC8vIFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vIFx0XHR0aGlzLnRvZ2dsZURldk1vZGVNb2RhbCgpO1xyXG4gICAgLy8gXHR9XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRHZW5TZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVCdWNrZXRHZW5TZWxlY3RJZCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRHZW5TZWxlY3Qub25jaGFuZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgICAgdGhpcy5oYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlKGV2ZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uSWQpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uLm9uY2xpY2sgPSB0aGlzLnRvZ2dsZURldk1vZGVNb2RhbDtcclxuXHJcbiAgICB0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3hJZFxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveC5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgdGhpcy5pc0NvcnJlY3RMYWJlbFNob3duID0gdGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveC5jaGVja2VkO1xyXG4gICAgICB0aGlzLmhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94SWRcclxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94Lm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmlzQnVja2V0SW5mb1Nob3duID0gdGhpcy5kZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3guY2hlY2tlZDtcclxuICAgICAgdGhpcy5kZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gdGhpcy5pc0J1Y2tldEluZm9TaG93biA/ICdibG9jaycgOiAnbm9uZSc7XHJcbiAgICAgIHRoaXMuaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICB0aGlzLmRldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3hJZFxyXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94Lm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmlzQnVja2V0Q29udHJvbHNFbmFibGVkID0gdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94LmNoZWNrZWQ7XHJcbiAgICAgIHRoaXMuaGFuZGxlQnVja2V0Q29udHJvbHNTaG93bkNoYW5nZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lcklkKTtcclxuXHJcbiAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZUlkXHJcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZUlkKTtcclxuXHJcbiAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSBwYXJzZUZsb2F0KHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlLnZhbHVlKTtcclxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyIDwgMC4yKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSAwLjI7XHJcbiAgICAgICAgdGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UudmFsdWUgPSAnMC4yJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWUuaW5uZXJUZXh0ID0gdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5oYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzSW5EZXZNb2RlKSB7XHJcbiAgICAgIHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgdGhlIGFuaW1hdGlvbiBzcGVlZCBtdWx0aXBsaWVyIHZhbHVlIGFuZCBwb3NpdGlvblxyXG4gICAgdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSBwYXJzZUZsb2F0KHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlLnZhbHVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBoaWRlRGV2TW9kZUJ1dHRvbigpIHtcclxuICAgIHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFic3RyYWN0IGhhbmRsZUJ1Y2tldEdlbk1vZGVDaGFuZ2UoZXZlbnQ6IEV2ZW50KTogdm9pZDtcclxuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQ29ycmVjdExhYmVsU2hvd25DaGFuZ2UoKTogdm9pZDtcclxuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlKCk6IHZvaWQ7XHJcbiAgcHVibGljIGFic3RyYWN0IGhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UoKTogdm9pZDtcclxuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyQ2hhbmdlKCk6IHZvaWQ7XHJcblxyXG4gIHB1YmxpYyB0b2dnbGVEZXZNb2RlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID09ICdibG9jaycpIHtcclxuICAgICAgdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwdWJsaWMgYWJzdHJhY3QgUnVuKGFwcGxpbms6IEFwcCk6IHZvaWQ7XHJcbiAgcHVibGljIGFic3RyYWN0IGhhbmRsZUFuc3dlckJ1dHRvblByZXNzKGFuczogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIpOiB2b2lkO1xyXG4gIHB1YmxpYyBhYnN0cmFjdCBIYXNRdWVzdGlvbnNMZWZ0KCk6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyBvbkVuZCgpOiB2b2lkIHtcclxuICAgIC8vIHNlbmRGaW5pc2hlZCgpO1xyXG4gICAgVUlDb250cm9sbGVyLlNob3dFbmQoKTtcclxuICAgIHRoaXMuYXBwLnVuaXR5QnJpZGdlLlNlbmRDbG9zZSgpO1xyXG4gIH1cclxufVxyXG4iLCIvL2NvZGUgZm9yIGxvYWRpbmcgYXVkaW9zXHJcblxyXG5pbXBvcnQgeyBxRGF0YSB9IGZyb20gJy4vcXVlc3Rpb25EYXRhJztcclxuaW1wb3J0IHsgYnVja2V0LCBidWNrZXRJdGVtIH0gZnJvbSAnLi4vYXNzZXNzbWVudC9idWNrZXREYXRhJztcclxuaW1wb3J0IHsgZ2V0Q2FzZUluZGVwZW5kZW50TGFuZ0xpc3QgfSBmcm9tICcuLi91dGlscy9qc29uVXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1ZGlvQ29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEF1ZGlvQ29udHJvbGxlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICBwdWJsaWMgaW1hZ2VUb0NhY2hlOiBzdHJpbmdbXSA9IFtdO1xyXG4gIHB1YmxpYyB3YXZUb0NhY2hlOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwdWJsaWMgYWxsQXVkaW9zOiBhbnkgPSB7fTtcclxuICBwdWJsaWMgYWxsSW1hZ2VzOiBhbnkgPSB7fTtcclxuICBwdWJsaWMgZGF0YVVSTDogc3RyaW5nID0gJyc7XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFNvdW5kUGF0aCA9ICdkaXN0L2F1ZGlvL0NvcnJlY3Qud2F2JztcclxuXHJcbiAgcHJpdmF0ZSBmZWVkYmFja0F1ZGlvOiBhbnkgPSBudWxsO1xyXG4gIHByaXZhdGUgY29ycmVjdEF1ZGlvOiBhbnkgPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmZlZWRiYWNrQXVkaW8gPSBuZXcgQXVkaW8oKTtcclxuICAgIHRoaXMuZmVlZGJhY2tBdWRpby5zcmMgPSB0aGlzLmNvcnJlY3RTb3VuZFBhdGg7XHJcbiAgICB0aGlzLmNvcnJlY3RBdWRpbyA9IG5ldyBBdWRpbygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBQcmVwYXJlQXVkaW9BbmRJbWFnZXNGb3JTdXJ2ZXkocXVlc3Rpb25zRGF0YTogcURhdGFbXSwgZGF0YVVSTDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMID0gZGF0YVVSTDtcclxuICAgIGNvbnN0IGZlZWRiYWNrU291bmRQYXRoID0gJ2F1ZGlvLycgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgJy9hbnN3ZXJfZmVlZGJhY2subXAzJztcclxuXHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS53YXZUb0NhY2hlLnB1c2goZmVlZGJhY2tTb3VuZFBhdGgpO1xyXG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuY29ycmVjdEF1ZGlvLnNyYyA9IGZlZWRiYWNrU291bmRQYXRoO1xyXG5cclxuICAgIGZvciAodmFyIHF1ZXN0aW9uSW5kZXggaW4gcXVlc3Rpb25zRGF0YSkge1xyXG4gICAgICBsZXQgcXVlc3Rpb25EYXRhID0gcXVlc3Rpb25zRGF0YVtxdWVzdGlvbkluZGV4XTtcclxuICAgICAgaWYgKHF1ZXN0aW9uRGF0YS5wcm9tcHRBdWRpbyAhPSBudWxsKSB7XHJcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLkZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MocXVlc3Rpb25EYXRhLnByb21wdEF1ZGlvLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocXVlc3Rpb25EYXRhLnByb21wdEltZyAhPSBudWxsKSB7XHJcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLkFkZEltYWdlVG9BbGxJbWFnZXMocXVlc3Rpb25EYXRhLnByb21wdEltZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAodmFyIGFuc3dlckluZGV4IGluIHF1ZXN0aW9uRGF0YS5hbnN3ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFuc3dlckRhdGEgPSBxdWVzdGlvbkRhdGEuYW5zd2Vyc1thbnN3ZXJJbmRleF07XHJcbiAgICAgICAgaWYgKGFuc3dlckRhdGEuYW5zd2VySW1nICE9IG51bGwpIHtcclxuICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5BZGRJbWFnZVRvQWxsSW1hZ2VzKGFuc3dlckRhdGEuYW5zd2VySW1nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEF1ZGlvcyk7XHJcbiAgICBjb25zb2xlLmxvZyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxJbWFnZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBBZGRJbWFnZVRvQWxsSW1hZ2VzKG5ld0ltYWdlVVJMOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKCdBZGQgaW1hZ2U6ICcgKyBuZXdJbWFnZVVSTCk7XHJcbiAgICBsZXQgbmV3SW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIG5ld0ltYWdlLnNyYyA9IG5ld0ltYWdlVVJMO1xyXG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsSW1hZ2VzW25ld0ltYWdlVVJMXSA9IG5ld0ltYWdlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBGaWx0ZXJBbmRBZGRBdWRpb1RvQWxsQXVkaW9zKG5ld0F1ZGlvVVJMOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKCdBZGRpbmcgYXVkaW86ICcgKyBuZXdBdWRpb1VSTCk7XHJcbiAgICBpZiAobmV3QXVkaW9VUkwuaW5jbHVkZXMoJy53YXYnKSkge1xyXG4gICAgICBuZXdBdWRpb1VSTCA9IG5ld0F1ZGlvVVJMLnJlcGxhY2UoJy53YXYnLCAnLm1wMycpO1xyXG4gICAgfSBlbHNlIGlmIChuZXdBdWRpb1VSTC5pbmNsdWRlcygnLm1wMycpKSB7XHJcbiAgICAgIC8vIEFscmVhZHkgY29udGFpbnMgLm1wMyBub3QgZG9pbmcgYW55dGhpbmdcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0F1ZGlvVVJMID0gbmV3QXVkaW9VUkwudHJpbSgpICsgJy5tcDMnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdGaWx0ZXJlZDogJyArIG5ld0F1ZGlvVVJMKTtcclxuXHJcbiAgICBsZXQgbmV3QXVkaW8gPSBuZXcgQXVkaW8oKTtcclxuICAgIGlmIChnZXRDYXNlSW5kZXBlbmRlbnRMYW5nTGlzdCgpLmluY2x1ZGVzKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwuc3BsaXQoJy0nKVswXSkpIHtcclxuICAgICAgbmV3QXVkaW8uc3JjID0gJ2F1ZGlvLycgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgJy8nICsgbmV3QXVkaW9VUkw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdBdWRpby5zcmMgPSAnYXVkaW8vJyArIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgKyAnLycgKyBuZXdBdWRpb1VSTDtcclxuICAgIH1cclxuXHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxBdWRpb3NbbmV3QXVkaW9VUkxdID0gbmV3QXVkaW87XHJcblxyXG4gICAgY29uc29sZS5sb2cobmV3QXVkaW8uc3JjKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgUHJlbG9hZEJ1Y2tldChuZXdCdWNrZXQ6IGJ1Y2tldCwgZGF0YVVSTCkge1xyXG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCA9IGRhdGFVUkw7XHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb3JyZWN0QXVkaW8uc3JjID1cclxuICAgICAgJ2F1ZGlvLycgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgJy9hbnN3ZXJfZmVlZGJhY2subXAzJztcclxuICAgIGZvciAodmFyIGl0ZW1JbmRleCBpbiBuZXdCdWNrZXQuaXRlbXMpIHtcclxuICAgICAgdmFyIGl0ZW0gPSBuZXdCdWNrZXQuaXRlbXNbaXRlbUluZGV4XTtcclxuICAgICAgQXVkaW9Db250cm9sbGVyLkZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MoaXRlbS5pdGVtTmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgUGxheUF1ZGlvKGF1ZGlvTmFtZTogc3RyaW5nLCBmaW5pc2hlZENhbGxiYWNrPzogRnVuY3Rpb24sIGF1ZGlvQW5pbT86IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICBhdWRpb05hbWUgPSBhdWRpb05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gcGxheSAnICsgYXVkaW9OYW1lKTtcclxuICAgIGlmIChhdWRpb05hbWUuaW5jbHVkZXMoJy5tcDMnKSkge1xyXG4gICAgICBpZiAoYXVkaW9OYW1lLnNsaWNlKC00KSAhPSAnLm1wMycpIHtcclxuICAgICAgICBhdWRpb05hbWUgPSBhdWRpb05hbWUudHJpbSgpICsgJy5tcDMnO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhdWRpb05hbWUgPSBhdWRpb05hbWUudHJpbSgpICsgJy5tcDMnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdQcmUgcGxheSBhbGwgYXVkaW9zOiAnKTtcclxuICAgIGNvbnNvbGUubG9nKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEF1ZGlvcyk7XHJcblxyXG4gICAgY29uc3QgcGxheVByb21pc2UgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGF1ZGlvID0gQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsQXVkaW9zW2F1ZGlvTmFtZV07XHJcbiAgICAgIGlmIChhdWRpbykge1xyXG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XHJcbiAgICAgICAgICB0eXBlb2YgYXVkaW9BbmltICE9PSAndW5kZWZpbmVkJyA/IGF1ZGlvQW5pbSh0cnVlKSA6IG51bGw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgdHlwZW9mIGF1ZGlvQW5pbSAhPT0gJ3VuZGVmaW5lZCcgPyBhdWRpb0FuaW0oZmFsc2UpIDogbnVsbDtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYXVkaW8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcGxheWluZyBhdWRpbzonLCBlcnJvcik7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdBdWRpbyBmaWxlIG5vdCBmb3VuZDonLCBhdWRpb05hbWUpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGxheVByb21pc2VcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHR5cGVvZiBmaW5pc2hlZENhbGxiYWNrICE9PSAndW5kZWZpbmVkJyA/IGZpbmlzaGVkQ2FsbGJhY2soKSA6IG51bGw7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdQcm9taXNlIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIEdldEltYWdlKGltYWdlTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgIHJldHVybiBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxJbWFnZXNbaW1hZ2VOYW1lXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgUGxheURpbmcoKTogdm9pZCB7XHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0F1ZGlvLnBsYXkoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgUGxheUNvcnJlY3QoKTogdm9pZCB7XHJcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb3JyZWN0QXVkaW8ucGxheSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBdWRpb0NvbnRyb2xsZXIge1xyXG4gICAgaWYgKEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgIEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZSA9IG5ldyBBdWRpb0NvbnRyb2xsZXIoKTtcclxuICAgICAgQXVkaW9Db250cm9sbGVyLmluc3RhbmNlLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gQXVkaW9Db250cm9sbGVyLmluc3RhbmNlO1xyXG4gIH1cclxufVxyXG4iLCIvLyBJbnRlcmZhY2UgdGhhdCBnZXRzIHBhc3NlZCBhcm91bmQgdGhlIGFwcCBjb21wb25lbnRzIHRvIGdhdGhlciBhbGwgcmVxdXJpZWQgcmVzb3VyY2VzXHJcbi8vIGFuZCB0aGF0IGdldHMgc2VudCB0byB0aGUgc2VydmljZSB3b3JrZXIgZm9yIGNhY2hpbmdcclxuXHJcbmludGVyZmFjZSBJQ2FjaGVNb2RlbCB7XHJcbiAgYXBwTmFtZTogc3RyaW5nO1xyXG4gIGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nO1xyXG4gIGF1ZGlvVmlzdWFsUmVzb3VyY2VzOiBTZXQ8c3RyaW5nPjtcclxufVxyXG5cclxuY2xhc3MgQ2FjaGVNb2RlbCBpbXBsZW1lbnRzIElDYWNoZU1vZGVsIHtcclxuICBhcHBOYW1lOiBzdHJpbmc7XHJcbiAgY29udGVudEZpbGVQYXRoOiBzdHJpbmc7XHJcbiAgYXVkaW9WaXN1YWxSZXNvdXJjZXM6IFNldDxzdHJpbmc+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGFwcE5hbWU6IHN0cmluZyxcclxuICAgIGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nLFxyXG4gICAgYXVkaW9WaXN1YWxSZXNvdXJjZXM6IFNldDxzdHJpbmc+XHJcbiAgKSB7XHJcbiAgICB0aGlzLmFwcE5hbWUgPSBhcHBOYW1lO1xyXG4gICAgdGhpcy5jb250ZW50RmlsZVBhdGggPSBjb250ZW50RmlsZVBhdGg7XHJcbiAgICB0aGlzLmF1ZGlvVmlzdWFsUmVzb3VyY2VzID0gYXVkaW9WaXN1YWxSZXNvdXJjZXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0QXBwTmFtZShhcHBOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYXBwTmFtZSA9IGFwcE5hbWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0Q29udGVudEZpbGVQYXRoKGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmNvbnRlbnRGaWxlUGF0aCA9IGNvbnRlbnRGaWxlUGF0aDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRBdWRpb1Zpc3VhbFJlc291cmNlcyhhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz4pIHtcclxuICAgIHRoaXMuYXVkaW9WaXN1YWxSZXNvdXJjZXMgPSBhdWRpb1Zpc3VhbFJlc291cmNlcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRJdGVtVG9BdWRpb1Zpc3VhbFJlc291cmNlcyhpdGVtOiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcy5oYXMoaXRlbSkpIHtcclxuICAgICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcy5hZGQoaXRlbSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYWNoZU1vZGVsO1xyXG4iLCJpbXBvcnQgeyBidWNrZXQgfSBmcm9tICcuLi9hc3Nlc3NtZW50L2J1Y2tldERhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIHtcclxuICB2YWx1ZTogbnVtYmVyIHwgYnVja2V0O1xyXG4gIGxlZnQ6IFRyZWVOb2RlIHwgbnVsbDtcclxuICByaWdodDogVHJlZU5vZGUgfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xyXG4gICAgdGhpcy5yaWdodCA9IG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG4vKiogR2VuZXJhdGVzIGEgcmFuZG9tIGJpbmFyeSBzZWFyY2ggdHJlZSBmcm9tIGFcclxuIC0gSWYgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kaWNlcyBhcmUgdGhlIHNhbWUsIHRoZSBmdW5jdGlvbiByZXR1cm5zIG51bGxcclxuIC0gSWYgdGhlIG1pZGRsZSBpbmRleCBpcyBldmVuLCB0aGUgZnVuY3Rpb24gdXNlcyB0aGUgZXhhY3QgbWlkZGxlIHBvaW50XHJcbiAtIE90aGVyd2lzZSwgdGhlIGZ1bmN0aW9uIHJhbmRvbWx5IGFkZHMgMCBvciAxIHRvIHRoZSBtaWRkbGUgaW5kZXhcclxuIC0gUmV0dXJucyB0aGUgcm9vdCBub2RlIG9mIHRoZSBnZW5lcmF0ZWQgYmluYXJ5IHNlYXJjaCB0cmVlIHdoaWNoIGNvbnRhaW5zIHRoZSBidWNrZXRJZHMgaWYgY2FsbGVkIHByb3Blcmx5XHJcbiAtIGV4OiBsZXQgcm9vdE9mSWRzID0gc29ydGVkQXJyYXlUb0JTVCh0aGlzLmJ1Y2tldHMsIHRoaXMuYnVja2V0c1swXS5idWNrZXRJRCAtIDEsIHRoaXMuYnVja2V0c1t0aGlzLmJ1Y2tldHMubGVuZ3RoIC0gMV0uYnVja2V0SUQsIHVzZWRJbmRpY2VzKTtcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzb3J0ZWRBcnJheVRvSURzQlNUKHN0YXJ0LCBlbmQsIHVzZWRJbmRpY2VzKSB7XHJcbiAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgLy8gUmFuZG9taXplIG1pZGRsZSBwb2ludCB3aXRoaW4gdW51c2VkIGluZGljZXNcclxuICBsZXQgbWlkO1xyXG5cclxuICBpZiAoKHN0YXJ0ICsgZW5kKSAlIDIgPT09IDAgJiYgdXNlZEluZGljZXMuc2l6ZSAhPT0gMSkge1xyXG4gICAgbWlkID0gTWF0aC5mbG9vcigoc3RhcnQgKyBlbmQpIC8gMik7IC8vIFVzZSB0aGUgZXhhY3QgbWlkZGxlIHBvaW50XHJcbiAgICBpZiAobWlkID09PSAwKSByZXR1cm4gbnVsbDtcclxuICB9IGVsc2Uge1xyXG4gICAgZG8ge1xyXG4gICAgICBtaWQgPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTtcclxuICAgICAgbWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpOyAvLyBSYW5kb21seSBhZGQgMCBvciAxIHRvIG1pZFxyXG4gICAgfSB3aGlsZSAobWlkID4gZW5kIHx8IHVzZWRJbmRpY2VzLmhhcyhtaWQpKTtcclxuICB9XHJcblxyXG4gIHVzZWRJbmRpY2VzLmFkZChtaWQpO1xyXG5cclxuICBsZXQgbm9kZSA9IG5ldyBUcmVlTm9kZShtaWQpO1xyXG5cclxuICBub2RlLmxlZnQgPSBzb3J0ZWRBcnJheVRvSURzQlNUKHN0YXJ0LCBtaWQgLSAxLCB1c2VkSW5kaWNlcyk7XHJcbiAgbm9kZS5yaWdodCA9IHNvcnRlZEFycmF5VG9JRHNCU1QobWlkICsgMSwgZW5kLCB1c2VkSW5kaWNlcyk7XHJcblxyXG4gIHJldHVybiBub2RlO1xyXG59XHJcbiIsIi8vdGhpcyBpcyB3aGVyZSB0aGUgY29kZSB3aWxsIGdvIGZvciBsaW5lYXJseSBpdGVyYXRpbmcgdGhyb3VnaCB0aGVcclxuLy9xdWVzdGlvbnMgaW4gYSBkYXRhLmpzb24gZmlsZSB0aGF0IGlkZW50aWZpZXMgaXRzZWxmIGFzIGEgc3VydmV5XHJcblxyXG5pbXBvcnQgeyBVSUNvbnRyb2xsZXIgfSBmcm9tICcuLi91aS91aUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IHFEYXRhLCBhbnN3ZXJEYXRhIH0gZnJvbSAnLi4vY29tcG9uZW50cy9xdWVzdGlvbkRhdGEnO1xyXG5pbXBvcnQgeyBBbmFseXRpY3NFdmVudHMgfSBmcm9tICcuLi9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzJztcclxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi4vQXBwJztcclxuaW1wb3J0IHsgQmFzZVF1aXogfSBmcm9tICcuLi9iYXNlUXVpeic7XHJcbmltcG9ydCB7IGZldGNoU3VydmV5UXVlc3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvanNvblV0aWxzJztcclxuaW1wb3J0IHsgVW5pdHlCcmlkZ2UgfSBmcm9tICcuLi91dGlscy91bml0eUJyaWRnZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5IGV4dGVuZHMgQmFzZVF1aXoge1xyXG4gIHB1YmxpYyBxdWVzdGlvbnNEYXRhOiBxRGF0YVtdO1xyXG4gIHB1YmxpYyBjdXJyZW50UXVlc3Rpb25JbmRleDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhVVJMOiBzdHJpbmcsIHVuaXR5QnJpZGdlKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgY29uc29sZS5sb2coJ1N1cnZleSBpbml0aWFsaXplZCcpO1xyXG5cclxuICAgIHRoaXMuZGF0YVVSTCA9IGRhdGFVUkw7XHJcbiAgICB0aGlzLnVuaXR5QnJpZGdlID0gdW5pdHlCcmlkZ2U7XHJcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gMDtcclxuICAgIFVJQ29udHJvbGxlci5TZXRCdXR0b25QcmVzc0FjdGlvbih0aGlzLmhhbmRsZUFuc3dlckJ1dHRvblByZXNzKTtcclxuICAgIFVJQ29udHJvbGxlci5TZXRTdGFydEFjdGlvbih0aGlzLnN0YXJ0U3VydmV5KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZygnQW5pbWF0aW9uIFNwZWVkIE11bHRpcGxpZXIgQ2hhbmdlZCcpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhbmRsZUJ1Y2tldEdlbk1vZGVDaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnQnVja2V0IEdlbiBNb2RlIENoYW5nZWQnKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgaGFuZGxlQ29ycmVjdExhYmVsU2hvd25DaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnQ29ycmVjdCBMYWJlbCBTaG93biBDaGFuZ2VkJyk7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIGhhbmRsZUJ1Y2tldEluZm9TaG93bkNoYW5nZSA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgSW5mbyBTaG93biBDaGFuZ2VkJyk7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIGhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnQnVja2V0IENvbnRyb2xzIFNob3duIENoYW5nZWQnKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgYXN5bmMgUnVuKGFwcDogQXBwKSB7XHJcbiAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgIHRoaXMuYnVpbGRRdWVzdGlvbkxpc3QoKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgdGhpcy5xdWVzdGlvbnNEYXRhID0gcmVzdWx0O1xyXG4gICAgICBBdWRpb0NvbnRyb2xsZXIuUHJlcGFyZUF1ZGlvQW5kSW1hZ2VzRm9yU3VydmV5KHRoaXMucXVlc3Rpb25zRGF0YSwgdGhpcy5hcHAuR2V0RGF0YVVSTCgpKTtcclxuICAgICAgdGhpcy51bml0eUJyaWRnZS5TZW5kTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGFydFN1cnZleSA9ICgpID0+IHtcclxuICAgIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkpO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBvblF1ZXN0aW9uRW5kID0gKCkgPT4ge1xyXG4gICAgVUlDb250cm9sbGVyLlNldEZlZWRiYWNrVmlzaWJpbGUoZmFsc2UsIGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICs9IDE7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKSkge1xyXG4gICAgICAgIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGVyZSBhcmUgbm8gcXVlc3Rpb25zIGxlZnQuJyk7XHJcbiAgICAgICAgdGhpcy5vbkVuZCgpO1xyXG4gICAgICB9XHJcbiAgICB9LCA1MDApO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyA9IChhbnN3ZXI6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKSA9PiB7XHJcbiAgICBBbmFseXRpY3NFdmVudHMuc2VuZEFuc3dlcmVkKHRoaXMucXVlc3Rpb25zRGF0YVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XSwgYW5zd2VyLCBlbGFwc2VkKTtcclxuICAgIFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1Zpc2liaWxlKHRydWUsIHRydWUpO1xyXG4gICAgVUlDb250cm9sbGVyLkFkZFN0YXIoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLm9uUXVlc3Rpb25FbmQoKTtcclxuICAgIH0sIDIwMDApO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBidWlsZFF1ZXN0aW9uTGlzdCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN1cnZleVF1ZXN0aW9ucyA9IGZldGNoU3VydmV5UXVlc3Rpb25zKHRoaXMuYXBwLmRhdGFVUkwpO1xyXG4gICAgcmV0dXJuIHN1cnZleVF1ZXN0aW9ucztcclxuICB9O1xyXG5cclxuICBwdWJsaWMgSGFzUXVlc3Rpb25zTGVmdCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IDw9IHRoaXMucXVlc3Rpb25zRGF0YS5sZW5ndGggLSAxO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGJ1aWxkTmV3UXVlc3Rpb24oKTogcURhdGEge1xyXG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IHRoaXMucXVlc3Rpb25zRGF0YVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XTtcclxuICAgIHJldHVybiBxdWVzdGlvbkRhdGE7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IHFEYXRhLCBhbnN3ZXJEYXRhIH0gZnJvbSAnLi4vY29tcG9uZW50cy9xdWVzdGlvbkRhdGEnO1xyXG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IHJhbmRGcm9tLCBzaHVmZmxlQXJyYXkgfSBmcm9tICcuLi91dGlscy9tYXRoVXRpbHMnO1xyXG5pbXBvcnQgeyBnZXREYXRhRmlsZSB9IGZyb20gJy4uL3V0aWxzL3VybFV0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVSUNvbnRyb2xsZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBVSUNvbnRyb2xsZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgcHJpdmF0ZSBsYW5kaW5nQ29udGFpbmVySWQgPSAnbGFuZFdyYXAnO1xyXG4gIHB1YmxpYyBsYW5kaW5nQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBnYW1lQ29udGFpbmVySWQgPSAnZ2FtZVdyYXAnO1xyXG4gIHB1YmxpYyBnYW1lQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBlbmRDb250YWluZXJJZCA9ICdlbmRXcmFwJztcclxuICBwdWJsaWMgZW5kQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBzdGFyQ29udGFpbmVySWQgPSAnc3RhcldyYXBwZXInO1xyXG4gIHB1YmxpYyBzdGFyQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBjaGVzdENvbnRhaW5lcklkID0gJ2NoZXN0V3JhcHBlcic7XHJcbiAgcHVibGljIGNoZXN0Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBxdWVzdGlvbnNDb250YWluZXJJZCA9ICdxV3JhcCc7XHJcbiAgcHVibGljIHF1ZXN0aW9uc0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHByaXZhdGUgZmVlZGJhY2tDb250YWluZXJJZCA9ICdmZWVkYmFja1dyYXAnO1xyXG4gIHB1YmxpYyBmZWVkYmFja0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHByaXZhdGUgYW5zd2Vyc0NvbnRhaW5lcklkID0gJ2FXcmFwJztcclxuICBwdWJsaWMgYW5zd2Vyc0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uMUlkID0gJ2Fuc3dlckJ1dHRvbjEnO1xyXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uMTogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b24ySWQgPSAnYW5zd2VyQnV0dG9uMic7XHJcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b24yOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIGFuc3dlckJ1dHRvbjNJZCA9ICdhbnN3ZXJCdXR0b24zJztcclxuICBwcml2YXRlIGFuc3dlckJ1dHRvbjM6IEhUTUxFbGVtZW50O1xyXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uNElkID0gJ2Fuc3dlckJ1dHRvbjQnO1xyXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uNDogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b241SWQgPSAnYW5zd2VyQnV0dG9uNSc7XHJcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b241OiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIGFuc3dlckJ1dHRvbjZJZCA9ICdhbnN3ZXJCdXR0b242JztcclxuICBwcml2YXRlIGFuc3dlckJ1dHRvbjY6IEhUTUxFbGVtZW50O1xyXG5cclxuICBwcml2YXRlIHBsYXlCdXR0b25JZCA9ICdwYnV0dG9uJztcclxuICBwcml2YXRlIHBsYXlCdXR0b246IEhUTUxFbGVtZW50O1xyXG5cclxuICBwcml2YXRlIGNoZXN0SW1nSWQgPSAnY2hlc3RJbWFnZSc7XHJcbiAgcHJpdmF0ZSBjaGVzdEltZzogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHB1YmxpYyBuZXh0UXVlc3Rpb24gPSBudWxsO1xyXG5cclxuICBwdWJsaWMgY29udGVudExvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgcVN0YXJ0O1xyXG4gIHB1YmxpYyBzaG93biA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgc3RhcnMgPSBbXTtcclxuICBwdWJsaWMgc2hvd25TdGFyc0NvdW50ID0gMDtcclxuICBwdWJsaWMgc3RhclBvc2l0aW9uczogQXJyYXk8eyB4OiBudW1iZXI7IHk6IG51bWJlciB9PiA9IEFycmF5PHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICB9PigpO1xyXG4gIHB1YmxpYyBxQW5zTnVtID0gMDtcclxuXHJcbiAgcHVibGljIGFsbFN0YXJ0OiBudW1iZXI7XHJcblxyXG4gIHB1YmxpYyBidXR0b25zID0gW107XHJcblxyXG4gIHByaXZhdGUgYnV0dG9uUHJlc3NDYWxsYmFjazogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSBzdGFydFByZXNzQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG5cclxuICBwdWJsaWMgYnV0dG9uc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIGRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBkZXZNb2RlQnVja2V0Q29udHJvbHNFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIHB1YmxpYyBhbmltYXRpb25TcGVlZE11bHRpcGxpZXI6IG51bWJlciA9IDE7XHJcblxyXG4gIHB1YmxpYyBleHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXI6IChjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGlja0NhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xyXG5cclxuICBwcml2YXRlIGluaXQoKTogdm9pZCB7XHJcbiAgICAvLyBJbml0aWFsaXplIHJlcXVpcmVkIGNvbnRhaW5lcnNcclxuICAgIHRoaXMubGFuZGluZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubGFuZGluZ0NvbnRhaW5lcklkKTtcclxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2FtZUNvbnRhaW5lcklkKTtcclxuICAgIHRoaXMuZW5kQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbmRDb250YWluZXJJZCk7XHJcbiAgICB0aGlzLnN0YXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXJDb250YWluZXJJZCk7XHJcbiAgICB0aGlzLmNoZXN0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jaGVzdENvbnRhaW5lcklkKTtcclxuICAgIHRoaXMucXVlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5xdWVzdGlvbnNDb250YWluZXJJZCk7XHJcbiAgICB0aGlzLmZlZWRiYWNrQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5mZWVkYmFja0NvbnRhaW5lcklkKTtcclxuICAgIHRoaXMuYW5zd2Vyc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2Vyc0NvbnRhaW5lcklkKTtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIHJlcXVpcmVkIGJ1dHRvbnNcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uMUlkKTtcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uMklkKTtcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uM0lkKTtcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNElkKTtcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uNSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNUlkKTtcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uNiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNklkKTtcclxuXHJcbiAgICB0aGlzLnBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnBsYXlCdXR0b25JZCk7XHJcblxyXG4gICAgdGhpcy5jaGVzdEltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY2hlc3RJbWdJZCk7XHJcblxyXG4gICAgdGhpcy5pbml0aWFsaXplU3RhcnMoKTtcclxuXHJcbiAgICB0aGlzLmluaXRFdmVudExpc3RlbmVycygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0aWFsaXplU3RhcnMoKTogdm9pZCB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcclxuICAgICAgY29uc3QgbmV3U3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG5cclxuICAgICAgLy8gbmV3U3Rhci5zcmMgPSBcImltZy9zdGFyLnBuZ1wiO1xyXG4gICAgICBuZXdTdGFyLmlkID0gJ3N0YXInICsgaTtcclxuXHJcbiAgICAgIG5ld1N0YXIuY2xhc3NMaXN0LmFkZCgndG9wc3RhcnYnKTtcclxuXHJcbiAgICAgIHRoaXMuc3RhckNvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdTdGFyKTtcclxuXHJcbiAgICAgIHRoaXMuc3RhckNvbnRhaW5lci5pbm5lckhUTUwgKz0gJyc7XHJcblxyXG4gICAgICBpZiAoaSA9PSA5KSB7XHJcbiAgICAgICAgdGhpcy5zdGFyQ29udGFpbmVyLmlubmVySFRNTCArPSAnPGJyPic7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RhcnMucHVzaChpKTtcclxuICAgIH1cclxuXHJcbiAgICBzaHVmZmxlQXJyYXkodGhpcy5zdGFycyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgU2V0QW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKG11bHRpcGxpZXI6IG51bWJlcik6IHZvaWQge1xyXG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gbXVsdGlwbGllcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBTZXRDb3JyZWN0TGFiZWxWaXNpYmlsaXR5KHZpc2libGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFZpc2liaWxpdHkgPSB2aXNpYmxlO1xyXG4gICAgY29uc29sZS5sb2coJ0NvcnJlY3QgbGFiZWwgdmlzaWJpbGl0eSBzZXQgdG8gJywgdGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsVmlzaWJpbGl0eSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgU2V0QnVja2V0Q29udHJvbHNWaXNpYmlsaXR5KHZpc2libGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgY29udHJvbHMgdmlzaWJpbGl0eSBzZXQgdG8gJywgdmlzaWJsZSk7XHJcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRDb250cm9sc0VuYWJsZWQgPSB2aXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBPdmVybGFwcGluZ090aGVyU3RhcnMoXHJcbiAgICBzdGFyUG9zaXRpb25zOiBBcnJheTx7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0+LFxyXG4gICAgeDogbnVtYmVyLFxyXG4gICAgeTogbnVtYmVyLFxyXG4gICAgbWluRGlzdGFuY2U6IG51bWJlclxyXG4gICk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHN0YXJQb3NpdGlvbnMubGVuZ3RoIDwgMSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhclBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBkeCA9IHN0YXJQb3NpdGlvbnNbaV0ueCAtIHg7XHJcbiAgICAgIGNvbnN0IGR5ID0gc3RhclBvc2l0aW9uc1tpXS55IC0geTtcclxuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG4gICAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRFdmVudExpc3RlbmVycygpOiB2b2lkIHtcclxuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXNcclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5hbnN3ZXJCdXR0b25QcmVzcygxKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uMSk7XHJcblxyXG4gICAgdGhpcy5hbnN3ZXJCdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmFuc3dlckJ1dHRvblByZXNzKDIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b24yKTtcclxuXHJcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoMyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjMpO1xyXG5cclxuICAgIHRoaXMuYW5zd2VyQnV0dG9uNC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5hbnN3ZXJCdXR0b25QcmVzcyg0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uNCk7XHJcblxyXG4gICAgdGhpcy5hbnN3ZXJCdXR0b241LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmFuc3dlckJ1dHRvblByZXNzKDUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b241KTtcclxuXHJcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoNik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjYpO1xyXG5cclxuICAgIHRoaXMubGFuZGluZ0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGdldERhdGFGaWxlKCkpICYmIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmNvbnRlbnRMb2FkZWQpIHtcclxuICAgICAgICB0aGlzLnNob3dHYW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNob3dPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKCFVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93bikge1xyXG4gICAgICBjb25zdCBuZXdRID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uO1xyXG4gICAgICBjb25zdCBidXR0b25zID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9ucztcclxuXHJcbiAgICAgIGNvbnN0IGFuaW1hdGlvblNwZWVkTXVsdGlwbGllciA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjtcclxuXHJcbiAgICAgIGxldCBhbmltYXRpb25EdXJhdGlvbiA9IDIyMCAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjtcclxuICAgICAgY29uc3QgZGVsYXlCZm9yZU9wdGlvbiA9IDE1MCAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjtcclxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd24gPSB0cnVlO1xyXG4gICAgICBsZXQgb3B0aW9uc0Rpc3BsYXllZCA9IDA7XHJcblxyXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xyXG4gICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgYnV0dG9uLnN0eWxlLmFuaW1hdGlvbiA9ICcnO1xyXG4gICAgICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1EuYW5zd2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgY3VyQW5zd2VyID0gbmV3US5hbnN3ZXJzW2ldO1xyXG4gICAgICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICAgICAgICBjb25zdCBpc0NvcnJlY3QgPSBjdXJBbnN3ZXIuYW5zd2VyTmFtZSA9PT0gbmV3US5jb3JyZWN0O1xyXG5cclxuICAgICAgICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnYW5zd2VyVGV4dCcgaW4gY3VyQW5zd2VyID8gY3VyQW5zd2VyLmFuc3dlclRleHQgOiAnJztcclxuXHJcbiAgICAgICAgICAvLyBBZGQgYSBsYWJlbCBpbnNpZGUgdGhlIGJ1dHRvbiB0byBzaG93IHRoZSBjb3JyZWN0IGFuc3dlclxyXG4gICAgICAgICAgaWYgKGlzQ29ycmVjdCAmJiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kZXZNb2RlQ29ycmVjdExhYmVsVmlzaWJpbGl0eSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY29ycmVjdExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvcnJlY3QtbGFiZWwnKTtcclxuICAgICAgICAgICAgY29ycmVjdExhYmVsLmlubmVySFRNTCA9ICdDb3JyZWN0JztcclxuICAgICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvcnJlY3RMYWJlbCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgIGJ1dHRvbi5zdHlsZS5ib3hTaGFkb3cgPSAnMHB4IDBweCAwcHggMHB4IHJnYmEoMCwwLDAsMCknO1xyXG4gICAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5ib3hTaGFkb3cgPSAnMHB4IDZweCA4cHggIzYwNjA2MCc7XHJcbiAgICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmFuaW1hdGlvbiA9IGB6b29tSW4gJHthbmltYXRpb25EdXJhdGlvbiAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1tcyBlYXNlIGZvcndhcmRzYDtcclxuICAgICAgICAgICAgICBpZiAoJ2Fuc3dlckltZycgaW4gY3VyQW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0bXBpbWcgPSBBdWRpb0NvbnRyb2xsZXIuR2V0SW1hZ2UoY3VyQW5zd2VyLmFuc3dlckltZyk7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQodG1waW1nKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNEaXNwbGF5ZWQrKztcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zRGlzcGxheWVkID09PSBuZXdRLmFuc3dlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmVuYWJsZUFuc3dlckJ1dHRvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpICogYW5pbWF0aW9uRHVyYXRpb24gKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXIgKiAwLjNcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBkZWxheUJmb3JlT3B0aW9uKTtcclxuXHJcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnFTdGFydCA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVuYWJsZUFuc3dlckJ1dHRvbigpOiB2b2lkIHtcclxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNBY3RpdmUgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBTZXRGZWVkYmFja1RleHQobnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coJ0ZlZWRiYWNrIHRleHQgc2V0IHRvICcgKyBudCk7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5pbm5lckhUTUwgPSBudDtcclxuICB9XHJcblxyXG4gIC8vZnVuY3Rpb25zIHRvIHNob3cvaGlkZSB0aGUgZGlmZmVyZW50IGNvbnRhaW5lcnNcclxuICBwcml2YXRlIHNob3dMYW5kaW5nKCk6IHZvaWQge1xyXG4gICAgdGhpcy5sYW5kaW5nQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICB0aGlzLmdhbWVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHRoaXMuZW5kQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIFNob3dFbmQoKTogdm9pZCB7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5sYW5kaW5nQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5nYW1lQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5lbmRDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd0dhbWUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmxhbmRpbmdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2dyaWQnO1xyXG4gICAgdGhpcy5lbmRDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHRoaXMuYWxsU3RhcnQgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5zdGFydFByZXNzQ2FsbGJhY2soKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgU2V0RmVlZGJhY2tWaXNpYmlsZSh2aXNpYmxlOiBib29sZWFuLCBpc0NvcnJlY3Q6IGJvb2xlYW4pIHtcclxuICAgIGlmICh2aXNpYmxlKSB7XHJcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XHJcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgaWYgKGlzQ29ycmVjdCkge1xyXG4gICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQ29udGFpbmVyLnN0eWxlLmNvbG9yID0gJ3JnYigxMDksIDIwNCwgMTIyKSc7XHJcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlDb3JyZWN0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuc3R5bGUuY29sb3IgPSAncmVkJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xyXG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBSZWFkeUZvck5leHQobmV3UTogcURhdGEsIHJlR2VuZXJhdGVJdGVtczogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGlmIChuZXdRID09PSBudWxsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdyZWFkeSBmb3IgbmV4dCEnKTtcclxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuc3dlcnNDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgZm9yICh2YXIgYiBpbiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zKSB7XHJcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNbYl0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgfVxyXG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd24gPSBmYWxzZTtcclxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLm5leHRRdWVzdGlvbiA9IG5ld1E7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIC8vIHBCLmlubmVySFRNTCA9IFwiPGJ1dHRvbiBpZD0nbmV4dHFCdXR0b24nPjxzdmcgd2lkdGg9JzI0JyBoZWlnaHQ9JzI0JyB2aWV3Qm94PScwIDAgMjQgMjQnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZD0nTTkgMThMMTUgMTJMOSA2VjE4WicgZmlsbD0nY3VycmVudENvbG9yJyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPScyJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjwvcGF0aD48L3N2Zz48L2J1dHRvbj5cIjtcclxuICAgIC8vIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZChcImF1ZGlvLWJ1dHRvblwiKTtcclxuXHJcbiAgICAvLyBXaGVuIHRoZSBkZXYgbW9kZSBpcyBhY3RpdmUgYW5kIHRoZSBidWNrZXQgbmV4dCwgcHJldmlvdXMgYW5kIHBsYXkgYnV0dG9ucyBhcmUgZW5hYmxlZCwgdXNlIHRoZSBleHRlcm5hbCBidWNrZXQgY29udHJvbHMgZ2VuZXJhdGlvbiBoYW5kbGVyXHJcbiAgICAvLyBpZiAoIXJlR2VuZXJhdGVJdGVtcykge1xyXG4gICAgLy8gICByZXR1cm47XHJcbiAgICAvLyB9XHJcbiAgICBjb25zdCBpc0J1Y2tldENvbnRyb2xzRW5hYmxlZCA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRldk1vZGVCdWNrZXRDb250cm9sc0VuYWJsZWQ7XHJcbiAgICBpZiAoaXNCdWNrZXRDb250cm9sc0VuYWJsZWQpIHtcclxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyKFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24sICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ2FsbCBmcm9tIGluc2lkZSBjbGljayBoYW5kbGVyIG9mIGV4dGVybmFsIGJ1Y2tldCBjb250cm9scycpO1xyXG4gICAgICAgIFVJQ29udHJvbGxlci5TaG93UXVlc3Rpb24oKTtcclxuICAgICAgICAvL3BsYXlxdWVzdGlvbmF1ZGlvXHJcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlBdWRpbyhcclxuICAgICAgICAgIG5ld1EucHJvbXB0QXVkaW8sXHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93T3B0aW9ucyxcclxuICAgICAgICAgIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb25cclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24uaW5uZXJIVE1MID1cclxuICAgICAgICBcIjxidXR0b24gaWQ9J25leHRxQnV0dG9uJz48aW1nIGNsYXNzPWF1ZGlvLWJ1dHRvbiB3aWR0aD0nMTAwcHgnIGhlaWdodD0nMTAwcHgnIHNyYz0nL2ltZy9Tb3VuZEJ1dHRvbl9JZGxlLnBuZycgdHlwZT0naW1hZ2Uvc3ZnK3htbCc+IDwvaW1nPjwvYnV0dG9uPlwiO1xyXG4gICAgICB2YXIgbmV4dFF1ZXN0aW9uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHRxQnV0dG9uJyk7XHJcbiAgICAgIG5leHRRdWVzdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBVSUNvbnRyb2xsZXIuU2hvd1F1ZXN0aW9uKCk7XHJcbiAgICAgICAgLy9wbGF5cXVlc3Rpb25hdWRpb1xyXG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5QXVkaW8oXHJcbiAgICAgICAgICBuZXdRLnByb21wdEF1ZGlvLFxyXG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd09wdGlvbnMsXHJcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIFNob3dBdWRpb0FuaW1hdGlvbihwbGF5aW5nOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGlmICghVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZCkge1xyXG4gICAgICBjb25zdCBwbGF5QnV0dG9uSW1nID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucGxheUJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcclxuICAgICAgaWYgKHBsYXlpbmcpIHtcclxuICAgICAgICBwbGF5QnV0dG9uSW1nLnNyYyA9ICdhbmltYXRpb24vU291bmRCdXR0b24uZ2lmJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwbGF5QnV0dG9uSW1nLnNyYyA9ICcvaW1nL1NvdW5kQnV0dG9uX0lkbGUucG5nJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBTaG93UXVlc3Rpb24obmV3UXVlc3Rpb24/OiBxRGF0YSk6IHZvaWQge1xyXG4gICAgLy8gcEIuaW5uZXJIVE1MID0gXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PHN2ZyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNOSAxOEwxNSAxMkw5IDZWMThaJyBmaWxsPSdjdXJyZW50Q29sb3InIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PC9wYXRoPjwvc3ZnPjwvYnV0dG9uPlwiO1xyXG5cclxuICAgIC8vIFdoZW4gdGhlIGRldiBtb2RlIGlzIGFjdGl2ZSBhbmQgdGhlIGJ1Y2tldCBuZXh0LCBwcmV2aW91cyBhbmQgcGxheSBidXR0b25zIGFyZSBlbmFibGVkLCB1c2UgdGhlIGV4dGVybmFsIGJ1Y2tldCBjb250cm9scyBnZW5lcmF0aW9uIGhhbmRsZXJcclxuICAgIGNvbnN0IGlzQnVja2V0Q29udHJvbHNFbmFibGVkID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZDtcclxuICAgIGlmIChpc0J1Y2tldENvbnRyb2xzRW5hYmxlZCkge1xyXG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5leHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXIoVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucGxheUJ1dHRvbiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDYWxsIGZyb20gaW5zaWRlIGNsaWNrIGhhbmRsZXIgb2YgZXh0ZXJuYWwgYnVja2V0IGNvbnRyb2xzICMyJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25leHQgcXVlc3Rpb24gYnV0dG9uIHByZXNzZWQnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhuZXdRdWVzdGlvbi5wcm9tcHRBdWRpbyk7XHJcblxyXG4gICAgICAgIGlmICgncHJvbXB0QXVkaW8nIGluIG5ld1F1ZXN0aW9uKSB7XHJcbiAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKG5ld1F1ZXN0aW9uLnByb21wdEF1ZGlvLCB1bmRlZmluZWQsIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5wbGF5QnV0dG9uLmlubmVySFRNTCA9XHJcbiAgICAgICAgXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PGltZyBjbGFzcz1hdWRpby1idXR0b24gd2lkdGg9JzEwMHB4JyBoZWlnaHQ9JzEwMHB4JyBzcmM9Jy9pbWcvU291bmRCdXR0b25fSWRsZS5wbmcnIHR5cGU9J2ltYWdlL3N2Zyt4bWwnPiA8L2ltZz48L2J1dHRvbj5cIjtcclxuXHJcbiAgICAgIHZhciBuZXh0UXVlc3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dHFCdXR0b24nKTtcclxuICAgICAgbmV4dFF1ZXN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZXh0IHF1ZXN0aW9uIGJ1dHRvbiBwcmVzc2VkJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cobmV3UXVlc3Rpb24ucHJvbXB0QXVkaW8pO1xyXG5cclxuICAgICAgICBpZiAoJ3Byb21wdEF1ZGlvJyBpbiBuZXdRdWVzdGlvbikge1xyXG4gICAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlBdWRpbyhuZXdRdWVzdGlvbi5wcm9tcHRBdWRpbywgdW5kZWZpbmVkLCBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuc3dlcnNDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuXHJcbiAgICBsZXQgcUNvZGUgPSAnJztcclxuXHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBuZXdRdWVzdGlvbiA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBuZXdRdWVzdGlvbiA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLm5leHRRdWVzdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJ3Byb21wdEltZycgaW4gbmV3UXVlc3Rpb24pIHtcclxuICAgICAgdmFyIHRtcGltZyA9IEF1ZGlvQ29udHJvbGxlci5HZXRJbWFnZShuZXdRdWVzdGlvbi5wcm9tcHRJbWcpO1xyXG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuYXBwZW5kQ2hpbGQodG1waW1nKTtcclxuICAgIH1cclxuXHJcbiAgICBxQ29kZSArPSBuZXdRdWVzdGlvbi5wcm9tcHRUZXh0O1xyXG5cclxuICAgIHFDb2RlICs9ICc8QlI+JztcclxuXHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MICs9IHFDb2RlO1xyXG5cclxuICAgIGZvciAodmFyIGJ1dHRvbkluZGV4IGluIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnMpIHtcclxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uc1tidXR0b25JbmRleF0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBBZGRTdGFyKCk6IHZvaWQge1xyXG4gICAgdmFyIHN0YXJUb1Nob3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgJ3N0YXInICsgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc3RhcnNbVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucUFuc051bV1cclxuICAgICkgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgIHN0YXJUb1Nob3cuc3JjID0gJy4uL2FuaW1hdGlvbi9TdGFyLmdpZic7XHJcbiAgICBzdGFyVG9TaG93LmNsYXNzTGlzdC5hZGQoJ3RvcHN0YXJ2Jyk7XHJcbiAgICBzdGFyVG9TaG93LmNsYXNzTGlzdC5yZW1vdmUoJ3RvcHN0YXJoJyk7XHJcblxyXG4gICAgc3RhclRvU2hvdy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblxyXG4gICAgbGV0IGNvbnRhaW5lcldpZHRoID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc3RhckNvbnRhaW5lci5vZmZzZXRXaWR0aDtcclxuICAgIGxldCBjb250YWluZXJIZWlnaHQgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zdGFyQ29udGFpbmVyLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnU3RhcnMgQ29udGFpbmVyIGRpbWVuc2lvbnM6ICcsIGNvbnRhaW5lcldpZHRoLCBjb250YWluZXJIZWlnaHQpO1xyXG5cclxuICAgIGxldCByYW5kb21YID0gMDtcclxuICAgIGxldCByYW5kb21ZID0gMDtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgIHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29udGFpbmVyV2lkdGggLSBjb250YWluZXJXaWR0aCAqIDAuMikpO1xyXG4gICAgICByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29udGFpbmVySGVpZ2h0KTtcclxuICAgIH0gd2hpbGUgKFVJQ29udHJvbGxlci5PdmVybGFwcGluZ090aGVyU3RhcnMoVUlDb250cm9sbGVyLmluc3RhbmNlLnN0YXJQb3NpdGlvbnMsIHJhbmRvbVgsIHJhbmRvbVksIDI4KSk7XHJcblxyXG4gICAgY29uc3QgYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyO1xyXG5cclxuICAgIC8vIFNhdmUgdGhlc2UgcmFuZG9tIHggYW5kIHkgdmFsdWVzLCBtYWtlIHRoZSBzdGFyIGFwcGVhciBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW4sIG1ha2UgaXQgMyB0aW1lcyBiaWdnZXIgdXNpbmcgc2NhbGUgYW5kIHNsb3dseSB0cmFuc2l0aW9uIHRvIHRoZSByYW5kb20geCBhbmQgeSB2YWx1ZXNcclxuICAgIHN0YXJUb1Nob3cuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEwKSc7XHJcbiAgICBzdGFyVG9TaG93LnN0eWxlLnRyYW5zaXRpb24gPSBgdG9wICR7MSAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1zIGVhc2UsIGxlZnQgJHsxICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfXMgZWFzZSwgdHJhbnNmb3JtICR7MC41ICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfXMgZWFzZWA7XHJcbiAgICBzdGFyVG9TaG93LnN0eWxlLnpJbmRleCA9ICc1MDAnO1xyXG4gICAgc3RhclRvU2hvdy5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyICsgJ3B4JztcclxuICAgIHN0YXJUb1Nob3cuc3R5bGUubGVmdCA9IFVJQ29udHJvbGxlci5pbnN0YW5jZS5nYW1lQ29udGFpbmVyLm9mZnNldFdpZHRoIC8gMiAtIHN0YXJUb1Nob3cub2Zmc2V0V2lkdGggLyAyICsgJ3B4JztcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2l0aW9uID0gYHRvcCAkezIgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXJ9cyBlYXNlLCBsZWZ0ICR7MiAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1zIGVhc2UsIHRyYW5zZm9ybSAkezIgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXJ9cyBlYXNlYDtcclxuICAgICAgaWYgKHJhbmRvbVggPCBjb250YWluZXJXaWR0aCAvIDIgLSAzMCkge1xyXG4gICAgICAgIC8vIFJvdGF0ZSB0aGUgc3RhciB0byB0aGUgcmlnaHQgYSBiaXRcclxuICAgICAgICBjb25zdCByb3RhdGlvbiA9IDUgKyBNYXRoLnJhbmRvbSgpICogODtcclxuICAgICAgICBjb25zb2xlLmxvZygnUm90YXRpbmcgc3RhciB0byB0aGUgcmlnaHQnLCByb3RhdGlvbik7XHJcbiAgICAgICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKC0nICsgcm90YXRpb24gKyAnZGVnKSBzY2FsZSgxKSc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUm90YXRlIHRoZSBzdGFyIHRvIHRoZSBsZWZ0IGEgYml0XHJcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSA1ICsgTWF0aC5yYW5kb20oKSAqIDg7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JvdGF0aW5nIHN0YXIgdG8gdGhlIGxlZnQnLCByb3RhdGlvbik7XHJcbiAgICAgICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKCcgKyByb3RhdGlvbiArICdkZWcpIHNjYWxlKDEpJztcclxuICAgICAgfVxyXG5cclxuICAgICAgc3RhclRvU2hvdy5zdHlsZS5sZWZ0ID0gMTAgKyByYW5kb21YICsgJ3B4JztcclxuICAgICAgc3RhclRvU2hvdy5zdHlsZS50b3AgPSByYW5kb21ZICsgJ3B4JztcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHN0YXJUb1Nob3cuc3R5bGUuZmlsdGVyID0gJ2Ryb3Atc2hhZG93KDBweCAwcHggMTBweCB5ZWxsb3cpJztcclxuICAgICAgfSwgMTkwMCAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcik7XHJcbiAgICB9LCAxMDAwICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKTtcclxuXHJcbiAgICBVSUNvbnRyb2xsZXIuaW5zdGFuY2Uuc3RhclBvc2l0aW9ucy5wdXNoKHsgeDogcmFuZG9tWCwgeTogcmFuZG9tWSB9KTtcclxuXHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xQW5zTnVtICs9IDE7XHJcblxyXG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50ICs9IDE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIENoYW5nZVN0YXJJbWFnZUFmdGVyQW5pbWF0aW9uKCk6IHZvaWQge1xyXG4gICAgdmFyIHN0YXJUb1Nob3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgJ3N0YXInICsgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc3RhcnNbVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucUFuc051bSAtIDFdXHJcbiAgICApIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBzdGFyVG9TaG93LnNyYyA9ICcuLi9pbWcvc3Rhcl9hZnRlcl9hbmltYXRpb24uZ2lmJztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uUHJlc3MoYnV0dG9uTnVtOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFsbEJ1dHRvbnNWaXNpYmxlID0gdGhpcy5idXR0b25zLmV2ZXJ5KChidXR0b24pID0+IGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID09PSAndmlzaWJsZScpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5idXR0b25zQWN0aXZlLCBhbGxCdXR0b25zVmlzaWJsZSk7XHJcbiAgICBpZiAodGhpcy5idXR0b25zQWN0aXZlID09PSB0cnVlKSB7XHJcbiAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5RGluZygpO1xyXG4gICAgICBjb25zdCBuUHJlc3NlZCA9IERhdGUubm93KCk7XHJcbiAgICAgIGNvbnN0IGRUaW1lID0gblByZXNzZWQgLSB0aGlzLnFTdGFydDtcclxuICAgICAgY29uc29sZS5sb2coJ2Fuc3dlcmVkIGluICcgKyBkVGltZSk7XHJcbiAgICAgIHRoaXMuYnV0dG9uUHJlc3NDYWxsYmFjayhidXR0b25OdW0sIGRUaW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgUHJvZ3Jlc3NDaGVzdCgpIHtcclxuICAgIGNvbnN0IGNoZXN0SW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlc3RJbWFnZScpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBsZXQgY3VycmVudEltZ1NyYyA9IGNoZXN0SW1hZ2Uuc3JjO1xyXG4gICAgY29uc29sZS5sb2coJ0NoZXN0IFByb2dyZXNzaW9uLS0+JywgY2hlc3RJbWFnZSk7XHJcbiAgICBjb25zb2xlLmxvZygnQ2hlc3QgUHJvZ3Jlc3Npb24tLT4nLCBjaGVzdEltYWdlLnNyYyk7XHJcbiAgICBjb25zdCBjdXJyZW50SW1hZ2VOdW1iZXIgPSBwYXJzZUludChjdXJyZW50SW1nU3JjLnNsaWNlKC02LCAtNCksIDEwKTtcclxuICAgIGNvbnNvbGUubG9nKCdDaGVzdCBQcm9ncmVzc2lvbiBudW1iZXItLT4nLCBjdXJyZW50SW1hZ2VOdW1iZXIpO1xyXG4gICAgY29uc3QgbmV4dEltYWdlTnVtYmVyID0gKGN1cnJlbnRJbWFnZU51bWJlciAlIDQpICsgMTtcclxuICAgIGNvbnN0IG5leHRJbWFnZVNyYyA9IGBpbWcvY2hlc3Rwcm9ncmVzc2lvbi9UcmVhc3VyZUNoZXN0T3BlbjAke25leHRJbWFnZU51bWJlcn0uc3ZnYDtcclxuICAgIGNoZXN0SW1hZ2Uuc3JjID0gbmV4dEltYWdlU3JjO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBTZXRDb250ZW50TG9hZGVkKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb250ZW50TG9hZGVkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIFNldEJ1dHRvblByZXNzQWN0aW9uKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uUHJlc3NDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBTZXRTdGFydEFjdGlvbihjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnN0YXJ0UHJlc3NDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBTZXRFeHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXIoXHJcbiAgICBoYW5kbGVyOiAoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgY2xpY2tDYWxsYmFjazogKCkgPT4gdm9pZCkgPT4gdm9pZFxyXG4gICk6IHZvaWQge1xyXG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyID0gaGFuZGxlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogVUlDb250cm9sbGVyIHtcclxuICAgIGlmIChVSUNvbnRyb2xsZXIuaW5zdGFuY2UgPT09IG51bGwpIHtcclxuICAgICAgVUlDb250cm9sbGVyLmluc3RhbmNlID0gbmV3IFVJQ29udHJvbGxlcigpO1xyXG4gICAgICBVSUNvbnRyb2xsZXIuaW5zdGFuY2UuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBVSUNvbnRyb2xsZXIuaW5zdGFuY2U7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGJ1Y2tldCB9IGZyb20gXCIuLi9hc3Nlc3NtZW50L2J1Y2tldERhdGFcIjtcclxuXHJcbmxldCBjcl91c2VyX2lkOiBzdHJpbmc7XHJcbmxldCBsYW5ndWFnZTogc3RyaW5nO1xyXG5sZXQgYXBwOiBzdHJpbmc7XHJcbmxldCB1c2VyX3NvdXJjZTogc3RyaW5nO1xyXG5sZXQgbGF0X2xhbmc6IHN0cmluZztcclxubGV0IGNvbnRlbnRfdmVyc2lvbjogc3RyaW5nO1xyXG5sZXQgYXBwX3ZlcnNpb246IHN0cmluZztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDb21tb25BbmFseXRpY3NFdmVudHNQcm9wZXJ0aWVzKFxyXG4gICAgX2NyX3VzZXJfaWQ6IHN0cmluZyxcclxuICAgIF9sYW5ndWFnZTogc3RyaW5nLFxyXG4gICAgX2FwcDogc3RyaW5nLFxyXG4gICAgX3VzZXJfc291cmNlOiBzdHJpbmcsXHJcbiAgICBfY29udGVudF92ZXJzaW9uOiBzdHJpbmcsXHJcbiAgICBfYXBwX3ZlcnNpb246IHN0cmluZyxcclxuXHJcbikge1xyXG5cclxuICAgIGNyX3VzZXJfaWQgPSBfY3JfdXNlcl9pZDtcclxuICAgIGxhbmd1YWdlID0gX2xhbmd1YWdlO1xyXG4gICAgYXBwID0gX2FwcDtcclxuICAgIHVzZXJfc291cmNlID0gX3VzZXJfc291cmNlO1xyXG4gICAgY29udGVudF92ZXJzaW9uID0gX2NvbnRlbnRfdmVyc2lvbjtcclxuICAgIGFwcF92ZXJzaW9uID0gX2FwcF92ZXJzaW9uO1xyXG5cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9jYXRpb25Qcm9wZXJ0eShfbGF0X2xhbmc6IHN0cmluZykge1xyXG4gICAgbGF0X2xhbmcgPSBfbGF0X2xhbmc7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vbkFuYWx5dGljc0V2ZW50c1Byb3BlcnRpZXMoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyX3VzZXJfaWQsXHJcbiAgICAgICAgbGFuZ3VhZ2UsXHJcbiAgICAgICAgYXBwLFxyXG4gICAgICAgIHVzZXJfc291cmNlLFxyXG4gICAgICAgIGxhdF9sYW5nLFxyXG4gICAgICAgIGNvbnRlbnRfdmVyc2lvbixcclxuICAgICAgICBhcHBfdmVyc2lvbixcclxuICAgIH07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhc2FsQnVja2V0SUQoYnVja2V0czogYnVja2V0W10pOiBudW1iZXIge1xyXG4gICAgbGV0IGJ1Y2tldElEID0gMDtcclxuXHJcbiAgICAvLyBTZWxlY3QgdGhlIGxvd2VzdCBidWNrZXRJRCBidWNrZXQgdGhhdCB0aGUgdXNlciBoYXMgZmFpbGVkXHJcbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGJ1Y2tldHMpIHtcclxuICAgICAgICBjb25zdCBidWNrZXQgPSBidWNrZXRzW2luZGV4XTtcclxuICAgICAgICBpZiAoYnVja2V0LnRlc3RlZCAmJiAhYnVja2V0LnBhc3NlZCkge1xyXG4gICAgICAgICAgICBpZiAoYnVja2V0SUQgPT0gMCB8fCBidWNrZXQuYnVja2V0SUQgPCBidWNrZXRJRCkge1xyXG4gICAgICAgICAgICAgICAgYnVja2V0SUQgPSBidWNrZXQuYnVja2V0SUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVja2V0SUQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVTY29yZShidWNrZXRzOiBidWNrZXRbXSwgYmFzYWxCdWNrZXRJRDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYWxjdWxhdGluZyBzY29yZScpO1xyXG4gICAgY29uc29sZS5sb2coYnVja2V0cyk7XHJcblxyXG4gICAgbGV0IHNjb3JlID0gMDtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnQmFzYWwgQnVja2V0IElEOiAnICsgYmFzYWxCdWNrZXRJRCk7XHJcblxyXG4gICAgLy8gR2V0IHRoZSBudW1jb3JyZWN0IGZyb20gdGhlIGJhc2FsIGJ1Y2tldCBiYXNlZCBvbiBsb29waW5nIHRocm91Z2ggYW5kIGZpbmRpbmcgdGhlIGJ1Y2tldCBpZFxyXG4gICAgbGV0IG51bUNvcnJlY3QgPSAwO1xyXG5cclxuICAgIGZvciAoY29uc3QgaW5kZXggaW4gYnVja2V0cykge1xyXG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IGJ1Y2tldHNbaW5kZXhdO1xyXG4gICAgICAgIGlmIChidWNrZXQuYnVja2V0SUQgPT0gYmFzYWxCdWNrZXRJRCkge1xyXG4gICAgICAgICAgICBudW1Db3JyZWN0ID0gYnVja2V0Lm51bUNvcnJlY3Q7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnTnVtIENvcnJlY3Q6ICcgKyBudW1Db3JyZWN0LCAnIGJhc2FsOiAnICsgYmFzYWxCdWNrZXRJRCwgJyBidWNrZXRzOiAnICsgYnVja2V0cy5sZW5ndGgpO1xyXG5cclxuICAgIGlmIChiYXNhbEJ1Y2tldElEID09PSBidWNrZXRzLmxlbmd0aCAmJiBudW1Db3JyZWN0ID49IDQpIHtcclxuICAgICAgICAvLyBJZiB0aGUgdXNlciBoYXMgZW5vdWdoIGNvcnJlY3QgYW5zd2VycyBpbiB0aGUgbGFzdCBidWNrZXQsIGdpdmUgdGhlbSBhIHBlcmZlY3Qgc2NvcmVcclxuICAgICAgICBjb25zb2xlLmxvZygnUGVyZmVjdCBzY29yZScpO1xyXG5cclxuICAgICAgICByZXR1cm4gYnVja2V0cy5sZW5ndGggKiAxMDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2NvcmUgPSBNYXRoLnJvdW5kKChiYXNhbEJ1Y2tldElEIC0gMSkgKiAxMDAgKyAobnVtQ29ycmVjdCAvIDUpICogMTAwKSB8IDA7XHJcblxyXG4gICAgcmV0dXJuIHNjb3JlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2VpbGluZ0J1Y2tldElEKGJ1Y2tldHM6IGJ1Y2tldFtdKTogbnVtYmVyIHtcclxuICAgIGxldCBidWNrZXRJRCA9IDA7XHJcblxyXG4gICAgLy8gU2VsZWN0IHRoZSBoaXVnaGVzdCBidWNrZXRJRCBidWNrZXQgdGhhdCB0aGUgdXNlciBoYXMgcGFzc2VkXHJcbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGJ1Y2tldHMpIHtcclxuICAgICAgICBjb25zdCBidWNrZXQgPSBidWNrZXRzW2luZGV4XTtcclxuICAgICAgICBpZiAoYnVja2V0LnRlc3RlZCAmJiBidWNrZXQucGFzc2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChidWNrZXRJRCA9PSAwIHx8IGJ1Y2tldC5idWNrZXRJRCA+IGJ1Y2tldElEKSB7XHJcbiAgICAgICAgICAgICAgICBidWNrZXRJRCA9IGJ1Y2tldC5idWNrZXRJRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVja2V0SUQ7XHJcbn1cclxuLy8gR2V0IExvY2F0aW9uXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcclxuICAgIGNvbnNvbGUubG9nKCdzdGFydGluZyB0byBnZXQgbG9jYXRpb24nKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9pcGluZm8uaW8vanNvbj90b2tlbj1iNjI2ODcyNzE3ODYxMGApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdnb3QgbG9jYXRpb24gcmVzcG9uc2UnKTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coanNvblJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGpzb25SZXNwb25zZS5sb2MgYXMgc3RyaW5nOyAvLyBlLmcuIFwiMzcuMzg2MCwtMTIyLjA4MzhcIlxyXG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oYGxvY2F0aW9uIGZhaWxlZCB0byB1cGRhdGUhIGVuY291bnRlcmVkIGVycm9yOiAke2Vyci5tZXNzYWdlfWApO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59IiwiLyoqIEpzb24gVXRpbHMgKi9cclxuXHJcbi8vIGltcG9ydCB7IHNldEZlZWRiYWNrVGV4dCB9IGZyb20gJy4vdWlDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFwcERhdGEodXJsOiBzdHJpbmcpIHtcclxuICByZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXBwVHlwZSh1cmw6IHN0cmluZykge1xyXG4gIHJldHVybiBsb2FkRGF0YSh1cmwpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIC8vIHNldEZlZWRiYWNrVGV4dChkYXRhW1wiZmVlZGJhY2tUZXh0XCJdKTtcclxuICAgIHJldHVybiBkYXRhWydhcHBUeXBlJ107XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEZlZWRiYWNrKHVybDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGxvYWREYXRhKHVybCkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgcmV0dXJuIGRhdGFbJ2ZlZWRiYWNrVGV4dCddO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hTdXJ2ZXlRdWVzdGlvbnModXJsOiBzdHJpbmcpIHtcclxuICByZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICByZXR1cm4gZGF0YVsncXVlc3Rpb25zJ107XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFzc2Vzc21lbnRCdWNrZXRzKHVybDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGxvYWREYXRhKHVybCkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgcmV0dXJuIGRhdGFbJ2J1Y2tldHMnXTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFVUkwodXJsOiBzdHJpbmcpIHtcclxuICByZXR1cm4gJy9kYXRhLycgKyB1cmwgKyAnLmpzb24nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FzZUluZGVwZW5kZW50TGFuZ0xpc3QoKSB7XHJcbiAgcmV0dXJuIFsnbHVnYW5kYSddO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBsb2FkRGF0YSh1cmw6IHN0cmluZykge1xyXG4gIHZhciBmdXJsID0gZ2V0RGF0YVVSTCh1cmwpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGZ1cmwpO1xyXG4gIHJldHVybiBmZXRjaChmdXJsKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKTtcclxufVxyXG4iLCJcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kRnJvbShhcnJheSkge1xyXG4gIHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnJheS5sZW5ndGgpXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGVBcnJheShhcnJheSkge1xyXG4gIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICBbYXJyYXlbaV0sIGFycmF5W2pdXSA9IFthcnJheVtqXSwgYXJyYXlbaV1dO1xyXG4gIH1cclxufVxyXG4iLCIvKipcclxuICogTW9kdWxlIHRoYXQgd3JhcHMgVW5pdHkgY2FsbHMgZm9yIHNlbmRpbmcgbWVzc2FnZXMgZnJvbSB0aGUgd2VidmlldyB0byBVbml0eS5cclxuICovXHJcblxyXG5kZWNsYXJlIGNvbnN0IFVuaXR5O1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuaXR5QnJpZGdlIHtcclxuICBwcml2YXRlIHVuaXR5UmVmZXJlbmNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGlmICh0eXBlb2YgVW5pdHkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UgPSBVbml0eTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIFNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgaWYgKHRoaXMudW5pdHlSZWZlcmVuY2UgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy51bml0eVJlZmVyZW5jZS5jYWxsKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIFNlbmRMb2FkZWQoKSB7XHJcbiAgICBpZiAodGhpcy51bml0eVJlZmVyZW5jZSAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwoJ2xvYWRlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3dvdWxkIGNhbGwgVW5pdHkgbG9hZGVkIG5vdycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIFNlbmRDbG9zZSgpIHtcclxuICAgIGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UuY2FsbCgnY2xvc2UnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd3b3VsZCBjbG9zZSBVbml0eSBub3cnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIENvbnRhaW5zIHV0aWxzIGZvciB3b3JraW5nIHdpdGggVVJMIHN0cmluZ3MuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcFR5cGUoKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcclxuICBjb25zdCBhcHBUeXBlID0gcGF0aFBhcmFtcy5nZXQoJ2FwcFR5cGUnKTtcclxuICByZXR1cm4gYXBwVHlwZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFVVSUQoKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcclxuICB2YXIgbnV1aWQgPSBwYXRoUGFyYW1zLmdldCgnY3JfdXNlcl9pZCcpO1xyXG4gIGlmIChudXVpZCA9PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdubyB1dWlkIHByb3ZpZGVkJyk7XHJcbiAgICBudXVpZCA9ICdXZWJVc2VyTm9JRCc7XHJcbiAgfVxyXG4gIHJldHVybiBudXVpZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJTb3VyY2UoKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcclxuICB2YXIgbnV1aWQgPSBwYXRoUGFyYW1zLmdldCgndXNlclNvdXJjZScpO1xyXG4gIGlmIChudXVpZCA9PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdubyB1c2VyIHNvdXJjZSBwcm92aWRlZCcpO1xyXG4gICAgbnV1aWQgPSAnV2ViVXNlck5vU291cmNlJztcclxuICB9XHJcbiAgcmV0dXJuIG51dWlkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YUZpbGUoKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcclxuICB2YXIgZGF0YSA9IHBhdGhQYXJhbXMuZ2V0KCdkYXRhJyk7XHJcbiAgaWYgKGRhdGEgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZGVmYXVsdCBkYXRhIGZpbGUnKTtcclxuICAgIGRhdGEgPSAnenVsdS1sZXR0ZXJzb3VuZHMnO1xyXG4gICAgLy9kYXRhID0gXCJzdXJ2ZXktenVsdVwiO1xyXG4gIH1cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG4vLyBHZXQgQXBwIExhbmd1YWdlIEZyb20gRGF0YSBVUkxcclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoYXBwVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAvLyBDaGVjayBpZiBhcHAgdHlwZSBpcyBub3QgZW1wdHkgYW5kIHNwbGl0IHRoZSBzdHJpbmcgYnkgdGhlIGh5cGhlbiB0aGVuIHJldHVybiB0aGUgZmlyc3QgZWxlbWVudFxyXG4gIGlmIChhcHBUeXBlICYmIGFwcFR5cGUgIT09ICcnICYmIGFwcFR5cGUuaW5jbHVkZXMoJy0nKSkge1xyXG4gICAgbGV0IGxhbmd1YWdlOiBzdHJpbmcgPSBhcHBUeXBlLnNwbGl0KCctJykuc2xpY2UoMCwgLTEpLmpvaW4oJy0nKTtcclxuICAgIGlmIChsYW5ndWFnZS5pbmNsdWRlcygnd2VzdC1hZnJpY2FuJykpIHtcclxuICAgICAgcmV0dXJuICd3ZXN0LWFmcmljYW4tZW5nbGlzaCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbGFuZ3VhZ2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gJ05vdEF2YWlsYWJsZSc7XHJcbn1cclxuLy8gR2V0IEFwcCBUeXBlIEZyb20gRGF0YSBVUkxcclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcFR5cGVGcm9tRGF0YVVSTChhcHBUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIC8vIENoZWNrIGlmIGFwcCB0eXBlIGlzIG5vdCBlbXB0eSBhbmQgc3BsaXQgdGhlIHN0cmluZyBieSB0aGUgaHlwaGVuIHRoZW4gcmV0dXJuIHRoZSBsYXN0IGVsZW1lbnRcclxuICBpZiAoYXBwVHlwZSAmJiBhcHBUeXBlICE9PSAnJyAmJiBhcHBUeXBlLmluY2x1ZGVzKCctJykpIHtcclxuICAgIHJldHVybiBhcHBUeXBlLnN1YnN0cmluZyhhcHBUeXBlLmxhc3RJbmRleE9mKCctJykgKyAxKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAnTm90QXZhaWxhYmxlJztcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVxdWlyZWRTY29yZSgpIHtcclxuICBsZXQgcGF0aFBhcmFtcyA9IGdldFBhdGhOYW1lKCk7XHJcbiAgcmV0dXJuIHBhdGhQYXJhbXMuZ2V0KFwicmVxdWlyZWRTY29yZVwiKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dEFzc2Vzc21lbnQoKSB7XHJcbiAgbGV0IHBhdGhQYXJhbXMgPSBnZXRQYXRoTmFtZSgpO1xyXG4gIHJldHVybiBwYXRoUGFyYW1zLmdldChcIm5leHRBc3Nlc3NtZW50XCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXRoTmFtZSgpIHtcclxuICBjb25zdCBxdWVyeVN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxdWVyeVN0cmluZyk7XHJcbiAgcmV0dXJuIHVybFBhcmFtcztcclxufVxyXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9