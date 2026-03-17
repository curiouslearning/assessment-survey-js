import { qData, answerData } from '../components/questionData';
import { AudioController } from '../components/audioController';
import { randFrom, shuffleArray } from '../utils/mathUtils';
import { getDataFile } from '../utils/urlUtils';
import { resolveAssetPath } from '../utils/assetUtils';
import { ASSET_PATHS } from '@configs/assetsPaths';

export class UIController {
  private static instance: UIController | null = null;
  private static configuredRoot: Document | ShadowRoot | HTMLElement = document;
  private root: Document | ShadowRoot | HTMLElement = UIController.configuredRoot;

  private landingContainerId = 'landWrap';
  public landingContainer: HTMLElement;

  private gameContainerId = 'gameWrap';
  public gameContainer: HTMLElement;

  private endContainerId = 'endWrap';
  public endContainer: HTMLElement;

  private starContainerId = 'starWrapper';
  public starContainer: HTMLElement;

  private chestContainerId = 'chestWrapper';
  public chestContainer: HTMLElement;

  private questionsContainerId = 'qWrap';
  public questionsContainer: HTMLElement;

  private feedbackContainerId = 'feedbackWrap';
  public feedbackContainer: HTMLElement;

  private answersContainerId = 'aWrap';
  public answersContainer: HTMLElement;

  private answerButton1Id = 'answerButton1';
  private answerButton1: HTMLElement;
  private answerButton2Id = 'answerButton2';
  private answerButton2: HTMLElement;
  private answerButton3Id = 'answerButton3';
  private answerButton3: HTMLElement;
  private answerButton4Id = 'answerButton4';
  private answerButton4: HTMLElement;
  private answerButton5Id = 'answerButton5';
  private answerButton5: HTMLElement;
  private answerButton6Id = 'answerButton6';
  private answerButton6: HTMLElement;

  private playButtonId = 'pbutton';
  private playButton: HTMLElement;

  private loadingScreenId = 'loadingScreen';
  private progressBarId = 'progressBar';

  private chestImgId = 'chestImage';
  private chestImg: HTMLElement;

  public nextQuestion = null;

  public contentLoaded: boolean = false;
  private gameReady: boolean = true;
  private skipStartScreen: boolean = false;

  public qStart;
  public shown = false;

  public stars = [];
  public shownStarsCount = 0;
  public starPositions: Array<{ x: number; y: number }> = Array<{
    x: number;
    y: number;
  }>();
  public qAnsNum = 0;

  public allStart: number;

  public buttons = [];

  private buttonPressCallback: Function;
  private startPressCallback: Function;

  public buttonsActive: boolean = false;

  private devModeCorrectLabelVisibility: boolean = false;
  private devModeBucketControlsEnabled: boolean = false;

  public animationSpeedMultiplier: number = 1;

  public externalBucketControlsGenerationHandler: (container: HTMLElement, clickCallback: () => void) => void;

  private createFallbackElement(id: string): HTMLElement {
    const fallback = document.createElement('div');
    fallback.setAttribute('data-ui-fallback-id', id);
    fallback.style.display = 'none';
    return fallback;
  }

  private resetRuntimeState(): void {
    this.nextQuestion = null;
    this.contentLoaded = false;
    this.gameReady = true;
    this.skipStartScreen = false;
    this.qStart = null;
    this.shown = false;
    this.stars = [];
    this.shownStarsCount = 0;
    this.starPositions = [];
    this.qAnsNum = 0;
    this.allStart = null;
    this.buttons = [];
    this.buttonsActive = false;
  }

  private getElementById<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = this.root.querySelector<T>(`#${id}`);
    if (!element) {
      console.warn(`UIController could not find required element with id '${id}' in configured root. Using fallback element.`);
      return this.createFallbackElement(id) as T;
    }
    return element;
  }

  private getElementByIdOrSelector<T extends HTMLElement = HTMLElement>(id: string, selector: string): T {
    const element = this.root.querySelector<T>(`#${id}`) ?? this.root.querySelector<T>(selector);
    if (!element) {
      console.warn(`UIController could not find required element with id '${id}' or selector '${selector}' in configured root. Using fallback element.`);
      return this.createFallbackElement(id) as T;
    }
    return element;
  }

  public static ConfigureRoot(root: Document | ShadowRoot | HTMLElement): void {
    const rootChanged = UIController.configuredRoot !== root;
    UIController.configuredRoot = root;
    if (UIController.instance !== null) {
      UIController.instance.root = root;
      if (rootChanged) {
        UIController.instance.init();
      }
    }
  }

  public static Reset(): void {
    UIController.instance = null;
    UIController.configuredRoot = document;
  }

  private init(): void {
    this.root = UIController.configuredRoot;
    this.resetRuntimeState();
    // Initialize required containers
    this.landingContainer = this.getElementById(this.landingContainerId);
    this.gameContainer = this.getElementById(this.gameContainerId);
    this.endContainer = this.getElementById(this.endContainerId);
    this.starContainer = this.getElementById(this.starContainerId);
    this.chestContainer = this.getElementByIdOrSelector(this.chestContainerId, '.chestWrapper');
    this.questionsContainer = this.getElementById(this.questionsContainerId);
    this.feedbackContainer = this.getElementById(this.feedbackContainerId);
    this.answersContainer = this.getElementById(this.answersContainerId);

    // Initialize required buttons
    this.answerButton1 = this.getElementById(this.answerButton1Id);
    this.answerButton2 = this.getElementById(this.answerButton2Id);
    this.answerButton3 = this.getElementById(this.answerButton3Id);
    this.answerButton4 = this.getElementById(this.answerButton4Id);
    this.answerButton5 = this.getElementById(this.answerButton5Id);
    this.answerButton6 = this.getElementById(this.answerButton6Id);

    this.playButton = this.getElementById(this.playButtonId);

    this.chestImg = this.getElementById(this.chestImgId);

    this.initializeStars();

    this.initEventListeners();
  }

  private initializeStars(): void {
    for (let i = 0; i < 20; i++) {
      const newStar = document.createElement('img');

      // newStar.src = "img/star.png";
      newStar.id = 'star' + i;

      newStar.classList.add('topstarv');

      this.starContainer.appendChild(newStar);

      this.starContainer.innerHTML += '';

      if (i == 9) {
        this.starContainer.innerHTML += '<br>';
      }

      this.stars.push(i);
    }

    shuffleArray(this.stars);
  }

  public SetAnimationSpeedMultiplier(multiplier: number): void {
    UIController.getInstance().animationSpeedMultiplier = multiplier;
  }

  public SetCorrectLabelVisibility(visible: boolean): void {
    this.devModeCorrectLabelVisibility = visible;
    console.log('Correct label visibility set to ', this.devModeCorrectLabelVisibility);
  }

  public SetBucketControlsVisibility(visible: boolean): void {
    console.log('Bucket controls visibility set to ', visible);
    this.devModeBucketControlsEnabled = visible;
  }

  public static OverlappingOtherStars(
    starPositions: Array<{ x: number; y: number }>,
    x: number,
    y: number,
    minDistance: number
  ): boolean {
    if (starPositions.length < 1) return false;

    for (let i = 0; i < starPositions.length; i++) {
      const dx = starPositions[i].x - x;
      const dy = starPositions[i].y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  }

  private initEventListeners(): void {
    // TODO: refactor this
    this.answerButton1.addEventListener('click', () => {
      this.answerButtonPress(1);
    });

    this.buttons.push(this.answerButton1);

    this.answerButton2.addEventListener('click', () => {
      this.answerButtonPress(2);
    });

    this.buttons.push(this.answerButton2);

    this.answerButton3.addEventListener('click', () => {
      this.answerButtonPress(3);
    });

    this.buttons.push(this.answerButton3);

    this.answerButton4.addEventListener('click', () => {
      this.answerButtonPress(4);
    });

    this.buttons.push(this.answerButton4);

    this.answerButton5.addEventListener('click', () => {
      this.answerButtonPress(5);
    });

    this.buttons.push(this.answerButton5);

    this.answerButton6.addEventListener('click', () => {
      this.answerButtonPress(6);
    });

    this.buttons.push(this.answerButton6);

    this.landingContainer.addEventListener('click', () => {
      if (this.canShowGameFromLanding()) {
        this.showGame();
      }
    });
  }

  private canShowGameFromLanding(): boolean {
    return this.contentLoaded && this.gameReady && localStorage.getItem(getDataFile()) !== null;
  }

  private maybeAutoStartGame(): void {
    if (this.skipStartScreen && this.canShowGameFromLanding()) {
      this.showGame();
    }
  }

  public showOptions(): void {
    if (!UIController.getInstance().shown) {
      const newQ = UIController.getInstance().nextQuestion;
      const buttons = UIController.getInstance().buttons;

      const animationSpeedMultiplier = UIController.getInstance().animationSpeedMultiplier;

      let animationDuration = 220 * animationSpeedMultiplier;
      const delayBforeOption = 150 * animationSpeedMultiplier;
      UIController.getInstance().shown = true;
      let optionsDisplayed = 0;

      buttons.forEach((button) => {
        button.style.visibility = 'hidden';
        button.style.animation = '';
        button.innerHTML = '';
      });

      setTimeout(() => {
        for (let i = 0; i < newQ.answers.length; i++) {
          const curAnswer = newQ.answers[i];
          const button = buttons[i] as HTMLButtonElement;

          const isCorrect = curAnswer.answerName === newQ.correct;

          button.innerHTML = 'answerText' in curAnswer ? curAnswer.answerText : '';

          // Add a label inside the button to show the correct answer
          if (isCorrect && UIController.getInstance().devModeCorrectLabelVisibility) {
            const correctLabel = document.createElement('div');
            correctLabel.classList.add('correct-label');
            correctLabel.innerHTML = 'Correct';
            button.appendChild(correctLabel);
          }

          button.style.visibility = 'hidden';
          button.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';
          setTimeout(
            () => {
              button.style.visibility = 'visible';
              button.style.boxShadow = '0px 6px 8px #606060';
              button.style.animation = `zoomIn ${animationDuration * animationSpeedMultiplier}ms ease forwards`;
              if ('answerImg' in curAnswer) {
                const tmpimg = AudioController.GetImage(curAnswer.answerImg);
                button.appendChild(tmpimg);
              }
              button.addEventListener('animationend', () => {
                optionsDisplayed++;
                if (optionsDisplayed === newQ.answers.length) {
                  UIController.getInstance().enableAnswerButton();
                }
              });
            },
            i * animationDuration * animationSpeedMultiplier * 0.3
          );
        }
      }, delayBforeOption);

      UIController.getInstance().qStart = Date.now();
    }
  }

  private enableAnswerButton(): void {
    UIController.getInstance().buttonsActive = true;
  }

  public static SetFeedbackText(nt: string): void {
    console.log('Feedback text set to ' + nt);
    UIController.getInstance().feedbackContainer.innerHTML = nt;
  }

  //functions to show/hide the different containers
  private showLanding(): void {
    this.landingContainer.style.display = 'flex';
    this.gameContainer.style.display = 'none';
    this.endContainer.style.display = 'none';
  }

  public static ShowEnd(): void {
    UIController.getInstance().landingContainer.style.display = 'none';
    UIController.getInstance().gameContainer.style.display = 'none';
    UIController.getInstance().endContainer.style.display = 'flex';
  }

  private showGame(): void {
    if (this.gameContainer.style.display === 'grid') {
      return;
    }

    this.landingContainer.style.display = 'none';
    this.gameContainer.style.display = 'grid';
    this.endContainer.style.display = 'none';
    this.allStart = Date.now();
    if (typeof this.startPressCallback === 'function') {
      this.startPressCallback();
    }
  }

  public static SetFeedbackVisibile(visible: boolean, isCorrect: boolean) {
    if (visible) {
      UIController.getInstance().feedbackContainer.classList.remove('hidden');
      UIController.getInstance().feedbackContainer.classList.add('visible');
      UIController.getInstance().buttonsActive = false;
      if (isCorrect) {
        UIController.getInstance().feedbackContainer.style.color = 'rgb(109, 204, 122)';
        AudioController.PlayCorrect();
      } else {
        UIController.getInstance().feedbackContainer.style.color = 'red';
      }
    } else {
      UIController.getInstance().feedbackContainer.classList.remove('visible');
      UIController.getInstance().feedbackContainer.classList.add('hidden');
      UIController.getInstance().buttonsActive = false;
    }
  }

  public static ReadyForNext(newQ: qData, reGenerateItems: boolean = true): void {
    if (newQ === null) {
      return;
    }
    console.log('ready for next!');
    UIController.getInstance().answersContainer.style.visibility = 'hidden';
    for (var b in UIController.getInstance().buttons) {
      UIController.getInstance().buttons[b].style.visibility = 'hidden';
    }
    UIController.getInstance().shown = false;
    UIController.getInstance().nextQuestion = newQ;
    UIController.getInstance().questionsContainer.innerHTML = '';
    UIController.getInstance().questionsContainer.style.display = 'none';
    // pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
    // UIController.getInstance().playButton.classList.add("audio-button");

    // When the dev mode is active and the bucket next, previous and play buttons are enabled, use the external bucket controls generation handler
    // if (!reGenerateItems) {
    //   return;
    // }
    const isBucketControlsEnabled = UIController.getInstance().devModeBucketControlsEnabled;
    if (isBucketControlsEnabled) {
      UIController.getInstance().externalBucketControlsGenerationHandler(UIController.getInstance().playButton, () => {
        console.log('Call from inside click handler of external bucket controls');
        UIController.ShowQuestion();
        //playquestionaudio
        AudioController.PlayAudio(
          newQ.promptAudio,
          UIController.getInstance().showOptions,
          UIController.ShowAudioAnimation
        );
      });
    } else {
      UIController.getInstance().playButton.innerHTML =
        `<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE)}' type='image/svg+xml'> </img></button>`;
      var nextQuestionButton = UIController.getInstance().playButton.querySelector('#nextqButton') as HTMLElement;
      nextQuestionButton.addEventListener('click', function () {
        UIController.ShowQuestion();
        //playquestionaudio
        AudioController.PlayAudio(
          newQ.promptAudio,
          UIController.getInstance().showOptions,
          UIController.ShowAudioAnimation
        );
      });
    }
  }

  public static ShowAudioAnimation(playing: boolean = false) {
    if (!UIController.getInstance().devModeBucketControlsEnabled) {
      const playButtonImg = UIController.getInstance().playButton.querySelector('img');
      if (playing) {
        playButtonImg.src = resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_ANIMATION);
      } else {
        playButtonImg.src = resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE);
      }
    }
  }

  public static ShowQuestion(newQuestion?: qData): void {
    // pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";

    // When the dev mode is active and the bucket next, previous and play buttons are enabled, use the external bucket controls generation handler
    const isBucketControlsEnabled = UIController.getInstance().devModeBucketControlsEnabled;
    if (isBucketControlsEnabled) {
      UIController.getInstance().externalBucketControlsGenerationHandler(UIController.getInstance().playButton, () => {
        console.log('Call from inside click handler of external bucket controls #2');
        console.log('next question button pressed');
        console.log(newQuestion.promptAudio);

        if ('promptAudio' in newQuestion) {
          AudioController.PlayAudio(newQuestion.promptAudio, undefined, UIController.ShowAudioAnimation);
        }
      });
    } else {
      UIController.getInstance().playButton.innerHTML =
        `<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE)}' type='image/svg+xml'> </img></button>`;

      var nextQuestionButton = UIController.getInstance().playButton.querySelector('#nextqButton') as HTMLElement;
      nextQuestionButton.addEventListener('click', function () {
        console.log('next question button pressed');
        console.log(newQuestion.promptAudio);

        if ('promptAudio' in newQuestion) {
          AudioController.PlayAudio(newQuestion.promptAudio, undefined, UIController.ShowAudioAnimation);
        }
      });
    }

    UIController.getInstance().answersContainer.style.visibility = 'visible';

    let qCode = '';

    UIController.getInstance().questionsContainer.innerHTML = '';

    if (typeof newQuestion == 'undefined') {
      newQuestion = UIController.getInstance().nextQuestion;
    }

    if ('promptImg' in newQuestion) {
      var tmpimg = AudioController.GetImage(newQuestion.promptImg);
      UIController.getInstance().questionsContainer.appendChild(tmpimg);
    }

    qCode += newQuestion.promptText;

    qCode += '<BR>';

    UIController.getInstance().questionsContainer.innerHTML += qCode;

    for (var buttonIndex in UIController.getInstance().buttons) {
      UIController.getInstance().buttons[buttonIndex].style.visibility = 'hidden';
    }
  }

  public static AddStar(): void {
    var starToShow = UIController.getInstance().getElementById<HTMLImageElement>(
      'star' + UIController.getInstance().stars[UIController.getInstance().qAnsNum]
    );
    starToShow.src = resolveAssetPath(ASSET_PATHS.STAR_ANIMATION);
    starToShow.classList.add('topstarv');
    starToShow.classList.remove('topstarh');

    starToShow.style.position = 'absolute';

    let containerWidth = UIController.getInstance().starContainer.offsetWidth;
    let containerHeight = UIController.getInstance().starContainer.offsetHeight;

    console.log('Stars Container dimensions: ', containerWidth, containerHeight);

    let randomX = 0;
    let randomY = 0;

    do {
      randomX = Math.floor(Math.random() * (containerWidth - containerWidth * 0.2));
      randomY = Math.floor(Math.random() * containerHeight);
    } while (UIController.OverlappingOtherStars(UIController.instance.starPositions, randomX, randomY, 28));

    const animationSpeedMultiplier = UIController.getInstance().animationSpeedMultiplier;

    // Save these random x and y values, make the star appear in the center of the screen, make it 3 times bigger using scale and slowly transition to the random x and y values
    starToShow.style.transform = 'scale(10)';
    starToShow.style.transition = `top ${1 * animationSpeedMultiplier}s ease, left ${1 * animationSpeedMultiplier}s ease, transform ${0.5 * animationSpeedMultiplier}s ease`;
    starToShow.style.zIndex = '500';
    starToShow.style.top = window.innerHeight / 2 + 'px';
    starToShow.style.left = UIController.instance.gameContainer.offsetWidth / 2 - starToShow.offsetWidth / 2 + 'px';

    setTimeout(() => {
      starToShow.style.transition = `top ${2 * animationSpeedMultiplier}s ease, left ${2 * animationSpeedMultiplier}s ease, transform ${2 * animationSpeedMultiplier}s ease`;
      if (randomX < containerWidth / 2 - 30) {
        // Rotate the star to the right a bit
        const rotation = 5 + Math.random() * 8;
        console.log('Rotating star to the right', rotation);
        starToShow.style.transform = 'rotate(-' + rotation + 'deg) scale(1)';
      } else {
        // Rotate the star to the left a bit
        const rotation = 5 + Math.random() * 8;
        console.log('Rotating star to the left', rotation);
        starToShow.style.transform = 'rotate(' + rotation + 'deg) scale(1)';
      }

      starToShow.style.left = 10 + randomX + 'px';
      starToShow.style.top = randomY + 'px';

      setTimeout(() => {
        starToShow.style.filter = 'drop-shadow(0px 0px 10px yellow)';
      }, 1900 * animationSpeedMultiplier);
    }, 1000 * animationSpeedMultiplier);

    UIController.instance.starPositions.push({ x: randomX, y: randomY });

    UIController.getInstance().qAnsNum += 1;

    UIController.getInstance().shownStarsCount += 1;
  }

  public static ChangeStarImageAfterAnimation(): void {
    var starToShow = UIController.getInstance().getElementById<HTMLImageElement>(
      'star' + UIController.getInstance().stars[UIController.getInstance().qAnsNum - 1]
    );
    starToShow.src = resolveAssetPath(ASSET_PATHS.STAR_AFTER_ANIMATION);
  }

  private answerButtonPress(buttonNum: number): void {
    const allButtonsVisible = this.buttons.every((button) => button.style.visibility === 'visible');
    console.log(this.buttonsActive, allButtonsVisible);
    if (this.buttonsActive === true) {
      AudioController.PlayDing();
      const nPressed = Date.now();
      const dTime = nPressed - this.qStart;
      console.log('answered in ' + dTime);
      this.buttonPressCallback(buttonNum, dTime);
    }
  }

  public static ProgressChest() {
    const chestImage = UIController.getInstance().getElementById<HTMLImageElement>('chestImage');
    let currentImgSrc = chestImage.src;
    console.log('Chest Progression-->', chestImage);
    console.log('Chest Progression-->', chestImage.src);
    const currentImageNumber = parseInt(currentImgSrc.slice(-6, -4), 10);
    console.log('Chest Progression number-->', currentImageNumber);
    const nextImageNumber = (currentImageNumber % 4) + 1;
    console.log({
      ASSET_PATHS
    })
    const nextImageSrc = resolveAssetPath(ASSET_PATHS.CHEST_PROGRESSION[nextImageNumber]);
    chestImage.src = nextImageSrc;
  }

  public static SetContentLoaded(value: boolean): void {
    const instance = UIController.getInstance();
    instance.contentLoaded = value;

    if (value) {
      instance.maybeAutoStartGame();
    }
  }

  public static SetSkipStartScreen(value: boolean): void {
    const instance = UIController.getInstance();
    instance.skipStartScreen = value;
    instance.maybeAutoStartGame();
  }

  public static SetGameReady(value: boolean): void {
    const instance = UIController.getInstance();
    instance.gameReady = value;

    if (value) {
      instance.maybeAutoStartGame();
    }
  }

  public static SetLoadingVisible(visible: boolean): void {
    const loadingScreen = UIController.getInstance().root.querySelector<HTMLElement>(`#${UIController.getInstance().loadingScreenId}`);
    if (!loadingScreen) {
      return;
    }

    loadingScreen.style.display = visible ? 'flex' : 'none';
  }

  public static SetLoadingProgress(progress: number): void {
    const progressBar = UIController.getInstance().root.querySelector<HTMLElement>(`#${UIController.getInstance().progressBarId}`);
    if (!progressBar) {
      return;
    }

    progressBar.style.width = `${progress}%`;
  }

  public static SetButtonPressAction(callback: Function): void {
    UIController.getInstance().buttonPressCallback = callback;
  }

  public static SetStartAction(callback: Function): void {
    UIController.getInstance().startPressCallback = callback;
  }

  public static SetExternalBucketControlsGenerationHandler(
    handler: (container: HTMLElement, clickCallback: () => void) => void
  ): void {
    UIController.getInstance().externalBucketControlsGenerationHandler = handler;
  }

  public static getInstance(): UIController {
    if (UIController.instance === null) {
      UIController.instance = new UIController();
      UIController.instance.init();
    }

    return UIController.instance;
  }
}
