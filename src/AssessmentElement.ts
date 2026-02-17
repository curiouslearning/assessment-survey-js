import { App } from './App';

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

            // Set the data URL in the URL parameters for the App to use
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('data', fullDataUrl);
            window.history.replaceState({}, '', currentUrl);

            // Create a temporary container in the light DOM for the App
            // (since App.ts expects to work with the main document)
            const tempContainer = document.createElement('div');
            tempContainer.id = 'assessment-app-root';
            tempContainer.style.cssText = `
        width: 100%;
        height: 100%;
      `;

            this.container.appendChild(tempContainer);

            // Initialize the App
            this.app = new App();
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
