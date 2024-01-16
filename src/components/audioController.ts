//code for loading audios

import { qData } from './questionData';
import { bucket, bucketItem } from '../assessment/bucketData';

export class AudioController {

	private static instance: AudioController | null = null;

	public imageToCache: string[] = [];
	public wavToCache: string[] = [];

	public allAudios: any = {};
	public allImages: any = {};
	public dataURL: string = "";

	private correctSoundPath = "dist/audio/Correct.wav";

	private feedbackAudio: any = null;
	private correctAudio: any = null;

	private init(): void {
		this.feedbackAudio = new Audio();
		this.feedbackAudio.src = this.correctSoundPath;
		this.correctAudio = new Audio();
	}

	public static PrepareAudioAndImagesForSurvey(questionsData: qData[], dataURL: string): void {
		AudioController.getInstance().dataURL = dataURL;
		const feedbackSoundPath =  "audio/" + AudioController.getInstance().dataURL + "/answer_feedback.mp3";

		AudioController.getInstance().wavToCache.push(feedbackSoundPath);
		AudioController.getInstance().correctAudio.src = feedbackSoundPath;

		for (var questionIndex in questionsData){
			let questionData = questionsData[questionIndex];

			if (questionData.promptAudio != null) {
				AudioController.FilterAndAddAudioToAllAudios(questionData.promptAudio);
			}

			if (questionData.promptImg != null ) {
				AudioController.AddImageToAllImages(questionData.promptImg);
			}

			for (var answerIndex in questionData.answers) {
				let answerData = questionData.answers[answerIndex];
				if (answerData.answerImg != null){
					AudioController.AddImageToAllImages(answerData.answerImg);
				}
			}
		}
		console.log(AudioController.getInstance().allAudios);
		console.log(AudioController.getInstance().allImages);
	}

	public static AddImageToAllImages(newImageURL: string): void {
		console.log("Add image: " + newImageURL);
		let newImage = new Image();
		newImage.src = newImageURL;
		AudioController.getInstance().allImages[newImageURL] = newImage;
	}

	public static FilterAndAddAudioToAllAudios(newAudioURL: string): void {
		console.log("Adding audio: " + newAudioURL);

		if (newAudioURL.includes(".wav")){
			newAudioURL = newAudioURL.replace(".wav", ".mp3");
		} else if (newAudioURL.includes(".mp3")) {
			// Already contains .mp3 not doing anything
		} else {
			newAudioURL = newAudioURL + ".mp3";
		}

		console.log("Filtered: " + newAudioURL);

		let newAudio = new Audio();
		newAudio.src = "audio/" + AudioController.getInstance().dataURL + "/" + newAudioURL;
		AudioController.getInstance().allAudios[newAudioURL] = newAudio;
		
		console.log(newAudio.src);
	}

	public static PreloadBucket(newBucket: bucket, dataURL) {
		AudioController.getInstance().dataURL = dataURL;
		AudioController.getInstance().correctAudio.src = "audio/" + AudioController.getInstance().dataURL + "/answer_feedback.mp3";
		for (var itemIndex in newBucket.items){
			var item = newBucket.items[itemIndex];
			AudioController.FilterAndAddAudioToAllAudios(item.itemName);
		}
	}

	public static PlayAudio(audioName: string, finishedCallback?: Function): void {
		console.log("trying to play " + audioName);
	
		if (audioName.includes(".mp3")){
			if (audioName.slice(-4) != ".mp3"){
				audioName = audioName + ".mp3";
			}
		} else {
			audioName = audioName + ".mp3";
		}

		console.log("Pre play all audios: ");
		console.log(AudioController.getInstance().allAudios);

		if (typeof(finishedCallback) != 'undefined'){
			AudioController.getInstance().allAudios[audioName].addEventListener("ended", () => {
				finishedCallback();
			})
		}

		if (audioName in AudioController.getInstance().allAudios){
			AudioController.getInstance().allAudios[audioName].play();
		}
		else if(audioName.toLowerCase() in AudioController.getInstance().allAudios)
		{
			AudioController.getInstance().allAudios[audioName.toLowerCase()].play();
		}
	}

	public static GetImage(imageName: string): any {
		return AudioController.getInstance().allImages[imageName];
	}

	public static PlayDing(): void {
		AudioController.getInstance().feedbackAudio.play();
	}

	public static PlayCorrect(): void {
		AudioController.getInstance().correctAudio.play();
	}

	public static getInstance(): AudioController {
		if (AudioController.instance == null) {
			AudioController.instance = new AudioController();
			AudioController.instance.init();
		}

		return AudioController.instance;
	}
}