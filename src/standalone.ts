import { startStandaloneApp } from './App';
import { AnalyticsIntegration } from '@analytics/analytics-integration';
import { mountAssessmentSurveyFragment, normalizeBaseUrl, normalizeHostTheme } from '@ui/dom-template';
import { firebaseConfig } from '@analytics/analytics-config';

const STANDALONE_ROOT_ID = 'assessment-survey-root';
const DEFAULT_ASSET_BASE_URL = '/assets';

function toBooleanAttribute(value: string | null, defaultValue: boolean): boolean {
    if (value === null) {
        return defaultValue;
    }

    return value !== 'false' && value !== '0';
}

function getOrCreateStandaloneRoot(): HTMLElement {
    const existingRoot = document.getElementById(STANDALONE_ROOT_ID);

    if (existingRoot instanceof HTMLElement) {
        return existingRoot;
    }

    const root = document.createElement('div');
    root.id = STANDALONE_ROOT_ID;
    document.body.appendChild(root);

    return root;
}

function getStandaloneAssetBaseUrl(root: HTMLElement): string {
    const configuredAssetBaseUrl = root.getAttribute('data-asset-base-url');

    if (!configuredAssetBaseUrl || configuredAssetBaseUrl.trim() === '') {
        return DEFAULT_ASSET_BASE_URL;
    }

    return normalizeBaseUrl(configuredAssetBaseUrl);
}

function mountStandaloneTemplate(root: HTMLElement, assetBaseUrl: string): void {
    mountAssessmentSurveyFragment(root, {
        assetBaseUrl,
        hostTheme: normalizeHostTheme(root.getAttribute('data-host-theme')),
        includeStylesheetLink: false,
        rootRelativeAssetPaths: false,
        sections: {
            loadingScreen: toBooleanAttribute(root.getAttribute('data-show-loading-screen'), true),
            endingScreen: toBooleanAttribute(root.getAttribute('data-show-ending-screen'), true),
            devModeBucketInfo: toBooleanAttribute(root.getAttribute('data-show-devmode-bucket-info'), true),
            devModeToggleButton: toBooleanAttribute(root.getAttribute('data-show-devmode-toggle-button'), true),
            devModeSettingsModal: toBooleanAttribute(root.getAttribute('data-show-devmode-settings'), true),
        },
        text: {
            feedbackText: root.getAttribute('data-feedback-text') ?? undefined,
            endingScreenText: root.getAttribute('data-ending-text') ?? undefined,
        },
    });
}

const standaloneRoot = getOrCreateStandaloneRoot();
const assetBaseUrl = getStandaloneAssetBaseUrl(standaloneRoot);
mountStandaloneTemplate(standaloneRoot, assetBaseUrl);

async function main() {
    await AnalyticsIntegration.initializeAnalytics({
        apiKey: firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        databaseURL: firebaseConfig.databaseURL,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        messagingSenderId: firebaseConfig.messagingSenderId,
        appId: firebaseConfig.appId,
        measurementId: firebaseConfig.measurementId,
    });

    startStandaloneApp({ assetBaseUrl });
}

main();