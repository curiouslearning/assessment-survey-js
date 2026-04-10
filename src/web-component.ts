import { App, AppStartupConfig, AssessmentCompletedPayload, HostIntegrationAdapters, SummaryData, createApp } from './App';
import { PubSub } from '@curiouslearning/core';
import { buildAssessmentSurveyFragment, normalizeBaseUrl, normalizeHostTheme } from './ui/dom-template';
import { UIController } from '@ui/uiController';
import { AnalyticsConfig } from '@analytics/base-analytics-integration';

const DEFAULT_TAG_NAME = 'assessment-survey-player';
const DEFAULT_ASSET_BASE_URL = '/assets';

type StartupModeDefaults = {
  skipLoadingScreen: boolean;
  skipStartScreen: boolean;
  enableServiceWorker: boolean;
  enableUnityBridge: boolean;
  enableAndroidSummary: boolean;
  enableParentPostMessage: boolean;
};

const EMBED_MODE_DEFAULTS: StartupModeDefaults = {
  skipLoadingScreen: true,
  skipStartScreen: true,
  enableServiceWorker: false,
  enableUnityBridge: false,
  enableAndroidSummary: false,
  enableParentPostMessage: false,
};

const STANDARD_MODE_DEFAULTS: StartupModeDefaults = {
  skipLoadingScreen: false,
  skipStartScreen: false,
  enableServiceWorker: true,
  enableUnityBridge: true,
  enableAndroidSummary: true,
  enableParentPostMessage: true,
};

function toBooleanAttribute(value: string | null, defaultValue: boolean): boolean {
  if (value === null) {
    return defaultValue;
  }

  return value !== 'false' && value !== '0';
}

function getFirstAttributeValue(element: HTMLElement, names: string[]): string | null {
  for (const name of names) {
    const value = element.getAttribute(name);
    if (value !== null) {
      return value;
    }
  }

  return null;
}

export class AssessmentSurveyPlayerElement extends HTMLElement {
  public static readonly ONLOADED = 'loaded';
  public static readonly ONCLOSE = 'closed';
  public static readonly ONSUMMARY = 'summary';
  public static readonly ONCOMPLETE = 'completed';
  public static readonly ONREWARDTRIGGER = 'reward-trigger';

  private appInstance: App | null = null;
  private isInitialized = false;
  private analyticsConfig: AnalyticsConfig | null = null;
  private readonly hostIntegrationPubSub = new PubSub();

  // exposed method for host app to inject analytics config
  public setAnalyticsConfig(config: AnalyticsConfig): void {
    this.analyticsConfig = config;
  }

  // TODO: consider subscribing to the app events directly in the app itself instead of creating a pubsub here at webcomponent
  public subscribe<T = unknown>(event: string, callback: (payload: T) => void): () => void {
    return this.hostIntegrationPubSub.subscribe(event, callback as (data: any) => void);
  }

  private buildHostIntegrationAdapters(): HostIntegrationAdapters {
    return {
      onLoaded: () => {
        this.hostIntegrationPubSub.publish(AssessmentSurveyPlayerElement.ONLOADED, undefined);
      },
      onClose: () => {
        this.hostIntegrationPubSub.publish(AssessmentSurveyPlayerElement.ONCLOSE, undefined);
      },
      onSummaryData: (summaryData: SummaryData) => {
        this.hostIntegrationPubSub.publish(AssessmentSurveyPlayerElement.ONSUMMARY, summaryData);
      },
      onComplete: (payload: AssessmentCompletedPayload) => {
        this.hostIntegrationPubSub.publish(AssessmentSurveyPlayerElement.ONCOMPLETE, payload);
      },
      onRewardTrigger: (payload: AssessmentCompletedPayload) => {
        this.hostIntegrationPubSub.publish(AssessmentSurveyPlayerElement.ONREWARDTRIGGER, payload);
      },
    };
  }

  connectedCallback(): void {
    if (this.isInitialized) {
      return;
    }

    const configuredAssetBaseUrl = this.getAttribute('asset-base-url');
    const assetBaseUrl = normalizeBaseUrl(
      configuredAssetBaseUrl && configuredAssetBaseUrl.trim() !== ''
        ? configuredAssetBaseUrl
        : DEFAULT_ASSET_BASE_URL
    );
    const configuredDataBaseUrl = getFirstAttributeValue(this, ['data-base-url', 'json-base-url']);
    const dataBaseUrl = normalizeBaseUrl(
      configuredDataBaseUrl && configuredDataBaseUrl.trim() !== ''
        ? configuredDataBaseUrl
        : assetBaseUrl
    );
    const hostTheme = normalizeHostTheme(this.getAttribute('host-theme'));
    const embedMode = toBooleanAttribute(this.getAttribute('embed-mode'), true);
    const modeDefaults = embedMode ? EMBED_MODE_DEFAULTS : STANDARD_MODE_DEFAULTS;
    this.replaceChildren(
      buildAssessmentSurveyFragment({
        assetBaseUrl,
        hostTheme,
        includeStylesheetLink: true,
        rootRelativeAssetPaths: true,
      })
    );

    UIController.ConfigureRoot(this);

    const startupConfig: AppStartupConfig = {
      dataURL: this.getAttribute('data-key') ?? undefined,
      userId: this.getAttribute('user-id') ?? undefined,
      userSource: this.getAttribute('user-source') ?? undefined,
      requiredScore: this.getAttribute('required-score') ?? undefined,
      nextAssessment: this.getAttribute('next-assessment') ?? undefined,
      endpoint: this.getAttribute('endpoint') ?? undefined,
      organization: this.getAttribute('organization') ?? undefined,
      assetBaseUrl,
      dataBaseUrl,
      skipLoadingScreen: toBooleanAttribute(this.getAttribute('skip-loading-screen'), modeDefaults.skipLoadingScreen),
      skipStartScreen: toBooleanAttribute(this.getAttribute('skip-start-screen'), modeDefaults.skipStartScreen),
      enableServiceWorker: toBooleanAttribute(this.getAttribute('enable-service-worker'), modeDefaults.enableServiceWorker),
      enableUnityBridge: toBooleanAttribute(this.getAttribute('enable-unity-bridge'), modeDefaults.enableUnityBridge),
      enableAndroidSummary: toBooleanAttribute(this.getAttribute('enable-android-summary'), modeDefaults.enableAndroidSummary),
      enableParentPostMessage: toBooleanAttribute(this.getAttribute('enable-parent-post-message'), modeDefaults.enableParentPostMessage),
      waitForWindowLoad: false,
      uiRoot: this,
      analyticsConfig: this.analyticsConfig ?? undefined,
      hostIntegrationAdapters: this.buildHostIntegrationAdapters(),
    };

    this.appInstance = createApp(startupConfig);
    this.appInstance.spinUp(startupConfig);
    this.isInitialized = true;
  }

  disconnectedCallback(): void {
    this.appInstance = null;
    this.isInitialized = false;
    this.analyticsConfig = null;
    UIController.Reset();
  }
}

export function registerAssessmentSurveyPlayerElement(tagName: string = DEFAULT_TAG_NAME): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, AssessmentSurveyPlayerElement);
  }
}