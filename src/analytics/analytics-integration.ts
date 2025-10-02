import { LevelCompleted, Opened, PuzzleCompleted, SessionEnd, SessionStart, UserLocation } from "./analytics-event-interface";
import { BaseAnalyticsIntegration } from "./base-analytics-integration";

/**
 * Singleton class for handling analytics integration.
 * 
 * This class extends {@link BaseAnalyticsIntegration} and manages initialization,
 * tracking, and sending analytics data to both internal and external systems.
 */
export class AnalyticsIntegration extends BaseAnalyticsIntegration {
    private static instance: AnalyticsIntegration | null;
    /**
     * Protected constructor to enforce singleton pattern.
     * Use {@link AnalyticsIntegration.initializeAnalytics} to initialize the instance.
     */
    protected constructor() {
        super();
    }
    /**
     * Initializes the AnalyticsIntegration singleton instance if not already initialized.
     * Ensures the analytics system is ready before usage.
     *
     * @returns {Promise<void>} A promise that resolves when initialization is complete.
     */
    public static async initializeAnalytics(): Promise<void> {
        if (!this.instance) {
            this.instance = new AnalyticsIntegration();
        }

        if (!this.instance.isAnalyticsReady()) {
            await this.instance.initialize();
        }
    }
    /**
   * Returns the singleton instance of AnalyticsIntegration.
   * 
   * @throws {Error} If the instance is not initialized via {@link initializeAnalytics}.
   * @returns {AnalyticsIntegration} The initialized analytics integration instance.
   */
    public static getInstance(): AnalyticsIntegration {
        if (!this.instance || !this.instance.isAnalyticsReady()) {
            throw new Error('AnalyticsIntegration.initializeAnalytics() must be called before accessing the instance');
        }

        return this.instance;
    }
    /**
    * Sends analytics data to an external third-party endpoint.
    *
    * The target endpoint and organization are read from UTM parameters in the URL.
    *
    * @param {number} score - The user's score to be sent.
    * @param {string} uuid - The unique identifier for the user.
    * @param {Number} requiredScore - The score required to pass the assessment.
    * @param {string} nextAssessment - The identifier or name of the next assessment.
    * @param {string} assessmentType - The type of assessment being completed.
    */
    public sendDataToThirdParty(score: number, uuid: string, requiredScore: Number, nextAssessment: string, assessmentType: string): void {
        // Send data to the third party
        console.log('Attempting to send score to a third party! Score: ', score);

        // Read the URL from utm parameters
        const urlParams = new URLSearchParams(window.location.search);
        const targetPartyURL = urlParams.get('endpoint');
        const organization = urlParams.get('organization');
        const xhr = new XMLHttpRequest();

        if (!targetPartyURL) {
            console.error('No target party URL found!');
            return;
        }

        const payload = {
            user: uuid,
            page: '111108121363615',
            event: {
                type: 'external',
                value: {
                    type: 'assessment',
                    subType: assessmentType,
                    score: score,
                    requiredScore: requiredScore,
                    nextAssessment: nextAssessment,
                    completed: true,
                },
            },
        };

        const payloadString = JSON.stringify(payload);

        try {
            xhr.open('POST', targetPartyURL, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Request was successful, handle the response here
                    console.log('POST success!' + xhr.responseText);
                } else {
                    // Request failed
                    console.error('Request failed with status: ' + xhr.status);
                }
            };

            xhr.send(payloadString);
        } catch (error) {
            console.error('Failed to send data to target party: ', error);
        }
    }
    /**
   * Initializes the analytics integration by calling the parent initialize method.
   *
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   */

    public async initialize(): Promise<void> {
        await super.initialize();
    }
    /**
    * Sends an "opened" event.
    *
    * @param {Opened} data - Event data for the opened event.
    */
    public sendOpenedEvent(data: Opened) {
        this.trackCustomEvent('opened', data);
    }
    /**
     * Sends a "user_location" event.
     *
     * @param {UserLocation} data - Event data for the user's location.
     */
    public sendUserLocationEvent(data: UserLocation) {
        this.trackCustomEvent('user_location', data);
    }
    /**
     * Sends a "session_start" event.
     *
     * @param {SessionStart} data - Event data for the start of a session.
     */

    public sendSessionStartEvent(data: SessionStart) {
        this.trackCustomEvent('session_start', data);
    }
    /**
     * Sends a "puzzle_completed" event.
     *
     * @param {PuzzleCompleted} data - Event data for puzzle completion.
     */
    public sendPuzzleCompletedEvent(data: PuzzleCompleted) {
        this.trackCustomEvent('puzzle_completed', data);
    }
    /**
     * Sends a "level_completed" event.
     *
     * @param {LevelCompleted} data - Event data for level completion.
     */

    public sendLevelCompletedEvent(data: LevelCompleted) {
        this.trackCustomEvent('level_completed', data);
    }
    /**
     * Sends a "session_end" event.
     *
     * @param {SessionEnd} data - Event data for the end of a session.
     */
    public sendSessionEndEvent(data: SessionEnd) {
        this.trackCustomEvent('session_end', data);
    }
}