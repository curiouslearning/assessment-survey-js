import { PubSub } from '@curiouslearning/core';

class AppEventBus extends PubSub {
    public EVENTS: {
        DROP_ELEMENT_INTERACTION: string,
        ON_DRAG_START: string,
        ON_DRAG_RETURN: string,
        ANSWERED_CORRECTLY: string,
    }

    constructor() {
        super();
        this.EVENTS = {
            DROP_ELEMENT_INTERACTION: 'DROP_ELEMENT_INTERACTION',
            ON_DRAG_START: 'ON_DRAG_START',
            ON_DRAG_RETURN: 'ON_DRAG_RETURN',
            ANSWERED_CORRECTLY: 'ANSWERED_CORRECTLY',
        }
    }
}

const appEventBus = new AppEventBus();

export default appEventBus;