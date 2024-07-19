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

	public devModeToggleButtonContainerId: string = "devModeModalToggleButtonContainer";
	public devModeToggleButtonContainer: HTMLElement;

	public devModeToggleButtonId: string = "devModeModalToggleButton";
	public devModeToggleButton: HTMLButtonElement;

	public devModeModalId: string = "devModeSettingsModal";
	public devModeSettingsModal: HTMLElement;

	constructor() {
		this.devModeToggleButtonContainer = document.getElementById(this.devModeToggleButtonContainerId);
		this.devModeToggleButton = document.getElementById(this.devModeToggleButtonId) as HTMLButtonElement;
		this.devModeSettingsModal = document.getElementById(this.devModeModalId);
		this.devModeToggleButton.onclick = this.ToggleDevModeModal;
	}

	public ToggleDevModeModal = () => {
		if (this.devModeSettingsModal.style.display == "block") {
			this.devModeSettingsModal.style.display = "none";
		} else {
			this.devModeSettingsModal.style.display = "block";
		}
	}

	public abstract Run(applink: App): void;
	public abstract TryAnswer(ans: number, elapsed: number): void;
	public abstract HasQuestionsLeft(): boolean;

	public onEnd(): void {
		// sendFinished();
		UIController.ShowEnd();
		this.app.unityBridge.SendClose();
	}
}
