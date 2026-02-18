import { App } from './App';
import { AnalyticsEvents } from './analytics/analyticsEvents';
import { UIController } from './ui/uiController';
import { UnityBridge } from './utils/unityBridge';
import { PubSub } from '@curiouslearning/core'

export abstract class BaseQuiz extends PubSub {
  protected app: App;
  protected quizEndData: any;
  public id: string;
  public type: string;
  public score: number;
  public startTime: number;
  public endTime: number;
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
    super();
    this.isInDevMode =
      window.location.href.includes('localhost') ||
      window.location.href.includes('127.0.0.1') ||
      window.location.href.includes('assessmentdev');
    // Lookup elements via UIController so we respect the current root (shadow DOM or document)
    const ui = UIController.getInstance();
    this.devModeToggleButtonContainer = ui.FindElement(this.devModeToggleButtonContainerId);
    this.devModeSettingsModal = ui.FindElement(this.devModeModalId);

    // this.devModeSettingsModal.addEventListener("click", (event) => {
    // 	// @ts-ignore
    // 	const id = event.target.id;
    // 	if (id == this.devModeModalId) {
    // 		event.stopPropagation();
    // 		this.toggleDevModeModal();
    // 	}
    // });

    this.devModeBucketGenSelect = ui.FindElement(this.devModeBucketGenSelectId) as HTMLSelectElement;
    if (this.devModeBucketGenSelect) {
      this.devModeBucketGenSelect.onchange = (event) => {
        this.handleBucketGenModeChange(event);
      };
    }

    this.devModeToggleButton = ui.FindElement(this.devModeToggleButtonId) as HTMLButtonElement;
    if (this.devModeToggleButton) this.devModeToggleButton.onclick = this.toggleDevModeModal;

    this.devModeCorrectLabelShownCheckbox = ui.FindElement(this.devModeCorrectLabelShownCheckboxId) as HTMLInputElement;
    if (this.devModeCorrectLabelShownCheckbox) {
      this.devModeCorrectLabelShownCheckbox.onchange = () => {
        this.isCorrectLabelShown = this.devModeCorrectLabelShownCheckbox.checked;
        this.handleCorrectLabelShownChange();
      };
    }

    this.devModeBucketInfoShownCheckbox = ui.FindElement(this.devModeBucketInfoShownCheckboxId) as HTMLInputElement;
    if (this.devModeBucketInfoShownCheckbox) {
      this.devModeBucketInfoShownCheckbox.onchange = () => {
        this.isBucketInfoShown = this.devModeBucketInfoShownCheckbox.checked;
        if (this.devModeBucketInfoContainer) this.devModeBucketInfoContainer.style.display = this.isBucketInfoShown ? 'block' : 'none';
        this.handleBucketInfoShownChange();
      };
    }

    this.devModeBucketControlsShownCheckbox = ui.FindElement(this.devModeBucketControlsShownCheckboxId) as HTMLInputElement;
    if (this.devModeBucketControlsShownCheckbox) {
      this.devModeBucketControlsShownCheckbox.onchange = () => {
        this.isBucketControlsEnabled = this.devModeBucketControlsShownCheckbox.checked;
        this.handleBucketControlsShownChange();
      };
    }

    this.devModeBucketInfoContainer = ui.FindElement(this.devModeBucketInfoContainerId);

    this.devModeAnimationSpeedMultiplierRange = ui.FindElement(this.devModeAnimationSpeedMultiplierRangeId) as HTMLInputElement;

    this.devModeAnimationSpeedMultiplierValue = ui.FindElement(this.devModeAnimationSpeedMultiplierValueId);

    if (this.devModeAnimationSpeedMultiplierRange) {
      this.devModeAnimationSpeedMultiplierRange.onchange = () => {
        this.animationSpeedMultiplier = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
        if (this.animationSpeedMultiplier < 0.2) {
          this.animationSpeedMultiplier = 0.2;
          this.devModeAnimationSpeedMultiplierRange.value = '0.2';
        }

        if (this.devModeAnimationSpeedMultiplierValue) this.devModeAnimationSpeedMultiplierValue.innerText = this.animationSpeedMultiplier.toString();
        this.handleAnimationSpeedMultiplierChange();
      };
    }

    if (!this.isInDevMode) {
      if (this.devModeToggleButtonContainer) this.devModeToggleButtonContainer.style.display = 'none';
    } else {
      if (this.devModeToggleButtonContainer) this.devModeToggleButtonContainer.style.display = 'block';
    }

    // Initialize the animation speed multiplier value and position
    if (this.devModeAnimationSpeedMultiplierRange) {
      this.animationSpeedMultiplier = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
    }
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

  start() {
    this.startTime = Date.now();
  }

  public onEnd(): void {
    // sendFinished();
    UIController.ShowEnd(); // TODO: non-game logic code. Move to App.ts
    this.app.unityBridge.SendClose(); // TODO: non-game logic code. Move to App.ts
    this.endTime = Date.now();
    this.publish('ENDED', this);
  }
}
