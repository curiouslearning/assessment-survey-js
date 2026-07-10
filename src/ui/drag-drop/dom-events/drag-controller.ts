import { iDraggableHTMLElement } from './draggable-button';
import { iDropAreaHTMLElement } from './drop-target';
import appEventBus from '@services/app-event-bus';

export default class DragEventController {
    private targetDropElement: iDropAreaHTMLElement | null = null;
    private foundDragElement: iDraggableHTMLElement | null = null;
    private locked = false;
    private activePointerId: number | null = null;
    // Drop-zone rect measured once per drag on pointerdown — the chest never moves
    // while dragging, so per-move hit tests need no layout reads at all.
    private chestRect: DOMRect | null = null;

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
        this.root.addEventListener('pointerdown', this.handlePointerDown);
        this.root.addEventListener('pointermove', this.handlePointerDragMove);
        this.root.addEventListener('pointerup', this.handlePointerUp);
        this.root.addEventListener('pointercancel', this.handlePointerCancel);
        this.root.addEventListener('dragstart', this.handleDragStart);
    }

    public detach(): void {
        this.root.removeEventListener('pointerdown', this.handlePointerDown);
        this.root.removeEventListener('pointermove', this.handlePointerDragMove);
        this.root.removeEventListener('pointerup', this.handlePointerUp);
        this.root.removeEventListener('pointercancel', this.handlePointerCancel);
        this.root.removeEventListener('dragstart', this.handleDragStart);
        this.foundDragElement = null;
        this.targetDropElement = null;
        this.activePointerId = null;
        this.chestRect = null;
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
        if (!this.isWithinTargetArea(dragElement)) {
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
        // Measure the drop zone once per drag, before any style writes dirty the
        // layout — every per-move hit test then runs on this cached rect.
        const hitTarget = this.root.querySelector('#chestImage') ?? this.targetDropElement;
        this.chestRect = hitTarget?.getBoundingClientRect() ?? null;
        this.foundDragElement?.onStart(event);
        // Open the chest lid as soon as a drag begins
        this.setChestImage('TreasureChestOpen04-new');
        appEventBus.publish(appEventBus.EVENTS.ON_DRAG_START, true);
    };

    // Pure-math hit test: the dragged element's center comes from state tracked by
    // DraggableButton and the chest rect was cached on pointerdown, so this never
    // forces a synchronous style recalc / layout during pointermove.
    private isWithinTargetArea(dragElement: iDraggableHTMLElement): boolean {
        const center = dragElement.getDragCenter?.();
        const chestRect = this.chestRect;

        if (!center || !chestRect) return false;

        return center.x >= chestRect.left &&
            center.x <= chestRect.right &&
            center.y >= chestRect.top &&
            center.y <= chestRect.bottom;
    }

    private handlePointerDragMove = (event: PointerEvent) => {
        //Returns none if there are no answer button element.
        if (!this.foundDragElement || !this.isActivePointer(event)) return;

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
        if (!this.foundDragElement) {
            this.activePointerId = null;
            return;
        }

        this.foundDragElement?.onEnd?.();
        this.foundDragElement = null;
        this.activePointerId = null;
        this.chestRect = null;
        // Close the chest lid once the drag interaction is over
        this.setChestImage('TreasureChestOpen01-new');
    };
}
