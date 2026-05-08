import appEventBus from '@services/app-event-bus';
import { iDraggableHTMLElement } from './draggable-button';

export interface iDropAreaHTMLElement extends HTMLElement {
    onHover?: () => void;
    onDrop?: (selectedAnswer: iDraggableHTMLElement) => void;
};

// DropAreaTarget augments a plain HTMLElement with onHover / onDrop callbacks
// so DragEventController can call them without holding a direct class reference.
export class DropAreaTarget {
    private element: iDropAreaHTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        // Attach handler methods directly onto the DOM element so the drag controller
        // can invoke them via the iDropAreaHTMLElement interface
        this.element.onHover = this.handleOnHovering.bind(this);
        this.element.onDrop = this.handleOnDrop.bind(this);
    }

    private handleOnHovering(): void {
        //Add logic here for on hover or logic for animation when hovering on the target area
    }

    private handleOnDrop(selectedAnswer: iDraggableHTMLElement): void {
        // Publish the dropped element so DragDropAssessmentUI can map it to an answer index
        appEventBus.publish(appEventBus.EVENTS.DROP_ELEMENT_INTERACTION, { selectedAnswer })
    }
}
