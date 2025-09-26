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