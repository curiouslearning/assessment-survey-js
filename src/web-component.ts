import { App, AppStartupConfig, createApp } from './App';
import { buildAssessmentSurveyFragment, normalizeBaseUrl, normalizeHostTheme } from './ui/dom-template';
import { UIController } from '@ui/uiController';

const DEFAULT_TAG_NAME = 'assessment-survey-player';

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

export class AssessmentSurveyPlayerElement extends HTMLElement {
  private appInstance: App | null = null;
  private isInitialized = false;

  connectedCallback(): void {
    if (this.isInitialized) {
      return;
    }

    const assetBaseUrl = normalizeBaseUrl(this.getAttribute('asset-base-url') ?? '');
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
      skipLoadingScreen: toBooleanAttribute(this.getAttribute('skip-loading-screen'), modeDefaults.skipLoadingScreen),
      skipStartScreen: toBooleanAttribute(this.getAttribute('skip-start-screen'), modeDefaults.skipStartScreen),
      enableServiceWorker: toBooleanAttribute(this.getAttribute('enable-service-worker'), modeDefaults.enableServiceWorker),
      enableUnityBridge: toBooleanAttribute(this.getAttribute('enable-unity-bridge'), modeDefaults.enableUnityBridge),
      enableAndroidSummary: toBooleanAttribute(this.getAttribute('enable-android-summary'), modeDefaults.enableAndroidSummary),
      enableParentPostMessage: toBooleanAttribute(this.getAttribute('enable-parent-post-message'), modeDefaults.enableParentPostMessage),
      waitForWindowLoad: false,
      uiRoot: this,
      hostIntegrationAdapters: {
        onLoaded: () => this.dispatchEvent(new CustomEvent('loaded')),
        onClose: () => this.dispatchEvent(new CustomEvent('closed')),
        onSummaryData: (summaryData) => this.dispatchEvent(new CustomEvent('summary', { detail: summaryData })),
        onAssessmentCompleted: (payload) => this.dispatchEvent(new CustomEvent('completed', { detail: payload })),
      },
    };

    this.appInstance = createApp(startupConfig);
    this.appInstance.spinUp(startupConfig);
    this.isInitialized = true;
  }

  disconnectedCallback(): void {
    this.appInstance = null;
    this.isInitialized = false;
    UIController.Reset();
  }
}

export function registerAssessmentSurveyPlayerElement(tagName: string = DEFAULT_TAG_NAME): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, AssessmentSurveyPlayerElement);
  }
}
