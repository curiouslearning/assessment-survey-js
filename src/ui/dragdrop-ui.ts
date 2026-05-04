import { qData } from '@components/questionData';
import { AudioController } from '@components/audioController';
import { shuffleArray } from '@utils/mathUtils';
import { resolveAssetPath } from '@utils/assetUtils';
import { ASSET_PATHS } from '@configs/assetsPaths';
import { AssessmentUI, AssessmentUICallbacks } from './assessment-ui';
import { DragEventController, DraggableButton, DropAreaTarget, iDraggableHTMLElement } from '@ui/dom-events';
import appEventBus from '@services/app-event-bus';

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
  private starContainer: HTMLElement;
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
  private starPositions: Array<{ x: number; y: number }> = [];
  private qAnsNum = 0;
  private shownStarsCount = 0;
  private allStart: number | null = null;
  private contentLoaded = false;
  private gameReady = true;
  private skipStartScreen = false;
  private animationSpeedMultiplier = 1;
  private buttonsActive = false;

  // --- dev-mode state ---
  private devModeCorrectLabelVisibility = false;
  private devModeBucketControlsEnabled = false;
  private externalBucketControlsHandler:
    | ((container: HTMLElement, clickCallback: () => void) => void)
    | null = null;

  private callbacks: AssessmentUICallbacks | null = null;
  private dragController: DragEventController | null = null;
  private dropUnsubscribe: (() => void) | null = null;

  constructor(root: Document | ShadowRoot | HTMLElement = document) {
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
    this.starContainer = this.getElement('starWrapper');
    this.questionsContainer = this.getElement('qWrap');
    this.feedbackContainer = this.getElement('feedbackWrap');
    this.answersContainer = this.getElement('aWrap');
    this.playButton = this.getElement('pbutton');

    for (let i = 1; i <= 6; i++) {
      this.answerButtons.push(this.getElement(`answerButton${i}`));
    }

    this.initializeStars();
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

  private initializeStars(): void {
    this.starContainer.innerHTML = '';
    const indices: number[] = [];

    for (let i = 0; i < 20; i++) {
      const star = document.createElement('img');
      star.id = `star${i}`;
      star.classList.add('topstarv');
      this.starContainer.appendChild(star);
      if (i === 9) {
        this.starContainer.appendChild(document.createElement('br'));
      }
      indices.push(i, i);
    }

    shuffleArray(indices);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — configure
  // ─────────────────────────────────────────────────────────────────────────────

  configure(callbacks: AssessmentUICallbacks): void {
    this.callbacks = callbacks;

    // Apply drag behaviour to each answer button (class 'answerButton' required by DragEventController).
    this.answerButtons.forEach((button) => new DraggableButton(button));

    // Apply drop behaviour to the chest div (class 'chestdiv' required by DragEventController).
    const chestDiv = this.root.querySelector<HTMLElement>('.chestdiv');
    if (chestDiv) {
      new DropAreaTarget(chestDiv);
    }

    // Attach pointer-event listeners to the game container so DragEventController
    // can locate both the draggable buttons and the chest drop zone.
    this.dragController = new DragEventController(this.gameContainer);
    this.dragController.attach();

    // Map dropped element → 0-based answerIndex → onAnswer callback.
    this.dropUnsubscribe = appEventBus.subscribe(
      appEventBus.EVENTS.DROP_ELEMENT_INTERACTION,
      ({ selectedAnswer }: { selectedAnswer: iDraggableHTMLElement }) => {
        if (!this.buttonsActive || !this.callbacks) return;
        // Button IDs are 'answerButton1'…'answerButton6' (1-based); convert to 0-based.
        const buttonNum = parseInt(selectedAnswer.id.replace('answerButton', ''), 10);
        if (isNaN(buttonNum)) return;
        const elapsedMs = Date.now() - this.qStart;
        this.callbacks.onAnswer({ answerIndex: buttonNum - 1, elapsedMs });
      }
    );

    this.landingContainer.addEventListener('click', () => {
      if (this.contentLoaded && this.gameReady) {
        this.showGame();
      }
    });
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
    this.buttonsActive = false;

    this.answersContainer.style.visibility = 'hidden';
    this.answerButtons.forEach((b) => (b.style.visibility = 'hidden'));
    this.questionsContainer.innerHTML = '';
    this.questionsContainer.style.display = 'none';

    if (this.devModeBucketControlsEnabled && this.externalBucketControlsHandler) {
      this.externalBucketControlsHandler(this.playButton, () => {
        this.revealQuestion();
        AudioController.PlayAudio(
          question.promptAudio,
          () => this.showAnswerTargets(),
          (playing: boolean) => this.updateAudioButtonImage(playing)
        );
      });
    } else {
      this.playButton.innerHTML = `<button id='nextqButton'><img class="audio-button" width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE)}' type='image/svg+xml'></img></button>`;
      const nextBtn = this.playButton.querySelector('#nextqButton') as HTMLElement;
      nextBtn?.addEventListener('click', () => {
        this.revealQuestion();
        AudioController.PlayAudio(
          question.promptAudio,
          () => this.showAnswerTargets(),
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

    this.questionsContainer.innerHTML += question.promptText + '<BR>';
    this.answerButtons.forEach((b) => (b.style.visibility = 'hidden'));

    // Replace the play button handler so subsequent clicks only replay audio
    // without re-hiding the answer buttons (matches UIController.ShowQuestion behavior).
    if (!this.devModeBucketControlsEnabled) {
      this.playButton.innerHTML = `<button id='nextqButton'><img class="audio-button" width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE)}' type='image/svg+xml'></img></button>`;
      const replayBtn = this.playButton.querySelector('#nextqButton') as HTMLElement;
      replayBtn?.addEventListener('click', () => {
        AudioController.PlayAudio(
          question.promptAudio,
          undefined,
          (playing: boolean) => this.updateAudioButtonImage(playing)
        );
      });
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
      btn.innerHTML = '';
    });

    setTimeout(() => {
      question.answers.forEach((answer, i) => {
        const button = this.answerButtons[i];
        if (!button) return;

        const isCorrect = answer.answerName === question.correct;
        button.innerHTML = 'answerText' in answer ? (answer as any).answerText : '';

        if (isCorrect && this.devModeCorrectLabelVisibility) {
          const label = document.createElement('div');
          label.classList.add('correct-label');
          label.innerHTML = 'Correct';
          button.appendChild(label);
        }

        button.style.visibility = 'hidden';
        button.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';

        setTimeout(() => {
          button.style.visibility = 'visible';
          button.style.boxShadow = '0px 6px 8px #606060';
          button.style.animation = `zoomIn ${animDuration * this.animationSpeedMultiplier}ms ease forwards`;

          if ('answerImg' in answer) {
            const img = AudioController.GetImage((answer as any).answerImg);
            button.appendChild(img);
          }

          button.addEventListener('animationend', () => {
            // Clear the animation so CSS fill-mode no longer overrides the
            // JS transform set by DraggableButton during drag.
            button.style.animation = '';
            const allVisible = question.answers.every((_, idx) => {
              const b = this.answerButtons[idx];
              return !b || b.style.visibility === 'visible';
            });
            if (allVisible) {
              this.buttonsActive = true;
            }
          });
        }, i * animDuration * this.animationSpeedMultiplier * 0.3);
      });
    }, delayBeforeOption);
  }

  private updateAudioButtonImage(playing: boolean): void {
    if (this.devModeBucketControlsEnabled) return;
    let img = this.playButton.querySelector('img') as HTMLImageElement;
    if (!img) {
      img = document.createElement('img');
      this.playButton.appendChild(img);
    }
    img.src = resolveAssetPath(
      playing ? ASSET_PATHS.SOUND_BUTTON_ANIMATION : ASSET_PATHS.SOUND_BUTTON_IDLE
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — feedback
  // ─────────────────────────────────────────────────────────────────────────────

  showFeedback(visible: boolean, isCorrect: boolean): void {
    this.buttonsActive = false;
    if (visible) {
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
  // AssessmentUI — star / chest progress
  // ─────────────────────────────────────────────────────────────────────────────

  addStar(): void {
    const starToShow = this.root.querySelector<HTMLImageElement>(`#star${this.qAnsNum}`);
    if (!starToShow) return;

    starToShow.src = resolveAssetPath(ASSET_PATHS.STAR_ANIMATION);
    starToShow.classList.add('topstarv');
    starToShow.classList.remove('topstarh');
    starToShow.style.position = 'absolute';

    const containerWidth = this.starContainer.offsetWidth;
    const containerHeight = this.starContainer.offsetHeight;

    let randomX = 0;
    let randomY = 0;
    do {
      randomX = Math.floor(Math.random() * (containerWidth - containerWidth * 0.2));
      randomY = Math.floor(Math.random() * containerHeight);
    } while (this.isOverlappingStars(randomX, randomY, 28));

    const mult = this.animationSpeedMultiplier;

    starToShow.style.transform = 'scale(10)';
    starToShow.style.transition = `top ${1 * mult}s ease, left ${1 * mult}s ease, transform ${0.5 * mult}s ease`;
    starToShow.style.zIndex = '500';
    starToShow.style.top = window.innerHeight / 2 + 'px';
    starToShow.style.left =
      this.gameContainer.offsetWidth / 2 - starToShow.offsetWidth / 2 + 'px';

    setTimeout(() => {
      starToShow.style.transition = `top ${2 * mult}s ease, left ${2 * mult}s ease, transform ${2 * mult}s ease`;
      const rotation = 5 + Math.random() * 8;
      starToShow.style.transform =
        randomX < containerWidth / 2 - 30
          ? `rotate(-${rotation}deg) scale(1)`
          : `rotate(${rotation}deg) scale(1)`;
      starToShow.style.left = `${10 + randomX}px`;
      starToShow.style.top = `${randomY}px`;

      setTimeout(() => {
        starToShow.style.filter = 'drop-shadow(0px 0px 10px yellow)';
      }, 1900 * mult);
    }, 1000 * mult);

    this.starPositions.push({ x: randomX, y: randomY });
    this.qAnsNum++;
    this.shownStarsCount++;
  }

  changeStarImageAfterAnimation(): void {
    // Matches UIController: uses qAnsNum (post-increment) to find the star element
    const star = this.root.querySelector<HTMLImageElement>(`#star${this.qAnsNum}`);
    if (star) star.src = resolveAssetPath(ASSET_PATHS.STAR_AFTER_ANIMATION);
  }

  progressChest(): void {
    const chestImage = this.root.querySelector<HTMLImageElement>('#chestImage');
    if (!chestImage) return;

    const currentNum = parseInt(chestImage.src.slice(-6, -4), 10);
    const nextNum = (currentNum % 4) + 1;
    chestImage.src = Number.isNaN(nextNum)
      ? resolveAssetPath(`img/chestprogression/TreasureChestOpen0${nextNum}.svg`)
      : resolveAssetPath(ASSET_PATHS.CHEST_PROGRESSION[nextNum]);
  }

  getShownStarsCount(): number {
    return this.shownStarsCount;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AssessmentUI — dev-mode hooks
  // ─────────────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────────

  private isOverlappingStars(x: number, y: number, minDistance: number): boolean {
    return this.starPositions.some((pos) => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  }
}
