// DraggableButton augments a plain HTMLElement with pointer-event callbacks
// so DragEventController can drive the drag lifecycle without a direct class reference.
export interface iDraggableHTMLElement extends HTMLElement {
  onStart?: (event: PointerEvent) => void;
  onMove?: (event: PointerEvent) => void;
  onEnd?: () => void;
  getDragCenter?: () => { x: number; y: number } | null;
}

export class DraggableButton {
  private element: iDraggableHTMLElement;
  private isDragging: boolean = false;
  private x: number = 0;
  private y: number = 0;
  // Pointer position at drag start — used as the origin for per-frame delta calculations
  private startPointer: {
    x: number;
    y: number;
  };
  // Element bounding rect captured at drag start — used to compute viewport boundary clamps
  private startRect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  // Movement range computed once at drag start from startRect and the viewport size,
  // so handleDragging does no DOM/viewport reads at all
  private bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  // Pending requestAnimationFrame id — coalesces transform writes to one per frame
  private rafId: number | null = null;

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
    this.bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    // Wire the three drag lifecycle methods onto the DOM element
    this.element.onStart = this.enableDrag.bind(this);
    this.element.onMove = this.handleDragging.bind(this);
    this.element.onEnd = this.disableDrag.bind(this);
    this.element.getDragCenter = this.getDragCenter.bind(this);
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

  // Pointer events can fire faster than the display refreshes, but only the last
  // position per frame is ever visible — so batch the style write into a single
  // requestAnimationFrame callback instead of writing on every pointermove.
  private scheduleTransformUpdate(): void {
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.updateTransformPosition(this.x, this.y);
    });
  }

  // Constrains value to the closed range [min, max]
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
    //Enable the dragging flag.
    this.isDragging = true;

    // Record the pointer position so handleDragging can compute the delta each frame
    this.startPointer = {
      x: event.clientX,
      y: event.clientY,
    };

    // Snapshot the element's initial rect so boundary clamps remain accurate as it moves.
    // This is the only layout read of the whole drag, taken before any style writes.
    const rect = this.element.getBoundingClientRect();
    this.startRect = {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    };

    // Translate the viewport edges into max/min offsets relative to the element's start position:
    // minX = -(distance from left viewport edge to element's left edge) — prevents going off-screen left
    // maxX = viewport.width - element's right edge — prevents going off-screen right
    // Same logic applies vertically.
    const viewport = this.getViewportSize();
    this.bounds = {
      minX: -this.startRect.left,
      maxX: viewport.width - this.startRect.right,
      minY: -this.startRect.top,
      maxY: viewport.height - this.startRect.bottom,
    };
    //Ensures the element being drag will be on top of everything.
    this.element.style.zIndex = '1000';
    this.element.classList.add('dragging');
  }

  private handleDragging(event: PointerEvent): void {
    if (!this.isDragging) return;

    // Raw pointer delta from the drag-start position
    const dx = event.clientX - this.startPointer.x;
    const dy = event.clientY - this.startPointer.y;

    //Update x and y using the movement range precomputed at drag start.
    this.x = this.clamp(dx, this.bounds.minX, this.bounds.maxX);
    this.y = this.clamp(dy, this.bounds.minY, this.bounds.maxY);

    //Update the element's position on the next frame.
    this.scheduleTransformUpdate();
  }

  private disableDrag(): void {
    if (!this.isDragging) return;

    //Disable the drag flag.
    this.isDragging = false;

    // Cancel any pending frame so a stale transform can't be applied after the reset below
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Reset all tracked drag state so the next drag starts from a clean slate
    this.startPointer = { x: 0, y: 0 };
    this.startRect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    this.bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    this.x = 0;
    this.y = 0;

    this.element.classList.remove('dragging');
    //Revert back the element back to it's original place.
    this.applyDefaultStyles();
  }

  private getDragCenter(): { x: number; y: number } | null {
    if (!this.isDragging) return null;

    return {
      x: (this.startRect.left + this.startRect.right) / 2 + this.x,
      y: (this.startRect.top + this.startRect.bottom) / 2 + this.y,
    };
  }
}
