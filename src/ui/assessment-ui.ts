import { qData } from '@components/questionData';

export interface AssessmentUICallbacks {
  onStart: () => void;
  /** answerIndex is 0-based (matching the internal answers array order). */
  onAnswer: (selection: { answerIndex: number; elapsedMs: number }) => void;
  onReplayPrompt?: () => void;
}

/**
 * Narrow UI contract for assessment screens.
 *
 * Models what the assessment flow needs from the UI,
 * not what the legacy UIController happens to expose.
 */
export interface AssessmentUI {
  configure(callbacks: AssessmentUICallbacks): void;

  // --- loading / startup state ---
  setLoadingVisible(visible: boolean): void;
  setLoadingProgress(progress: number): void;
  setContentLoaded(loaded: boolean): void;
  setGameReady(ready: boolean): void;
  setSkipStartScreen(skip: boolean): void;

  // --- screen transitions ---
  showLanding(): void;
  showEnd(): void;

  // --- question lifecycle ---
  prepareQuestion(question: qData): void;
  revealQuestion(): void;

  // --- feedback ---
  showFeedback(visible: boolean, isCorrect: boolean): void;
  setFeedbackText?(text: string): void;

  // --- star / chest progress ---
  addStar(): void;
  changeStarImageAfterAnimation(): void;
  progressChest(): void;
  getShownStarsCount(): number;

  // --- dev-mode hooks (optional) ---
  setCorrectLabelVisibility?(visible: boolean): void;
  setBucketControlsVisibility?(visible: boolean): void;
  setAnimationSpeedMultiplier?(multiplier: number): void;
  setExternalBucketControlsGenerationHandler?(
    handler: (container: HTMLElement, clickCallback: () => void) => void
  ): void;
}
