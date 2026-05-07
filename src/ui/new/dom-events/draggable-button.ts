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
    private startRect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };

    constructor(element: HTMLElement) {
        this.element = element;
        this.isDragging = false;
        this.x = 0;
        this.y = 0;
        this.startPointer = { x: 0, y: 0 };
        this.startRect = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };

        this.element.onStart = this.enableDrag.bind(this);
        this.element.onMove = this.handleDragging.bind(this);
        this.element.onEnd = this.disableDrag.bind(this);
        this.applyDefaultStyles();
    }

    private applyDefaultStyles(): void {
        this.element.style.cursor = 'grab';
        this.element.style.touchAction = 'none';
        this.element.style.userSelect = 'none';
        this.element.style.zIndex = '0';
        this.updateTransformPosition(0, 0);
    }

    private updateTransformPosition(x: number, y: number): void {
        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    private getViewportSize(): { width: number; height: number } {
        return {
            width: window.visualViewport?.width ?? window.innerWidth,
            height: window.visualViewport?.height ?? window.innerHeight,
        };
    }

    private enableDrag(event: PointerEvent): void {
        this.isDragging = true;

        this.startPointer = {
            x: event.clientX,
            y: event.clientY
        };

        const rect = this.element.getBoundingClientRect();
        this.startRect = {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
        };

        this.element.style.zIndex = '1000';
        this.element.classList.add('dragging');
    }

    private handleDragging(event: PointerEvent): void {
        if (!this.isDragging) return;

        const dx = event.clientX - this.startPointer.x;
        const dy = event.clientY - this.startPointer.y;

        const viewport = this.getViewportSize();

        const minX = -this.startRect.left;
        const maxX = viewport.width - this.startRect.right;
        const minY = -this.startRect.top;
        const maxY = viewport.height - this.startRect.bottom;

        this.x = this.clamp(dx, minX, maxX);
        this.y = this.clamp(dy, minY, maxY);

        this.updateTransformPosition(this.x, this.y);
    }

    private disableDrag(): void {
        if (!this.isDragging) return;

        this.isDragging = false;

        this.startPointer = { x: 0, y: 0 };
        this.startRect = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };
        this.x = 0;
        this.y = 0;

        this.element.classList.remove('dragging');
        this.applyDefaultStyles();
    }
}
