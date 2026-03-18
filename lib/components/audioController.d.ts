import { qData } from './questionData';
import { bucket } from '../assessment/bucketData';
export declare class AudioController {
    private static instance;
    imageToCache: string[];
    wavToCache: string[];
    allAudios: any;
    allImages: any;
    dataURL: string;
    private feedbackAudio;
    private correctAudio;
    private init;
    static PrepareAudioAndImagesForSurvey(questionsData: qData[], dataURL: string): void;
    static AddImageToAllImages(newImageURL: string): void;
    static FilterAndAddAudioToAllAudios(newAudioURL: string): void;
    static PreloadBucket(newBucket: bucket, dataURL: any): void;
    private static safePlay;
    static PlayAudio(audioName: string, finishedCallback?: Function, audioAnim?: Function): void;
    static GetImage(imageName: string): any;
    static PlayDing(): void;
    static PlayCorrect(): void;
    static getInstance(): AudioController;
}
