/**
 * App class that represents an entry point of the application.
 */

import { getUUID, getUserSource, getDataFile } from './components/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment';
import { UnityBridge } from './components/unityBridge';
import { AnalyticsEvents } from './components/analyticsEvents';
import { BaseQuiz } from './baseQuiz';
import { fetchAppData, getDataURL } from './components/jsonUtils';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Workbox } from 'workbox-window';
import CacheModel from './components/cacheModel';
import { UIController } from './components/uiController';

const appVersion: string = 'v1.1.1';


/**
 * Content version from the data file in format v0.1
 * Gets set when the content is loaded
 */
let contentVersion: string = '';

let loadingScreen = document.getElementById('loadingScreen');
const progressBar = document.getElementById('progressBar');
const broadcastChannel: BroadcastChannel = new BroadcastChannel(
  'as-message-channel'
);

export class App {
  /** Could be 'assessment' or 'survey' based on the data file */
  public dataURL: string;

  public unityBridge;
  public analytics;
  public game: BaseQuiz;

  cacheModel: CacheModel;

  lang: string = 'english';

  constructor() {
    this.unityBridge = new UnityBridge();

    console.log('Initializing app...');

    this.dataURL = getDataFile();
    this.cacheModel = new CacheModel(
      this.dataURL,
      this.dataURL,
      new Set<string>()
    );

    // console.log("Data file: " + this.dataURL);

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

    const fapp = initializeApp(firebaseConfig);
    const fanalytics = getAnalytics(fapp);

    this.analytics = fanalytics;
    logEvent(fanalytics, 'notification_received');
    logEvent(fanalytics, 'test initialization event', {});

    console.log('firebase initialized');
  }

  public async spinUp() {
    window.addEventListener('load', () => {
      console.log('Window Loaded!');
      (async () => {
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
                  data['quizName']
                    .toLowerCase()
                    .includes('west african english')
                ) {
                  audioItemURL =
                    '/audio/' +
                    this.dataURL +
                    '/' +
                    buckets[i].items[j].itemName.toLowerCase().trim() +
                    '.mp3';
                } else {
                  audioItemURL =
                    '/audio/' +
                    this.dataURL +
                    '/' +
                    buckets[i].items[j].itemName.trim() +
                    '.mp3';
                }

                this.cacheModel.addItemToAudioVisualResources(audioItemURL);
              }
            }

            this.cacheModel.addItemToAudioVisualResources(
              '/audio/' + this.dataURL + '/answer_feedback.mp3'
            );

            this.game = new Assessment(this.dataURL, this.unityBridge);
          }

          this.game.unityBridge = this.unityBridge;

          AnalyticsEvents.setUuid(getUUID(), getUserSource());
          AnalyticsEvents.linkAnalytics(this.analytics, this.dataURL);
          AnalyticsEvents.setAssessmentType(assessmentType);
          contentVersion = data['contentVersion'];
          AnalyticsEvents.sendInit(appVersion, data['contentVersion']);
          // this.cacheModel.setAppName(this.cacheModel.appName + ':' + data["contentVersion"]);

          this.game.Run(this);
        });

        await this.registerServiceWorker(this.game, this.dataURL);
      })();
    });
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

      navigator.serviceWorker.addEventListener(
        'message',
        handleServiceWorkerMessage
      );

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
      }).then(async (response) => {
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
      }).catch((error) => { 
        console.error('Error fetching the content file: ' + error);
      });

      if (localStorage.getItem(this.cacheModel.appName) == null) {
        console.log('Caching!' + this.cacheModel.appName);
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
        }, 1500);
      }

      broadcastChannel.onmessage = (event) => {
        console.log(event.data.command + ' received from service worker!');
        if (
          event.data.command == 'Activated' &&
          localStorage.getItem(this.cacheModel.appName) == null
        ) {
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

  handleServiceWorkerRegistation(
    registration: ServiceWorkerRegistration | undefined
  ): void {
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
    }, 1500);

    UIController.SetContentLoaded(true);
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
