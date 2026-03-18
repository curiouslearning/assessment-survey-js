import { AudioController } from '../components/audioController';
import { shuffleArray } from '../utils/mathUtils';
import { getDataFile } from '../utils/urlUtils';
import { resolveAssetPath } from '../utils/assetUtils';
import { ASSET_PATHS } from '../config/assetsPaths';
export class UIController {
    constructor() {
        this.root = UIController.configuredRoot;
        this.landingContainerId = 'landWrap';
        this.gameContainerId = 'gameWrap';
        this.endContainerId = 'endWrap';
        this.starContainerId = 'starWrapper';
        this.chestContainerId = 'chestWrapper';
        this.questionsContainerId = 'qWrap';
        this.feedbackContainerId = 'feedbackWrap';
        this.answersContainerId = 'aWrap';
        this.answerButton1Id = 'answerButton1';
        this.answerButton2Id = 'answerButton2';
        this.answerButton3Id = 'answerButton3';
        this.answerButton4Id = 'answerButton4';
        this.answerButton5Id = 'answerButton5';
        this.answerButton6Id = 'answerButton6';
        this.playButtonId = 'pbutton';
        this.loadingScreenId = 'loadingScreen';
        this.progressBarId = 'progressBar';
        this.chestImgId = 'chestImage';
        this.nextQuestion = null;
        this.contentLoaded = false;
        this.gameReady = true;
        this.skipStartScreen = false;
        this.shown = false;
        this.stars = [];
        this.shownStarsCount = 0;
        this.starPositions = Array();
        this.qAnsNum = 0;
        this.buttons = [];
        this.buttonsActive = false;
        this.devModeCorrectLabelVisibility = false;
        this.devModeBucketControlsEnabled = false;
        this.animationSpeedMultiplier = 1;
    }
    createFallbackElement(id) {
        const fallback = document.createElement('div');
        fallback.setAttribute('data-ui-fallback-id', id);
        fallback.style.display = 'none';
        return fallback;
    }
    resetRuntimeState() {
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
    getElementById(id) {
        const element = this.root.querySelector(`#${id}`);
        if (!element) {
            console.warn(`UIController could not find required element with id '${id}' in configured root. Using fallback element.`);
            return this.createFallbackElement(id);
        }
        return element;
    }
    getElementByIdOrSelector(id, selector) {
        var _a;
        const element = (_a = this.root.querySelector(`#${id}`)) !== null && _a !== void 0 ? _a : this.root.querySelector(selector);
        if (!element) {
            console.warn(`UIController could not find required element with id '${id}' or selector '${selector}' in configured root. Using fallback element.`);
            return this.createFallbackElement(id);
        }
        return element;
    }
    static ConfigureRoot(root) {
        const rootChanged = UIController.configuredRoot !== root;
        UIController.configuredRoot = root;
        if (UIController.instance !== null) {
            UIController.instance.root = root;
            if (rootChanged) {
                UIController.instance.init();
            }
        }
    }
    static Reset() {
        UIController.instance = null;
        UIController.configuredRoot = document;
    }
    init() {
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
    initializeStars() {
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
    SetAnimationSpeedMultiplier(multiplier) {
        UIController.getInstance().animationSpeedMultiplier = multiplier;
    }
    SetCorrectLabelVisibility(visible) {
        this.devModeCorrectLabelVisibility = visible;
        console.log('Correct label visibility set to ', this.devModeCorrectLabelVisibility);
    }
    SetBucketControlsVisibility(visible) {
        console.log('Bucket controls visibility set to ', visible);
        this.devModeBucketControlsEnabled = visible;
    }
    static OverlappingOtherStars(starPositions, x, y, minDistance) {
        if (starPositions.length < 1)
            return false;
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
    initEventListeners() {
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
    canShowGameFromLanding() {
        return this.contentLoaded && this.gameReady && localStorage.getItem(getDataFile()) !== null;
    }
    maybeAutoStartGame() {
        if (this.skipStartScreen && this.canShowGameFromLanding()) {
            this.showGame();
        }
    }
    showOptions() {
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
                    const button = buttons[i];
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
                    setTimeout(() => {
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
                    }, i * animationDuration * animationSpeedMultiplier * 0.3);
                }
            }, delayBforeOption);
            UIController.getInstance().qStart = Date.now();
        }
    }
    enableAnswerButton() {
        UIController.getInstance().buttonsActive = true;
    }
    static SetFeedbackText(nt) {
        console.log('Feedback text set to ' + nt);
        UIController.getInstance().feedbackContainer.innerHTML = nt;
    }
    //functions to show/hide the different containers
    showLanding() {
        this.landingContainer.style.display = 'flex';
        this.gameContainer.style.display = 'none';
        this.endContainer.style.display = 'none';
    }
    static ShowEnd() {
        UIController.getInstance().landingContainer.style.display = 'none';
        UIController.getInstance().gameContainer.style.display = 'none';
        UIController.getInstance().endContainer.style.display = 'flex';
    }
    showGame() {
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
    static SetFeedbackVisibile(visible, isCorrect) {
        if (visible) {
            UIController.getInstance().feedbackContainer.classList.remove('hidden');
            UIController.getInstance().feedbackContainer.classList.add('visible');
            UIController.getInstance().buttonsActive = false;
            if (isCorrect) {
                UIController.getInstance().feedbackContainer.style.color = 'rgb(109, 204, 122)';
                AudioController.PlayCorrect();
            }
            else {
                UIController.getInstance().feedbackContainer.style.color = 'red';
            }
        }
        else {
            UIController.getInstance().feedbackContainer.classList.remove('visible');
            UIController.getInstance().feedbackContainer.classList.add('hidden');
            UIController.getInstance().buttonsActive = false;
        }
    }
    static ReadyForNext(newQ, reGenerateItems = true) {
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
                AudioController.PlayAudio(newQ.promptAudio, UIController.getInstance().showOptions, UIController.ShowAudioAnimation);
            });
        }
        else {
            UIController.getInstance().playButton.innerHTML =
                `<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE)}' type='image/svg+xml'> </img></button>`;
            var nextQuestionButton = UIController.getInstance().playButton.querySelector('#nextqButton');
            nextQuestionButton.addEventListener('click', function () {
                UIController.ShowQuestion();
                //playquestionaudio
                AudioController.PlayAudio(newQ.promptAudio, UIController.getInstance().showOptions, UIController.ShowAudioAnimation);
            });
        }
    }
    static ShowAudioAnimation(playing = false) {
        if (!UIController.getInstance().devModeBucketControlsEnabled) {
            const playButtonImg = UIController.getInstance().playButton.querySelector('img');
            if (playing) {
                playButtonImg.src = resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_ANIMATION);
            }
            else {
                playButtonImg.src = resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE);
            }
        }
    }
    static ShowQuestion(newQuestion) {
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
        }
        else {
            UIController.getInstance().playButton.innerHTML =
                `<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='${resolveAssetPath(ASSET_PATHS.SOUND_BUTTON_IDLE)}' type='image/svg+xml'> </img></button>`;
            var nextQuestionButton = UIController.getInstance().playButton.querySelector('#nextqButton');
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
    static AddStar() {
        var starToShow = UIController.getInstance().getElementById('star' + UIController.getInstance().stars[UIController.getInstance().qAnsNum]);
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
            }
            else {
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
    static ChangeStarImageAfterAnimation() {
        var starToShow = UIController.getInstance().getElementById('star' + UIController.getInstance().stars[UIController.getInstance().qAnsNum - 1]);
        starToShow.src = resolveAssetPath(ASSET_PATHS.STAR_AFTER_ANIMATION);
    }
    answerButtonPress(buttonNum) {
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
    static ProgressChest() {
        const chestImage = UIController.getInstance().getElementById('chestImage');
        let currentImgSrc = chestImage.src;
        console.log('Chest Progression-->', chestImage);
        console.log('Chest Progression-->', chestImage.src);
        const currentImageNumber = parseInt(currentImgSrc.slice(-6, -4), 10);
        console.log('Chest Progression number-->', currentImageNumber);
        const nextImageNumber = (currentImageNumber % 4) + 1;
        console.log({
            ASSET_PATHS
        });
        const nextImageSrc = resolveAssetPath(ASSET_PATHS.CHEST_PROGRESSION[nextImageNumber]);
        chestImage.src = nextImageSrc;
    }
    static SetContentLoaded(value) {
        const instance = UIController.getInstance();
        instance.contentLoaded = value;
        if (value) {
            instance.maybeAutoStartGame();
        }
    }
    static SetSkipStartScreen(value) {
        const instance = UIController.getInstance();
        instance.skipStartScreen = value;
        instance.maybeAutoStartGame();
    }
    static SetGameReady(value) {
        const instance = UIController.getInstance();
        instance.gameReady = value;
        if (value) {
            instance.maybeAutoStartGame();
        }
    }
    static SetLoadingVisible(visible) {
        const loadingScreen = UIController.getInstance().root.querySelector(`#${UIController.getInstance().loadingScreenId}`);
        if (!loadingScreen) {
            return;
        }
        loadingScreen.style.display = visible ? 'flex' : 'none';
    }
    static SetLoadingProgress(progress) {
        const progressBar = UIController.getInstance().root.querySelector(`#${UIController.getInstance().progressBarId}`);
        if (!progressBar) {
            return;
        }
        progressBar.style.width = `${progress}%`;
    }
    static SetButtonPressAction(callback) {
        UIController.getInstance().buttonPressCallback = callback;
    }
    static SetStartAction(callback) {
        UIController.getInstance().startPressCallback = callback;
    }
    static SetExternalBucketControlsGenerationHandler(handler) {
        UIController.getInstance().externalBucketControlsGenerationHandler = handler;
    }
    static getInstance() {
        if (UIController.instance === null) {
            UIController.instance = new UIController();
            UIController.instance.init();
        }
        return UIController.instance;
    }
}
UIController.instance = null;
UIController.configuredRoot = document;
