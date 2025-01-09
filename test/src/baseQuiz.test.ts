import { BaseQuiz } from '../../src/baseQuiz';
import { App } from '../../src/App';

// Create a concrete implementation of BaseQuiz for testing
class TestQuiz extends BaseQuiz {
  public handleBucketGenModeChange(event: Event): void {
    console.log('BucketGenModeChanged');
  }

  public handleCorrectLabelShownChange(): void {
    console.log('CorrectLabelShownChanged');
  }

  public handleBucketInfoShownChange(): void {
    console.log('BucketInfoShownChanged');
  }

  public handleBucketControlsShownChange(): void {
    console.log('BucketControlsShownChanged');
  }

  public handleAnimationSpeedMultiplierChange(): void {
    console.log('AnimationSpeedMultiplierChanged');
  }

  public Run(applink: App): void {
    console.log('Running TestQuiz');
  }

  public handleAnswerButtonPress(ans: number, elapsed: number): void {
    console.log(`AnswerButtonPressed with ans: ${ans}, elapsed: ${elapsed}`);
  }

  public HasQuestionsLeft(): boolean {
    return true;
  }
}

describe('BaseQuiz', () => {
  let testQuiz: TestQuiz;

  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = `
      <div id="devModeModalToggleButtonContainer"></div>
      <button id="devModeModalToggleButton"></button>
      <div id="devModeSettingsModal"></div>
      <select id="devModeBucketGenSelect"></select>
      <input type="checkbox" id="devModeCorrectLabelShownCheckbox">
      <input type="checkbox" id="devModeBucketInfoShownCheckbox">
      <div id="devModeBucketInfoContainer"></div>
      <input type="checkbox" id="devModeBucketControlsShownCheckbox">
      <input type="range" id="devModeAnimationSpeedMultiplierRange" value="1">
      <span id="devModeAnimationSpeedMultiplierValue"></span>
    `;

    testQuiz = new TestQuiz();
  });

  test('should initialize with default values', () => {
    expect(testQuiz.isInDevMode).toBeTruthy(); // Assuming devMode is based on localhost
    expect(testQuiz.animationSpeedMultiplier).toBe(1);
    expect(testQuiz.isCorrectLabelShown).toBe(false);
    expect(testQuiz.isBucketInfoShown).toBe(false);
    expect(testQuiz.isBucketControlsEnabled).toBe(false);
  });

  test('should toggle dev mode modal visibility', () => {
    const modal = document.getElementById('devModeSettingsModal')!;
    modal.style.display = 'none';

    testQuiz.toggleDevModeModal();
    expect(modal.style.display).toBe('block');

    testQuiz.toggleDevModeModal();
    expect(modal.style.display).toBe('none');
  });

  test('should handle bucket gen mode change', () => {
    const spy = jest.spyOn(testQuiz, 'handleBucketGenModeChange');
    const event = new Event('change');
    const select = document.getElementById('devModeBucketGenSelect')!;
    select.dispatchEvent(event);

    expect(spy).toHaveBeenCalledWith(event);
  });

  test('should update correct label visibility', () => {
    const checkbox = document.getElementById('devModeCorrectLabelShownCheckbox') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(testQuiz.isCorrectLabelShown).toBe(true);
  });

  test('should update bucket info visibility', () => {
    const checkbox = document.getElementById('devModeBucketInfoShownCheckbox') as HTMLInputElement;
    const container = document.getElementById('devModeBucketInfoContainer')!;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(testQuiz.isBucketInfoShown).toBe(true);
    expect(container.style.display).toBe('block');
  });

  test('should update bucket controls visibility', () => {
    const checkbox = document.getElementById('devModeBucketControlsShownCheckbox') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(testQuiz.isBucketControlsEnabled).toBe(true);
  });

  test('should update animation speed multiplier', () => {
    const range = document.getElementById('devModeAnimationSpeedMultiplierRange') as HTMLInputElement;
    const valueDisplay = document.getElementById('devModeAnimationSpeedMultiplierValue')!;
    range.value = '0.5';
    range.dispatchEvent(new Event('change'));

    expect(testQuiz.animationSpeedMultiplier).toBe(0.5);
    expect(valueDisplay.innerText).toBe('0.5');
  });

  test('should hide dev mode button container', () => {
    const container = document.getElementById('devModeModalToggleButtonContainer')!;
    testQuiz.hideDevModeButton();
    expect(container.style.display).toBe('none');
  });

  test('should call abstract methods', () => {
    expect(() => testQuiz.Run(new App())).not.toThrow();
    expect(() => testQuiz.handleAnswerButtonPress(1, 1000)).not.toThrow();
    expect(testQuiz.HasQuestionsLeft()).toBe(true);
  });
});
