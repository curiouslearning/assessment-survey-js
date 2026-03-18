import { AnalyticsService } from '@curiouslearning/analytics';
/**
 * Base class for integrating analytics providers.
 *
 * This class sets up and manages analytics strategies (Firebase, Statsig, etc.)
 * using the Curious Learning Analytics SDK. It provides initialization logic,
 * custom event tracking, and accessors for analytics services.
 */
export declare class BaseAnalyticsIntegration {
    private analyticsService;
    private firebaseStrategy;
    private statsigStrategy;
    private isInitialized;
    /**
     * Creates a new instance of BaseAnalyticsIntegration.
     *
     * Initializes the {@link AnalyticsService}, but does not start any providers
     * until {@link initialize} is called.
     */
    constructor();
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
    initialize(): Promise<void>;
    /**
     * Tracks a custom event using the registered analytics providers.
     *
     * If analytics are not yet initialized, the event may be queued by the service.
     *
     * @param {string} eventName - The name of the event to track.
     * @param {object} event - The event payload containing event details.
     */
    protected trackCustomEvent(eventName: string, event: object): void;
    /**
     * Gets the underlying {@link AnalyticsService} instance.
     *
     * @returns {AnalyticsService} The analytics service used for managing providers.
     */
    get analytics(): AnalyticsService;
    /**
     * Gets the initialized Firebase app instance (if available).
     *
     * @returns {any | undefined} The Firebase app instance, or undefined if not initialized.
     */
    get firebaseApp(): any;
    /**
     * Checks whether analytics have been successfully initialized.
     *
     * @returns {boolean} True if analytics are initialized, false otherwise.
     */
    isAnalyticsReady(): boolean;
}
