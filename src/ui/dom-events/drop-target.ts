import appEventBus from '@services/app-event-bus';
import { iDraggableHTMLElement } from './draggable-button';

export interface iDropAreaHTMLElement extends HTMLElement {
    onHover?: (selectedElement: iDraggableHTMLElement) => void;
};

export class DropAreaTarget {
    private element: iDropAreaHTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.onHover = this.handleOnHovering.bind(this);
    }

    private handleOnHovering(selectedElement: iDraggableHTMLElement): void {
        //Publish the selected element passed in drop area.
        appEventBus.publish(appEventBus.EVENTS.DROP_ELEMENT_INTERACTION, { selectedElement })
    }
}
