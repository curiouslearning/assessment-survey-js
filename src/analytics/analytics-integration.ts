import { LevelCompleted, Opened, PuzzleCompleted, SessionEnd, SessionStart, UserLocation } from "./analytics-event-interface";
import { BaseAnalyticsIntegration } from "./base-analytics-integration";

export class AnalyticsIntegration extends BaseAnalyticsIntegration {
    private static instance: AnalyticsIntegration | null;

    protected constructor() {
        super();
    }
    public static async initializeAnalytics(): Promise<void> {
        if (!this.instance) {
            this.instance = new AnalyticsIntegration();
        }

        if (!this.instance.isAnalyticsReady()) {
            await this.instance.initialize();
        }
    }
    public static getInstance(): AnalyticsIntegration {
        if (!this.instance || !this.instance.isAnalyticsReady()) {
            throw new Error('AnalyticsIntegration.initializeAnalytics() must be called before accessing the instance');
        }

        return this.instance;
    }
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
    public async initialize(): Promise<void> {
        await super.initialize();
    }
    public sendOpenedEvent(data: Opened) {
        this.trackCustomEvent('opened', data);
    }
    public sendUserLocationEvent(data: UserLocation) {
        this.trackCustomEvent('user_location', data);
    }
    public sendSessionStartEvent(data: SessionStart) {
        this.trackCustomEvent('session_start', data);
    }
    public sendPuzzleCompletedEvent(data: PuzzleCompleted) {
        this.trackCustomEvent('puzzle_completed', data);
    }
    public sendLevelCompletedEvent(data: LevelCompleted) {
        this.trackCustomEvent('level_completed', data);
    }
    public sendSessionEndEvent(data: SessionEnd) {
        this.trackCustomEvent('session_end', data);
    }
}