/**
 * App class that represents an entry point of the application.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUUID, getUserSource, getDataFile, getAppLanguageFromDataURL, getAppTypeFromDataURL, configureRuntimeConfig } from './utils/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment';
import { UnityBridge } from './utils/unityBridge';
import { fetchAppData, getDataURL } from './utils/jsonUtils';
import { resolveAssetPath, setAssetBaseUrl } from './utils/assetUtils';
import { Workbox } from 'workbox-window';
import CacheModel from './components/cacheModel';
import { UIController } from './ui/uiController';
import { AnalyticsIntegration } from './analytics/analytics-integration';
import { getLocation, getCommonAnalyticsEventsProperties, setCommonAnalyticsEventsProperties, setLocationProperty } from './utils/AnalyticsUtils';
import { AndroidInterface } from '@curiouslearning/core';
import { ASSET_PATHS } from './config/assetsPaths';
const appVersion = 'v1.1.3';
/**
 * Content version from the data file in format v0.1
 * Gets set when the content is loaded
 */
let contentVersion = '';
const broadcastChannel = new BroadcastChannel('as-message-channel');
export class App {
    constructor(config = {}) {
        var _a, _b;
        this.lang = 'english';
        this.applyRuntimeConfig(config);
        this.applyHostIntegrationConfig(config);
        if (config.uiRoot) {
            UIController.ConfigureRoot(config.uiRoot);
        }
        this.unityBridge = this.enableUnityBridge ? new UnityBridge() : App.createNoopUnityBridge();
        console.log('Initializing app...');
        this.dataURL = (_a = config.dataURL) !== null && _a !== void 0 ? _a : getDataFile();
        this.enableServiceWorker = (_b = config.enableServiceWorker) !== null && _b !== void 0 ? _b : true;
        this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set());
    }
    spinUp(config = {}) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            this.applyRuntimeConfig(config);
            this.applyHostIntegrationConfig(config);
            const waitForWindowLoad = (_a = config.waitForWindowLoad) !== null && _a !== void 0 ? _a : true;
            const skipLoadingScreen = (_b = config.skipLoadingScreen) !== null && _b !== void 0 ? _b : false;
            const skipStartScreen = (_c = config.skipStartScreen) !== null && _c !== void 0 ? _c : false;
            this.enableServiceWorker = (_d = config.enableServiceWorker) !== null && _d !== void 0 ? _d : this.enableServiceWorker;
            UIController.SetGameReady(false);
            UIController.SetSkipStartScreen(skipStartScreen);
            if (skipLoadingScreen) {
                UIController.SetLoadingVisible(false);
            }
            yield AnalyticsIntegration.initializeAnalytics();
            this.analyticsIntegration = AnalyticsIntegration.getInstance();
            const initialize = () => __awaiter(this, void 0, void 0, function* () {
                console.log('Window Loaded!');
                yield this.initializeGame();
                if (skipLoadingScreen) {
                    localStorage.setItem(this.cacheModel.appName, 'true');
                    UIController.SetLoadingProgress(100);
                    UIController.SetLoadingVisible(false);
                    UIController.SetContentLoaded(true);
                }
                if (this.enableServiceWorker) {
                    yield this.registerServiceWorker(this.game, this.dataURL, skipLoadingScreen);
                }
                else {
                    localStorage.setItem(this.cacheModel.appName, 'true');
                    UIController.SetLoadingVisible(false);
                    UIController.SetContentLoaded(true);
                }
            });
            if (!waitForWindowLoad || document.readyState === 'complete') {
                yield initialize();
                return;
            }
            window.addEventListener('load', () => {
                initialize();
            });
        });
    }
    static createNoopUnityBridge() {
        return {
            SendMessage: (_message) => { },
            SendLoaded: () => { },
            SendClose: () => { },
        };
    }
    applyRuntimeConfig(config) {
        var _a;
        setAssetBaseUrl((_a = config.assetBaseUrl) !== null && _a !== void 0 ? _a : '');
        configureRuntimeConfig({
            data: config.dataURL,
            cr_user_id: config.userId,
            userSource: config.userSource,
            requiredScore: config.requiredScore,
            nextAssessment: config.nextAssessment,
            endpoint: config.endpoint,
            organization: config.organization,
        });
        if (config.dataURL) {
            this.dataURL = config.dataURL;
            if (this.cacheModel) {
                this.cacheModel.setAppName(config.dataURL);
            }
        }
    }
    applyHostIntegrationConfig(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.enableUnityBridge = (_b = (_a = config.enableUnityBridge) !== null && _a !== void 0 ? _a : this.enableUnityBridge) !== null && _b !== void 0 ? _b : true;
        this.enableAndroidSummary = (_d = (_c = config.enableAndroidSummary) !== null && _c !== void 0 ? _c : this.enableAndroidSummary) !== null && _d !== void 0 ? _d : true;
        this.enableParentPostMessage = (_f = (_e = config.enableParentPostMessage) !== null && _e !== void 0 ? _e : this.enableParentPostMessage) !== null && _f !== void 0 ? _f : true;
        this.hostIntegrationAdapters = Object.assign(Object.assign({}, ((_g = this.hostIntegrationAdapters) !== null && _g !== void 0 ? _g : {})), ((_h = config.hostIntegrationAdapters) !== null && _h !== void 0 ? _h : {}));
    }
    initializeGame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetchAppData(this.dataURL).then((data) => {
                console.log('Assessment/Survey ' + appVersion + ' initializing!');
                console.log('App data loaded!');
                console.log(data);
                this.cacheModel.setContentFilePath(getDataURL(this.dataURL));
                UIController.SetFeedbackText(data['feedbackText']);
                let appType = data['appType'];
                if (appType == 'survey') {
                    this.game = new Survey(this.dataURL, this.unityBridge);
                }
                else if (appType == 'assessment') {
                    let buckets = data['buckets'];
                    for (let i = 0; i < buckets.length; i++) {
                        for (let j = 0; j < buckets[i].items.length; j++) {
                            let audioItemURL;
                            if (data['quizName'].includes('Luganda') ||
                                data['quizName'].toLowerCase().includes('west african english')) {
                                audioItemURL = resolveAssetPath(ASSET_PATHS.AUDIO.itemAudio(this.dataURL, buckets[i].items[j].itemName.toLowerCase().trim()));
                            }
                            else {
                                audioItemURL = resolveAssetPath(ASSET_PATHS.AUDIO.itemAudio(this.dataURL, buckets[i].items[j].itemName.trim()));
                            }
                            this.cacheModel.addItemToAudioVisualResources(audioItemURL);
                        }
                    }
                    this.cacheModel.addItemToAudioVisualResources(resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(this.dataURL)));
                    this.game = new Assessment(this.dataURL, this.unityBridge);
                }
                this.game.unityBridge = this.unityBridge;
                contentVersion = data['contentVersion'];
                this.setCommonProperties();
                this.logInitialAnalyticsEvents();
                this.game.Run(this);
                this.game.subscribe('ENDED', (gameInstance) => {
                    const { score, startTime, endTime } = gameInstance;
                    this.notifySummaryData({
                        app_type: appType,
                        score,
                        time_spent: endTime - startTime,
                    });
                });
            });
        });
    }
    setCommonProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            setCommonAnalyticsEventsProperties(getUUID(), getAppLanguageFromDataURL(this.dataURL), getAppTypeFromDataURL(this.dataURL), getUserSource(), contentVersion, appVersion);
        });
    }
    logInitialAnalyticsEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const lat_lang = yield getLocation();
            setLocationProperty(lat_lang !== null && lat_lang !== void 0 ? lat_lang : 'NotAvailable');
            this.analyticsIntegration.track("opened" /* AnalyticsEventsType.OPENED */, {});
            this.analyticsIntegration.track("user_location" /* AnalyticsEventsType.USER_LOCATION */, {});
            this.analyticsIntegration.track("initialized" /* AnalyticsEventsType.INITIALIZE */, { type: "initialized" });
        });
    }
    registerServiceWorker(game, dataURL = '', skipLoadingScreen = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Registering service worker...');
            if ('serviceWorker' in navigator) {
                let wb = new Workbox('./sw.js', {});
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
                // We need to check if there's a new version of the content file and in that case
                // remove the localStorage content name and version value
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
                    // We need to check here for the content version updates
                    // If there's a new content version, we need to remove the cached content and reload
                    // We are comparing here the contentVersion with the aheadContentVersion
                    if (aheadContentVersion && contentVersion != aheadContentVersion) {
                        console.log('Content version mismatch! Reloading...');
                        localStorage.removeItem(this.cacheModel.appName);
                        // Clear the cache for tht particular content
                        caches.delete(this.cacheModel.appName);
                        handleUpdateFoundMessage();
                    }
                }))
                    .catch((error) => {
                    console.error('Error fetching the content file: ' + error);
                });
                if (localStorage.getItem(this.cacheModel.appName) == null) {
                    console.log('Caching!' + this.cacheModel.appName);
                    if (!skipLoadingScreen) {
                        UIController.SetLoadingVisible(true);
                    }
                    broadcastChannel.postMessage({
                        command: 'Cache',
                        data: {
                            appData: this.cacheModel,
                        },
                    });
                }
                else {
                    UIController.SetLoadingProgress(100);
                    setTimeout(() => {
                        UIController.SetLoadingVisible(false);
                        UIController.SetContentLoaded(true);
                    }, skipLoadingScreen ? 0 : 1500);
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
    notifyLoaded() {
        var _a, _b;
        UIController.SetGameReady(true);
        if (this.enableUnityBridge) {
            this.unityBridge.SendLoaded();
        }
        (_b = (_a = this.hostIntegrationAdapters) === null || _a === void 0 ? void 0 : _a.onLoaded) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    notifyClose() {
        var _a, _b;
        if (this.enableUnityBridge) {
            this.unityBridge.SendClose();
        }
        (_b = (_a = this.hostIntegrationAdapters) === null || _a === void 0 ? void 0 : _a.onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    notifySummaryData(summaryData) {
        var _a, _b;
        if (this.enableAndroidSummary) {
            const { cr_user_id } = getCommonAnalyticsEventsProperties();
            const androidInterface = new AndroidInterface({
                cr_user_id,
                app_id: 'assessment',
            });
            androidInterface.logSummaryData(summaryData);
        }
        (_b = (_a = this.hostIntegrationAdapters) === null || _a === void 0 ? void 0 : _a.onSummaryData) === null || _b === void 0 ? void 0 : _b.call(_a, summaryData);
    }
    notifyAssessmentCompleted(score) {
        var _a, _b;
        const payload = {
            type: 'assessment_completed',
            score,
        };
        if (this.enableParentPostMessage && window.parent) {
            window.parent.postMessage(payload, 'https://synapse.curiouscontent.org/');
        }
        (_b = (_a = this.hostIntegrationAdapters) === null || _a === void 0 ? void 0 : _a.onAssessmentCompleted) === null || _b === void 0 ? void 0 : _b.call(_a, payload);
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
        UIController.SetLoadingProgress(progressValue);
    }
    else if (progressValue >= 100) {
        UIController.SetLoadingProgress(100);
        setTimeout(() => {
            UIController.SetLoadingVisible(false);
            UIController.SetContentLoaded(true);
        }, 1500);
        // add book with a name to local storage as cached
        localStorage.setItem(event.data.data.bookName, 'true');
        readLanguageDataFromCacheAndNotifyAndroidApp(event.data.data.bookName);
    }
}
function readLanguageDataFromCacheAndNotifyAndroidApp(bookName) {
    //@ts-ignore
    if (window.Android) {
        let isContentCached = localStorage.getItem(bookName) !== null;
        //@ts-ignore
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
export function createApp(config = {}) {
    return new App(config);
}
export function startStandaloneApp(config = {}) {
    console.log(config);
    const app = new App(config);
    app.spinUp(config);
    return app;
}
