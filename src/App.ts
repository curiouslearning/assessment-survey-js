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

import CacheModel from './components/cacheModel';
import { UIController } from './ui/uiController';
import { AnalyticsEventsType, AnalyticsIntegration } from './analytics/analytics-integration';
import { getLocation, getCommonAnalyticsEventsProperties, setCommonAnalyticsEventsProperties, setLocationProperty } from './utils/AnalyticsUtils';

import { FinalScoreScreen } from './components/finalScoreScreen';

import { AndroidInterface } from '@curiouslearning/core';


const appVersion: string = 'v1.1.3';

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

    console.log('Initializing app...');

    this.dataURL = getDataFile();
    this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set<string>());


  }

  public async spinUp() {
    await AnalyticsIntegration.initializeAnalytics();
    this.analyticsIntegration = AnalyticsIntegration.getInstance();
    window.addEventListener('load', () => {
      console.log('Window Loaded!');
      (async () => {
        // Check for unconfirmed score on app startup
        // This must happen after DOM is ready but before loading app data
        const scoreScreen = FinalScoreScreen.getInstance();
        const hasUnconfirmedScore = scoreScreen.checkAndRestore();

        // If there's an unconfirmed score, don't proceed with normal app initialization
        // The score screen will handle navigation after confirmation
        if (hasUnconfirmedScore) {
          console.log('Unconfirmed score found. Showing score screen.');
          return; // Exit early - score screen is now visible and navigation is locked
        }

        await fetchAppData(this.dataURL).then((data) => {
          console.log('Assessment/Survey ' + appVersion + ' initializing!');
          console.log('App data loaded!');
          console.log(data);

          this.cacheModel.setContentFilePath(getDataURL(this.dataURL));

          // TODO: Why do we need to set the feedback text here?
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

          // NOTE: when adding new event handling, simply list it down here.
          this.game.subscribe('ENDED', (gameInstance: BaseQuiz) => {
            const { cr_user_id } = getCommonAnalyticsEventsProperties();
            const androidInterface = new AndroidInterface({
              cr_user_id,
              app_id: 'assessment',
            });
            const { score, startTime, endTime } = gameInstance;
            androidInterface.logSummaryData({
              app_type: appType,
              score,
              time_spent: endTime - startTime
            })
          });
        });
        loadingScreen!.style.display = 'none';
        // await this.registerServiceWorker(this.game, this.dataURL);
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

const app = new App();
app.spinUp();
