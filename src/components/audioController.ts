//code for loading audios

import { qData } from './questionData';
import { bucket, bucketItem } from '@assessment/bucketData';
import { getCaseIndependentLangList } from '@utils/jsonUtils';
import { resolveAssetPath } from '@utils/assetUtils';
import { ASSET_PATHS } from '@configs/assetsPaths';

export class AudioController {
  private static instance: AudioController | null = null;

  public imageToCache: string[] = [];
  public wavToCache: string[] = [];

  public allAudios: any = {};
  public allImages: any = {};
  public dataURL: string = '';
  public soundEffects: any = {};
  public soundEffectLastPlayedAt: any = {};

  private feedbackAudio: any = null;
  private correctAudio: any = null;
  private dingAudio: any = null;

  private init(): void {
    this.feedbackAudio = new Audio();
    this.correctAudio = new Audio();
    this.dingAudio = new Audio();
    this.dingAudio.src = resolveAssetPath(ASSET_PATHS.AUDIO.dingSfx);
  }

  public static PrepareAudioAndImagesForSurvey(questionsData: qData[], dataURL: string): void {
    AudioController.getInstance().dataURL = dataURL;
    const feedbackSoundPath = resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(AudioController.getInstance().dataURL));
    AudioController.getInstance().wavToCache.push(ASSET_PATHS.AUDIO.feedbackAudio(AudioController.getInstance().dataURL));
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
    newAudio.src = resolveAssetPath(ASSET_PATHS.AUDIO.itemAudio(AudioController.getInstance().dataURL, newAudioURL));
    AudioController.getInstance().allAudios[newAudioURL] = newAudio;

    console.log(newAudio.src);
  }

  public static PreloadBucket(newBucket: bucket, dataURL) {
    AudioController.getInstance().dataURL = dataURL;
    const feedbackSoundPath = resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(AudioController.getInstance().dataURL));
    AudioController.getInstance().correctAudio.src = feedbackSoundPath;
    AudioController.getInstance().feedbackAudio.src = feedbackSoundPath;
    for (var itemIndex in newBucket.items) {
      var item = newBucket.items[itemIndex];
      AudioController.FilterAndAddAudioToAllAudios(item.itemName.toLowerCase());
    }
  }

  private static safePlay(audio: HTMLAudioElement, label: string): void {
    if (!audio) {
      console.warn(`${label} audio is not available.`);
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

  //For handling SFX that are not just mp3 audio file.
  public static PlaySoundEffect(audioPath: string, finishedCallback?: Function): void {
    const normalizedAudioPath = audioPath.trim();
    const soundEffectCooldownMs = 200;
    const now = Date.now();
    const lastPlayedAt = AudioController.getInstance().soundEffectLastPlayedAt[normalizedAudioPath] ?? 0;

    // Prevent rapid repeated clicks or drag-start events from spamming the same sound effect.
    if (now - lastPlayedAt < soundEffectCooldownMs) {
      return;
    }

    AudioController.getInstance().soundEffectLastPlayedAt[normalizedAudioPath] = now;
    let audio = AudioController.getInstance().soundEffects[normalizedAudioPath];

    if (!audio) {
      audio = new Audio(resolveAssetPath(normalizedAudioPath));
      AudioController.getInstance().soundEffects[normalizedAudioPath] = audio;
    }

    audio.currentTime = 0;
    audio.onended = null;

    if (typeof finishedCallback !== 'undefined') {
      audio.onended = () => finishedCallback();
    }

    const playResult = audio.play();
    if (playResult && typeof playResult.then === 'function') {
      playResult
        .catch((error) => {
          console.error(`Error playing sound effect '${normalizedAudioPath}':`, error);
        });
    }
  }

  public static GetImage(imageName: string): any {
    return AudioController.getInstance().allImages[imageName];
  }

  public static PlayDing(): void {
    AudioController.safePlay(AudioController.getInstance().dingAudio, 'Ding');
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
