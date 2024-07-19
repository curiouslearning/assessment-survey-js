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

	public devModeBucketGenSelectId: string = "devModeBucketGenSelect";
	public devModeBucketGenSelect: HTMLSelectElement;

	constructor() {
		this.isInDevMode = window.location.href.includes("localhost") || window.location.href.includes("assessmentdev");
		this.devModeToggleButtonContainer = document.getElementById(this.devModeToggleButtonContainerId);
		this.devModeSettingsModal = document.getElementById(this.devModeModalId);

		this.devModeBucketGenSelect = document.getElementById(this.devModeBucketGenSelectId) as HTMLSelectElement;
		this.devModeBucketGenSelect.onchange = (event) => { this.handleBucketGenModeChange(event) };
		
		this.devModeToggleButton = document.getElementById(this.devModeToggleButtonId) as HTMLButtonElement;
		this.devModeToggleButton.onclick = this.toggleDevModeModal;
	}

	public abstract handleBucketGenModeChange(event: Event): void;

	public toggleDevModeModal = () => {
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
