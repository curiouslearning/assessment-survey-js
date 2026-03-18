import { createApp } from './App';
import { UIController } from './ui/uiController';
const DEFAULT_TAG_NAME = 'assessment-survey-player';
const EMBED_MODE_DEFAULTS = {
    skipLoadingScreen: true,
    skipStartScreen: true,
    enableServiceWorker: false,
    enableUnityBridge: false,
    enableAndroidSummary: false,
    enableParentPostMessage: false,
};
const STANDARD_MODE_DEFAULTS = {
    skipLoadingScreen: false,
    skipStartScreen: false,
    enableServiceWorker: true,
    enableUnityBridge: true,
    enableAndroidSummary: true,
    enableParentPostMessage: true,
};
function normalizeHostTheme(theme) {
    var _a;
    const normalizedTheme = (_a = theme === null || theme === void 0 ? void 0 : theme.trim().toLowerCase()) !== null && _a !== void 0 ? _a : '';
    if (normalizedTheme === 'ftm-dim') {
        return 'ftm-dim';
    }
    return 'default';
}
function getBodyWrapperClass(hostTheme) {
    return hostTheme === 'ftm-dim' ? 'bodyWrapper as-host-theme-ftm-dim' : 'bodyWrapper';
}
function normalizeBaseUrl(baseUrl) {
    if (!baseUrl) {
        return '';
    }
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}
function withBase(baseUrl, path) {
    const normalizedBase = normalizeBaseUrl(baseUrl);
    const normalizedPath = path.replace(/^\/+/, '');
    const test = normalizedBase ? `${normalizedBase}/${normalizedPath}` : `/${normalizedPath}`;
    console.log({ test });
    return test;
}
function toBooleanAttribute(value, defaultValue) {
    if (value === null) {
        return defaultValue;
    }
    return value !== 'false' && value !== '0';
}
function buildTemplate(assetBaseUrl, hostTheme) {
    return `
    <link rel="stylesheet" href="${withBase(assetBaseUrl, 'css/style.css')}" />
    <div class="${getBodyWrapperClass(hostTheme)}">
      <div class="landingPageWrapper" id="landWrap">
        <img class="landingMonster" src="${withBase(assetBaseUrl, 'img/monster.png')}" />
        <br />
        <button id="startButton">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 18L15 12L9 6V18Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <div id="loadingScreen">
          <img id="loading-gif" src="${withBase(assetBaseUrl, 'img/loadingImg.gif')}" alt="Loading Animation" />
          <div id="progressBarContainer">
            <div id="progressBar"></div>
          </div>
        </div>
      </div>

      <div class="questionViewWrapper" id="gameWrap" style="display: none">
        <div class="starWrapper" id="starWrapper"></div>
        <div class="chestWrapper">
          <div class="chestdiv">
            <img id="chestImage" src="${withBase(assetBaseUrl, 'img/chestprogression/TreasureChestOpen01.svg')}" />
          </div>
        </div>
        <div class="questionContainer" id="qWrap"></div>

        <div class="answerContainer" id="aWrap">
          <div class="answerButton" id="answerButton1">1</div>
          <div class="answerButton" id="answerButton2">2</div>
          <div class="answerButton" id="answerButton3">3</div>
          <div class="answerButton" id="answerButton4">4</div>
          <div class="answerButton" id="answerButton5" style="display: none">5</div>
          <div class="answerButton" id="answerButton6" style="display: none">6</div>
        </div>
        <div>
          <div class="nextQuestionInput">
            <div id="pbutton"></div>
          </div>

          <div class="feedbackContainer hidden" id="feedbackWrap">kuyancomeka!</div>
        </div>
      </div>

      <div class="endingPageWrapper" id="endWrap" style="display: none">click to exit!</div>

      <div id="devModeBucketInfoContainer"></div>

      <div id="devModeModalToggleButtonContainer">
        <button id="devModeModalToggleButton">
          Dev<br />
          Mode
        </button>
      </div>

      <div id="devModeSettingsModal">
        <p style="font-size: 26px">Dev Mode Settings</p>
        <form id="devModeSettingsContainer">
          <span class="devModeLabel">Assessment bucket generation mode</span>
          <select id="devModeBucketGenSelect">
            <option value="0">Randomized Middle Point BST</option>
            <option value="1">Sequential Array Based</option>
          </select>
          <span class="devModeLabel">Show a Label on correct target</span>
          <div style="display: flex; align-items: center; height: 40px; gap: 8px">
            <input id="devModeCorrectLabelShownCheckbox" type="checkbox" />
            <label for="devModeCorrectLabelShownCheckbox">Show correct label on answer button</label>
          </div>
          <span class="devModeLabel">Show bucket details on screen</span>
          <div style="display: flex; align-items: center; height: 40px; gap: 8px">
            <input id="devModeBucketInfoShownCheckbox" type="checkbox" />
            <label for="devModeBucketInfoShownCheckbox">Show bucket index, tried and passed</label>
          </div>
          <span class="devModeLabel">Enable bucket controls</span>
          <div style="display: flex; align-items: center; height: 40px; gap: 8px">
            <input id="devModeBucketControlsShownCheckbox" type="checkbox" />
            <label for="devModeBucketControlsShownCheckbox">Enable item buttons, next and prev buckets</label>
          </div>
          <span class="devModeLabel">Animations speed</span>
          <div style="width: 100%; position: relative">
            <input id="devModeAnimationSpeedMultiplierRange" type="range" min="0" max="1" value="1" step="0.1" />
            <div style="display: flex; width: 100%; justify-content: space-between">
              <span style="font-size: 12px"><- Faster</span>
              <text id="devModeAnimationSpeedMultiplierValue">1</text>
              <span style="font-size: 12px">Slower -></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
}
export class AssessmentSurveyPlayerElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.appInstance = null;
        this.isInitialized = false;
    }
    connectedCallback() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.isInitialized) {
            return;
        }
        const assetBaseUrl = normalizeBaseUrl((_a = this.getAttribute('asset-base-url')) !== null && _a !== void 0 ? _a : '');
        const hostTheme = normalizeHostTheme(this.getAttribute('host-theme'));
        const embedMode = toBooleanAttribute(this.getAttribute('embed-mode'), true);
        const modeDefaults = embedMode ? EMBED_MODE_DEFAULTS : STANDARD_MODE_DEFAULTS;
        this.innerHTML = buildTemplate(assetBaseUrl, hostTheme);
        UIController.ConfigureRoot(this);
        const startupConfig = {
            dataURL: (_b = this.getAttribute('data-key')) !== null && _b !== void 0 ? _b : undefined,
            userId: (_c = this.getAttribute('user-id')) !== null && _c !== void 0 ? _c : undefined,
            userSource: (_d = this.getAttribute('user-source')) !== null && _d !== void 0 ? _d : undefined,
            requiredScore: (_e = this.getAttribute('required-score')) !== null && _e !== void 0 ? _e : undefined,
            nextAssessment: (_f = this.getAttribute('next-assessment')) !== null && _f !== void 0 ? _f : undefined,
            endpoint: (_g = this.getAttribute('endpoint')) !== null && _g !== void 0 ? _g : undefined,
            organization: (_h = this.getAttribute('organization')) !== null && _h !== void 0 ? _h : undefined,
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
    disconnectedCallback() {
        this.appInstance = null;
        this.isInitialized = false;
        UIController.Reset();
    }
}
export function registerAssessmentSurveyPlayerElement(tagName = DEFAULT_TAG_NAME) {
    if (!customElements.get(tagName)) {
        customElements.define(tagName, AssessmentSurveyPlayerElement);
    }
}
