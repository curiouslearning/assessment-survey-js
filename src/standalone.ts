import { startStandaloneApp } from './App';
import { mountAssessmentSurveyFragment, normalizeHostTheme } from './ui/dom-template';

const STANDALONE_ROOT_ID = 'assessment-survey-root';

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

function mountStandaloneTemplate(root: HTMLElement): void {
	mountAssessmentSurveyFragment(root, {
		assetBaseUrl: root.getAttribute('data-asset-base-url') ?? '',
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
mountStandaloneTemplate(standaloneRoot);
startStandaloneApp();
