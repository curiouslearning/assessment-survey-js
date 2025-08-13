//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { UIController } from '../ui/uiController';
import { AudioController } from '../components/audioController';
import { qData, answerData } from '../components/questionData';
import { AnalyticsEvents } from '../firebase/analyticsEvents';
import { App } from '../App';
import { BaseQuiz } from '../baseQuiz';
import { fetchSurveyQuestions } from '../utils/jsonUtils';
import { UnityBridge } from '../utils/unityBridge';

export class Survey extends BaseQuiz {
  public questionsData: qData[];
  public currentQuestionIndex: number;

  constructor(dataURL: string, unityBridge) {
    super();
    console.log('Survey initialized');

    this.dataURL = dataURL;
    this.unityBridge = unityBridge;
    this.currentQuestionIndex = 0;
    UIController.SetButtonPressAction(this.handleAnswerButtonPress);
    UIController.SetStartAction(this.startSurvey);
  }

  public handleAnimationSpeedMultiplierChange(): void {
    console.log('Animation Speed Multiplier Changed');
  }

  public handleBucketGenModeChange = () => {
    console.log('Bucket Gen Mode Changed');
  };

  public handleCorrectLabelShownChange = () => {
    console.log('Correct Label Shown Changed');
  };

  public handleBucketInfoShownChange = () => {
    console.log('Bucket Info Shown Changed');
  };

  public handleBucketControlsShownChange = () => {
    console.log('Bucket Controls Shown Changed');
  };

  public async Run(app: App) {
    this.app = app;
    this.buildQuestionList().then((result) => {
      this.questionsData = result;
      AudioController.PrepareAudioAndImagesForSurvey(this.questionsData, this.app.GetDataURL());
      this.unityBridge.SendLoaded();
    });
  }

  public startSurvey = () => {
    UIController.ReadyForNext(this.buildNewQuestion());
  };

  public onQuestionEnd = () => {
    UIController.SetFeedbackVisibile(false, false);

    this.currentQuestionIndex += 1;

    setTimeout(() => {
      if (this.HasQuestionsLeft()) {
        UIController.ReadyForNext(this.buildNewQuestion());
      } else {
        console.log('There are no questions left.');
        this.onEnd();
      }
    }, 500);
  };

  public handleAnswerButtonPress = (answer: number, elapsed: number) => {
    AnalyticsEvents.sendAnswered(this.questionsData[this.currentQuestionIndex], answer, elapsed);
    UIController.SetFeedbackVisibile(true, true);
    UIController.AddStar();
    setTimeout(() => {
      this.onQuestionEnd();
    }, 2000);
  };

  public buildQuestionList = () => {
    const surveyQuestions = fetchSurveyQuestions(this.app.dataURL);
    return surveyQuestions;
  };

  public HasQuestionsLeft(): boolean {
    return this.currentQuestionIndex <= this.questionsData.length - 1;
  }

  public buildNewQuestion(): qData {
    var questionData = this.questionsData[this.currentQuestionIndex];
    return questionData;
  }
}
