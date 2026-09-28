export interface TapToAnswerCallbacks {
  onAnswer: (answerIndex: number, elapsedMs: number) => void;
  getElapsedMs: () => number;
}

/**
 * Click-to-select input for a row of answer buttons — a plain tap gesture,
 * independent of any drag-and-drop wiring. Extracted out of DragDropAssessmentUI
 * so a UI built around dragging doesn't also own an unrelated tap gesture
 * (see FM-979: spelling answers fall back to tapping a box instead of dragging
 * a ladybug, since longer words don't fit inside it).
 */
export class TapToAnswerController {
  private active = false;
  private readonly unsubscribers: Array<() => void> = [];

  constructor(
    private readonly buttons: HTMLElement[],
    private readonly callbacks: TapToAnswerCallbacks
  ) {}

  attach(): void {
    this.buttons.forEach((button, index) => {
      const handleClick = () => {
        if (!this.active) return;
        this.active = false;
        this.callbacks.onAnswer(index, this.callbacks.getElapsedMs());
      };
      button.addEventListener('click', handleClick);
      this.unsubscribers.push(() => button.removeEventListener('click', handleClick));
    });
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  dispose(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers.length = 0;
  }
}
