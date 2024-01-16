import { qData, answerData } from './questionData';
import { AudioController } from './audioLoader';
import { randFrom, shuffleArray } from './mathUtils';
import { getDataFile } from './urlUtils';

export class UIController {
	
	private static instance: UIController | null = null;

	private landingContainerId = "landWrap";
	public landingContainer: HTMLElement;

	private gameContainerId = "gameWrap";
	public gameContainer: HTMLElement;

	private endContainerId = "endWrap";
	public endContainer: HTMLElement;

	private starContainerId = "starWrapper";
	public starContainer: HTMLElement;

	private questionsContainerId = "qWrap";
	public questionsContainer: HTMLElement;

	private feedbackContainerId = "feedbackWrap";
	public feedbackContainer: HTMLElement;

	private answersContainerId = "aWrap";
	public answersContainer: HTMLElement;

	private answerButton1Id = "answerButton1";
	private answerButton1: HTMLElement;
	private answerButton2Id = "answerButton2";
	private answerButton2: HTMLElement;
	private answerButton3Id = "answerButton3";
	private answerButton3: HTMLElement;
	private answerButton4Id = "answerButton4";
	private answerButton4: HTMLElement;
	private answerButton5Id = "answerButton5";
	private answerButton5: HTMLElement;
	private answerButton6Id = "answerButton6";
	private answerButton6: HTMLElement;

	private playButtonId = "pbutton";
	private playButton: HTMLElement;

	public nextQuestion = null;

	private contentLoaded = false;

	public qStart;
	public shown = false;

	public stars = [];
	public qAnsNum = 0;

	public allStart: number;

	public buttons = [];

	private buttonPressCallback: Function;
	private startPressCallback: Function;

	public buttonsActive: boolean = true;

	private init(): void {
		// Initialize required containers
		this.landingContainer = document.getElementById(this.landingContainerId);
		this.gameContainer = document.getElementById(this.gameContainerId);
		this.endContainer = document.getElementById(this.endContainerId);
		this.starContainer = document.getElementById(this.starContainerId);
		this.questionsContainer = document.getElementById(this.questionsContainerId);
		this.feedbackContainer = document.getElementById(this.feedbackContainerId);
		this.answersContainer = document.getElementById(this.answersContainerId);

		// Initialize required buttons
		this.answerButton1 = document.getElementById(this.answerButton1Id);
		this.answerButton2 = document.getElementById(this.answerButton2Id);
		this.answerButton3 = document.getElementById(this.answerButton3Id);
		this.answerButton4 = document.getElementById(this.answerButton4Id);
		this.answerButton5 = document.getElementById(this.answerButton5Id);
		this.answerButton6 = document.getElementById(this.answerButton6Id);

		this.playButton = document.getElementById(this.playButtonId);

		this.initializeStars();

		this.initEventListeners();
	}

	private initializeStars(): void {
		for (let i = 0; i < 20; i++) {
			const newStar = document.createElement("img");
			newStar.src = "img/star.png";
			newStar.id = "star" + i;

			newStar.classList.add("topstarh");

			this.starContainer.appendChild(newStar);

			this.starContainer.innerHTML += "";

			if (i == 9) {
				this.starContainer.innerHTML += "<br>";
			}

			this.stars.push(i);
		}

		shuffleArray(this.stars);
	}

	private initEventListeners(): void {
		this.answerButton1.addEventListener("click", () => {
			this.answerButtonPress(1);
		});

		this.buttons.push(this.answerButton1);

		this.answerButton2.addEventListener("click", () => {
			this.answerButtonPress(2);
		});

		this.buttons.push(this.answerButton2);

		this.answerButton3.addEventListener("click", () => {
			this.answerButtonPress(3);
		});

		this.buttons.push(this.answerButton3);

		this.answerButton4.addEventListener("click", () => {
			this.answerButtonPress(4);
		});

		this.buttons.push(this.answerButton4);

		this.answerButton5.addEventListener("click", () => {
			this.answerButtonPress(5);
		});

		this.buttons.push(this.answerButton5);

		this.answerButton6.addEventListener("click", () => {
			this.answerButtonPress(6);
		});

		this.buttons.push(this.answerButton6);

		this.landingContainer.addEventListener("click", () => {
			if (localStorage.getItem(getDataFile())) {
				this.showGame();
			}
		});
	}

	private showOptions(): void {
		if (!UIController.getInstance().shown) {
			var newQ = UIController.getInstance().nextQuestion;

			//showing the answers on each button
			let btnIndex = 0;
			for (var aNum in newQ.answers) {
				UIController.getInstance().buttons[btnIndex++].style.visibility = "visible";
				let curAnswer = newQ.answers[aNum];
				let answerCode = "";
				if ('answerText' in curAnswer) {
					answerCode += curAnswer.answerText;
				}
				UIController.getInstance().buttons[aNum].innerHTML = answerCode;
				if ('answerImg' in curAnswer) {
					var tmpimg = AudioController.GetImage(curAnswer.answerImg);
					UIController.getInstance().buttons[aNum].appendChild(tmpimg);
				}
			}

			UIController.getInstance().qStart = Date.now();
		}

	}

	public static SetFeedbackText(nt: string): void {
		console.log("Feedback text set to " + nt);
		UIController.getInstance().feedbackContainer.innerHTML = nt;
	}

	//functions to show/hide the different containers
	private showLanding(): void {
		this.landingContainer.style.display = "flex";
		this.gameContainer.style.display = "none";
		this.endContainer.style.display = "none";
	}

	public static ShowEnd(): void {
		UIController.getInstance().landingContainer.style.display = "none";
		UIController.getInstance().gameContainer.style.display = "none";
		UIController.getInstance().endContainer.style.display = "flex";
	}

	private showGame(): void {
		this.landingContainer.style.display = "none";
		this.gameContainer.style.display = "grid";
		this.endContainer.style.display = "none";
		this.allStart = Date.now();
		this.startPressCallback();
	}

	public static SetFeedbackVisibile(visible: boolean) {
		if (visible) {
			UIController.getInstance().feedbackContainer.classList.remove("hidden");
			UIController.getInstance().feedbackContainer.classList.add("visible");
			AudioController.PlayCorrect();

			UIController.getInstance().buttonsActive = false;
		} else {
			UIController.getInstance().feedbackContainer.classList.remove("visible");
			UIController.getInstance().feedbackContainer.classList.add("hidden");

			UIController.getInstance().buttonsActive = true;
		}
	}

	public static ReadyForNext(newQ: qData): void {
		console.log("ready for next!");
		UIController.getInstance().answersContainer.style.visibility = "hidden";
		for (var b in UIController.getInstance().buttons) {
			UIController.getInstance().buttons[b].style.visibility = "hidden";
		}
		UIController.getInstance().shown = false;
		UIController.getInstance().nextQuestion = newQ;
		UIController.getInstance().questionsContainer.innerHTML = "";
		UIController.getInstance().questionsContainer.style.display = "none";
		// pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
		UIController.getInstance().playButton.innerHTML = "<button id='nextqButton'><img width='85px' height='85px' src='/img/sound-play-button.svg' type='image/svg+xml'> </img></button>";
		var nextQuestionButton = document.getElementById("nextqButton");
		nextQuestionButton.addEventListener("click", function () {
			UIController.ShowQuestion();
			//playquestionaudio
			AudioController.PlayAudio(newQ.promptAudio, UIController.getInstance().showOptions);
		});
	}

	public static ShowQuestion(newQuestion?: qData): void {

		// pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
		UIController.getInstance().playButton.innerHTML = "<button id='nextqButton'><img width='85px' height='85px' src='/img/sound-play-button.svg' type='image/svg+xml'> </img></button>";

		var nqb = document.getElementById("nextqButton");
		nqb.addEventListener("click", function () {
			console.log("next question button pressed");
			console.log(newQ.promptAudio);
			
			if ('promptAudio' in newQ) {
				playAudio(newQ.promptAudio, UIController.getInstance().showOptions);
			}
		})

		UIController.getInstance().answersContainer.style.visibility = "visible";

		let qCode = "";

		UIController.getInstance().questionsContainer.innerHTML = "";

		if (typeof (newQ) == 'undefined') {
			newQ = UIController.getInstance().nextQuestion;
		}

		if ('promptImg' in newQ) {
			var tmpimg = getImg(newQ.promptImg);
			UIController.getInstance().questionsContainer.appendChild(tmpimg);
		}

		qCode += newQ.promptText;

		qCode += "<BR>";

		UIController.getInstance().questionsContainer.innerHTML += qCode;


		for (var b in UIController.getInstance().buttons) {
			UIController.getInstance().buttons[b].style.visibility = "hidden";
		}
	}

	public static AddStar(): void {
		var startoshow = document.getElementById("star" + UIController.getInstance().stars[UIController.getInstance().qAnsNum]);
		startoshow.classList.add("topstarv");
		startoshow.classList.remove("topstarh");
		UIController.getInstance().qAnsNum += 1;
	}

	private answerButtonPress(buttonNum: number): void {
		if (this.buttonsActive) {
			playDing();
			const nPressed = Date.now();
			const dTime = nPressed - this.qStart;
			console.log("answered in " + dTime);
			this.buttonPressCallback(buttonNum, dTime);
		}
	}

	public static SetContentLoaded(value: boolean): void {
		UIController.getInstance().contentLoaded = value;
	}

	public static SetButtonPressAction(callback: Function): void {
		UIController.getInstance().buttonPressCallback = callback;
	}

	public static SetStartAction(callback: Function): void {
		UIController.getInstance().startPressCallback = callback;
	}

	public static getInstance(): UIController {
		if (UIController.instance === null) {
			UIController.instance = new UIController();
			UIController.instance.init();
		}

		return UIController.instance;
	}
}
