var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCommonAnalyticsEventsProperties } from "../utils/AnalyticsUtils";
import { getEndpoint, getOrganization } from "../utils/urlUtils";
import { BaseAnalyticsIntegration } from "./base-analytics-integration";
export class AnalyticsIntegration extends BaseAnalyticsIntegration {
    constructor() {
        super();
    }
    createBaseEventData() {
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
    static initializeAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instance) {
                this.instance = new AnalyticsIntegration();
            }
            if (!this.instance.isAnalyticsReady()) {
                yield this.instance.initialize();
            }
        });
    }
    static getInstance() {
        if (!this.instance || !this.instance.isAnalyticsReady()) {
            throw new Error('AnalyticsIntegration.initializeAnalytics() must be called before accessing the instance');
        }
        return this.instance;
    }
    sendDataToThirdParty(score, uuid, requiredScore, nextAssessment, assessmentType) {
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
                }
                else {
                    // Request failed
                    console.error('Request failed with status: ' + xhr.status);
                }
            };
            xhr.send(payloadString);
        }
        catch (error) {
            console.error('Failed to send data to target party: ', error);
        }
    }
    initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.initialize.call(this);
        });
    }
    track(eventType, eventData) {
        const baseData = this.createBaseEventData();
        let data = Object.assign(Object.assign({}, baseData), eventData);
        this.trackCustomEvent(eventType, data);
    }
}
