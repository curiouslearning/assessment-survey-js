import { DragEventController, DraggableButton, DropAreaTarget, iDraggableHTMLElement } from './dom-events';
import appEventBus from '@services/app-event-bus';

export interface DragToAnswerCallbacks {
  onAnswer: (answerIndex: number, elapsedMs: number) => void;
  getElapsedMs: () => number;
}

/**
 * Drag-and-drop input for a row of answer buttons — dragging an item onto the
 * drop target answers the question. Owns the DragEventController/DraggableButton/
 * DropAreaTarget wiring and the appEventBus subscription that maps a drop back to
 * an answerIndex, kept separate from TapToAnswerController's plain click gesture.
 */
export class DragToAnswerController {
  private active = false;
  private dragController: DragEventController | null = null;
  private dropUnsubscribe: (() => void) | null = null;

  constructor(
    private readonly gameContainer: HTMLElement,
    private readonly answerButtons: HTMLElement[],
    private readonly dropTarget: HTMLElement | null,
    private readonly callbacks: DragToAnswerCallbacks
  ) {}

  attach(): void {
    // Apply drag behaviour to each answer button (class 'answerButton' required by DragEventController).
    this.answerButtons.forEach((button) => new DraggableButton(button));

    // Apply drop behaviour to the chest div (class 'chestdiv' required by DragEventController).
    if (this.dropTarget) {
      new DropAreaTarget(this.dropTarget);
    }

    // Attach pointer-event listeners to the game container so DragEventController
    // can locate both the draggable buttons and the chest drop zone.
    this.dragController = new DragEventController(this.gameContainer);
    this.dragController.attach();

    // Map dropped element → 0-based answerIndex → onAnswer callback.
    this.dropUnsubscribe = appEventBus.subscribe(
      appEventBus.EVENTS.DROP_ELEMENT_INTERACTION,
      ({ selectedAnswer }: { selectedAnswer: iDraggableHTMLElement }) => {
        if (!this.active) return;
        this.setActive(false);
        // Button IDs are 'answerButton1'…'answerButton6' (1-based); convert to 0-based.
        const buttonNum = parseInt(selectedAnswer.id.replace('answerButton', ''), 10);
        if (isNaN(buttonNum)) return;
        this.callbacks.onAnswer(buttonNum - 1, this.callbacks.getElapsedMs());
      }
    );
  }

  setActive(active: boolean): void {
    this.active = active;
    this.dragController?.setLocked(!active);
  }

  dispose(): void {
    this.dragController?.detach();
    this.dragController = null;
    this.dropUnsubscribe?.();
    this.dropUnsubscribe = null;
  }
}
