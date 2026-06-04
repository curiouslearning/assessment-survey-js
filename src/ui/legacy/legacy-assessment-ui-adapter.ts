import { qData } from '@components/questionData';
import { AssessmentUI, AssessmentUICallbacks } from '../assessment-ui';
import { UIController } from '@ui/uiController';
import { AudioController } from '@components/audioController';

/**
 * Wraps the existing UIController singleton behind the AssessmentUI interface.
 * Preserves the legacy experience without requiring a UIController rewrite.
 */
export class LegacyAssessmentUIAdapter implements AssessmentUI {
  configure(callbacks: AssessmentUICallbacks): void {
    UIController.SetButtonPressAction((buttonNum: number, elapsedMs: number) => {
      // UIController buttons are 1-based; AssessmentUI contract is 0-based
      callbacks.onAnswer({ answerIndex: buttonNum - 1, elapsedMs });
    });
    UIController.SetStartAction(callbacks.onStart);
  }

  setLoadingVisible(visible: boolean): void {
    UIController.SetLoadingVisible?.(visible);
  }

  setLoadingProgress(progress: number): void {
    UIController.SetLoadingProgress?.(progress);
  }

  setContentLoaded(loaded: boolean): void {
    UIController.SetContentLoaded?.(loaded);
  }

  setGameReady(ready: boolean): void {
    UIController.SetGameReady?.(ready);
  }

  setSkipStartScreen(skip: boolean): void {
    UIController.SetSkipStartScreen?.(skip);
  }

  showLanding(): void {
    UIController.getInstance().showLanding();
  }

  showEnd(): void {
    UIController.ShowEnd();
  }

  prepareQuestion(question: qData): void {
    UIController.ReadyForNext(question);
  }

  revealQuestion(): void {
    UIController.ShowQuestion();
    const instance = UIController.getInstance();
    if (instance.nextQuestion?.promptAudio) {
      AudioController.PlayAudio(
        instance.nextQuestion.promptAudio,
        instance.showOptions,
        UIController.ShowAudioAnimation
      );
    }
  }

  showFeedback(visible: boolean, isCorrect: boolean): void {
    UIController.SetFeedbackVisibile(visible, isCorrect);
  }

  setFeedbackText(text: string): void {
    UIController.SetFeedbackText?.(text);
  }

  addStar(): void {
    UIController.AddStar();
  }

  changeStarImageAfterAnimation(): void {
    UIController.ChangeStarImageAfterAnimation();
  }

  progressChest(): void {
    UIController.ProgressChest();
  }

  getShownStarsCount(): number {
    return UIController.getInstance().shownStarsCount;
  }

  setCorrectLabelVisibility(visible: boolean): void {
    UIController.getInstance().SetCorrectLabelVisibility(visible);
  }

  setBucketControlsVisibility(visible: boolean): void {
    UIController.getInstance().SetBucketControlsVisibility(visible);
  }

  setAnimationSpeedMultiplier(multiplier: number): void {
    UIController.getInstance().SetAnimationSpeedMultiplier(multiplier);
  }

  setExternalBucketControlsGenerationHandler(
    handler: (container: HTMLElement, clickCallback: () => void) => void
  ): void {
    UIController.SetExternalBucketControlsGenerationHandler(handler);
  }
}
