import { firebaseConfig } from './analytics-config';

let AnalyticsServiceClass: any;
let FirebaseStrategyClass: any;
let StatsigStrategyClass: any;

try {
  const analyticsModule = require('@curiouslearning/analytics');
  AnalyticsServiceClass = analyticsModule.AnalyticsService;
  FirebaseStrategyClass = analyticsModule.FirebaseStrategy;
  StatsigStrategyClass = analyticsModule.StatsigStrategy;
} catch (error) {
  class NoopStrategy {
    constructor(opts?: any) {}
    async initialize(): Promise<void> {
      return;
    }
  }
  class NoopService {
    register(name: string, strategy: any): void {}
    track(event: string, payload: any): void {}
  }
  AnalyticsServiceClass = NoopService;
  FirebaseStrategyClass = NoopStrategy;
  StatsigStrategyClass = NoopStrategy;
}

/**
 * Base class for integrating analytics providers.
 *
 * This class sets up and manages analytics strategies (Firebase, Statsig, etc.)
 * using the Curious Learning Analytics SDK. It provides initialization logic,
 * custom event tracking, and accessors for analytics services.
 */
export class BaseAnalyticsIntegration {
    private analyticsService: any;
    private firebaseStrategy: any;
    private statsigStrategy: any;
    private isInitialized: boolean = false;

    /**
     * Creates a new instance of BaseAnalyticsIntegration.
     *
     * Initializes the {@link AnalyticsService}, but does not start any providers
     * until {@link initialize} is called.
     */
    constructor() {
        this.analyticsService = new AnalyticsServiceClass();
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
     * @returns {Promise<void>} A promise that resolves when analytics have been initialized.
     * @throws {Error} If initialization fails.
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            this.firebaseStrategy = new FirebaseStrategyClass({
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
    get firebaseApp() {
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
