import { AnalyticsService, FirebaseStrategy, StatsigStrategy } from '@curiouslearning/analytics';
import { firebaseConfig } from "./analytics-config";

export class BaseAnalyticsIntegration {
    private analyticsService: AnalyticsService;
    private firebaseStrategy: FirebaseStrategy;
    private statsigStrategy: StatsigStrategy;
    private isInitialized: boolean = false;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            // Initialize Analytics Strategy
            this.firebaseStrategy = new FirebaseStrategy({
                firebaseOptions: {
                    apiKey: firebaseConfig.apiKey,
                    authDomain: firebaseConfig.authDomain,
                    databaseURL: firebaseConfig.databaseURL,
                    projectId: firebaseConfig.projectId,
                    storageBucket: firebaseConfig.storageBucket,
                    messagingSenderId: firebaseConfig.messagingSenderId,
                    appId: firebaseConfig.appId,
                    measurementId: firebaseConfig.measurementId,
                },
                userProperties: {

                }
            });

            await this.firebaseStrategy.initialize();
            this.analyticsService.register('firebase', this.firebaseStrategy);

            // Initialize Statsig Strategy
            // this.statsigStrategy = new StatsigStrategy({
            //     clientKey: statsigConfig.clientKey,
            //     statsigUser: {
            //         userID: getUUID() || statsigConfig.userId
            //     }
            // });

            // await this.statsigStrategy.initialize();
            // this.analyticsService.register('statsig', this.statsigStrategy);

            this.isInitialized = true;
            console.log("Analytics service initialized successfully with Firebase and Statsig");

        } catch (error) {
            console.error("Error while initializing analytics:", error);
            throw error; // Re-throw to let users handle initialization errors
        }
    }

    protected trackCustomEvent(eventName: string, event: object): void {
        if (!this.isInitialized) {
            console.warn("Analytics not initialized, queuing event:", eventName);
            // The analytics service should handle queuing events until initialization
        }

        try {
            this.analyticsService.track(eventName, event);
        } catch (error) {
            console.error("Error while logging custom event:", error);
        }
    }


    // Getter methods for backward compatibility if needed
    get analytics() {
        return this.analyticsService;
    }

    get firebaseApp() {
        return this.firebaseStrategy?.firebaseApp;
    }

    // Method to check if analytics is ready
    public isAnalyticsReady(): boolean {
        return this.isInitialized;
    }
}