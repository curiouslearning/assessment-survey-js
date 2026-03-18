//code for loading audios
import { resolveAssetPath } from '../utils/assetUtils';
import { ASSET_PATHS } from '../config/assetsPaths';
export class AudioController {
    constructor() {
        this.imageToCache = [];
        this.wavToCache = [];
        this.allAudios = {};
        this.allImages = {};
        this.dataURL = '';
        this.feedbackAudio = null;
        this.correctAudio = null;
    }
    init() {
        this.feedbackAudio = new Audio();
        this.correctAudio = new Audio();
    }
    static PrepareAudioAndImagesForSurvey(questionsData, dataURL) {
        AudioController.getInstance().dataURL = dataURL;
        const feedbackSoundPath = resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(AudioController.getInstance().dataURL));
        AudioController.getInstance().wavToCache.push(feedbackSoundPath);
        AudioController.getInstance().correctAudio.src = feedbackSoundPath;
        AudioController.getInstance().feedbackAudio.src = feedbackSoundPath;
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
        newImage.src = resolveAssetPath(newImageURL);
        AudioController.getInstance().allImages[newImageURL] = newImage;
    }
    static FilterAndAddAudioToAllAudios(newAudioURL) {
        console.log('Adding audio: ' + newAudioURL);
        if (newAudioURL.includes('.wav')) {
            newAudioURL = newAudioURL.replace('.wav', '.mp3');
        }
        else if (newAudioURL.includes('.mp3')) {
            // Already contains .mp3 not doing anything
        }
        else {
            newAudioURL = newAudioURL.trim() + '.mp3';
        }
        console.log('Filtered: ' + newAudioURL);
        let newAudio = new Audio();
        newAudio.src = resolveAssetPath(ASSET_PATHS.AUDIO.itemAudio(AudioController.getInstance().dataURL, newAudioURL));
        AudioController.getInstance().allAudios[newAudioURL] = newAudio;
        console.log(newAudio.src);
    }
    static PreloadBucket(newBucket, dataURL) {
        AudioController.getInstance().dataURL = dataURL;
        const feedbackSoundPath = resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(AudioController.getInstance().dataURL));
        AudioController.getInstance().correctAudio.src = feedbackSoundPath;
        AudioController.getInstance().feedbackAudio.src = feedbackSoundPath;
        for (var itemIndex in newBucket.items) {
            var item = newBucket.items[itemIndex];
            AudioController.FilterAndAddAudioToAllAudios(item.itemName.toLowerCase());
        }
    }
    static safePlay(audio, label) {
        if (!audio || !audio.src) {
            console.warn(`${label} audio source is not set.`);
            return;
        }
        const playResult = audio.play();
        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch((error) => {
                console.warn(`${label} audio failed to play from source '${audio.src}'`, error);
            });
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
        var _a, _b;
        const instance = AudioController.getInstance();
        if ((_a = instance.feedbackAudio) === null || _a === void 0 ? void 0 : _a.src) {
            AudioController.safePlay(instance.feedbackAudio, 'Ding');
            return;
        }
        if ((_b = instance.correctAudio) === null || _b === void 0 ? void 0 : _b.src) {
            AudioController.safePlay(instance.correctAudio, 'Ding fallback');
        }
    }
    static PlayCorrect() {
        AudioController.safePlay(AudioController.getInstance().correctAudio, 'Correct');
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
