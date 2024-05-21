import { App } from './App';
import { AnalyticsEvents } from './components/analyticsEvents';
import { UIController } from './components/uiController';
import { UnityBridge } from './components/unityBridge';

export abstract class BaseQuiz {
	protected app: App;
	public dataURL: string;
	public unityBridge: UnityBridge;

	public abstract Run(applink: App): void;
	public abstract TryAnswer(ans: number, elapsed: number): void;
	public abstract HasQuestionsLeft(): boolean;

	public onEnd(): void {
		// sendFinished();
		UIController.ShowEnd();
		this.app.unityBridge.SendClose();
	}
}
