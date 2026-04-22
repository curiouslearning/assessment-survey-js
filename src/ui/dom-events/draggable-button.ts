
export interface iDraggableHTMLElement extends HTMLElement {
    onStart?: (event: PointerEvent) => void;
    onMove?: (event: PointerEvent) => void;
    onEnd?: () => void;
};

export class DraggableButton {
    private element: iDraggableHTMLElement;
    private isDragging: boolean = false;
    private x: number = 0;
    private y: number = 0;
    private startPointer: {
        x: number;
        y: number;
    };

    constructor(element: HTMLElement) {
        this.element = element;
        this.isDragging = false;
        this.x = 0;
        this.y = 0;
        this.startPointer = { x: 0, y: 0 };
        this.element.onStart = this.enableDrag.bind(this);
        this.element.onMove = this.handleDragging.bind(this);
        this.element.onEnd = this.disableDrag.bind(this);
        this.element.style.cursor = 'grab';
        this.element.style.touchAction = 'none';
        this.element.style.userSelect = 'none';
        this.element.style.zIndex = '0';
        this.updateTransformPosition(0, 0);
    }

    private updateTransformPosition(x: number, y: number): void {
        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }

    private enableDrag(event: PointerEvent): void {
        //Enable the dragging flag.
        this.isDragging = true;

        //Mark the starting position of the element.
        this.startPointer = {
            x: event.clientX,
            y: event.clientY
        };

        //Ensures the element being drag will be on top of everything.
        this.element.style.zIndex = '1000';
    }

    private handleDragging(event: PointerEvent): void {
        if (!this.isDragging) return;

        //Calculate the new position based on the starting position to where the cursor is.
        const dx = event.clientX - this.startPointer.x;
        const dy = event.clientY - this.startPointer.y;

        //Update x and up based on new calculation.
        this.x = dx;
        this.y = dy;

        //Update the element's position.
        this.updateTransformPosition(this.x, this.y);
    }

    private disableDrag(): void {
        if (!this.isDragging) return;

        //Disable the drag flag.
        this.isDragging = false;

        //Reset the x and y position.
        this.startPointer = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;

        this.element.style.zIndex = '0';

        //Revert back the element back to it's original place.
        this.updateTransformPosition(this.x, this.y);
    }
}
