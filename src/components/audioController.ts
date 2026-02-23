//code for loading audios

import { qData } from './questionData';
import { bucket, bucketItem } from '../assessment/bucketData';
import { getCaseIndependentLangList } from '../utils/jsonUtils';
import { resolveAssetPath } from '../utils/assetUtils';

export class AudioController {
  private static instance: AudioController | null = null;

  public imageToCache: string[] = [];
  public wavToCache: string[] = [];

  public allAudios: any = {};
  public allImages: any = {};
  public dataURL: string = '';

  private feedbackAudio: any = null;
  private correctAudio: any = null;

  private init(): void {
    this.feedbackAudio = new Audio();
    this.correctAudio = new Audio();
  }

  public static PrepareAudioAndImagesForSurvey(questionsData: qData[], dataURL: string): void {
    AudioController.getInstance().dataURL = dataURL;
    const feedbackSoundPath = resolveAssetPath('audio/' + AudioController.getInstance().dataURL + '/answer_feedback.mp3');

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

  public static AddImageToAllImages(newImageURL: string): void {
    console.log('Add image: ' + newImageURL);
    let newImage = new Image();
    newImage.src = resolveAssetPath(newImageURL);
    AudioController.getInstance().allImages[newImageURL] = newImage;
  }

  public static FilterAndAddAudioToAllAudios(newAudioURL: string): void {
    console.log('Adding audio: ' + newAudioURL);
    if (newAudioURL.includes('.wav')) {
      newAudioURL = newAudioURL.replace('.wav', '.mp3');
    } else if (newAudioURL.includes('.mp3')) {
      // Already contains .mp3 not doing anything
    } else {
      newAudioURL = newAudioURL.trim() + '.mp3';
    }

    console.log('Filtered: ' + newAudioURL);

    let newAudio = new Audio();
    if (getCaseIndependentLangList().includes(AudioController.getInstance().dataURL.split('-')[0])) {
      newAudio.src = resolveAssetPath('audio/' + AudioController.getInstance().dataURL + '/' + newAudioURL);
    } else {
      newAudio.src = resolveAssetPath('audio/' + AudioController.getInstance().dataURL + '/' + newAudioURL);
    }

    AudioController.getInstance().allAudios[newAudioURL] = newAudio;

    console.log(newAudio.src);
  }

  public static PreloadBucket(newBucket: bucket, dataURL) {
    AudioController.getInstance().dataURL = dataURL;
    const feedbackSoundPath = resolveAssetPath('audio/' + AudioController.getInstance().dataURL + '/answer_feedback.mp3');
    AudioController.getInstance().correctAudio.src = feedbackSoundPath;
    AudioController.getInstance().feedbackAudio.src = feedbackSoundPath;
    for (var itemIndex in newBucket.items) {
      var item = newBucket.items[itemIndex];
      AudioController.FilterAndAddAudioToAllAudios(item.itemName.toLowerCase());
    }
  }

  private static safePlay(audio: HTMLAudioElement, label: string): void {
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

  public static PlayAudio(audioName: string, finishedCallback?: Function, audioAnim?: Function): void {
    audioName = audioName.toLowerCase();
    console.log('trying to play ' + audioName);
    if (audioName.includes('.mp3')) {
      if (audioName.slice(-4) != '.mp3') {
        audioName = audioName.trim() + '.mp3';
      }
    } else {
      audioName = audioName.trim() + '.mp3';
    }

    console.log('Pre play all audios: ');
    console.log(AudioController.getInstance().allAudios);

    const playPromise = new Promise<void>((resolve, reject) => {
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
      } else {
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

  public static GetImage(imageName: string): any {
    return AudioController.getInstance().allImages[imageName];
  }

  public static PlayDing(): void {
    const instance = AudioController.getInstance();
    if (instance.feedbackAudio?.src) {
      AudioController.safePlay(instance.feedbackAudio, 'Ding');
      return;
    }

    if (instance.correctAudio?.src) {
      AudioController.safePlay(instance.correctAudio, 'Ding fallback');
    }
  }

  public static PlayCorrect(): void {
    AudioController.safePlay(AudioController.getInstance().correctAudio, 'Correct');
  }

  public static getInstance(): AudioController {
    if (AudioController.instance == null) {
      AudioController.instance = new AudioController();
      AudioController.instance.init();
    }

    return AudioController.instance;
  }
}
