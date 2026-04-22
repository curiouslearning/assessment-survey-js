export interface iDropAreaHTMLElement extends HTMLElement {
    onHover?: (event: PointerEvent) => void;
};

export class DropAreaTarget {
    private element: iDropAreaHTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.onHover = this.handleOnHovering.bind(this);
    }

    private handleOnHovering(event: PointerEvent): void {
        console.log('DropTargetCallbacks hovering on the chest')
    }
}
