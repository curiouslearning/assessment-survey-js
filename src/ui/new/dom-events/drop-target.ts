import appEventBus from '@services/app-event-bus';
import { iDraggableHTMLElement } from './draggable-button';

export interface iDropAreaHTMLElement extends HTMLElement {
    onHover?: () => void;
    onDrop?: (selectedAnswer: iDraggableHTMLElement) => void;
};

export class DropAreaTarget {
    private element: iDropAreaHTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.onHover = this.handleOnHovering.bind(this);
        this.element.onDrop = this.handleOnDrop.bind(this);
    }

    private handleOnHovering(): void {
        //Add logic here for on hover or logic for animation when hovering on the target area
    }

    private handleOnDrop(selectedAnswer: iDraggableHTMLElement): void {
        appEventBus.publish(appEventBus.EVENTS.DROP_ELEMENT_INTERACTION, { selectedAnswer })
    }
}
