import { AnalyticsService, FirebaseStrategy, StatsigStrategy } from '@curiouslearning/analytics';

export interface AnalyticsConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

/**
 * Base class for integrating analytics providers.
 *
 * This class sets up and manages analytics strategies (Firebase, Statsig, etc.)
 * using the Curious Learning Analytics SDK. It provides initialization logic,
 * custom event tracking, and accessors for analytics services.
 */
export class BaseAnalyticsIntegration {
    private analyticsService: AnalyticsService;
    private firebaseStrategy: FirebaseStrategy;
    private statsigStrategy: StatsigStrategy;
    private isInitialized: boolean = false;

    /**
     * Creates a new instance of BaseAnalyticsIntegration.
     *
     * Initializes the {@link AnalyticsService}, but does not start any providers
     * until {@link initialize} is called.
     */
    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    /**
     * Initializes the analytics integration by setting up and registering providers.
     *
     * - Initializes Firebase Analytics with the provided configuration.
     * - Registers Firebase as an analytics provider.
     * - Optionally, can initialize Statsig (currently commented out).
     *
     * Ensures initialization only happens once.
     *
     * @param {AnalyticsConfig} config - The Firebase analytics configuration object.
     * @returns {Promise<void>} A promise that resolves when analytics have been initialized.
     * @throws {Error} If initialization fails.
     */
    public async initialize(config: AnalyticsConfig): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            this.firebaseStrategy = new FirebaseStrategy({
                firebaseOptions: {
                    apiKey: config.apiKey,
                    authDomain: config.authDomain,
                    databaseURL: config.databaseURL,
                    projectId: config.projectId,
                    storageBucket: config.storageBucket,
                    messagingSenderId: config.messagingSenderId,
                    appId: config.appId,
                    measurementId: config.measurementId,
                },
                userProperties: {}
            });

            await this.firebaseStrategy.initialize();
            this.analyticsService.register('firebase', this.firebaseStrategy);

            // Example of Statsig initialization (commented out)
            // this.statsigStrategy = new StatsigStrategy({
            //     clientKey: statsigConfig.clientKey,
            //     statsigUser: { userID: getUUID() || statsigConfig.userId }
            // });
            // await this.statsigStrategy.initialize();
            // this.analyticsService.register('statsig', this.statsigStrategy);

            this.isInitialized = true;
            console.log("Analytics service initialized successfully with Firebase and Statsig");
        } catch (error) {
            console.error("Error while initializing analytics:", error);
            throw error;
        }
    }

    /**
     * Tracks a custom event using the registered analytics providers.
     *
     * If analytics are not yet initialized, the event may be queued by the service.
     *
     * @param {string} eventName - The name of the event to track.
     * @param {object} event - The event payload containing event details.
     */
    protected trackCustomEvent(eventName: string, event: object): void {
        if (!this.isInitialized) {
            console.warn("Analytics not initialized, queuing event:", eventName);
        }

        try {
            this.analyticsService.track(eventName, event);
        } catch (error) {
            console.error("Error while logging custom event:", error);
        }
    }

    /**
     * Gets the underlying {@link AnalyticsService} instance.
     *
     * @returns {AnalyticsService} The analytics service used for managing providers.
     */
    get analytics() {
        return this.analyticsService;
    }

    /**
     * Gets the initialized Firebase app instance (if available).
     *
     * @returns {any | undefined} The Firebase app instance, or undefined if not initialized.
     */
    get firebaseApp(): any {
        return this.firebaseStrategy?.firebaseApp;
    }

    /**
     * Checks whether analytics have been successfully initialized.
     *
     * @returns {boolean} True if analytics are initialized, false otherwise.
     */
    public isAnalyticsReady(): boolean {
        return this.isInitialized;
    }
}