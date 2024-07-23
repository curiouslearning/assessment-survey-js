import { qData } from './questionData';
import { bucket, bucketItem } from '../assessment/bucketData';
import { getCaseIndependentLangList } from './jsonUtils';

function normalizeFileName(fileName: string): string {
    return fileName.toLowerCase();
}

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

        for (const questionData of questionsData) {
            if (questionData.promptAudio != null) {
                AudioController.FilterAndAddAudioToAllAudios(questionData.promptAudio);
            }

            if (questionData.promptImg != null ) {
                AudioController.AddImageToAllImages(questionData.promptImg);
            }

            for (const answerData of questionData.answers) {
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
        newAudioURL = normalizeFileName(newAudioURL);

        if (newAudioURL.includes(".wav")){
            newAudioURL = newAudioURL.replace(".wav", ".mp3");
        } else if (!newAudioURL.includes(".mp3")) {
            newAudioURL = newAudioURL.trim() + ".mp3";
        }

        console.log("Filtered: " + newAudioURL);
        
        let newAudio = new Audio();
        newAudio.src = "audio/" + AudioController.getInstance().dataURL + "/" + newAudioURL;
        
        AudioController.getInstance().allAudios[newAudioURL] = newAudio;
        
        console.log(newAudio.src);
    }

    public static PreloadBucket(newBucket: bucket, dataURL: string) {
        AudioController.getInstance().dataURL = dataURL;
        AudioController.getInstance().correctAudio.src = "audio/" + AudioController.getInstance().dataURL + "/answer_feedback.mp3";
        for (const item of newBucket.items){
            AudioController.FilterAndAddAudioToAllAudios(item.itemName);
        }
    }

    public static PlayAudio(audioName: string, finishedCallback?: Function, audioAnim?: Function): void {
        audioName = normalizeFileName(audioName);

        if (!audioName.endsWith(".mp3")) {
            audioName = audioName.trim() + ".mp3";
        }
    
        console.log("Pre play all audios: ");
        console.log(AudioController.getInstance().allAudios);

        const playPromise = new Promise<void>((resolve, reject) => {
            const audio = AudioController.getInstance().allAudios[audioName];
            if (audio) {
                audio.addEventListener("play", () => {
                    if (audioAnim) audioAnim(true);
                });

                audio.addEventListener("ended", () => {
                    if (audioAnim) audioAnim(false);
                    resolve();
                });

                audio.play().catch((error) => {
                    console.error("Error playing audio:", error);
                    resolve();
                });
            } else {
                console.warn("Audio file not found:", audioName);
                resolve();
            }
        });

        playPromise.then(() => {
            if (finishedCallback) finishedCallback();
        }).catch(error => {
            console.error("Promise error:", error);
        });
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