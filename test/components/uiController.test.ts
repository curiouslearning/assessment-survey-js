import { UIController } from '../../src/components/uiController'; // Adjust the path as needed

describe('UIController', () => {
  let uiController;

  beforeEach(() => {
    // Set up the DOM environment
    document.body.innerHTML = `
    <div id="landingContainer"></div>
    <div id="gameContainer"></div>
    <div id="feedbackContainer"></div>
    <div id="gameFeedback"></div>
    <div id="starContainer"></div>
    <button id="answerButton1"></button>
    <button id="answerButton2"></button>
    <button id="answerButton3"></button>
    <button id="answerButton4"></button>
    <button id="answerButton5"></button>
    <button id="answerButton6"></button>
    <div id="star-container"></div>
    <div id="landing-container"></div>
    <div id="game-container"></div>
    <button id="play-button"></button>
    <button id="exit-button"></button>
  `;

    uiController = UIController.getInstance();
    uiController.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize UIController instance', () => {
    expect(uiController).toBeDefined();
    expect(UIController.getInstance()).toBe(uiController);
  });

  test('should initialize buttons and add event listeners', () => {
    const button1 = document.getElementById('answerButton1');
    const button2 = document.getElementById('answerButton2');

    jest.spyOn(uiController, 'answerButtonPress');

    button1.click();
    button2.click();

    expect(uiController.answerButtonPress).toHaveBeenCalledTimes(2);
    expect(uiController.answerButtonPress).toHaveBeenCalledWith(1);
    expect(uiController.answerButtonPress).toHaveBeenCalledWith(2);
  });

  test('should toggle visibility of containers', () => {
    const landingContainer = document.getElementById('landingContainer');
    const gameContainer = document.getElementById('gameContainer');

    uiController.showGameScreen();

    expect(landingContainer.style.display).toBe('none');
    expect(gameContainer.style.display).toBe('flex');
  });

  test('should initialize stars in the star container', () => {
    const starContainer = document.getElementById('starContainer');

    uiController.initStars(5);

    expect(starContainer.childElementCount).toBe(5);
    expect(starContainer.children[0].classList.contains('star')).toBe(true);
  });

  test('should show correct feedback message', () => {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const gameFeedback = document.getElementById('gameFeedback');

    uiController.showFeedback(true);

    expect(feedbackContainer.style.display).toBe('flex');
    expect(gameFeedback.textContent).toBe('Correct!');
  });

  test('should hide feedback after a delay', () => {
    jest.useFakeTimers();
    const feedbackContainer = document.getElementById('feedbackContainer');

    uiController.showFeedback(true);
    jest.advanceTimersByTime(220);

    expect(feedbackContainer.style.display).toBe('none');
  });

  test('should update button visibility', () => {
    uiController.showAnswerOptions(4);

    expect(document.getElementById('answerButton1').style.display).toBe('inline-block');
    expect(document.getElementById('answerButton5').style.display).toBe('none');
  });

  test('should clear stars correctly', () => {
    const starContainer = document.getElementById('starContainer');

    uiController.initStars(5);
    expect(starContainer.childElementCount).toBe(5);

    uiController.clearStars();
    expect(starContainer.childElementCount).toBe(0);
  });
});
