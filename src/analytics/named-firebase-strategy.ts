import { AbstractAnalyticsStrategy } from '@curiouslearning/analytics';
import { FirebaseApp, FirebaseOptions, initializeApp, deleteApp } from 'firebase/app';
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';

const NAMED_APP = 'assessment-survey';

export class NamedFirebaseStrategy extends AbstractAnalyticsStrategy {
    private app: FirebaseApp | null = null;
    private analytics: Analytics | null = null;

    constructor(private readonly firebaseOptions: FirebaseOptions) {
        super();
    }

    async initialize(): Promise<void> {
        this.app = initializeApp(this.firebaseOptions, NAMED_APP);
        this.analytics = getAnalytics(this.app);
    }

    track(eventName: string, data: any): void {
        if (this.analytics) {
            logEvent(this.analytics, eventName, data);
        }
    }

    get firebaseApp(): FirebaseApp | null {
        return this.app;
    }

    dispose(): void {
        if (this.app) {
            deleteApp(this.app);
            this.app = null;
            this.analytics = null;
        }
    }
}
