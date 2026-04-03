var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AnalyticsService, FirebaseStrategy } from '@curiouslearning/analytics';
import { firebaseConfig } from "./analytics-config";
export class BaseAnalyticsIntegration {
    constructor() {
        this.isInitialized = false;
        this.analyticsService = new AnalyticsService();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized) {
                return;
            }
            try {
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
                    userProperties: {}
                });
                yield this.firebaseStrategy.initialize();
                this.analyticsService.register('firebase', this.firebaseStrategy);
                this.isInitialized = true;
                console.log("Analytics service initialized successfully with Firebase and Statsig");
            }
            catch (error) {
                console.error("Error while initializing analytics:", error);
                throw error;
            }
        });
    }
    trackCustomEvent(eventName, event) {
        if (!this.isInitialized) {
            console.warn("Analytics not initialized, queuing event:", eventName);
        }
        try {
            this.analyticsService.track(eventName, event);
        }
        catch (error) {
            console.error("Error while logging custom event:", error);
        }
    }
    get analytics() {
        return this.analyticsService;
    }
    get firebaseApp() {
        var _a;
        return (_a = this.firebaseStrategy) === null || _a === void 0 ? void 0 : _a.firebaseApp;
    }
    isAnalyticsReady() {
        return this.isInitialized;
    }
}
//# sourceMappingURL=base-analytics-integration.js.map