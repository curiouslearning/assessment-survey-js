import { getCommonAnalyticsEventsProperties } from "@utils/AnalyticsUtils";
import { getEndpoint, getOrganization } from "@utils/urlUtils";
import { Answered, BucketCompleted, CommonEventProperties, Completed, Initialized, Opened, UserLocation } from "./analytics-event-interface";
import { AnalyticsConfig, BaseAnalyticsIntegration } from "./base-analytics-integration";

export const enum AnalyticsEventsType {
    INITIALIZE = 'initialized',
    OPENED = 'opened',
    USER_LOCATION = 'user_location',
    BUCKET_COMPLETED = 'bucketCompleted',
    ANSWERED = 'answered',
    COMPLETED = 'completed'
}

type EventDataMap = {
    [AnalyticsEventsType.INITIALIZE]: Initialized;
    [AnalyticsEventsType.OPENED]: Opened;
    [AnalyticsEventsType.USER_LOCATION]: UserLocation;
    [AnalyticsEventsType.BUCKET_COMPLETED]: BucketCompleted;
    [AnalyticsEventsType.ANSWERED]: Answered;
    [AnalyticsEventsType.COMPLETED]: Completed;
}

export class AnalyticsIntegration extends BaseAnalyticsIntegration {
    private static instance: AnalyticsIntegration | null;

    protected constructor() {
        super();
    }

    private createBaseEventData(): CommonEventProperties {
        const commonProperties = getCommonAnalyticsEventsProperties();
        return {
            clUserId: commonProperties.cr_user_id,
            lang: commonProperties.language,
            app: commonProperties.app,
            latLong: commonProperties.lat_lang,
            userSource: commonProperties.user_source,
            appVersion: commonProperties.app_version,
            contentVersion: commonProperties.content_version,
        };
    }

    public static async initializeAnalytics(config: AnalyticsConfig): Promise<void> {
        if (!this.instance) {
            this.instance = new AnalyticsIntegration();
        }

        if (!this.instance.isAnalyticsReady()) {
            await this.instance.initialize(config);
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

        const targetPartyURL = getEndpoint();
        const organization = getOrganization();
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

    public async initialize(config: AnalyticsConfig): Promise<void> {
        await super.initialize(config);
    }

    public track<T extends AnalyticsEventsType>(
        eventType: T,
        eventData: Partial<CommonEventProperties> & Omit<EventDataMap[T], keyof CommonEventProperties>
    ): void {
        const baseData = this.createBaseEventData();
        let data = { ...baseData, ...eventData } as EventDataMap[T];

        this.trackCustomEvent(eventType, data);
    }
}