/**
 * App class that represents an entry point of the application.
 */
import { BaseQuiz } from './baseQuiz';
import CacheModel from './components/cacheModel';
import { AnalyticsIntegration } from './analytics/analytics-integration';
export interface AppStartupConfig {
    dataURL?: string;
    enableServiceWorker?: boolean;
    waitForWindowLoad?: boolean;
    skipLoadingScreen?: boolean;
    skipStartScreen?: boolean;
    uiRoot?: Document | ShadowRoot | HTMLElement;
    assetBaseUrl?: string;
    enableUnityBridge?: boolean;
    enableAndroidSummary?: boolean;
    enableParentPostMessage?: boolean;
    userId?: string;
    userSource?: string;
    requiredScore?: string;
    nextAssessment?: string;
    endpoint?: string;
    organization?: string;
    hostIntegrationAdapters?: HostIntegrationAdapters;
}
export interface SummaryData {
    app_type: string;
    score: number;
    time_spent: number;
}
export interface AssessmentCompletedPayload {
    type: 'assessment_completed';
    score: number;
}
export interface HostIntegrationAdapters {
    onLoaded?: () => void;
    onClose?: () => void;
    onSummaryData?: (summary: SummaryData) => void;
    onAssessmentCompleted?: (payload: AssessmentCompletedPayload) => void;
}
export declare class App {
    /** Could be 'assessment' or 'survey' based on the data file */
    dataURL: string;
    unityBridge: any;
    analytics: any;
    game: BaseQuiz;
    analyticsIntegration: AnalyticsIntegration;
    cacheModel: CacheModel;
    enableServiceWorker: boolean;
    enableUnityBridge: boolean;
    enableAndroidSummary: boolean;
    enableParentPostMessage: boolean;
    hostIntegrationAdapters: HostIntegrationAdapters;
    lang: string;
    constructor(config?: AppStartupConfig);
    spinUp(config?: AppStartupConfig): Promise<void>;
    private static createNoopUnityBridge;
    private applyRuntimeConfig;
    private applyHostIntegrationConfig;
    private initializeGame;
    setCommonProperties(): Promise<void>;
    logInitialAnalyticsEvents(): Promise<void>;
    registerServiceWorker(game: BaseQuiz, dataURL?: string, skipLoadingScreen?: boolean): Promise<void>;
    handleServiceWorkerRegistation(registration: ServiceWorkerRegistration | undefined): void;
    GetDataURL(): string;
    notifyLoaded(): void;
    notifyClose(): void;
    notifySummaryData(summaryData: SummaryData): void;
    notifyAssessmentCompleted(score: number): void;
}
export declare function createApp(config?: AppStartupConfig): App;
export declare function startStandaloneApp(config?: AppStartupConfig): App;
