import { App } from './App';
import { AnalyticsEvents } from './analytics/analyticsEvents';
import { UIController } from './ui/uiController';
import { UnityBridge } from './utils/unityBridge';
// Lightweight in-repo pub/sub used by quizzes to notify app-level listeners.
class PubSub {
  private listeners: { [key: string]: Array<(payload?: any) => void> } = {};

  subscribe(event: string, callback: (payload?: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  publish(event: string, payload?: any): void {
    const subs = this.listeners[event];
    if (!subs) {
      return;
    }

    const errors: unknown[] = [];
    for (const callback of subs) {
      try {
        callback(payload);
      } catch (err) {
        errors.push(err);
        console.error('PubSub callback error for event', event, err);
      }
    }

    const shouldThrowInCurrentEnv =
      typeof process === 'undefined' || process?.env?.NODE_ENV !== 'production';
    if (errors.length > 0 && shouldThrowInCurrentEnv) {
      throw errors[0];
    }
  }
}

export abstract class BaseQuiz extends PubSub {
  static readonly TYPE: string = 'base';

  protected app: App;
  protected quizEndData: any;
  public id: string;
  public type: string;
  public score: number;
  public max_score: number;
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
  public devModeToggleButtonContainer: HTMLElement | null;

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
  public devModeAnimationSpeedMultiplierValue: HTMLElement | null;

  constructor() {
    super();
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
    if (this.devModeBucketGenSelect) {
      this.devModeBucketGenSelect.onchange = (event) => {
        this.handleBucketGenModeChange(event);
      };
    }

    this.devModeToggleButton = document.getElementById(this.devModeToggleButtonId) as HTMLButtonElement;
    if (this.devModeToggleButton) {
      this.devModeToggleButton.onclick = this.toggleDevModeModal;
    }

    this.devModeCorrectLabelShownCheckbox = document.getElementById(
      this.devModeCorrectLabelShownCheckboxId
    ) as HTMLInputElement;
    if (this.devModeCorrectLabelShownCheckbox) {
      this.devModeCorrectLabelShownCheckbox.onchange = () => {
        this.isCorrectLabelShown = this.devModeCorrectLabelShownCheckbox.checked;
        this.handleCorrectLabelShownChange();
      };
    }

    this.devModeBucketInfoShownCheckbox = document.getElementById(
      this.devModeBucketInfoShownCheckboxId
    ) as HTMLInputElement;
    if (this.devModeBucketInfoShownCheckbox) {
      this.devModeBucketInfoShownCheckbox.onchange = () => {
        this.isBucketInfoShown = this.devModeBucketInfoShownCheckbox.checked;
        if (this.devModeBucketInfoContainer) {
          this.devModeBucketInfoContainer.style.display = this.isBucketInfoShown ? 'block' : 'none';
        }
        this.handleBucketInfoShownChange();
      };
    }

    this.devModeBucketControlsShownCheckbox = document.getElementById(
      this.devModeBucketControlsShownCheckboxId
    ) as HTMLInputElement;
    if (this.devModeBucketControlsShownCheckbox) {
      this.devModeBucketControlsShownCheckbox.onchange = () => {
        this.isBucketControlsEnabled = this.devModeBucketControlsShownCheckbox.checked;
        this.handleBucketControlsShownChange();
      };
    }

    this.devModeBucketInfoContainer = document.getElementById(this.devModeBucketInfoContainerId);

    this.devModeAnimationSpeedMultiplierRange = document.getElementById(
      this.devModeAnimationSpeedMultiplierRangeId
    ) as HTMLInputElement;

    this.devModeAnimationSpeedMultiplierValue = document.getElementById(this.devModeAnimationSpeedMultiplierValueId);

    if (this.devModeAnimationSpeedMultiplierRange) {
      this.devModeAnimationSpeedMultiplierRange.onchange = () => {
        this.syncAnimationSpeedMultiplier();
      };
      this.syncAnimationSpeedMultiplier();
    }

    if (this.devModeToggleButtonContainer) {
      if (!this.isInDevMode) {
        this.devModeToggleButtonContainer.style.display = 'none';
      } else {
        this.devModeToggleButtonContainer.style.display = 'block';
      }
    }
  }

  public hideDevModeButton() {
    if (this.devModeToggleButtonContainer) {
      this.devModeToggleButtonContainer.style.display = 'none';
    }
  }

  private syncAnimationSpeedMultiplier(): void {
    if (!this.devModeAnimationSpeedMultiplierRange) {
      return;
    }

    const parsedValue = parseFloat(this.devModeAnimationSpeedMultiplierRange.value);
    this.animationSpeedMultiplier = Number.isFinite(parsedValue) ? parsedValue : 1;
    if (this.animationSpeedMultiplier < 0.2) {
      this.animationSpeedMultiplier = 0.2;
      this.devModeAnimationSpeedMultiplierRange.value = '0.2';
    }

    if (this.devModeAnimationSpeedMultiplierValue) {
      this.devModeAnimationSpeedMultiplierValue.innerText = this.animationSpeedMultiplier.toString();
    }

    this.handleAnimationSpeedMultiplierChange();
  }

  public abstract handleBucketGenModeChange(event: Event): void;
  public abstract handleCorrectLabelShownChange(): void;
  public abstract handleBucketInfoShownChange(): void;
  public abstract handleBucketControlsShownChange(): void;
  public abstract handleAnimationSpeedMultiplierChange(): void;

  public toggleDevModeModal = () => {
    if (!this.devModeSettingsModal) {
      return;
    }
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
