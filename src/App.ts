/**
 * App class that represents an entry point of the application.
 */

import { getUUID, getUserSource, getDataFile } from './components/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment'
import { UnityBridge } from './components/unityBridge'
import { setUuid, linkAnalytics, sendInit } from './components/analyticsEvents'
import { baseQuiz } from './baseQuiz';
import { fetchAppData, getDataURL } from './components/jsonUtils';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Workbox } from 'workbox-window';
import CacheModel from './components/cacheModel';
import { setFeedbackText } from './components/uiController';
import { setContentLoaded } from './components/uiController';

const appVersion = "v0.0.7";

let loadingScreen = document.getElementById("loadingScreen");

const broadcastChannel: BroadcastChannel = new BroadcastChannel('as-message-channel');

export class App {

	/** Could be 'assessment' or 'survey' based on the data file */
	public dataURL: string;

	public unity;
	public analytics;
	public game: baseQuiz;

	cacheModel: CacheModel;

	lang: string = "english";

	constructor() {
		this.unity = new UnityBridge();

		console.log("Initializing app...");

		this.dataURL = getDataFile();

		this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set<string>());

		// console.log("Data file: " + this.dataURL);

		const firebaseConfig = {
		  apiKey: "AIzaSyB8c2lBVi26u7YRL9sxOP97Uaq3yN8hTl4",
		  authDomain: "ftm-b9d99.firebaseapp.com",
		  databaseURL: "https://ftm-b9d99.firebaseio.com",
		  projectId: "ftm-b9d99",
		  storageBucket: "ftm-b9d99.appspot.com",
		  messagingSenderId: "602402387941",
		  appId: "1:602402387941:web:7b1b1181864d28b49de10c",
		  measurementId: "G-FF1159TGCF"
		};

		const fapp = initializeApp(firebaseConfig);
		const fanalytics = getAnalytics(fapp);

		this.analytics = fanalytics;
		logEvent(fanalytics, 'notification_received');
		logEvent(fanalytics,"test initialization event",{});

		console.log("firebase initialized");
	}

	public async spinUp() {
		window.addEventListener('load', () => {
			console.log("Window Loaded!");
			(async () => {
				await this.registerServiceWorker(this.game);
			})();
		});

		await fetchAppData(this.dataURL).then(data => {
			console.log("Assessment/Survey " + appVersion + " initializing!");
			console.log("App data loaded!");
			console.log(data);

			this.cacheModel.setContentFilePath(getDataURL(this.dataURL));

			// TODO: Why do we need to set the feedback text here?
			setFeedbackText(data["feedbackText"]);

			let appType = data["appType"];

			if (appType == "survey") {
				this.game = new Survey(this.dataURL, this.unity);
			} else if (appType == "assessment") {
				// Get and add all the audio assets to the cache model

				let buckets = data["buckets"];

				for (let i = 0; i < buckets.length; i++) {
					for (let j = 0; j < buckets[i].items.length; j++) {
						let audioItemURL = "/audio/" + this.dataURL + "/" + buckets[i].items[j].itemName + ".mp3";
						this.cacheModel.addItemToAudioVisualResources(audioItemURL);
					}
				}

				this.cacheModel.addItemToAudioVisualResources("/audio/" + this.dataURL + "/answer_feedback.mp3");

				this.game = new Assessment(this.dataURL, this.unity);
			}

			this.game.unity = this.unity;

			setUuid(getUUID(), getUserSource());
			linkAnalytics(this.analytics, this.dataURL);
			sendInit();

			this.game.run(this);
		});
	}

	async registerServiceWorker(game: baseQuiz) {
		console.log("Registering service worker...");

		if ("serviceWorker" in navigator) {
			let wb = new Workbox('./sw.js', {});

			wb.register().then((registration) => {
				console.log("Service worker registered!");
				this.handleServiceWorkerRegistation(registration);
			}).catch((err) => {
				console.log("Service worker registration failed: " + err);
			});

			await navigator.serviceWorker.ready;
			
			console.log("Cache Model: ");
			console.log(this.cacheModel);

			// if (localStorage.getItem(book.bookName) == null) {
            //     this.broadcastChannel.postMessage({
            //         command: "Cache",
            //         data: {
            //             lang: this.lang,
            //             bookData: book,
            //             contentFile: this.contentFilePath,
            //         }
            //     });
            // }

		} else {
			console.warn("Service workers are not supported in this browser.");
		}
	}

	handleServiceWorkerRegistation(registration: ServiceWorkerRegistration | undefined): void {
		try {
			registration?.installing?.postMessage({
				type: 'Registartion',
				value: this.lang
			})
		} catch (err) {
			console.log("Service worker registration failed: " + err);
		}
	}

}


const app = new App();
app.spinUp();
