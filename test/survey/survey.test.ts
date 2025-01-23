import { Survey } from '../../src/survey/survey';
import { UIController } from '../../src/components/uiController';
import { AudioController } from '../../src/components/audioController';
import { App } from '../../src/App';
import { fetchSurveyQuestions } from '../../src/components/jsonUtils';
import { UnityBridge } from '../../src/components/unityBridge';

jest.mock('../../src/components/jsonUtils', () => ({
  fetchSurveyQuestions: jest.fn(),
}));

jest.mock('../../src/components/uiController', () => ({
  SetButtonPressAction: jest.fn(),
  SetStartAction: jest.fn(),
  ReadyForNext: jest.fn(),
  SetFeedbackVisibile: jest.fn(),
  AddStar: jest.fn(),
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
  PrepareAudioAndImagesForSurvey: jest.fn(),
}));

jest.mock('../../src/components/unityBridge', () => ({
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

    (fetchSurveyQuestions as jest.Mock).mockResolvedValue([
      { itemName: 'Question1', itemText: 'What is 1+1?' },
      { itemName: 'Question2', itemText: 'What is 2+2?' },
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
      { itemName: 'Question1', itemText: 'What is 1+1?' },
      { itemName: 'Question2', itemText: 'What is 2+2?' },
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

    expect(question).toEqual({ itemName: 'Question1', itemText: 'What is 1+1?' });
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
