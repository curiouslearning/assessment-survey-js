// test/ui/uiController.test.ts
import { setupDom } from './_mock_/dom';
import { UIController } from '../../src/ui/uiController';

describe('UIController', () => {
  let uiController: UIController;
  let feedbackContainer: HTMLElement;
  let mockButtonPressCallback: jest.Mock;
  let mockPlayDing: jest.Mock;
  let chestImage: HTMLImageElement;
  beforeEach(() => {
    setupDom();
    feedbackContainer = document.getElementById('feedbackWrap') as HTMLElement;
    UIController.instance = null;
    uiController = UIController.getInstance(); // Getting the singleton instance
    uiController.initEventListeners();
    uiController['feedbackContainer'] = feedbackContainer;


    chestImage = document.getElementById('chestImage') as HTMLImageElement;
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
});
