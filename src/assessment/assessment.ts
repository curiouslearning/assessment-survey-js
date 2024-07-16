//this is where the logic for handling the buckets will go
//
//once we start adding in the assessment functionality
import { UIController } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { AnalyticsEvents } from '../components/analyticsEvents'
import { App } from '../App';
import { bucket, bucketItem } from './bucketData';
import { BaseQuiz } from '../BaseQuiz';
import { fetchAssessmentBuckets } from '../components/jsonUtils';
import { TreeNode, sortedArrayToIDsBST } from '../components/tNode';
import { randFrom, shuffleArray } from '../components/mathUtils';
import { AudioController } from '../components/audioController';

enum searchStage {
	BinarySearch,
	LinearSearchUp,
	LinearSearchDown
}

export class Assessment extends BaseQuiz {

	public unityBridge;

	public currentNode: TreeNode;
	public currentQuestion: qData;
	public bucketArray: number[];
	public questionNumber: number;
	
	public buckets: bucket[];
	public currentBucket: bucket;
	public numBuckets: number;
	public basalBucket: number;
	public ceilingBucket: number;

	constructor(dataURL: string, unityBridge: any) {
		super();
		this.dataURL = dataURL;
		this.unityBridge = unityBridge;
		this.questionNumber = 0;
		console.log("app initialized");
		UIController.SetButtonPressAction(this.TryAnswer);
		UIController.SetStartAction(this.startAssessment);
	}

	public Run(applink: App): void {
		this.app = applink;
		this.buildBuckets().then(result => {
			console.log(this.currentBucket);
			this.unityBridge.SendLoaded();
		});
	}

	public startAssessment = () => {
		UIController.ReadyForNext(this.getNextQuestion());
	}

	public buildBuckets = () => {
		var res = fetchAssessmentBuckets(this.app.GetDataURL()).then((result) => {
			this.buckets = result;
			this.numBuckets = result.length;
			console.log("buckets: " + this.buckets);
			this.bucketArray = Array.from(Array(this.numBuckets), (_, i) => i+1);
			console.log("empty array " +  this.bucketArray)
			let usedIndices = new Set<number>();
			usedIndices.add(0);
			let rootOfIDs = sortedArrayToIDsBST(this.buckets[0].bucketID - 1, this.buckets[this.buckets.length - 1].bucketID, usedIndices);
			// console.log("Generated the buckets root ----------------------------------------------");
			// console.log(rootOfIDs);
			let bucketsRoot = this.convertToBucketBST(rootOfIDs, this.buckets);
			console.log("Generated the buckets root ----------------------------------------------");
			console.log(bucketsRoot);
			this.basalBucket = this.numBuckets + 1;
			this.ceilingBucket = -1;
			this.currentNode = bucketsRoot;
			this.tryMoveBucket(bucketsRoot.value, false);
		});
		return res;
	}

	/**
	 * Converts a binary search tree of numbers to a binary search tree of bucket objects
	 * @param node Is a root node of a binary search tree
	 * @param buckets Is an array of bucket objects
	 * @returns A root node of a binary search tree where the value of each node is a bucket object
	 */
	public convertToBucketBST = (node: TreeNode, buckets: bucket[]) => {
		// Traverse each element take the value and find that bucket in the buckets array and assign that bucket instead of the number value
		if (node === null) return node;

		let bucketId = node.value;
		node.value = buckets.find(bucket => bucket.bucketID === bucketId);
		if (node.left !== null) node.left = this.convertToBucketBST(node.left, buckets);
		if (node.right !== null) node.right = this.convertToBucketBST(node.right, buckets);

		return node;
	}

	public initBucket = (bucket: bucket) => {
		this.currentBucket = bucket;
		this.currentBucket.usedItems = [];
		this.currentBucket.numTried = 0;
		this.currentBucket.numCorrect = 0;
		this.currentBucket.numConsecutiveWrong = 0;
		this.currentBucket.tested = true;
		this.currentBucket.passed = false;
	}

	public TryAnswer = (answer: number, elapsed: number) => {
		AnalyticsEvents.sendAnswered(this.currentQuestion, answer, elapsed);
		this.currentBucket.numTried += 1;
		if (this.currentQuestion.answers[answer-1].answerName == this.currentQuestion.correct){
			this.currentBucket.numCorrect += 1;
			this.currentBucket.numConsecutiveWrong = 0;
			console.log("Answered correctly");
		}else{
			this.currentBucket.numConsecutiveWrong += 1;
			console.log("Answered incorrectly, " + this.currentBucket.numConsecutiveWrong);
		}
		UIController.AddStar();
		UIController.SetFeedbackVisibile(true);
		setTimeout(() => { 
			console.log('Completed first Timeout');
			this.onQuestionEnd()
		}, 2000);
	}

	public onQuestionEnd = () => {
		let questionEndTimeout = (this.HasQuestionsLeft()) ? 500 : 4000;
	
		const endOperations = () => {
			UIController.SetFeedbackVisibile(false);
			UIController.ChangeStarImageAfterAnimation();
			if (this.HasQuestionsLeft()) {
				UIController.ReadyForNext(this.getNextQuestion());
			} else {
				console.log("No questions left");
				this.onEnd();
			}
		};
	
		// Create a promise that resolves after the specified timeout
		const timeoutPromise = new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, questionEndTimeout);
		});
	
		// Execute endOperations after timeoutPromise resolves
		timeoutPromise.then(() => {
			endOperations();
		});
	}
	

	public getNextQuestion = () => {
		var targetItem, foil1, foil2, foil3;

		do {
			targetItem = randFrom(this.currentBucket.items);
		} while (this.currentBucket.usedItems.includes(targetItem));
			this.currentBucket.usedItems.push(targetItem);
		do {
			foil1 = randFrom(this.currentBucket.items);
		} while (targetItem == foil1);
		do {
			foil2 = randFrom(this.currentBucket.items);
		} while (targetItem == foil2 || foil1 == foil2);
		do {
			foil3 = randFrom(this.currentBucket.items);
		} while (targetItem == foil3 || foil1 == foil3 || foil2 == foil3);

		var answerOptions = [targetItem, foil1, foil2, foil3];
		shuffleArray(answerOptions);

		var result = {
			qName: "question-" + this.questionNumber + "-" + targetItem.itemName,
			qNumber: this.questionNumber,
			qTarget: targetItem.itemName,
			promptText: "",
			bucket: this.currentBucket.bucketID,
			promptAudio: targetItem.itemName,
			correct: targetItem.itemText,
			answers: [
				{
					answerName: answerOptions[0].itemName,
					answerText: answerOptions[0].itemText
				},
				{
					answerName: answerOptions[1].itemName,
					answerText: answerOptions[1].itemText
				},
				{
					answerName: answerOptions[2].itemName,
					answerText: answerOptions[2].itemText
				},
				{
					answerName: answerOptions[3].itemName,
					answerText: answerOptions[3].itemText
				}
			]
		};

		this.currentQuestion = result;
		this.questionNumber += 1;
		return result;
	}

	public tryMoveBucket = (nBucket, passed: boolean) => {
		if (this.currentBucket != null) {
			this.currentBucket.passed = passed;
			AnalyticsEvents.sendBucket(this.currentBucket, passed);
		}
		console.log("new  bucket is " + nBucket.bucketID);
		AudioController.PreloadBucket(nBucket, this.app.GetDataURL());
		this.initBucket(nBucket);
	}

	public HasQuestionsLeft = () => {
		//// TODO: check buckets, check if done
		var hasQuestionsLeft = true;

		if (this.currentBucket.passed) return false;
			
		if (this.currentBucket.numCorrect >= 4) {
			//passed this bucket
			console.log("passed this bucket " + this.currentBucket.bucketID);
			
			if (this.currentBucket.bucketID >= this.numBuckets) {
				//passed highest bucket
				console.log("passed highest bucket");
				this.currentBucket.passed = true;
				AnalyticsEvents.sendBucket(this.currentBucket, true);
				UIController.ProgressChest();
				hasQuestionsLeft = false;	
			}
			else {
				//moved up to next bucket
				console.log("moving up bucket");
				if (this.currentNode.right != null){
					//move down to right
					UIController.ProgressChest();
					console.log("moving to right node");
					this.currentNode = this.currentNode.right;
					this.tryMoveBucket(this.currentNode.value, true);
					
				}else{
					// reached root node!!!!
						console.log("reached root node");
						this.currentBucket.passed = true;
						AnalyticsEvents.sendBucket(this.currentBucket, true);
						UIController.ProgressChest();
						hasQuestionsLeft = false;
					// do something here
				}
			}
		} else if (this.currentBucket.numConsecutiveWrong >= 2 || this.currentBucket.numTried >= 5) {
			//failed this bucket
			console.log("failed this bucket " + this.currentBucket.bucketID);
			if (this.currentBucket.bucketID < this.basalBucket) {
				//update basal bucket number
				this.basalBucket = this.currentBucket.bucketID;
			}
			if (this.currentBucket.bucketID <= 1) {
				//failed the lowest bucket
				console.log("failed lowest bucket");
				hasQuestionsLeft = false;
				this.currentBucket.passed = false;
				AnalyticsEvents.sendBucket(this.currentBucket, false);
			}
			else {
				console.log("moving down bucket");
				if (this.currentNode.left != null){
					//move down to left
					console.log("moving to left node");
					this.currentNode = this.currentNode.left;
					this.tryMoveBucket(this.currentNode.value, false);
				} else {
					// reached root node!!!!
					console.log("reached root node");
					hasQuestionsLeft = false;
					this.currentBucket.passed = false;
					AnalyticsEvents.sendBucket(this.currentBucket, false);
					// do something here
				}
			}
		}

		return hasQuestionsLeft;

	}
	
	public override onEnd(): void {
		AnalyticsEvents.sendFinished(this.buckets, this.basalBucket, this.ceilingBucket);
		UIController.ShowEnd();
		this.app.unityBridge.SendClose();
	}
}
