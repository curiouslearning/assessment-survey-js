import { iDraggableHTMLElement } from './draggable-button';
import { iDropAreaHTMLElement } from './drop-target';
import appEventBus from '@services/app-event-bus';

export default class DragEventController {
    private targetDropElement: iDropAreaHTMLElement | null = null;
    private foundDragElement: iDraggableHTMLElement | null = null;
    private locked = false;
    private activePointerId: number | null = null;

    // Batches pointermove work to one update per animation frame instead of doing the
    // transform write + drop-area rect read synchronously on every native pointermove —
    // avoids forced-synchronous-layout (write-then-read) on low-end devices.
    private pendingMoveEvent: PointerEvent | null = null;
    private rafHandle: number | null = null;

    constructor(private root: HTMLElement) {
        this.targetDropElement = this.getDropTarget();
    }

    public setLocked(locked: boolean): void {
        this.locked = locked;
        if (locked && this.foundDragElement) {
            this.endDrag();
        }
    }

    public attach(): void {
        // pointerdown/pointermove/pointerup/pointercancel never call preventDefault(),
        // so marking them passive lets the browser optimize scroll/composite scheduling.
        this.root.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
        this.root.addEventListener('pointermove', this.handlePointerDragMove, { passive: true });
        this.root.addEventListener('pointerup', this.handlePointerUp, { passive: true });
        this.root.addEventListener('pointercancel', this.handlePointerCancel, { passive: true });
        this.root.addEventListener('dragstart', this.handleDragStart);
    }

    public detach(): void {
        this.root.removeEventListener('pointerdown', this.handlePointerDown);
        this.root.removeEventListener('pointermove', this.handlePointerDragMove);
        this.root.removeEventListener('pointerup', this.handlePointerUp);
        this.root.removeEventListener('pointercancel', this.handlePointerCancel);
        this.root.removeEventListener('dragstart', this.handleDragStart);
        this.cancelPendingMove();
        this.foundDragElement = null;
        this.targetDropElement = null;
        this.activePointerId = null;
    }

    private cancelPendingMove(): void {
        if (this.rafHandle !== null) {
            cancelAnimationFrame(this.rafHandle);
            this.rafHandle = null;
        }
        this.pendingMoveEvent = null;
    }

    // Applies a still-scheduled move immediately instead of discarding it, so a pointerup
    // that lands between two animation frames is evaluated against the final pointer
    // position rather than a frame-stale one.
    private flushPendingMoveNow(): void {
        if (this.rafHandle !== null) {
            cancelAnimationFrame(this.rafHandle);
            this.rafHandle = null;
        }
        const event = this.pendingMoveEvent;
        this.pendingMoveEvent = null;

        if (event && this.foundDragElement && this.isActivePointer(event)) {
            this.foundDragElement.onMove(event);
        }
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

    private isActivePointer(event: PointerEvent): boolean {
        return this.activePointerId !== null && event.pointerId === this.activePointerId;
    }

    //suppress the browser's native HTML5 drag on any element inside
    // the game container so only the custom pointer-event drag can fire.
    private handleDragStart = (event: DragEvent) => {
        event.preventDefault();
    };

    private handlePointerDown = (event: PointerEvent) => {
        if (this.locked) return;
        if (this.activePointerId !== null || this.foundDragElement) return;

        const dragElement = this.locateBtnElement(event);

        if (!dragElement) return;

        this.activePointerId = event.pointerId;
        this.foundDragElement = dragElement;
        this.foundDragElement?.onStart(event);
        // Open the chest lid as soon as a drag begins
        this.setChestImage('TreasureChestOpen04-new');
        appEventBus.publish(appEventBus.EVENTS.ON_DRAG_START, true);
    };

    private isWithinTargetArea(
        dragElement: iDraggableHTMLElement,
        dropElement: iDropAreaHTMLElement,
    ): boolean {
        const buttonRect = dragElement.getBoundingClientRect();
        const hitTarget = this.root.querySelector('#chestImage') ?? dropElement;
        const chestRect = hitTarget.getBoundingClientRect();

        const centerX = (buttonRect.left + buttonRect.right) / 2;
        const centerY = (buttonRect.top + buttonRect.bottom) / 2;

        return centerX >= chestRect.left &&
            centerX <= chestRect.right &&
            centerY >= chestRect.top &&
            centerY <= chestRect.bottom;
    }

    private handlePointerDragMove = (event: PointerEvent) => {
        //Returns none if there are no answer button element.
        if (!this.foundDragElement || !this.isActivePointer(event)) return;

        // Keep only the latest pointer position; schedule at most one flush per frame
        // so bursts of native pointermove events collapse into a single update.
        this.pendingMoveEvent = event;
        if (this.rafHandle !== null) return;

        this.rafHandle = requestAnimationFrame(this.flushPendingMove);
    };

    private flushPendingMove = (): void => {
        this.rafHandle = null;
        const event = this.pendingMoveEvent;
        this.pendingMoveEvent = null;

        if (!event || !this.foundDragElement || !this.isActivePointer(event)) return;

        //Trigger the on move to move the button element.
        this.foundDragElement?.onMove(event);

        // Notify the drop target while the dragged element hovers over it
        const dropContext = this.getActiveDropContext();
        if (dropContext) {
            dropContext.dropElement?.onHover();
        }
    };

    private handlePointerUp = (event: PointerEvent) => {
        if (!this.isActivePointer(event)) return;

        // Commit any move still waiting for its animation frame so the drop-zone
        // check below sees the pointer's actual final position.
        this.flushPendingMoveNow();

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

    private handlePointerCancel = (event: PointerEvent) => {
        if (!this.isActivePointer(event)) return;

        this.endDrag();
    };

    private endDrag(): void {
        this.cancelPendingMove();

        if (!this.foundDragElement) {
            this.activePointerId = null;
            return;
        }

        this.foundDragElement?.onEnd?.();
        this.foundDragElement = null;
        this.activePointerId = null;
        // Close the chest lid once the drag interaction is over
        this.setChestImage('TreasureChestOpen01-new');
    };
}
