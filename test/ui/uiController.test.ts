// test/ui/uiController.test.ts
import { setupDom } from './_mock_/dom';
import { UIController } from '../../src/ui/uiController';
import { AudioController } from '../../src/components/audioController';
import { jest } from '@jest/globals';
import { qData } from '../../src/components/questionData';
describe('UIController', () => {
  let mockQData: qData;
  let uiController: UIController;
  let feedbackContainer: HTMLElement;
  let mockButtonPressCallback: jest.Mock;
  let mockPlayDing: jest.Mock;
  let chestImage: HTMLImageElement;
  let playButtonImg: HTMLImageElement;
  let buttons: any = [];


  beforeEach(() => {
    setupDom();
    feedbackContainer = document.getElementById('feedbackWrap') as HTMLElement;
    UIController.instance = null;


    uiController = UIController.getInstance(); // Getting the singleton instance
    uiController.initEventListeners();
    feedbackContainer.classList.add('hidden');
    uiController.stars = [1, 2, 3, 4, 5];
    uiController.qAnsNum = 1;
    uiController.starContainer = document.getElementById('starWrapper')!;
    uiController.gameContainer = document.getElementById('gameWrap')!;
    uiController.shownStarsCount = 0;
    uiController.starPositions = [];
    uiController.animationSpeedMultiplier = 1;
    uiController['feedbackContainer'] = feedbackContainer;
    uiController.playButton = document.getElementById('playButton')!;
    playButtonImg = document.createElement('img');
    uiController.devModeBucketControlsEnabled = false;
    uiController = UIController.getInstance();
    uiController.answersContainer = document.getElementById('aWrap')!;
    uiController.questionsContainer = document.getElementById('qWrap')!;
    uiController.playButton = document.createElement('div');
    document.body.appendChild(uiController.playButton);
    uiController.answerButton1 = document.getElementById("answerButton1")!;
    uiController.answerButton2 = document.getElementById("answerButton2")!;
    buttons = Array.from({ length: 3 }, () => document.createElement('button'));
    uiController.devModeBucketControlsEnabled = false;
    uiController.externalBucketControlsGenerationHandler = jest.fn();
    uiController.landingContainer = document.getElementById('landWrap')!;
    uiController.gameContainer = document.getElementById('gameWrap')!;
    uiController.endContainer = document.getElementById('endWrap')!;
    uiController.startPressCallback = jest.fn();
    jest.spyOn(AudioController, 'PlayAudio').mockImplementation(jest.fn());
    mockQData = {
      qName: 'Sample Question',
      qNumber: 1,
      qTarget: 'Target 1',
      promptText: 'What is the capital of France?',
      promptAudio: 'audio/question1.mp3',
      answers: [
        { answerName: 'Paris', answerText: 'Paris' },
        { answerName: 'London', answerText: 'London' },
      ],
      correct: 'Paris',
      bucket: 1,
    };
    chestImage = document.getElementById('chestImage') as HTMLImageElement;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });


  it('getInstance should return the same instance (singleton)', () => {
    const instance1 = UIController.getInstance();
    const instance2 = UIController.getInstance();
    expect(instance1).toBe(instance2);
  });
  it('should return an instance of UIController', () => {
    const instance = UIController.getInstance();
    expect(instance).toBeInstanceOf(UIController);
  });

  it('should return the same instance on multiple calls', () => {
    const instance1 = UIController.getInstance();
    const instance2 = UIController.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize the instance only once', () => {
    const initSpy = jest.spyOn(UIController.prototype as any, 'init');
    const instance1 = UIController.getInstance();
    const instance2 = UIController.getInstance();

    expect(initSpy).toHaveBeenCalledTimes(1);
    initSpy.mockRestore();
  });
  it('should set the externalBucketControlsGenerationHandler on the singleton instance', () => {
    const mockHandler = jest.fn();

    UIController.SetExternalBucketControlsGenerationHandler(mockHandler);

    const instance = UIController.getInstance();
    expect(instance.externalBucketControlsGenerationHandler).toBe(mockHandler);
  });

  it('should call getInstance when setting the handler', () => {
    const getInstanceSpy = jest.spyOn(UIController, 'getInstance');

    const mockHandler = jest.fn();
    UIController.SetExternalBucketControlsGenerationHandler(mockHandler);

    expect(getInstanceSpy).toHaveBeenCalled();
    getInstanceSpy.mockRestore();
  });
  it('should set the startPressCallback on the singleton instance', () => {
    const mockCallback = jest.fn();

    UIController.SetStartAction(mockCallback);

    const instance = UIController.getInstance();
    expect(instance.startPressCallback).toBe(mockCallback);
  });

  it('should call getInstance when setting the startPressCallback', () => {
    const getInstanceSpy = jest.spyOn(UIController, 'getInstance');
    const mockCallback = jest.fn();

    UIController.SetStartAction(mockCallback);

    expect(getInstanceSpy).toHaveBeenCalled();
    getInstanceSpy.mockRestore();
  });
  it('should set the buttonPressCallback on the singleton instance', () => {
    const mockCallback = jest.fn();

    UIController.SetButtonPressAction(mockCallback);

    const instance = UIController.getInstance();
    expect(instance.buttonPressCallback).toBe(mockCallback);
  });

  it('should call getInstance when setting the buttonPressCallback', () => {
    const getInstanceSpy = jest.spyOn(UIController, 'getInstance');
    const mockCallback = jest.fn();

    UIController.SetButtonPressAction(mockCallback);

    expect(getInstanceSpy).toHaveBeenCalled();
    getInstanceSpy.mockRestore();
  });

  it('should call buttonPressCallback when triggered manually', () => {
    const mockCallback = jest.fn();

    UIController.SetButtonPressAction(mockCallback);
    const instance = UIController.getInstance();

    instance.buttonPressCallback(); // Simulate button press

    expect(mockCallback).toHaveBeenCalled();
  });
  it('should set contentLoaded to true on the singleton instance', () => {
    UIController.SetContentLoaded(true);
    const instance = UIController.getInstance();

    expect(instance.contentLoaded).toBe(true);
  });

  it('should set contentLoaded to false on the singleton instance', () => {
    UIController.SetContentLoaded(false);
    const instance = UIController.getInstance();

    expect(instance.contentLoaded).toBe(false);
  });

  it('should call getInstance when setting contentLoaded', () => {
    const getInstanceSpy = jest.spyOn(UIController, 'getInstance');

    UIController.SetContentLoaded(true);

    expect(getInstanceSpy).toHaveBeenCalled();
    getInstanceSpy.mockRestore();
  });
  it('should update chest image source to the next one', () => {
    UIController.ProgressChest();
    expect(chestImage.src).toContain('http://localhost/img/chestprogression/TreasureChestOpen0NaN.svg');
  });

  it('should loop from 04 to 01', () => {
    chestImage.src = 'img/chestprogression/TreasureChestOpen04.svg';
    UIController.ProgressChest();
    expect(chestImage.src).toContain('http://localhost/img/chestprogression/TreasureChestOpen01.svg');
  });

  it('should extract correct current image number and increment', () => {
    chestImage.src = 'img/chestprogression/TreasureChestOpen03.svg';
    UIController.ProgressChest();
    expect(chestImage.src).toContain('http://localhost/img/chestprogression/TreasureChestOpen04.svg');
  });

  it('should default to image 01 if current number is invalid', () => {
    chestImage.src = 'img/chestprogression/InvalidName.svg';
    UIController.ProgressChest();
    // Depending on how parseInt behaves, this might become NaN.
    // So you might want to guard in actual code.
    expect(chestImage.src).toContain('http://localhost/img/chestprogression/TreasureChestOpen0NaN.svg'); // <- can write a fallback in real code
  });
  it('should add 20 stars with correct IDs and class', () => {
    const uiController = UIController.getInstance();
    uiController.initializeStars();

    for (let i = 0; i < 20; i++) {
      const star = document.getElementById(`star${i}`);
      expect(star).not.toBeNull();
      expect(star?.classList.contains('topstarv')).toBe(true);
    }
  });

  it('should add a <br> after the 10th star (after star9)', () => {
    const uiController = UIController.getInstance();
    uiController.initializeStars();

    const starContainer = document.getElementById('starWrapper');
    expect(starContainer?.innerHTML.includes('<br>')).toBe(true);
  });

  it('should populate the stars array with 20 values', () => {
    const uiController = UIController.getInstance();
    uiController.initializeStars();

    expect(uiController.stars.length).toBe(40);
    expect(new Set(uiController.stars).size).toBe(20); // No duplicates
  });

  it('should shuffle the stars array', () => {
    const uiController = UIController.getInstance();

    // Save default order before shuffle
    const defaultOrder = [...Array(20).keys()];
    uiController.initializeStars();
    const shuffled = uiController.stars;

    const isShuffled = defaultOrder.some((val, idx) => val !== shuffled[idx]);
    expect(isShuffled).toBe(true);
  });
  it('should set animationSpeedMultiplier to the given value', () => {
    const multiplier = 2.5;
    UIController.getInstance().SetAnimationSpeedMultiplier(multiplier);
    expect(UIController.getInstance().animationSpeedMultiplier).toBe(multiplier);
  });

  it('should update animationSpeedMultiplier even if value is 0', () => {
    UIController.getInstance().SetAnimationSpeedMultiplier(0);
    expect(UIController.getInstance().animationSpeedMultiplier).toBe(0);
  });

  it('should update animationSpeedMultiplier to a negative value', () => {
    UIController.getInstance().SetAnimationSpeedMultiplier(-1);
    expect(UIController.getInstance().animationSpeedMultiplier).toBe(-1);
  });
  it('should set devModeCorrectLabelVisibility to true', () => {
    UIController.getInstance().SetCorrectLabelVisibility(true);
    expect(UIController.getInstance().devModeCorrectLabelVisibility).toBe(true);
  });

  it('should set devModeCorrectLabelVisibility to false', () => {
    UIController.getInstance().SetCorrectLabelVisibility(false);
    expect(UIController.getInstance().devModeCorrectLabelVisibility).toBe(false);
  });
  it('should set devModeBucketControlsEnabled to true', () => {
    UIController.getInstance().SetBucketControlsVisibility(true);
    expect(UIController.getInstance().devModeBucketControlsEnabled).toBe(true);
  });

  it('should set devModeBucketControlsEnabled to false', () => {
    UIController.getInstance().SetBucketControlsVisibility(false);
    expect(UIController.getInstance().devModeBucketControlsEnabled).toBe(false);
  });
  it('should return false if there are no stars', () => {
    const starPositions: Array<{ x: number; y: number }> = [];
    const result = UIController.OverlappingOtherStars(starPositions, 5, 5, 10);
    expect(result).toBe(false);
  });

  it('should return false if no stars are within the minimum distance', () => {
    const starPositions: Array<{ x: number; y: number }> = [{ x: 1, y: 1 }];
    const result = UIController.OverlappingOtherStars(starPositions, 10, 10, 5);
    expect(result).toBe(false);
  });

  it('should return true if a star is within the minimum distance', () => {
    const starPositions: Array<{ x: number; y: number }> = [{ x: 1, y: 1 }];
    const result = UIController.OverlappingOtherStars(starPositions, 3, 3, 3);
    expect(result).toBe(true);
  });

  it('should return true if multiple stars are within the minimum distance', () => {
    const starPositions: Array<{ x: number; y: number }> = [
      { x: 1, y: 1 },
      { x: 3, y: 3 },
    ];
    const result = UIController.OverlappingOtherStars(starPositions, 4, 4, 3);
    expect(result).toBe(true);
  });

  it('should return false if no stars are within the minimum distance, even with multiple stars', () => {
    const starPositions: Array<{ x: number; y: number }> = [
      { x: 1, y: 1 },
      { x: 10, y: 10 },
    ];
    const result = UIController.OverlappingOtherStars(starPositions, 20, 20, 5);
    expect(result).toBe(false);
  });
  it('should add click event listeners to all answer buttons', () => {
    const spyAnswerButtonPress = jest.spyOn(uiController, 'answerButtonPress'); // Spy on the method

    // Trigger click on all answer buttons
    uiController.answerButton1.click();
    uiController.answerButton2.click();
    uiController.answerButton3.click();
    uiController.answerButton4.click();
    uiController.answerButton5.click();
    uiController.answerButton6.click();

    // Check if answerButtonPress was called with the correct button number
    expect(spyAnswerButtonPress).toHaveBeenCalledWith(1);
    expect(spyAnswerButtonPress).toHaveBeenCalledWith(2);
    expect(spyAnswerButtonPress).toHaveBeenCalledWith(3);
    expect(spyAnswerButtonPress).toHaveBeenCalledWith(4);
    expect(spyAnswerButtonPress).toHaveBeenCalledWith(5);
    expect(spyAnswerButtonPress).toHaveBeenCalledWith(6);
  });

  it('should add click event listener to landingContainer', () => {
    const spyShowGame = jest.spyOn(uiController, 'showGame'); // Spy on the showGame method

    // Simulate click on landingContainer
    uiController.landingContainer.click();

    // Check if showGame is called when conditions are met (simulating contentLoaded and localStorage)
    expect(spyShowGame).toHaveBeenCalled();
  });

  it('should not call showGame if localStorage data is missing', () => {
    // Clear localStorage to simulate missing data
    localStorage.clear();

    const spyShowGame = jest.spyOn(uiController, 'showGame'); // Spy on the showGame method

    // Simulate click on landingContainer
    uiController.landingContainer.click();

    // showGame should not be called because localStorage data is missing
    expect(spyShowGame).not.toHaveBeenCalled();
  });

  it('should call showGame only if contentLoaded is true and localStorage has data', () => {
    // Set up the conditions for contentLoaded and localStorage
    localStorage.setItem('someDataKey', 'someData'); // Set some data in localStorage
    uiController.contentLoaded = true; // Set contentLoaded to true

    const spyShowGame = jest.spyOn(uiController, 'showGame'); // Spy on the showGame method

    // Simulate click on landingContainer
    uiController.landingContainer.click();

    // Check that showGame was called
    expect(spyShowGame).toHaveBeenCalled();
  });

  it('should not call showGame if contentLoaded is false', () => {
    // Simulate conditions where contentLoaded is false
    uiController.contentLoaded = false;
    localStorage.setItem('someDataKey', 'someData'); // Set data in localStorage

    const spyShowGame = jest.spyOn(uiController, 'showGame'); // Spy on the showGame method

    // Simulate click on landingContainer
    uiController.landingContainer.click();

    // showGame should not be called
    expect(spyShowGame).not.toHaveBeenCalled();
  });
  it('should set feedbackContainer.innerHTML to the given text', () => {
    UIController.SetFeedbackText('Great job!');
    expect(uiController.feedbackContainer.innerHTML).toBe('Great job!');
  });

  it('should overwrite previous feedback text', () => {
    feedbackContainer.innerHTML = 'Old text';
    UIController.SetFeedbackText('New feedback');
    expect(uiController.feedbackContainer.innerHTML).toBe('New feedback');
  });
  it('should set the correct image source and classes on the star element', () => {
    const star = document.getElementById('star0') as HTMLImageElement;

    UIController.AddStar();

    expect(star.src).toContain('Star.gif');
    expect(star.classList.contains('topstarv')).toBe(true);
    expect(star.classList.contains('topstarh')).toBe(false);
    expect(star.style.position).toBe('absolute');
  });

  it('should increment qAnsNum and shownStarsCount', () => {
    UIController.AddStar();

    expect(uiController.qAnsNum).toBe(1);
    expect(uiController.shownStarsCount).toBe(1);
  });

  it('should push new coordinates to starPositions array', () => {
    expect(uiController.starPositions.length).toBe(0);

    UIController.AddStar();

    expect(uiController.starPositions.length).toBe(1);
    expect(uiController.starPositions[0]).toHaveProperty('x');
    expect(uiController.starPositions[0]).toHaveProperty('y');
  });

  it('should apply transition and transform styles', () => {
    const star = document.getElementById('star0') as HTMLImageElement;

    UIController.AddStar();

    expect(star.style.transition).toContain('top');
    expect(star.style.transform).toContain('scale(10)');
    expect(star.style.zIndex).toBe('500');
  });

  it('should call OverlappingOtherStars to avoid overlap', () => {
    const spy = jest.spyOn(UIController, 'OverlappingOtherStars').mockReturnValue(false);

    UIController.AddStar();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not throw if the star element does not exist (edge case)', () => {
    uiController.stars = [99]; // ID that doesn't exist in DOM

    expect(() => {
      UIController.AddStar();
    }).toThrow(); // if you're not catching it in code, expect it to throw
  });
  // it('should set playButton img to SoundButton.gif when playing is true', () => {
  //   UIController.ShowAudioAnimation(true);
  //   const img = uiController.playButton.querySelector('img');
  //   expect(img!.src).toContain('../../animation/SoundButton.gif');
  // });

  // it('should set playButton img to SoundButton_Idle.png when playing is false', () => {
  //   const img = uiController.playButton.querySelector('img')!;
  //   img.src = '../../animation/SoundButton.gif'; // initially playing

  //   UIController.ShowAudioAnimation(false);

  //   expect(img!.src).toContain('../../img/SoundButton_Idle.png');
  // });

  // it('should do nothing if devModeBucketControlsEnabled is true', () => {
  //   uiController.devModeBucketControlsEnabled = true;

  //   const img = uiController.playButton.querySelector('img')!;
  //   img.src = '../../img/SoundButton_Idle.png';

  //   UIController.ShowAudioAnimation(true);

  //   expect(img!.src).toContain('../../img/SoundButton_Idle.png'); // unchanged
  // });

  // it('should default to idle image when called with no argument', () => {
  //   const img = uiController.playButton.querySelector('img')!;
  //   img.src = '../../animation/SoundButton.gif'; // simulate playing state

  //   UIController.ShowAudioAnimation(); // default is false

  //   expect(img!.src).toContain('../../img/SoundButton_Idle.png');
  // });
  it('should hide landingContainer, show gameContainer, and hide endContainer', () => {
    uiController.showGame();

    expect(uiController.landingContainer.style.display).toBe('none');
    expect(uiController.gameContainer.style.display).toBe('grid');
    expect(uiController.endContainer.style.display).toBe('none');
  });

  it('should set allStart timestamp to now (approximately)', () => {
    const before = Date.now();
    uiController.showGame();
    const after = Date.now();

    expect(uiController.allStart).toBeGreaterThanOrEqual(before);
    expect(uiController.allStart).toBeLessThanOrEqual(after);
  });

  it('should call startPressCallback', () => {
    uiController.showGame();
    expect(uiController.startPressCallback).toHaveBeenCalled();
  });

  it('should set landingContainer display to flex', () => {
    uiController.showLanding();
    expect(uiController.landingContainer.style.display).toBe('flex');
  });

  it('should set gameContainer display to none', () => {
    uiController.showLanding();
    expect(uiController.gameContainer.style.display).toBe('none');
  });

  it('should set endContainer display to none', () => {
    uiController.showLanding();
    expect(uiController.endContainer.style.display).toBe('none');
  });
  it('should hide the landing container', () => {
    UIController.ShowEnd();
    expect(uiController.landingContainer.style.display).toBe('none');
  });

  it('should hide the game container', () => {
    UIController.ShowEnd();
    expect(uiController.gameContainer.style.display).toBe('none');
  });

  it('should show the end container', () => {
    UIController.ShowEnd();
    expect(uiController.endContainer.style.display).toBe('flex');
  });
  it('should hide the landing container', () => {
    uiController.showGame();
    expect(uiController.landingContainer.style.display).toBe('none');
  });

  it('should show the game container with display set to grid', () => {
    uiController.showGame();
    expect(uiController.gameContainer.style.display).toBe('grid');
  });

  it('should hide the end container', () => {
    uiController.showGame();
    expect(uiController.endContainer.style.display).toBe('none');
  });

  it('should set allStart to the current timestamp', () => {
    const before = Date.now();
    uiController.showGame();
    const after = Date.now();
    expect(uiController.allStart).toBeGreaterThanOrEqual(before);
    expect(uiController.allStart).toBeLessThanOrEqual(after);
  });

  it('should call startPressCallback', () => {
    uiController.showGame();
    expect(uiController.startPressCallback).toHaveBeenCalled();
  });
  it('should make feedback container visible and set color to green for correct answer', () => {
    UIController.SetFeedbackVisibile(true, true);

    expect(UIController.getInstance().feedbackContainer.classList.contains('visible')).toBe(true);
    expect(UIController.getInstance().feedbackContainer.classList.contains('hidden')).toBe(false);
    expect(UIController.getInstance().feedbackContainer.style.color).toBe('rgb(109, 204, 122)'); // green
    expect(UIController.getInstance().buttonsActive).toBe(false);
    expect(AudioController.PlayCorrect).toHaveBeenCalled();
  });

  it('should make feedback container visible and set color to red for incorrect answer', () => {
    UIController.SetFeedbackVisibile(true, false);

    expect(UIController.getInstance().feedbackContainer.classList.contains('visible')).toBe(true);
    expect(UIController.getInstance().feedbackContainer.classList.contains('hidden')).toBe(false);
    expect(UIController.getInstance().feedbackContainer.style.color).toBe('red');
    expect(UIController.getInstance().buttonsActive).toBe(false);
    expect(AudioController.PlayCorrect).not.toHaveBeenCalled();
  });

  it('should hide feedback container when visible is false', () => {
    UIController.SetFeedbackVisibile(false, true);

    expect(UIController.getInstance().feedbackContainer.classList.contains('visible')).toBe(false);
    expect(UIController.getInstance().feedbackContainer.classList.contains('hidden')).toBe(true);
    expect(UIController.getInstance().buttonsActive).toBe(false);
  });

  it('should not play correct audio when visible is false', () => {
    UIController.SetFeedbackVisibile(false, true);
    expect(AudioController.PlayCorrect).not.toHaveBeenCalled();
  });
  test('should change star image to star_after_animation.gif', () => {
    const star = document.getElementById('star1') as HTMLImageElement;
    star.src = 'initial.gif';

    UIController.getInstance().qAnsNum = 1;
    UIController.getInstance().stars = [1, 2, 3, 4, 5];

    UIController.ChangeStarImageAfterAnimation();

    expect(star.src).toContain('star_after_animation.gif');
  });
  test('should add a star with gif and correct style changes', () => {
    const ui = UIController.getInstance();
    ui.qAnsNum = 0;

    UIController.AddStar();

    const star = document.getElementById('star1') as HTMLImageElement;
    expect(star.src).toContain('Star.gif');
    expect(star.classList.contains('topstarv')).toBe(true);
    expect(star.style.position).toBe('absolute');
    expect(ui.shownStarsCount).toBe(1);
  });

  test('should set buttonsActive to true', () => {

    uiController.buttonsActive = false;

    uiController.enableAnswerButton();

    expect(uiController.buttonsActive).toBe(true);
  });
  test('should retain true if buttonsActive is already true', () => {

    uiController.buttonsActive = true;

    uiController.enableAnswerButton();

    expect(uiController.buttonsActive).toBe(true);
  });
  it('should exit early if newQ is null', () => {
    const result = UIController.ReadyForNext(null as any);
    expect(result).toBeUndefined();
  });



  it('should reset nextQuestion and hide questionsContainer', () => {
    UIController.ReadyForNext(mockQData);

    expect(uiController.nextQuestion).toEqual(mockQData);
    expect(uiController.questionsContainer.innerHTML).toBe('');
    expect(uiController.questionsContainer.style.display).toBe('none');
    expect(uiController.shown).toBe(false);
  });

  it('should call externalBucketControlsGenerationHandler when devModeBucketControlsEnabled is true', () => {
    uiController.devModeBucketControlsEnabled = true;

    UIController.ReadyForNext(mockQData);

    expect(uiController.externalBucketControlsGenerationHandler).toHaveBeenCalled();
  });

  it('should create nextqButton and attach click listener when devModeBucketControlsEnabled is false', () => {
    UIController.ReadyForNext(mockQData);

    const nextButton = document.getElementById('nextqButton');
    expect(nextButton).not.toBeNull();
  });

  it('should trigger ShowQuestion and PlayAudio when nextqButton is clicked', () => {
    const showQuestionSpy = jest.spyOn(UIController, 'ShowQuestion');
    const playAudioSpy = jest.spyOn(AudioController, 'PlayAudio');

    UIController.ReadyForNext(mockQData);

    const nextButton = document.getElementById('nextqButton');
    nextButton?.click();

    expect(showQuestionSpy).toHaveBeenCalled();
    expect(playAudioSpy).toHaveBeenCalledWith(
      mockQData.promptAudio,
      expect.any(Function),
      UIController.ShowAudioAnimation
    );
  });

  it('should NOT call externalBucketControlsGenerationHandler when devModeBucketControlsEnabled is false', () => {
    uiController.devModeBucketControlsEnabled = false;

    UIController.ReadyForNext(mockQData);

    expect(uiController.externalBucketControlsGenerationHandler).not.toHaveBeenCalled();
  });

});
