// audioController.test.ts
import { AudioController } from '../../src/components/audioController';
import { qData } from '../../src/components/questionData';
import { bucket } from '../../src/assessment/bucketData';

describe('AudioController', () => {
  beforeEach(() => {
    // Reset singleton instance
    (AudioController as any).instance = null;
  });

  test('PrepareAudioAndImagesForSurvey should cache audios and images', () => {
    const questionsData: qData[] = [
      {
        promptAudio: 'question-audio.wav',
        promptImg: 'question-image.png',
        answers: [
          {
            answerImg: 'answer-image.png',
            answerName: '',
          },
        ],
        qName: '',
        qNumber: 0,
        qTarget: '',
        promptText: '',
      },
    ];
    AudioController.PrepareAudioAndImagesForSurvey(questionsData, 'testData');

    const instance = AudioController.getInstance();
    expect(instance.wavToCache).toContain('audio/testData/answer_feedback.mp3');
    expect(instance.allAudios).toHaveProperty('question-audio.mp3', expect.any(Audio));
    expect(instance.allImages).toHaveProperty('question-image.png', expect.any(Image));
    expect(instance.allImages).toHaveProperty('answer-image.png', expect.any(Image));
  });

  test('FilterAndAddAudioToAllAudios should handle audio formats', () => {
    const audioURL = 'example-audio';
    AudioController.FilterAndAddAudioToAllAudios(audioURL);

    const instance = AudioController.getInstance();
    expect(instance.allAudios).toHaveProperty('example-audio.mp3', expect.any(Audio));
  });

  test('AddImageToAllImages should cache images', () => {
    const imageURL = 'example-image.png';
    AudioController.AddImageToAllImages(imageURL);

    const instance = AudioController.getInstance();
    expect(instance.allImages).toHaveProperty(imageURL, expect.any(Image));
  });

  test('PlayAudio should play an audio file if it exists', async () => {
    const audioName = 'test-audio.mp3';
    const instance = AudioController.getInstance();
    instance.allAudios[audioName] = new Audio();

    const playSpy = jest.spyOn(instance.allAudios[audioName], 'play').mockResolvedValue(undefined);

    await new Promise<void>((resolve) => {
      AudioController.PlayAudio(audioName, resolve);
    });

    expect(playSpy).toHaveBeenCalled();
  });

  test('PlayAudio should handle missing audio gracefully', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    await new Promise<void>((resolve) => {
      AudioController.PlayAudio('missing-audio.mp3', resolve);
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith('Audio file not found:', 'missing-audio.mp3');
    consoleWarnSpy.mockRestore();
  });

  test('PreloadBucket should cache bucket audios', () => {
    const newBucket: bucket = {
      items: [
        {
          itemName: 'bucket-audio.wav',
          itemText: '',
        },
      ],
      bucketID: 0,
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      score: 0,
      passed: false,
    };
    AudioController.PreloadBucket(newBucket, 'testData');

    const instance = AudioController.getInstance();
    expect(instance.allAudios).toHaveProperty('bucket-audio.mp3', expect.any(Audio));
  });

  test('PlayDing should play the feedback audio', () => {
    const instance = AudioController.getInstance();
    const playSpy = jest.spyOn(instance['feedbackAudio'], 'play').mockImplementation();

    AudioController.PlayDing();

    expect(playSpy).toHaveBeenCalled();
  });

  test('PlayCorrect should play the correct audio', () => {
    const instance = AudioController.getInstance();
    const playSpy = jest.spyOn(instance['feedbackAudio'], 'play').mockImplementation();

    AudioController.PlayCorrect();

    expect(playSpy).toHaveBeenCalled();
  });

  test('GetImage should return cached image', () => {
    const imageName = 'test-image.png';
    const instance = AudioController.getInstance();
    instance.allImages[imageName] = new Image();

    const image = AudioController.GetImage(imageName);

    expect(image).toBeInstanceOf(Image);
  });
});
