import { App } from './App';
import { AnalyticsEvents } from './components/analyticsEvents';
import { UIController } from './components/uiController';
import { UnityBridge } from './components/unityBridge';

export abstract class BaseQuiz {
  protected app: App;
  public dataURL: string;
  public unityBridge: UnityBridge;

  public devModeAvailable: boolean = false;
  public isInDevMode: boolean = false;

  public isCorrectLabelShown: boolean = false;
  public isBucketInfoShown: boolean = false;
  public isBucketControlsEnabled: boolean = false;
  public animationSpeedMultiplier: number = 1;

  public devModeToggleButtonContainerId: string = 'devModeModalToggleButtonContainer';
  public devModeToggleButtonContainer: HTMLElement;

  public devModeToggleButtonId: string = 'devModeModalToggleButton';
  public devModeToggleButton: HTMLButtonElement;

  public devModeModalId: string = 'devModeSettingsModal';
  public devModeSettingsModal: HTMLElement;

  public devModeBucketGenSelectId: string = 'devModeBucketGenSelect';
  public devModeBucketGenSelect: HTMLSelectElement;

  public devModeCorrectLabelShownCheckboxId: string = 'devModeCorrectLabelShownCheckbox';
  public devModeCorrectLabelShownCheckbox: HTMLInputElement;

  public devModeBucketInfoShownCheckboxId: string = 'devModeBucketInfoShownCheckbox';
  public devModeBucketInfoShownCheckbox: HTMLInputElement;
  public devModeBucketInfoContainerId: string = 'devModeBucketInfoContainer';
  public devModeBucketInfoContainer: HTMLElement;

  public devModeBucketControlsShownCheckboxId: string = 'devModeBucketControlsShownCheckbox';
  public devModeBucketControlsShownCheckbox: HTMLInputElement;

  public devModeAnimationSpeedMultiplierRangeId: string = 'devModeAnimationSpeedMultiplierRange';
  public devModeAnimationSpeedMultiplierRange: HTMLInputElement;

  public devModeAnimationSpeedMultiplierValueId: string = 'devModeAnimationSpeedMultiplierValue';
  public devModeAnimationSpeedMultiplierValue: HTMLElement;

  constructor() {
    this.isInDevMode =
      window.location.href.includes('localhost') ||
      window.location.href.includes('127.0.0.1') ||
      window.location.href.includes('assessmentdev');
    this.devModeToggleButtonContainer = document.getElementById(this.devModeToggleButtonContainerId);
    this.devModeSettingsModal = document.getElementById(this.devModeModalId);

    // this.devModeSettingsModal.addEventListener("click", (event) => {
    // 	// @ts-ignore
    // 	const id = event.target.id;
    // 	if (id == this.devModeModalId) {
    // 		event.stopPropagation();
    // 		this.toggleDevModeModal();
    // 	}
    // });

    this.devModeBucketGenSelect = document.getElementById(this.devModeBucketGenSelectId) as HTMLSelectElement;
    this.devModeBucketGenSelect.onchange = (event) => {
      this.handleBucketGenModeChange(event);
    };

    this.devModeToggleButton = document.getElementById(this.devModeToggleButtonId) as HTMLButtonElement;
    this.devModeToggleButton.onclick = this.toggleDevModeModal;

    this.devModeCorrectLabelShownCheckbox = document.getElementById(
      this.devModeCorrectLabelShownCheckboxId
    ) as HTMLInputElement;
    this.devModeCorrectLabelShownCheckbox.onchange = () => {
      this.isCorrectLabelShown = this.devModeCorrectLabelShownCheckbox.checked;
      this.handleCorrectLabelShownChange();
    };

    this.devModeBucketInfoShownCheckbox = document.getElementById(
      this.devModeBucketInfoShownCheckboxId
    ) as HTMLInputElement;
    this.devModeBucketInfoShownCheckbox.onchange = () => {
      this.isBucketInfoShown = this.devModeBucketInfoShownCheckbox.checked;
      this.devModeBucketInfoContainer.style.display = this.isBucketInfoShown ? 'block' : 'none';
      this.handleBucketInfoShownChange();
    };

    this.devModeBucketControlsShownCheckbox = document.getElementById(
      this.devModeBucketControlsShownCheckboxId
    ) as HTMLInputElement;
    this.devModeBucketControlsShownCheckbox.onchange = () => {
      this.isBucketControlsEnabled = this.devModeBucketControlsShownCheckbox.checked;
      this.handleBucketControlsShownChange();
    };

    this.devModeBucketInfoContainer = document.getElementById(this.devModeBucketInfoContainerId);

    this.devModeAnimationSpeedMultiplierRange = document.getElementById(
      this.devModeAnimationSpeedMultiplierRangeId
    ) as HTMLInputElement;

    this.devModeAnimationSpeedMultiplierValue = document.getElementById(this.devModeAnimationSpeedMultiplierValueId);

    this.devModeAnimationSpeedMultiplierRange.onchange = () => {
      this.animationSpeedMultiplier = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
      if (this.animationSpeedMultiplier < 0.2) {
        this.animationSpeedMultiplier = 0.2;
        this.devModeAnimationSpeedMultiplierRange.value = '0.2';
      }

      this.devModeAnimationSpeedMultiplierValue.innerText = this.animationSpeedMultiplier.toString();
      this.handleAnimationSpeedMultiplierChange();
    };

    if (!this.isInDevMode) {
      this.devModeToggleButtonContainer.style.display = 'none';
    } else {
      this.devModeToggleButtonContainer.style.display = 'block';
    }

    // Initialize the animation speed multiplier value and position
    this.animationSpeedMultiplier = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
  }

  public hideDevModeButton() {
    this.devModeToggleButtonContainer.style.display = 'none';
  }

  public abstract handleBucketGenModeChange(event: Event): void;
  public abstract handleCorrectLabelShownChange(): void;
  public abstract handleBucketInfoShownChange(): void;
  public abstract handleBucketControlsShownChange(): void;
  public abstract handleAnimationSpeedMultiplierChange(): void;

  public toggleDevModeModal = () => {
    if (this.devModeSettingsModal.style.display == 'block') {
      this.devModeSettingsModal.style.display = 'none';
    } else {
      this.devModeSettingsModal.style.display = 'block';
    }
  };

  public abstract Run(applink: App): void;
  public abstract handleAnswerButtonPress(ans: number, elapsed: number): void;
  public abstract HasQuestionsLeft(): boolean;

  public onEnd(): void {
    // sendFinished();
    UIController.ShowEnd();
    this.app.unityBridge.SendClose();
  }
}
