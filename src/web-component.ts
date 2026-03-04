import { App, AppStartupConfig, createApp } from './App';
import { UIController } from './ui/uiController';

const DEFAULT_TAG_NAME = 'assessment-survey-player';
type HostTheme = 'default' | 'ftm-dim';

function normalizeHostTheme(theme: string | null): HostTheme {
  const normalizedTheme = theme?.trim().toLowerCase() ?? '';

  if (normalizedTheme === 'ftm-dim') {
    return 'ftm-dim';
  }

  return 'default';
}

function getBodyWrapperClass(hostTheme: HostTheme): string {
  return hostTheme === 'ftm-dim' ? 'bodyWrapper as-host-theme-ftm-dim' : 'bodyWrapper';
}

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    return '';
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function withBase(baseUrl: string, path: string): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.replace(/^\/+/, '');
  return normalizedBase ? `${normalizedBase}/${normalizedPath}` : `/${normalizedPath}`;
}

function toBooleanAttribute(value: string | null, defaultValue: boolean): boolean {
  if (value === null) {
    return defaultValue;
  }

  return value !== 'false' && value !== '0';
}

function buildTemplate(assetBaseUrl: string, hostTheme: HostTheme): string {
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
  private appInstance: App | null = null;
  private isInitialized = false;

  connectedCallback(): void {
    if (this.isInitialized) {
      return;
    }

    const assetBaseUrl = normalizeBaseUrl(this.getAttribute('asset-base-url') ?? '');
    const hostTheme = normalizeHostTheme(this.getAttribute('host-theme'));
    this.innerHTML = buildTemplate(assetBaseUrl, hostTheme);

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
      skipLoadingScreen: toBooleanAttribute(this.getAttribute('skip-loading-screen'), true),
      enableServiceWorker: toBooleanAttribute(this.getAttribute('enable-service-worker'), false),
      enableUnityBridge: toBooleanAttribute(this.getAttribute('enable-unity-bridge'), false),
      enableAndroidSummary: toBooleanAttribute(this.getAttribute('enable-android-summary'), false),
      enableParentPostMessage: toBooleanAttribute(this.getAttribute('enable-parent-post-message'), false),
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
