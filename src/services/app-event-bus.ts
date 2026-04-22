import { PubSub } from './pubsub';

class AppEventBus extends PubSub {
    public EVENTS: {
        DROP_ELEMENT_INTERACTION: string
    }

    constructor() {
        super();
        this.EVENTS = {
            DROP_ELEMENT_INTERACTION: 'DROP_ELEMENT_INTERACTION'
        }
    }
}

const appEventBus = new AppEventBus();

export default appEventBus;