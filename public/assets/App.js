var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUUID, getUserSource, getDataFile, getAppLanguageFromDataURL, getAppTypeFromDataURL } from './utils/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment';
import { UnityBridge } from './utils/unityBridge';
import { AudioController } from './components/audioController';
import { fetchAppData, getDataURL, setBaseUrl } from './utils/jsonUtils';
import { Workbox } from 'workbox-window';
import CacheModel from './components/cacheModel';
import { UIController } from './ui/uiController';
import { AnalyticsIntegration } from './analytics/analytics-integration';
import { getLocation, setCommonAnalyticsEventsProperties, setLocationProperty } from './utils/AnalyticsUtils';
const appVersion = 'v1.1.3';
let contentVersion = '';
let loadingScreen = null;
let progressBar = null;
const broadcastChannel = new BroadcastChannel('as-message-channel');
export class App {
    constructor() {
        this.lang = 'english';
        this.unityBridge = new UnityBridge();
        console.log('Initializing app...');
        console.log('Microfrontend Assessment/Survey App Version: 1.4');
        this.dataURL = getDataFile();
        this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set());
    }
    spinUp(baseUrl = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (baseUrl) {
                AudioController.getInstance().baseUrl = baseUrl;
                UIController.getInstance().baseUrl = baseUrl;
                setBaseUrl(baseUrl);
            }
            yield AnalyticsIntegration.initializeAnalytics();
            this.analyticsIntegration = AnalyticsIntegration.getInstance();
            loadingScreen = document.getElementById('loadingScreen');
            progressBar = document.getElementById('progressBar');
            const data = yield fetchAppData(this.dataURL);
            this.cacheModel.setContentFilePath(getDataURL(this.dataURL));
            UIController.SetFeedbackText(data['feedbackText']);
            let appType = data['appType'];
            if (appType === 'survey') {
                this.game = new Survey(this.dataURL, this.unityBridge);
            }
            else {
                this.game = new Assessment(this.dataURL, this.unityBridge);
            }
            this.game.unityBridge = this.unityBridge;
            contentVersion = data['contentVersion'];
            this.setCommonProperties();
            this.logInitialAnalyticsEvents();
            this.game.Run(this);
            console.log('Assessment/Survey ' + appVersion + ' initializing!');
            yield this.registerServiceWorker(this.game, this.dataURL);
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
            this.analyticsIntegration.track("opened", {});
            this.analyticsIntegration.track("user_location", {});
            this.analyticsIntegration.track("initialized", { type: "initialized" });
        });
    }
    registerServiceWorker(game, dataURL = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.__ASSESSMENT_MF__) {
                console.log('Skipping SW registration (MF mode)');
                return;
            }
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
                        UIController.SetContentLoaded(true);
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
            UIController.SetContentLoaded(true);
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
//# sourceMappingURL=App.js.map