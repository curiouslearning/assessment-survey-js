import { qData } from '@components/questionData';
import { AudioController } from '@components/audioController';
import { resolveAssetPath } from '@utils/assetUtils';
import { ASSET_PATHS } from '@configs/assetsPaths';
import { AssessmentUI, AssessmentUICallbacks } from '../assessment-ui';
import { DragDropAudioController } from '@services/drag-drop-audio-controller';
import { isRTL, setFontSizeRTL, setFontSizeLTR } from '@utils/languageUtils';
import { TapToAnswerController } from '../tap-to-answer-controller';
import { DragToAnswerController } from './drag-to-answer-controller';
/**
 * Drag-and-drop assessment UI.
 *
 * Uses the same DOM template and element IDs as UIController (same containers,
 * star/chest/feedback structure, loading screen). The answer interaction is
 * replaced with drag-and-drop instead of click buttons.
 *
 * Drag-and-drop mechanics are stubbed with TODOs pending integration from the
 * separate drag-and-drop ticket. Click fallback is in place during development.
 */
export class DragDropAssessmentUI implements AssessmentUI {
  private root: Document | ShadowRoot | HTMLElement;

  // --- containers (same element IDs as UIController) ---
  private landingContainer: HTMLElement;
  private gameContainer: HTMLElement;
  private endContainer: HTMLElement;
  private questionsContainer: HTMLElement;
  private feedbackContainer: HTMLElement;
  private answersContainer: HTMLElement;
  private playButton: HTMLElement;

  // answer buttons — used as drop targets in drag-and-drop mode
  private answerButtons: HTMLElement[] = [];

  // --- runtime state (mirrors UIController fields) ---
  private nextQuestion: qData | null = null;
  private shown = false;
  private qStart = 0;
  private allStart: number | null = null;
  private contentLoaded = false;
  private gameReady = true;
  private skipStartScreen = false;
  private animationSpeedMultiplier = 1;

  // --- star progress state ---
  private shownStarsCount = 0;

  // --- dev-mode state ---
  private devModeCorrectLabelVisibility = false;
  private devModeBucketControlsEnabled = false;
  private externalBucketControlsHandler: ((container: HTMLElement, clickCallback: () => void) => void) | null = null;

  // Spelling assessments answer by tapping a plain rectangular box instead of
  // dragging a ladybug onto the chest (see FM-979: longer spelled words don't
  // fit inside the ladybug's ~105px width).
  private isSpellingAssessment = false;

  // Sentence Reading (FM-999 spike) needs its sentence prompt visible as text; every other
  // assessment type relies on audio-only prompts and keeps qWrap hidden (display: none).
  private isSentenceReadingAssessment = false;

  private callbacks: AssessmentUICallbacks | null = null;
  private tapController: TapToAnswerController | null = null;
  private dragAnswerController: DragToAnswerController | null = null;
  private landingClickHandler: (() => void) | null = null;

  private dragDropAudioControllerInstance: DragDropAudioController | null;

  constructor(root: Document | ShadowRoot | HTMLElement = document) {
    this.dragDropAudioControllerInstance = new DragDropAudioController();
    this.root = root;
    this.init();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Initialisation
  // ─────────────────────────────────────────────────────────────────────────────

  private init(): void {
    this.landingContainer = this.getElement('landWrap');
    this.gameContainer = this.getElement('gameWrap');
    this.endContainer = this.getElement('endWrap');
    this.questionsContainer = this.getElement('qWrap');
    this.feedbackContainer = this.getElement('feedbackWrap');
    this.answersContainer = this.getElement('aWrap');
    this.playButton = this.getElement('pbutton');

    for (let i = 1; i <= 6; i++) {
      this.answerButtons.push(this.getElement(`answerButton${i}`));
    }
  }

  private getElement(id: string): HTMLElement {
    const el = this.root.querySelector<HTMLElement>(`#${id}`);
    if (!el) {
      console.warn(`DragDropAssessmentUI: element #${id} not found in root`);
      const fallback = document.createElement('div');
      fallback.setAttribute('data-ui-fallback-id', id);
      fallback.style.display = 'none';
      return fallback;
    }
    return el;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — configure
  // ─────────────────────────────────────────────────────────────────────────────

  configure(callbacks: AssessmentUICallbacks): void {
    this.callbacks = callbacks;

    if (this.isSpellingAssessment || this.isSentenceReadingAssessment) {
      // Click-to-select: tapping a box answers immediately, no drag/drop wiring.
      // Sentence Reading (FM-999 spike) reuses this same tap controller as Spelling —
      // there's no chest/drag metaphor needed for "pick the matching image".
      this.tapController = new TapToAnswerController(this.answerButtons, {
        onAnswer: (answerIndex, elapsedMs) => this.callbacks?.onAnswer({ answerIndex, elapsedMs }),
        getElapsedMs: () => Date.now() - this.qStart,
      });
      this.tapController.attach();
    } else {
      const chestDiv = this.root.querySelector<HTMLElement>('.chestdiv');
      this.dragAnswerController = new DragToAnswerController(this.gameContainer, this.answerButtons, chestDiv, {
        onAnswer: (answerIndex, elapsedMs) => this.callbacks?.onAnswer({ answerIndex, elapsedMs }),
        getElapsedMs: () => Date.now() - this.qStart,
      });
      this.dragAnswerController.attach();
    }

    this.landingClickHandler = () => {
      if (this.contentLoaded && this.gameReady) {
        this.showGame();
      }
    };
    this.landingContainer.addEventListener('click', this.landingClickHandler);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — loading / startup state
  // ─────────────────────────────────────────────────────────────────────────────

  setLoadingVisible(visible: boolean): void {
    const screen = this.root.querySelector<HTMLElement>('#loadingScreen');
    if (screen) screen.style.display = visible ? 'flex' : 'none';
  }

  setLoadingProgress(progress: number): void {
    const bar = this.root.querySelector<HTMLElement>('#progressBar');
    if (bar) bar.style.width = `${progress}%`;
  }

  setContentLoaded(loaded: boolean): void {
    this.contentLoaded = loaded;
    if (loaded) this.maybeAutoStart();
  }

  setGameReady(ready: boolean): void {
    this.gameReady = ready;
    if (ready) this.maybeAutoStart();
  }

  setSkipStartScreen(skip: boolean): void {
    this.skipStartScreen = skip;
    this.maybeAutoStart();
  }

  private maybeAutoStart(): void {
    if (this.skipStartScreen && this.contentLoaded && this.gameReady) {
      this.showGame();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — screen transitions
  // ─────────────────────────────────────────────────────────────────────────────

  showLanding(): void {
    this.landingContainer.style.display = 'flex';
    this.gameContainer.style.display = 'none';
    this.endContainer.style.display = 'none';
  }

  showEnd(): void {
    this.landingContainer.style.display = 'none';
    this.gameContainer.style.display = 'none';
    this.endContainer.style.display = 'flex';
  }

  private showGame(): void {
    if (this.gameContainer.style.display === 'grid') return;
    this.landingContainer.style.display = 'none';
    this.gameContainer.style.display = 'grid';
    this.endContainer.style.display = 'none';
    // Hide answer buttons immediately so placeholder text is never visible before the
    // first question is prepared (guards against any frame painted before onStart fires).
    this.answersContainer.style.visibility = 'hidden';
    this.answerButtons.forEach((b) => (b.style.visibility = 'hidden'));
    this.allStart = Date.now();
    this.callbacks?.onStart();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — question lifecycle
  // ─────────────────────────────────────────────────────────────────────────────

  prepareQuestion(question: qData): void {
    if (!question) return;
    this.nextQuestion = question;
    this.shown = false;
    this.tapController?.setActive(false);
    this.dragAnswerController?.setActive(false);

    this.answersContainer.style.visibility = 'hidden';
    this.answerButtons.forEach((b) => (b.style.visibility = 'hidden'));
    this.questionsContainer.innerHTML = '';
    this.questionsContainer.style.display = 'none';

    if (this.isSentenceReadingAssessment) {
      // Sentence Reading has no audio prompt - the sentence itself is the whole prompt, so
      // there's no play/replay button. Show the sentence and the 4 image options immediately,
      // and after each answer the next sentence loads the same way (see FM-999 spike).
      this.playButton.innerHTML = '';
      this.revealQuestion();
      this.showAnswerTargets();
      return;
    }

    if (this.devModeBucketControlsEnabled && this.externalBucketControlsHandler) {
      this.externalBucketControlsHandler(this.playButton, () => {
        this.revealQuestion();
        AudioController.PlayAudio(
          question.promptAudio,
          () => {
            if (this.nextQuestion === question) this.showAnswerTargets();
          },
          (playing: boolean) => this.updateAudioButtonImage(playing)
        );
      });
    } else {
      this.playButton.innerHTML = `<button id='nextqButton'><img class="audio-button" draggable="false" width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE_NEW)}' type='image/svg+xml'></img></button>`;
      const nextBtn = this.playButton.querySelector('#nextqButton') as HTMLElement;
      nextBtn?.addEventListener('click', () => {
        this.revealQuestion();
        AudioController.PlayAudio(
          question.promptAudio,
          () => {
            if (this.nextQuestion === question) this.showAnswerTargets();
          },
          (playing: boolean) => this.updateAudioButtonImage(playing)
        );
      });
    }
  }

  revealQuestion(): void {
    const question = this.nextQuestion;
    if (!question) return;

    this.answersContainer.style.visibility = 'visible';
    this.questionsContainer.innerHTML = '';

    if ('promptImg' in question) {
      const img = AudioController.GetImage((question as any).promptImg);
      this.questionsContainer.appendChild(img);
    }

    if (this.isSentenceReadingAssessment) {
      // Plain text in a centered flex box - no trailing <BR> needed like the audio-prompt layout.
      this.questionsContainer.textContent = question.promptText;
      this.questionsContainer.style.display = '';
      // Crossfade in over the feedback box's slot (showFeedback hides it back out on answer).
      this.questionsContainer.classList.remove('hidden');
      this.questionsContainer.classList.add('visible');
      this.answerButtons.forEach((b) => (b.style.visibility = 'hidden'));
      // Sentence Reading has no audio - prepareQuestion already reveals the sentence and
      // calls showAnswerTargets directly, so there's no play/replay button to wire up here.
      return;
    }

    this.questionsContainer.innerHTML += question.promptText + '<BR>';
    this.answerButtons.forEach((b) => (b.style.visibility = 'hidden'));

    // Replace the play button handler so subsequent clicks only replay audio
    // without re-hiding the answer buttons (matches UIController.ShowQuestion behavior).
    if (!this.devModeBucketControlsEnabled) {
      this.playButton.innerHTML = `<button id='nextqButton'><img class="audio-button" draggable="false" width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE_NEW)}' type='image/svg+xml'></img></button>`;
      const replayBtn = this.playButton.querySelector('#nextqButton') as HTMLElement;
      replayBtn?.addEventListener('click', () => {
        AudioController.PlayAudio(question.promptAudio, undefined, (playing: boolean) =>
          this.updateAudioButtonImage(playing)
        );
      });
    } else {
      // In dev-mode bucket-controls, the play button area holds item-selection buttons.
      // Auto-play the prompt audio and reveal answer targets once it finishes.
      AudioController.PlayAudio(
        question.promptAudio,
        () => {
          if (this.nextQuestion === question) this.showAnswerTargets();
        },
        (playing: boolean) => this.updateAudioButtonImage(playing)
      );
    }
  }

  /**
   * Shows the answer options after audio finishes playing.
   * Buttons are made visible as draggable items — the drop onto the chest
   * is handled by DragEventController + appEventBus.
   */
  private showAnswerTargets(): void {
    if (this.shown) return;
    const question = this.nextQuestion;
    if (!question) return;

    this.shown = true;
    this.qStart = Date.now();

    const animDuration = 220 * this.animationSpeedMultiplier;
    const delayBeforeOption = 150 * this.animationSpeedMultiplier;

    this.answerButtons.forEach((btn) => {
      btn.style.visibility = 'hidden';
      btn.style.animation = '';
      btn.style.fontSize = '';
      btn.innerHTML = '';
    });

    setTimeout(() => {
      question.answers.forEach((answer, i) => {
        const button = this.answerButtons[i];
        if (!button) return;

        const isCorrect = answer.answerName === question.correct;
        const answerText = 'answerText' in answer ? (answer as any).answerText : '';
        button.innerHTML = answerText;
        this.applyTextFit(button, answerText);

        if (isCorrect && this.devModeCorrectLabelVisibility) {
          const label = document.createElement('div');
          label.classList.add('correct-label');
          label.innerHTML = 'Correct';
          button.appendChild(label);
        }

        button.style.visibility = 'hidden';
        button.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';

        setTimeout(
          () => {
            button.style.visibility = 'visible';
            button.style.animation = `zoomIn ${animDuration * this.animationSpeedMultiplier}ms ease forwards`;

            if ('answerImg' in answer) {
              const img = AudioController.GetImage((answer as any).answerImg);
              button.appendChild(img);
            }

            button.addEventListener(
              'animationend',
              () => {
                // Clear the animation so CSS fill-mode no longer overrides the
                // JS transform set by DraggableButton during drag.
                button.style.animation = '';
                const allVisible = question.answers.every((_, idx) => {
                  const b = this.answerButtons[idx];
                  return !b || b.style.visibility === 'visible';
                });
                if (allVisible) {
                  this.tapController?.setActive(true);
                  this.dragAnswerController?.setActive(true);
                }
              },
              { once: true }
            );
          },
          i * animDuration * this.animationSpeedMultiplier * 0.3
        );
      });
    }, delayBeforeOption);
  }

  private updateAudioButtonImage(playing: boolean): void {
    if (this.devModeBucketControlsEnabled) return;
    let img = this.playButton.querySelector('img') as HTMLImageElement;
    if (!img) {
      img = document.createElement('img');
      img.draggable = false;
      this.playButton.appendChild(img);
    }
    img.src = resolveAssetPath(playing ? ASSET_PATHS.SOUND_BUTTON_ANIMATION_NEW : ASSET_PATHS.SOUND_BUTTON_IDLE_NEW);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — feedback
  // ─────────────────────────────────────────────────────────────────────────────

  showFeedback(visible: boolean, isCorrect: boolean): void {
    this.tapController?.setActive(false);
    this.dragAnswerController?.setActive(false);
    if (visible) {
      // Sentence Reading shares the feedback slot with its sentence prompt box - swap them
      // out so only one is visible at a time (see FM-999 spike).
      if (this.isSentenceReadingAssessment) {
        this.questionsContainer.classList.remove('visible');
        this.questionsContainer.classList.add('hidden');
      }
      this.feedbackContainer.classList.remove('hidden');
      this.feedbackContainer.classList.add('visible');
      this.feedbackContainer.style.color = isCorrect ? 'rgb(109, 204, 122)' : 'red';
      if (isCorrect) AudioController.PlayCorrect();
    } else {
      this.feedbackContainer.classList.remove('visible');
      this.feedbackContainer.classList.add('hidden');
    }
  }

  setFeedbackText(text: string): void {
    this.feedbackContainer.innerHTML = text;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — star / chest progress (stars are not shown in new-ui mode)
  // ─────────────────────────────────────────────────────────────────────────────

  addStar(): void {
    this.shownStarsCount += 1;
  }

  changeStarImageAfterAnimation(): void {}

  getShownStarsCount(): number {
    return this.shownStarsCount;
  }

  progressChest(): void {
    const chestImage = this.root.querySelector<HTMLImageElement>('#chestImage');
    if (!chestImage) return;
    chestImage.src = resolveAssetPath(ASSET_PATHS.CHEST_PROGRESSION_NEW[4]);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — dev-mode hooks
  // ─────────────────────────────────────────────────────────────────────────────

  setAssessmentType(assessmentType: string): void {
    this.isSpellingAssessment = assessmentType === 'spelling';
    this.isSentenceReadingAssessment = assessmentType === 'sentence-reading';
    if (this.isSpellingAssessment) {
      this.answersContainer.classList.add('as-spelling-mode');
      // Wider 2-per-row layout (matches the legacy UI's answer grid) — the
      // ladybug's narrower 4-across row doesn't leave room for longer words.
      this.answersContainer.style.gridTemplateColumns = 'repeat(2, minmax(0, 200px))';
    }
    if (this.isSentenceReadingAssessment) {
      // Plain, uniformly-sized boxes holding an image (no ladybug drag target) — see FM-999 spike.
      this.answersContainer.classList.add('as-sentence-reading-mode');
      // 2x2 grid instead of the default 4-across row (overrides the inline style set at
      // DOM-creation time in draggable-question-view-wrapper-section.ts).
      this.answersContainer.style.gridTemplateColumns = 'repeat(2, minmax(0, 150px))';
      // Styles qWrap as a feedback-like box sharing the feedback slot (see revealQuestion/showFeedback).
      this.questionsContainer.classList.add('as-sentence-reading-mode');
    }
  }

  setCorrectLabelVisibility(visible: boolean): void {
    this.devModeCorrectLabelVisibility = visible;
  }

  setBucketControlsVisibility(visible: boolean): void {
    this.devModeBucketControlsEnabled = visible;
  }

  setAnimationSpeedMultiplier(multiplier: number): void {
    this.animationSpeedMultiplier = multiplier;
  }

  setExternalBucketControlsGenerationHandler(
    handler: (container: HTMLElement, clickCallback: () => void) => void
  ): void {
    this.externalBucketControlsHandler = handler;
  }

  dispose(): void {
    this.tapController?.dispose();
    this.tapController = null;
    this.dragAnswerController?.dispose();
    this.dragAnswerController = null;

    this.dragDropAudioControllerInstance?.disposeSubscriptions();
    this.dragDropAudioControllerInstance = null;

    if (this.landingClickHandler) {
      this.landingContainer.removeEventListener('click', this.landingClickHandler);
      this.landingClickHandler = null;
    }
    this.callbacks = null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Scales the button's font-size so the longest word fits on a single line
   * inside the ladybug body. The 4-column layout gives ~60 px of usable text
   * width (≈80 px column − 20 px padding). Breakpoints derived from
   * BalooBhai2's ~0.58 avg char-width ratio: F = 60 / (chars × 0.58).
   */
  private applyTextFit(button: HTMLElement, rawText: string): void {
    const plainText = rawText.replace(/<[^>]*>/g, '').trim();
    if (!plainText) return;

    const words = plainText.split(/\s+/);
    const maxWordLen = Math.max(...words.map((w) => w.length));
    const textIsInRTL = isRTL(plainText);

    if (textIsInRTL) {
      button.style.fontSize = setFontSizeRTL(maxWordLen);
    } else {
      button.style.fontSize = setFontSizeLTR(maxWordLen);
    }
  }
}
