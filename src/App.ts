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
import { FinalScoreScreen } from './components/finalScoreScreen';
import { APP_VERSION } from './utils/constants';
import { logger } from './utils/logger';
import { AppData } from './utils/types';

const appVersion: string = APP_VERSION;

/**
 * Content version from the data file in format v0.1
 * Gets set when the content is loaded
 */
let contentVersion: string = '';

let loadingScreen = document.getElementById('loadingScreen');
const progressBar = document.getElementById('progressBar');
const broadcastChannel: BroadcastChannel = new BroadcastChannel('as-message-channel');

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

    logger.info('Initializing app...');

    this.dataURL = getDataFile();
    this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set<string>());


  }

  public async spinUp() {
    await AnalyticsIntegration.initializeAnalytics();
    this.analyticsIntegration = AnalyticsIntegration.getInstance();
    window.addEventListener('load', () => {
      logger.info('Window Loaded!');
      (async () => {
        // Check for unconfirmed score on app startup
        // This must happen after DOM is ready but before loading app data
        const scoreScreen = FinalScoreScreen.getInstance();
        const hasUnconfirmedScore = scoreScreen.checkAndRestore();

        // If there's an unconfirmed score, don't proceed with normal app initialization
        // The score screen will handle navigation after confirmation
        if (hasUnconfirmedScore) {
          logger.info('Unconfirmed score found. Showing score screen.');
          return; // Exit early - score screen is now visible and navigation is locked
        }

        await fetchAppData(this.dataURL).then((data: AppData) => {
          logger.info(`Assessment/Survey ${appVersion} initializing!`);
          logger.debug('App data loaded!', data);

          this.cacheModel.setContentFilePath(getDataURL(this.dataURL));

          // Set feedback text from app data
          UIController.SetFeedbackText(data['feedbackText']);

          let appType = data['appType'];
          let assessmentType = data['assessmentType'];

          if (appType == 'survey') {
            this.game = new Survey(this.dataURL, this.unityBridge);
          } else if (appType == 'assessment') {
            // Get and add all the audio assets to the cache model

            let buckets = data['buckets'];

            for (let i = 0; i < buckets.length; i++) {
              for (let j = 0; j < buckets[i].items.length; j++) {
                let audioItemURL;
                // Use to lower case for the Lugandan data
                if (
                  data['quizName'].includes('Luganda') ||
                  data['quizName'].toLowerCase().includes('west african english')
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

          this.game.unityBridge = this.unityBridge;

          contentVersion = data['contentVersion'];

          this.setCommonProperties();
          // AnalyticsEvents.sendInit(appVersion, data['contentVersion']);
          this.logInitialAnalyticsEvents();
          // this.cacheModel.setAppName(this.cacheModel.appName + ':' + data["contentVersion"]);

          this.game.Run(this);
        });

        await this.registerServiceWorker(this.game, this.dataURL);
      })();
    });
  }
  async setCommonProperties() {
    setCommonAnalyticsEventsProperties(getUUID(), getAppLanguageFromDataURL(this.dataURL), getAppTypeFromDataURL(this.dataURL), getUserSource(), contentVersion, appVersion);
  }
  async logInitialAnalyticsEvents() {
    const lat_lang = await getLocation();
    setLocationProperty(lat_lang ?? 'NotAvailable');
    this.analyticsIntegration.track(AnalyticsEventsType.OPENED, {})

    this.analyticsIntegration.track(AnalyticsEventsType.USER_LOCATION, {});

    this.analyticsIntegration.track(AnalyticsEventsType.INITIALIZE, { type: "initialized" })

  }
  async registerServiceWorker(game: BaseQuiz, dataURL: string = '') {
    logger.info('Registering service worker...');

    if ('serviceWorker' in navigator) {
      let wb = new Workbox('./sw.js', {});

      wb.register()
        .then((registration) => {
          logger.info('Service worker registered!');
          this.handleServiceWorkerRegistation(registration);
        })
        .catch((err) => {
          logger.error('Service worker registration failed', err);
        });

      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      await navigator.serviceWorker.ready;

      logger.debug('Cache Model:', this.cacheModel);

      // We need to check if there's a new version of the content file and in that case
      // remove the localStorage content name and version value

      logger.debug(`Checking for content version updates... ${dataURL}`);

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
            logger.error('Failed to fetch the content file from the server!');
            return;
          }
          const newContentFileData = await response.json();
          const aheadContentVersion = newContentFileData['contentVersion'];
          logger.debug(`No Cache Content version: ${aheadContentVersion}`);

          // We need to check here for the content version updates
          // If there's a new content version, we need to remove the cached content and reload
          // We are comparing here the contentVersion with the aheadContentVersion
          if (aheadContentVersion && contentVersion !== aheadContentVersion) {
            logger.info('Content version mismatch! Reloading...');
            localStorage.removeItem(this.cacheModel.appName);
            // Clear the cache for that particular content
            caches.delete(this.cacheModel.appName);
            handleUpdateFoundMessage();
          }
        })
        .catch((error) => {
          logger.error('Error fetching the content file', error);
        });

      if (localStorage.getItem(this.cacheModel.appName) == null) {
        logger.info(`Caching! ${this.cacheModel.appName}`);
        loadingScreen!.style.display = 'flex';
        broadcastChannel.postMessage({
          command: 'Cache',
          data: {
            appData: this.cacheModel,
          },
        });
      } else {
        progressBar!.style.width = 100 + '%';
        setTimeout(() => {
          loadingScreen!.style.display = 'none';
          UIController.SetContentLoaded(true);
        }, 1500);
      }

      broadcastChannel.onmessage = (event) => {
        logger.debug(`${event.data.command} received from service worker!`);
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
      logger.warn('Service workers are not supported in this browser.');
    }
  }

  handleServiceWorkerRegistation(registration: ServiceWorkerRegistration | undefined): void {
    try {
      registration?.installing?.postMessage({
        type: 'Registartion',
        value: this.lang,
      });
    } catch (err) {
      logger.error('Service worker registration failed', err);
    }
  }

  public GetDataURL(): string {
    return this.dataURL;
  }
}

broadcastChannel.addEventListener('message', handleServiceWorkerMessage);

function handleServiceWorkerMessage(event): void {
  if (event.data.msg === 'Loading') {
    const progressValue = parseInt(event.data.data.progress);
    handleLoadingMessage(event, progressValue);
  }
  if (event.data.msg === 'UpdateFound') {
    logger.info('Update Found');
    handleUpdateFoundMessage();
  }
}

function handleLoadingMessage(event, progressValue): void {
  if (progressValue < 40 && progressValue >= 10) {
    progressBar!.style.width = progressValue + '%';
  } else if (progressValue >= 100) {
    progressBar!.style.width = 100 + '%';
    setTimeout(() => {
      loadingScreen!.style.display = 'none';
      UIController.SetContentLoaded(true);
    }, 1500);
    // add book with a name to local storage as cached
    localStorage.setItem(event.data.data.bookName, 'true');
    readLanguageDataFromCacheAndNotifyAndroidApp(event.data.data.bookName);
  }
}

function readLanguageDataFromCacheAndNotifyAndroidApp(bookName: string): void {
  if (window.Android?.cachedStatus) {
    const isContentCached: boolean = localStorage.getItem(bookName) !== null;
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

const app = new App();
app.spinUp();
