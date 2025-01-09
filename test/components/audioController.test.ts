import { AudioController } from '../../src/components/audioController';
import { bucket } from '../../src/assessment/bucketData';

jest.mock('../path/to/jsonUtils', () => ({
  getCaseIndependentLangList: jest.fn(() => ['luganda']),
}));

describe('AudioController', () => {
  let mockAudioPlay: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAudioPlay = jest.fn();
    window.Audio = jest.fn().mockImplementation(() => ({
      play: mockAudioPlay,
      addEventListener: jest.fn(),
      src: '',
    }));
  });

  describe('PrepareAudioAndImagesForSurvey', () => {
    it('should prepare audio and images for survey questions', () => {
      const questionsData = [
        {
          promptAudio: 'audio1',
          promptImg: 'image1',
          answers: [{ answerImg: 'answerImage1' }],
        },
      ];
      const dataURL = 'testURL';

      AudioController.PrepareAudioAndImagesForSurvey(questionsData, dataURL);

      const instance = AudioController.getInstance();
      expect(instance.wavToCache).toContain('audio/testURL/answer_feedback.mp3');
      expect(instance.allAudios).toHaveProperty('audio1.mp3');
      expect(instance.allImages).toHaveProperty('image1');
      expect(instance.allImages).toHaveProperty('answerImage1');
    });
  });

  describe('AddImageToAllImages', () => {
    it('should add an image to allImages', () => {
      const imageURL = 'testImage';

      AudioController.AddImageToAllImages(imageURL);

      const instance = AudioController.getInstance();
      expect(instance.allImages).toHaveProperty(imageURL);
      expect(instance.allImages[imageURL].src).toEqual(imageURL);
    });
  });

  describe('FilterAndAddAudioToAllAudios', () => {
    it('should add audio to allAudios with correct path and format', () => {
      const audioURL = 'testAudio';

      AudioController.FilterAndAddAudioToAllAudios(audioURL);

      const instance = AudioController.getInstance();
      expect(instance.allAudios).toHaveProperty('testAudio.mp3');
      expect(instance.allAudios['testAudio.mp3'].src).toContain('audio');
    });
  });

  describe('PreloadBucket', () => {
    it('should preload audios from a bucket', () => {
      const bucketData: bucket = {
        items: [{ itemName: 'item1' }, { itemName: 'item2' }],
      };
      const dataURL = 'testBucket';

      AudioController.PreloadBucket(bucketData, dataURL);

      const instance = AudioController.getInstance();
      expect(instance.allAudios).toHaveProperty('item1.mp3');
      expect(instance.allAudios).toHaveProperty('item2.mp3');
    });
  });

  describe('PlayAudio', () => {
    it('should play the specified audio and trigger callbacks', async () => {
      const audioName = 'testAudio';
      const finishedCallback = jest.fn();
      const audioAnim = jest.fn();

      AudioController.FilterAndAddAudioToAllAudios(audioName);
      await AudioController.PlayAudio(audioName, finishedCallback, audioAnim);

      expect(mockAudioPlay).toHaveBeenCalled();
      expect(audioAnim).toHaveBeenCalledWith(true);
      expect(finishedCallback).toHaveBeenCalled();
    });

    it('should warn if audio is not found', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await AudioController.PlayAudio('nonExistentAudio');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Audio file not found:', 'nonExistentAudio.mp3');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('GetImage', () => {
    it('should return the image by name', () => {
      const imageName = 'testImage';

      AudioController.AddImageToAllImages(imageName);
      const image = AudioController.GetImage(imageName);

      expect(image).toBeDefined();
      expect(image.src).toEqual(imageName);
    });
  });

  describe('PlayDing', () => {
    it('should play the feedback audio', () => {
      const instance = AudioController.getInstance();
      instance.feedbackAudio.play = jest.fn();

      AudioController.PlayDing();

      expect(instance.feedbackAudio.play).toHaveBeenCalled();
    });
  });

  describe('PlayCorrect', () => {
    it('should play the correct audio', () => {
      const instance = AudioController.getInstance();
      instance.correctAudio.play = jest.fn();

      AudioController.PlayCorrect();

      expect(instance.correctAudio.play).toHaveBeenCalled();
    });
  });

  describe('getInstance', () => {
    it('should return the same instance of AudioController', () => {
      const instance1 = AudioController.getInstance();
      const instance2 = AudioController.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
