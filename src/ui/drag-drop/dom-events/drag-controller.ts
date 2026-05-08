import { iDraggableHTMLElement } from './draggable-button';
import { iDropAreaHTMLElement } from './drop-target';
import appEventBus from '@services/app-event-bus';

export default class DragEventController {
    private targetDropElement: iDropAreaHTMLElement | null = null;
    private foundDragElement: iDraggableHTMLElement | null = null;

    constructor(private root: HTMLElement) {
        this.targetDropElement = this.getDropTarget();
    }

    public attach(): void {
        this.root.addEventListener('pointerdown', this.handlePointerDown);
        this.root.addEventListener('pointermove', this.handlePointerDragMove);
        this.root.addEventListener('pointerup', this.handlePointerUp);
        this.root.addEventListener('pointercancel', this.handlePointerCancel);
    }

    public detach(): void {
        this.root.removeEventListener('pointerdown', this.handlePointerDown);
        this.root.removeEventListener('pointermove', this.handlePointerDragMove);
        this.root.removeEventListener('pointerup', this.handlePointerUp);
        this.root.removeEventListener('pointercancel', this.handlePointerCancel);
        this.foundDragElement = null;
        this.targetDropElement = null;
    }

    private locateBtnElement(event: PointerEvent): iDraggableHTMLElement | null {
        const target = event.target as HTMLElement | null;
        // Walk up the DOM to find the closest .answerButton ancestor (handles taps on child elements inside the button)
        const answerButton: iDraggableHTMLElement = target?.closest('.answerButton');

        return !answerButton ? null : answerButton;
    }

    private getDropTarget(): iDropAreaHTMLElement | null {
        return this.root.querySelector('.chestdiv');
    }

    private getActiveDropContext(): {
        dragElement: iDraggableHTMLElement;
        dropElement: iDropAreaHTMLElement;
    } | null {
        const dragElement = this.foundDragElement;
        const dropElement = this.targetDropElement;

        if (!dragElement || !dropElement) {
            return null;
        }

        // Only a valid drop context if the dragged element is currently overlapping the drop zone
        if (!this.isWithinTargetArea(dragElement, dropElement)) {
            return null;
        }

        return { dragElement, dropElement };
    }

    private setChestImage(variant: 'TreasureChestOpen01-new' | 'TreasureChestOpen04-new'): void {
        const chestImage = this.root.querySelector('#chestImage') as HTMLImageElement | null;
        if (!chestImage) return;
        chestImage.src = chestImage.src.replace(/TreasureChestOpen[\w-]+\.svg/, `${variant}.svg`);
    }

    private handlePointerDown = (event: PointerEvent) => {
        this.foundDragElement = this.locateBtnElement(event);

        if (this.foundDragElement) {
            this.foundDragElement?.onStart(event);
            // Open the chest lid as soon as a drag begins
            this.setChestImage('TreasureChestOpen04-new');
            appEventBus.publish(appEventBus.EVENTS.ON_DRAG_START, true);
        }

    };

    // AABB (axis-aligned bounding box) overlap test:
    // Returns true if any part of the dragged element's rect overlaps the drop zone rect.
    // Two rectangles overlap when neither is fully to the left, right, above, or below the other.
    private isWithinTargetArea(
        dragElement: iDraggableHTMLElement,
        dropElement: iDropAreaHTMLElement,
    ): boolean {
        const buttonRect = dragElement.getBoundingClientRect();
        const dropAreaRect = dropElement.getBoundingClientRect();

        const isOverlapping = buttonRect.left < dropAreaRect.right &&
            buttonRect.right > dropAreaRect.left &&
            buttonRect.top < dropAreaRect.bottom &&
            buttonRect.bottom > dropAreaRect.top;

        return isOverlapping;
    }

    private handlePointerDragMove = (event: PointerEvent) => {
        //Returns none if there are no answer button element.
        if (!this.foundDragElement) return;

        //Trigger the on move to move the button element.
        this.foundDragElement?.onMove(event);

        // Notify the drop target while the dragged element hovers over it
        const dropContext = this.getActiveDropContext();
        if (dropContext) {
            dropContext.dropElement?.onHover();
        }
    };

    private handlePointerUp = (_event: PointerEvent) => {
        const dropContext = this.getActiveDropContext();
        if (dropContext) {
            // Dragged element released over the drop zone — commit the answer selection
            dropContext.dropElement?.onDrop(dropContext.dragElement);
        } else if (this.foundDragElement) {
            // Released outside the drop zone — animate button back to starting position
            appEventBus.publish(appEventBus.EVENTS.ON_DRAG_RETURN, true);
        }

        this.endDrag();
    };

    private handlePointerCancel = (_event: PointerEvent) => {
        this.endDrag();
    };

    private endDrag(): void {
        if (!this.foundDragElement) {
            return;
        }

        this.foundDragElement?.onEnd?.();
        this.foundDragElement = null;
        // Close the chest lid once the drag interaction is over
        this.setChestImage('TreasureChestOpen01-new');
    };
}
