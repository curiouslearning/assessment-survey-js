import { iDraggableHTMLElement } from './draggable-button';
import { iDropAreaHTMLElement } from './drop-target';

export default class DragEventController {
    private targetDropElement: iDropAreaHTMLElement | null = null;

    constructor(private root: HTMLElement) {
        //Get the target drop area.
        this.targetDropElement = this.getDropTarget();
    }

    public attach(): void {
        this.root.addEventListener('pointerdown', this.handlePointerDown);
        this.root.addEventListener('pointermove', this.handlePointerDragMove);
        this.root.addEventListener('pointerup', this.handlePointerUp);
    }

    private locateBtnElement(event: PointerEvent): iDraggableHTMLElement | null {
        const target = event.target as HTMLElement | null;
        //recent lastest element within reach.
        const answerButton: iDraggableHTMLElement = target?.closest('.answerButton');

        return !answerButton ? null : answerButton;
    }

    private getDropTarget(): iDropAreaHTMLElement | null {
        return this.root.querySelector('.chestdiv');
    }

    private isOverlapping(a: HTMLElement, b: HTMLElement): boolean {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();

        return (
            rectA.left < rectB.right &&
            rectA.right > rectB.left &&
            rectA.top < rectB.bottom &&
            rectA.bottom > rectB.top
        );
    }

    private handlePointerDown = (event: PointerEvent) => {
        const answerButton: iDraggableHTMLElement = this.locateBtnElement(event);

        if (answerButton) {
            answerButton?.onStart(event);
        }

    };

    private handlePointerDragMove = (event: PointerEvent) => {
        //Check if within a button element.
        const answerButton: iDraggableHTMLElement = this.locateBtnElement(event);

        //Returns none if there are no answer button element.
        if (!answerButton) return;

        //Trigger the on move to move the button element.
        answerButton?.onMove(event);

        if (answerButton && this.targetDropElement) {
            //Get the element's current box in screen/dom tree.
            const buttonRect = answerButton.getBoundingClientRect();
            const dropAreaRect = this.targetDropElement.getBoundingClientRect();

            //Check if the button element is within the box area of drop area element.
            const isOverlapping = buttonRect.left < dropAreaRect.right &&
                buttonRect.right > dropAreaRect.left &&
                buttonRect.top < dropAreaRect.bottom &&
                buttonRect.bottom > dropAreaRect.top;

            if (isOverlapping) {
                console.log({ answerButton })
                this.targetDropElement?.onHover(answerButton);
            }
        };
    };

    private handlePointerUp = (event: PointerEvent) => {
        const answerButton: iDraggableHTMLElement = this.locateBtnElement(event);
        // temporary drop/end logic here
        console.log(' handlePointerUp ')
        if (answerButton) {
            answerButton?.onEnd();
        }
    };
}
