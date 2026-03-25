/**
 * App class that represents an entry point of the application.
 */

import { getUUID, getUserSource, getDataFile, getAppLanguageFromDataURL, getAppTypeFromDataURL } from './utils/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment';
import { UnityBridge } from './utils/unityBridge';
import { AnalyticsEvents } from './analytics/analyticsEvents';
import { BaseQuiz } from './baseQuiz';
import { fetchAppData, getDataURL } from './utils/jsonUtils';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Workbox } from 'workbox-window';
import CacheModel from './components/cacheModel';
import { UIController } from './ui/uiController';
import { AnalyticsEventsType, AnalyticsIntegration } from './analytics/analytics-integration';
import { getLocation, getCommonAnalyticsEventsProperties, setCommonAnalyticsEventsProperties, setLocationProperty } from './utils/AnalyticsUtils';
let AndroidInterface: any;
try {
  AndroidInterface = require('@curiouslearning/core').AndroidInterface;
} catch (err) {
  AndroidInterface = class {
    constructor(_opts: any) {}
    logUserSessionsData(_args: any) {}
  };
}

const appVersion: string = 'v1.1.3';

/**
 * Content version from the data file in format v0.1
 * Gets set when the content is loaded
 */
let contentVersion: string = '';

const broadcastChannel: BroadcastChannel = new BroadcastChannel('as-message-channel');

function getLoadingScreen(): HTMLElement | null {
  return document.getElementById('loadingScreen');
}

function getProgressBar(): HTMLElement | null {
  return document.getElementById('progressBar');
}

export class App {
  /** Could be 'assessment' or 'survey' based on the data file */
  public dataURL: string;

  public unityBridge;
  public analytics;
  public game: BaseQuiz;
  public analyticsIntegration: AnalyticsIntegration;
  cacheModel: CacheModel;

  lang: string = 'english';

  constructor() {
    this.unityBridge = new UnityBridge();

    console.log('Initializing app...');

    this.dataURL = getDataFile();
    this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set<string>());


  }

  public async spinUp() {
    await AnalyticsIntegration.initializeAnalytics();
    this.analyticsIntegration = AnalyticsIntegration.getInstance();

    const initialize = async () => {
      try {
        const data = await fetchAppData(this.dataURL);
        this.cacheModel.setContentFilePath(getDataURL(this.dataURL));
        UIController.SetFeedbackText?.(data['feedbackText']);

        let appType = data['appType'];
        let assessmentType = data['assessmentType'];

        if (appType == Survey.TYPE) {
          this.game = new Survey(this.dataURL, this.unityBridge);
        } else if (appType == Assessment.TYPE) {
          let buckets = data['buckets'] || [];

          for (let i = 0; i < buckets.length; i++) {
            for (let j = 0; j < buckets[i].items.length; j++) {
              let audioItemURL;
              if (
                data['quizName']?.includes('Luganda') ||
                data['quizName']?.toLowerCase().includes('west african english')
              ) {
                audioItemURL =
                  '/audio/' + this.dataURL + '/' + buckets[i].items[j].itemName.toLowerCase().trim() + '.mp3';
              } else {
                audioItemURL = '/audio/' + this.dataURL + '/' + buckets[i].items[j].itemName.trim() + '.mp3';
              }
              this.cacheModel.addItemToAudioVisualResources(audioItemURL);
            }
          }

          this.cacheModel.addItemToAudioVisualResources('/audio/' + this.dataURL + '/answer_feedback.mp3');
          this.game = new Assessment(this.dataURL, this.unityBridge);
        }

        if (this.game != null) {
          this.game.unityBridge = this.unityBridge;
        }

        contentVersion = data['contentVersion'];

        await this.setCommonProperties();
        await this.logInitialAnalyticsEvents();

        this.game?.Run?.(this);

        this.game?.subscribe?.('ENDED', (gameInstance: BaseQuiz) => {
          if (appType !== 'assessment') return;

          const { cr_user_id, language } = getCommonAnalyticsEventsProperties();
          const androidInterface = new AndroidInterface({
            cr_user_id,
            app_id: appType,
            debug: false,
            log: false,
          });
          const { score, startTime, endTime, max_score } = gameInstance;
          androidInterface.logUserSessionsData({
            type: assessmentType || appType,
            lang: language,
            score,
            max_score,
            time_spent: endTime - startTime,
            event_type: 'activity_completed',
          });
        });

        await this.registerServiceWorker(this.game, this.dataURL);
      } catch (err) {
        console.error('Error initializing app:', err);
      }
    };

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        await initialize();
      } else {
        window.addEventListener('load', async () => {
          await initialize();
        });
      }
    } else {
      await initialize();
    }
  }
  async setCommonProperties() {
    setCommonAnalyticsEventsProperties(getUUID(), getAppLanguageFromDataURL(this.dataURL), getAppTypeFromDataURL(this.dataURL), getUserSource(), contentVersion, appVersion);
  }
  async logInitialAnalyticsEvents() {
    const lat_lang = await getLocation();
    setLocationProperty(lat_lang ?? 'NotAvailable');
    this.analyticsIntegration?.track?.(AnalyticsEventsType.OPENED, {});
    this.analyticsIntegration?.track?.(AnalyticsEventsType.USER_LOCATION, {});
    this.analyticsIntegration?.track?.(AnalyticsEventsType.INITIALIZE, { type: 'initialized' });

  }
  async registerServiceWorker(game: BaseQuiz, dataURL: string = '') {
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

      await navigator.serviceWorker.ready;

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
        .then(async (response) => {
          if (!response.ok) {
            console.error('Failed to fetch the content file from the server!');
            return;
          }
          const newContentFileData = await response.json();
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
        })
        .catch((error) => {
          console.error('Error fetching the content file: ' + error);
        });

      if (localStorage.getItem(this.cacheModel.appName) == null) {
        console.log('Caching!' + this.cacheModel.appName);
        getLoadingScreen()?.style && (getLoadingScreen()!.style.display = 'flex');
        broadcastChannel.postMessage({
          command: 'Cache',
          data: {
            appData: this.cacheModel,
          },
        });
      } else {
        const progressBar = getProgressBar();
        if (progressBar) {
          progressBar.style.width = '100%';
        }
        setTimeout(() => {
          const loadingScreen = getLoadingScreen();
          if (loadingScreen) {
            loadingScreen.style.display = 'none';
          }
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
    } else {
      console.warn('Service workers are not supported in this browser.');
    }
  }

  handleServiceWorkerRegistation(registration: ServiceWorkerRegistration | undefined): void {
    try {
      registration?.installing?.postMessage({
        type: 'Registartion',
        value: this.lang,
      });
    } catch (err) {
      console.log('Service worker registration failed: ' + err);
    }
  }

  public GetDataURL(): string {
    return this.dataURL;
  }
}

broadcastChannel.addEventListener('message', handleServiceWorkerMessage);

function handleServiceWorkerMessage(event): void {
  if (event.data.msg == 'Loading') {
    let progressValue = parseInt(event.data.data.progress);
    handleLoadingMessage(event, progressValue);
  }
  if (event.data.msg == 'UpdateFound') {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>.,update Found');
    handleUpdateFoundMessage();
  }
}

function handleLoadingMessage(event, progressValue): void {
  const progressBar = getProgressBar();
  const loadingScreen = getLoadingScreen();

  if (progressValue < 40 && progressValue >= 10) {
    if (progressBar) {
      progressBar.style.width = progressValue + '%';
    }
  } else if (progressValue >= 100) {
    if (progressBar) {
      progressBar.style.width = '100%';
    }
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
      UIController.SetContentLoaded(true);
    }, 1500);
    // add book with a name to local storage as cached
    localStorage.setItem(event.data.data.bookName, 'true');
    readLanguageDataFromCacheAndNotifyAndroidApp(event.data.data.bookName);
  }
}

function readLanguageDataFromCacheAndNotifyAndroidApp(bookName: string) {
  //@ts-ignore
  if (window.Android) {
    let isContentCached: boolean = localStorage.getItem(bookName) !== null;
    //@ts-ignore
    window.Android.cachedStatus(isContentCached);
  }
}

function handleUpdateFoundMessage(): void {
  let text = 'Update Found.\nPlease accept the update by pressing Ok.';
  if (confirm(text) == true) {
    window.location.reload();
  } else {
    text = 'Update will happen on the next launch.';
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const app = new App();
  app.spinUp();
}
