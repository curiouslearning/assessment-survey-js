import { qData, answerData } from './questionData';
import { playAudio, playDing, playCorrect, getImg } from './audioLoader';
import { randFrom, shuffleArray } from './mathUtils';
import { getDataFile } from './urlUtils';

export default class UIController {
	
	private static instance: UIController | null = null;

	private landingContainerId = "landWrap";
	private landingContainer: HTMLElement;

	private gameContainerId = "gameWrap";
	private gameContainer: HTMLElement;

	private endContainerId = "endWrap";
	private endContainer: HTMLElement;

	private starContainerId = "starWrapper";
	private starContainer: HTMLElement;

	private questionsContainerId = "qWrap";
	private questionsContainer: HTMLElement;

	private feedbackContainerId = "feedbackWrap";
	private feedbackContainer: HTMLElement;

	private answersContainerId = "aWrap";
	private answersContainer: HTMLElement;

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

	private nextQuestion = null;

	private contentLoaded = false;

	private qStart;
	private shown = false;

	public stars = [];
	public qAnsNum = 0;

	private allStart: number;

	private buttons = [];

	private buttonPressCallback: Function;
	private startPressCallback: Function;

	private buttonsActive: boolean = true;

	private constructor() {
		this.init();
	}

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
				showGame();
			}
		});
	}

	private showOptions(): void {
		if (!this.shown) {
			var newQ = this.nextQuestion;

			//showing the answers on each button
			let btnIndex = 0;
			for (var aNum in newQ.answers) {
				this.buttons[btnIndex++].style.visibility = "visible";
				let curAnswer = newQ.answers[aNum];
				let answerCode = "";
				if ('answerText' in curAnswer) {
					answerCode += curAnswer.answerText;
				}
				this.buttons[aNum].innerHTML = answerCode;
				if ('answerImg' in curAnswer) {
					var tmpimg = getImg(curAnswer.answerImg);
					this.buttons[aNum].appendChild(tmpimg);
				}
			}

			this.qStart = Date.now();
		}

	}

	private setFeedbackText(nt: string): void {
		console.log("Feedback text set to " + nt);
		this.feedbackContainer.innerHTML = nt;
	}

	//functions to show/hide the different containers
	private showLanding(): void {
		landingCont.style.display = "flex";
		gameCont.style.display = "none";
		endCont.style.display = "none";
	}

	private showEnd(): void {
		this.landingContainer.style.display = "none";
		this.gameContainer.style.display = "none";
		this.endContainer.style.display = "flex";
	}

	private showGame(): void {
		this.landingContainer.style.display = "none";
		this.gameContainer.style.display = "grid";
		this.endContainer.style.display = "none";
		this.allStart = Date.now();
		this.startPressCallback();
	}

	private setFeedbackVisibile(visible: boolean) {
		if (visible) {
			this.feedbackContainer.classList.remove("hidden");
			this.feedbackContainer.classList.add("visible");
			playCorrect();

			buttonsActive = false;
		} else {
			this.feedbackContainer.classList.remove("visible");
			this.feedbackContainer.classList.add("hidden");

			buttonsActive = true;
		}
	}
}

const landingCont = document.getElementById("landWrap");
const gameCont = document.getElementById("gameWrap");
const endCont = document.getElementById("endWrap");
const sD = document.getElementById("starWrapper");
const qT = document.getElementById("qWrap");
const pB = document.getElementById("pbutton");
const fT = document.getElementById("feedbackWrap");
const aC = document.getElementById("aWrap");
const b1 = document.getElementById("answerButton1");
const b2 = document.getElementById("answerButton2");
const b3 = document.getElementById("answerButton3");
const b4 = document.getElementById("answerButton4");
const b5 = document.getElementById("answerButton5");
const b6 = document.getElementById("answerButton6");

var nextquest = null;

var qstart;
var allstart;
var shown = false;
var allstars = [];
var qansnum = 0;

let contentLoaded = false;

export function setContentLoaded(value: boolean) {
	contentLoaded = value;
}

for (var xi = 0; xi < 20; xi += 1) {
	const newstar = document.createElement("img");
	newstar.src = "img/star.png";
	newstar.id = "star" + xi;
	newstar.classList.add("topstarh");


	sD.appendChild(newstar);
	sD.innerHTML += "";
	if (xi == 9) {
		sD.innerHTML += "<br>";
	}
	allstars.push(xi)
}

shuffleArray(allstars);


const buttons = [b1, b2, b3, b4, b5, b6];
var bCallback: Function;
var sCallback: Function;
var buttonsActive: boolean = true;



//add button listeners
b1.addEventListener("click", function () {
	buttonPress(1);
});

b2.addEventListener("click", function () {
	buttonPress(2);
});

b3.addEventListener("click", function () {
	buttonPress(3);
});

b4.addEventListener("click", function () {
	buttonPress(4);
});

b5.addEventListener("click", function () {
	buttonPress(5);
});

b6.addEventListener("click", function () {
	buttonPress(6);
});

landingCont.addEventListener("click", function () {
	if (localStorage.getItem(getDataFile())) {
		showGame();
	}
})

endCont.addEventListener("click", function () {
	showLanding();
})



export function readyForNext(newQ: qData): void {
	console.log("ready for next!");
	aC.style.visibility = "hidden";
	for (var b in buttons) {
		buttons[b].style.visibility = "hidden";
	}
	shown = false;
	nextquest = newQ;
	qT.innerHTML = "";
	qT.style.display = "none";
	// pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
	pB.innerHTML = "<button id='nextqButton'><img width='85px' height='85px' src='/img/sound-play-button.svg' type='image/svg+xml'> </img></button>";
	var nqb = document.getElementById("nextqButton");
	nqb.addEventListener("click", function () {
		showQuestion();
		//playquestionaudio
		playAudio(newQ.promptAudio, showOptions);
	})
}

// function to display a new question
export function showQuestion(newQ?: qData): void {

	// pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
	pB.innerHTML = "<button id='nextqButton'><img width='85px' height='85px' src='/img/sound-play-button.svg' type='image/svg+xml'> </img></button>";
	var nqb = document.getElementById("nextqButton");
	nqb.addEventListener("click", function () {
		console.log("next question button pressed");
		console.log(newQ.promptAudio);
		
		if ('promptAudio' in newQ) {
			playAudio(newQ.promptAudio, showOptions);
		}
	})

	aC.style.visibility = "visible";

	let qCode = "";
	qT.innerHTML = "";
	if (typeof (newQ) == 'undefined') {
		newQ = nextquest;
	}

	if ('promptImg' in newQ) {
		var tmpimg = getImg(newQ.promptImg);
		qT.appendChild(tmpimg);
	}
	qCode += newQ.promptText;

	qCode += "<BR>";

	qT.innerHTML += qCode;


	for (var b in buttons) {
		buttons[b].style.visibility = "hidden";
	}
}


export function showOptions(): void {
	if (!shown) {
		var newQ = nextquest;

		//showing the answers on each button
		let btnIndex = 0;
		for (var aNum in newQ.answers) {
			buttons[btnIndex++].style.visibility = "visible";
			let curAnswer = newQ.answers[aNum];
			let answerCode = "";
			if ('answerText' in curAnswer) {
				answerCode += curAnswer.answerText;
			}
			buttons[aNum].innerHTML = answerCode;
			if ('answerImg' in curAnswer) {
				var tmpimg = getImg(curAnswer.answerImg);
				buttons[aNum].appendChild(tmpimg);
			}
		}

		qstart = Date.now();
	}

}

export function setFeedbackText(nt: string): void {
	console.log("feedback text set to " + nt);
	fT.innerHTML = nt;
}

//functions to show/hide the different containers
export function showLanding(): void {
	landingCont.style.display = "flex";
	gameCont.style.display = "none";
	endCont.style.display = "none";
}

export function showGame(): void {
	landingCont.style.display = "none";
	gameCont.style.display = "grid";
	endCont.style.display = "none";
	allstart = Date.now();
	sCallback();
}

export function showEnd(): void {
	landingCont.style.display = "none";
	gameCont.style.display = "none";
	endCont.style.display = "flex";
}

export function setFeedbackVisibile(b: boolean) {
	if (b) {
		fT.classList.remove("hidden");
		fT.classList.add("visible");
		playCorrect();

		buttonsActive = false;
	} else {
		fT.classList.remove("visible");
		fT.classList.add("hidden");

		buttonsActive = true;
	}
}

// add a star on question answer

export function addStar(): void {
	var startoshow = document.getElementById("star" + allstars[qansnum]);
	startoshow.classList.add("topstarv");
	startoshow.classList.remove("topstarh");
	qansnum += 1;
}

//handle button press

export function setStartAction(callback: Function): void {
	sCallback = callback;
}


export function setButtonAction(callback: Function): void {
	bCallback = callback;
}

function buttonPress(num: number) {
	if (buttonsActive) {
		playDing();
		var npressed = Date.now();
		var dtime = npressed - qstart;
		console.log("answered in " + dtime)
		bCallback(num, dtime);
	}
}
