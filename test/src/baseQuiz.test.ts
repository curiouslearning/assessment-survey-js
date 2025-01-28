import { BaseQuiz } from '../../src/baseQuiz';
import { App } from '../../src/App';
import { UIController } from '../../src/ui/uiController';
import { UnityBridge } from '../../src/utils/unityBridge';

class MockQuiz extends BaseQuiz {
  public handleBucketGenModeChange(event: Event): void {}
  public handleCorrectLabelShownChange(): void {}
  public handleBucketInfoShownChange(): void {}
  public handleBucketControlsShownChange(): void {}
  public handleAnimationSpeedMultiplierChange(): void {}
  public Run(applink: App): void {}
  public handleAnswerButtonPress(ans: number, elapsed: number): void {}
  public HasQuestionsLeft(): boolean {
    return true;
  }
}

describe('BaseQuiz', () => {
  let mockQuiz: MockQuiz;

  beforeEach(() => {
    // Mock necessary DOM elements
    document.body.innerHTML = `
      <div id="devModeModalToggleButtonContainer"></div>
      <button id="devModeModalToggleButton"></button>
      <div id="devModeSettingsModal" style="display: none;"></div>
      <select id="devModeBucketGenSelect"></select>
      <input id="devModeCorrectLabelShownCheckbox" type="checkbox">
      <input id="devModeBucketInfoShownCheckbox" type="checkbox">
      <div id="devModeBucketInfoContainer" style="display: none;"></div>
      <input id="devModeBucketControlsShownCheckbox" type="checkbox">
      <input id="devModeAnimationSpeedMultiplierRange" type="range" value="1">
      <span id="devModeAnimationSpeedMultiplierValue"></span>
    `;

    mockQuiz = new MockQuiz();
  });

  test('should initialize dev mode properties based on URL', () => {
    expect(mockQuiz.isInDevMode).toBe(true);
  });

  test('should toggle dev mode modal visibility', () => {
    const modal = document.getElementById('devModeSettingsModal') as HTMLElement;

    expect(modal.style.display).toBe('none');
    mockQuiz.toggleDevModeModal();
    expect(modal.style.display).toBe('block');
    mockQuiz.toggleDevModeModal();
    expect(modal.style.display).toBe('none');
  });

  test('should set isCorrectLabelShown when checkbox changes', () => {
    const checkbox = document.getElementById('devModeCorrectLabelShownCheckbox') as HTMLInputElement;
    checkbox.checked = true;

    checkbox.dispatchEvent(new Event('change'));
    expect(mockQuiz.isCorrectLabelShown).toBe(true);

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    expect(mockQuiz.isCorrectLabelShown).toBe(false);
  });

  test('should update bucket info visibility when checkbox changes', () => {
    const checkbox = document.getElementById('devModeBucketInfoShownCheckbox') as HTMLInputElement;
    const container = document.getElementById('devModeBucketInfoContainer') as HTMLElement;

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    expect(container.style.display).toBe('block');

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    expect(container.style.display).toBe('none');
  });

  test('should update animation speed multiplier on range change', () => {
    const rangeInput = document.getElementById('devModeAnimationSpeedMultiplierRange') as HTMLInputElement;
    const valueDisplay = document.getElementById('devModeAnimationSpeedMultiplierValue') as HTMLElement;

    rangeInput.value = '2';
    rangeInput.dispatchEvent(new Event('change'));
    expect(mockQuiz.animationSpeedMultiplier).toBe(2);
    expect(valueDisplay.innerText).toBe('2');

    rangeInput.value = '0.1';
    rangeInput.dispatchEvent(new Event('change'));
    expect(mockQuiz.animationSpeedMultiplier).toBe(0.2);
    expect(rangeInput.value).toBe('0.2');
    expect(valueDisplay.innerText).toBe('0.2');
  });

  test('should hide dev mode button when hideDevModeButton is called', () => {
    const container = document.getElementById('devModeModalToggleButtonContainer') as HTMLElement;
    mockQuiz.hideDevModeButton();
    expect(container.style.display).toBe('none');
  });
});
