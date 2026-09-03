import { Survey } from '../../src/survey/survey';
import { UIController } from '../../src/ui/uiController';
import { AudioController } from '../../src/components/audioController';
import { App } from '../../src/App';
import { fetchAppData, fetchSurveyQuestions } from '../../src/utils/jsonUtils';
import { UnityBridge } from '../../src/utils/unityBridge';

jest.mock('../../src/utils/jsonUtils', () => ({
  fetchAppData: jest.fn(),
  fetchSurveyQuestions: jest.fn(),
  getDataURL: jest.fn((url: string) => `/data/${url}.json`),
}));

jest.mock('../../src/ui/uiController', () => ({
  UIController: {
    SetButtonPressAction: jest.fn(),
    SetStartAction: jest.fn(),
    ReadyForNext: jest.fn(),
    SetFeedbackVisibile: jest.fn(),
    AddStar: jest.fn(),
    ShowEnd: jest.fn(),
  },
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  }),
  logEvent: jest.fn(),
}));

jest.mock('../../src/components/audioController', () => ({
  AudioController: {
    PrepareAudioAndImagesForSurvey: jest.fn(),
  },
}));

jest.mock('../../src/utils/unityBridge', () => ({
  UnityBridge: jest.fn().mockImplementation(() => ({
    SendLoaded: jest.fn(),
    SendMessage: jest.fn(),
    SendClose: jest.fn(),
  })),
}));

describe('Survey', () => {
  let survey: Survey;
  let mockApp: App;
  let mockUnityBridge: UnityBridge;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Set up DOM elements required by Survey/BaseQuiz
    document.body.innerHTML = `
      <select id="bucketGenSelect"></select>
    `;

    mockApp = new App();
    mockUnityBridge = new UnityBridge();
    survey = new Survey('testDataURL', mockUnityBridge);

    (fetchAppData as jest.Mock).mockResolvedValue({});
    (fetchSurveyQuestions as jest.Mock).mockResolvedValue([
      {
        qName: 'Question1',
        qNumber: 1,
        qTarget: 'Math',
        promptText: 'What is 1+1?',
        promptAudio: 'question1.mp3',
        answers: [{ answerName: '2' }, { answerName: '3' }],
        correct: '2',
        bucket: 1,
      },
      {
        qName: 'Question2',
        qNumber: 2,
        qTarget: 'Math',
        promptText: 'What is 2+2?',
        promptAudio: 'question2.mp3',
        answers: [{ answerName: '4' }, { answerName: '5' }],
        correct: '4',
        bucket: 1,
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize Survey correctly', () => {
    expect(survey.dataURL).toBe('testDataURL');
    expect(survey.unityBridge).toBe(mockUnityBridge);
    expect(survey.currentQuestionIndex).toBe(0);
    expect(UIController.SetButtonPressAction).toHaveBeenCalledWith(survey.handleAnswerButtonPress);
    expect(UIController.SetStartAction).toHaveBeenCalledWith(survey.startSurvey);
  });

  it('should call buildQuestionList and set questionsData on Run', async () => {
    await survey.Run(mockApp);

    expect(fetchSurveyQuestions).toHaveBeenCalledWith(mockApp.dataURL);
    expect(survey.questionsData).toEqual([
      {
        qName: 'Question1',
        qNumber: 1,
        qTarget: 'Math',
        promptText: 'What is 1+1?',
        promptAudio: 'question1.mp3',
        answers: [{ answerName: '2' }, { answerName: '3' }],
        correct: '2',
        bucket: 1,
      },
      {
        qName: 'Question2',
        qNumber: 2,
        qTarget: 'Math',
        promptText: 'What is 2+2?',
        promptAudio: 'question2.mp3',
        answers: [{ answerName: '4' }, { answerName: '5' }],
        correct: '4',
        bucket: 1,
      },
    ]);
    expect(AudioController.PrepareAudioAndImagesForSurvey).toHaveBeenCalledWith(
      survey.questionsData,
      mockApp.GetDataURL()
    );
    expect(mockUnityBridge.SendLoaded).toHaveBeenCalled();
  });

  it('should build a new question', async () => {
    await survey.Run(mockApp);
    const question = survey.buildNewQuestion();

    expect(question).toEqual({
      qName: 'Question1',
      qNumber: 1,
      qTarget: 'Math',
      promptText: 'What is 1+1?',
      promptAudio: 'question1.mp3',
      answers: [{ answerName: '2' }, { answerName: '3' }],
      correct: '2',
      bucket: 1,
    });
  });

  it('should indicate whether there are questions left', async () => {
    await survey.Run(mockApp);

    expect(survey.HasQuestionsLeft()).toBe(true);

    survey.currentQuestionIndex = 2; // Beyond last question
    expect(survey.HasQuestionsLeft()).toBe(false);
  });

  it('should handle answer button press and trigger analytics and UI updates', async () => {
    await survey.Run(mockApp);

    survey.handleAnswerButtonPress(1, 1000);

    expect(UIController.SetFeedbackVisibile).toHaveBeenCalledWith(true, true);
    expect(UIController.AddStar).toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(mockUnityBridge.SendLoaded).toHaveBeenCalled();
  });

  it('should mark survey feedback as incorrect when selected answer does not match correct answer', async () => {
    await survey.Run(mockApp);

    survey.handleAnswerButtonPress(2, 1000);

    expect(UIController.SetFeedbackVisibile).toHaveBeenCalledWith(true, false);
  });

  it('should preserve positive feedback for survey questions without a correct answer', async () => {
    await survey.Run(mockApp);
    delete survey.questionsData[0].correct;

    survey.handleAnswerButtonPress(2, 1000);

    expect(UIController.SetFeedbackVisibile).toHaveBeenCalledWith(true, true);
  });

  it('should go to the next question after a question ends', async () => {
    await survey.Run(mockApp);

    survey.onQuestionEnd();

    jest.advanceTimersByTime(500);

    expect(survey.currentQuestionIndex).toBe(1); // Next question index
    expect(UIController.ReadyForNext).toHaveBeenCalledWith(survey.buildNewQuestion());
  });

  it('should end the survey when no questions are left', async () => {
    const mockOnEnd = jest.fn();
    survey.onEnd = mockOnEnd; // Mock onEnd method

    await survey.Run(mockApp);

    survey.currentQuestionIndex = 2; // Beyond last question
    survey.onQuestionEnd();

    jest.advanceTimersByTime(500);

    expect(mockOnEnd).toHaveBeenCalled();
  });
});
