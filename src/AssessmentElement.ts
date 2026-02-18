import { App } from './App';
import { UIController } from './ui/uiController';

/**
 * AssessmentElement - Web Component wrapper for the Assessment Survey application
 * 
 * Usage:
 * <assessment-survey data-url="your-data-url"></assessment-survey>
 * 
 * Attributes:
 * - data-url: URL to the assessment data file
 * 
 * Events:
 * - assessment-complete: Fired when assessment is completed
 * - assessment-close: Fired when assessment is closed
 */
export class AssessmentElement extends HTMLElement {
    private app: App | null = null;
    private _shadowRoot: ShadowRoot;
    private container: HTMLDivElement;

    constructor() {
        super();

        // Create shadow DOM for encapsulation
        this._shadowRoot = this.attachShadow({ mode: 'open' });

        // Create container
        this.container = document.createElement('div');
        this.container.id = 'assessment-container';
        this.container.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      background: #fff;
    `;

        this._shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        // Initialize the assessment app when component is added to DOM
        this.initializeAssessment();
    }

    disconnectedCallback() {
        // Clean up when component is removed from DOM
        this.cleanup();
    }

    private async initializeAssessment() {
        try {
            // Support both full URLs and local paths
            const dataUrl = this.getAttribute('data-url') || '';
            const dataFile = this.getAttribute('data-file') || '';
            const basePath = this.getAttribute('base-path') || './';

            // Construct the full data URL
            let fullDataUrl = dataUrl;
            if (!dataUrl && dataFile) {
                // If no URL provided but data-file is specified, use local bundled data
                fullDataUrl = `${basePath}assessment-data/${dataFile}`;
            }

            if (!fullDataUrl) {
                console.error('AssessmentElement: either data-url or data-file attribute is required');
                return;
            }

            // Extract just the key name (without the 'data/' prefix and '.json' extension)
            // This handles cases like:
            //   'data/english/assessment_data.json' -> 'english/assessment_data'
            //   'english/assessment_data.json' -> 'english/assessment_data'
            //   'zulu-lettersounds.json' -> 'zulu-lettersounds'
            //   'zulu-lettersounds' -> 'zulu-lettersounds'
            let dataKey = fullDataUrl.replace(/^(\.?\/)?data(\/)?/, '').replace(/\.json$/, '');

            // Set the data key in the URL parameters for the App to use
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('data', dataKey);
            window.history.replaceState({}, '', currentUrl);

            // Inject the HTML structure from index.html into the shadow DOM
            // This is required because the App and UIController expect these elements to exist
            this.container.innerHTML = `
                <link rel="stylesheet" href="${basePath}assessment-css/style.css">
                <style>
                    :host { display: block; width: 100%; height: 100%; }
                    .bodyWrapper { width: 100% !important; max-width: none !important; }
                </style>
                <div class="bodyWrapper">
                    <div class="landingPageWrapper" id="landWrap">
                        <img class="landingMonster" src="${basePath}assessment-img/monster.png" />
                        <br />
                        <button id="startButton">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6V18Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                        <div id="loadingScreen">
                            <img id="loading-gif" src="${basePath}assessment-img/loadingImg.gif" alt="Loading Animation" />
                            <div id="progressBarContainer">
                                <div id="progressBar"></div>
                            </div>
                        </div>
                    </div>

                    <div class="questionViewWrapper" id="gameWrap" style="display: none">
                        <div class="starWrapper" id="starWrapper"></div>
                        <div class="chestWrapper">
                            <div class="chestdiv">
                                <img id="chestImage" src="${basePath}assessment-img/chestprogression/TreasureChestOpen01.svg" />
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
                </div>
            `;

            // Initialize UIController with the shadow root BEFORE creating the App.
            // This ensures all DOM element lookups in BaseQuiz and Assessment constructors
            // will find elements within the shadow DOM.
            UIController.getInstance(this._shadowRoot);

            // Initialize the App with the shadow root to allow scoped DOM access
            this.app = new App(this._shadowRoot);
            await this.app.spinUp();

            // Listen for assessment completion
            this.setupEventListeners();

        } catch (error) {
            console.error('Failed to initialize assessment:', error);
            this.dispatchEvent(new CustomEvent('assessment-error', {
                detail: { error },
                bubbles: true,
                composed: true
            }));
        }
    }

    private setupEventListeners() {
        // Listen for assessment end event from the App
        if (this.app) {
            this.app.game?.subscribe('ENDED', () => {
                this.dispatchEvent(new CustomEvent('assessment-complete', {
                    detail: {
                        score: this.app?.game?.score,
                        timestamp: Date.now()
                    },
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }

    private cleanup() {
        // Clean up resources
        if (this.app) {
            // The App class doesn't have a cleanup method, but we can clear references
            this.app = null;
        }

        // Clear container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    /**
     * Public method to close the assessment
     */
    public close() {
        this.dispatchEvent(new CustomEvent('assessment-close', {
            bubbles: true,
            composed: true
        }));
        this.cleanup();
    }
}

// Register the custom element
if (!customElements.get('assessment-survey')) {
    customElements.define('assessment-survey', AssessmentElement);
}

// Export for UMD build
export default AssessmentElement;
