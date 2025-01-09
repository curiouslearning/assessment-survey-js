import { UIController } from '../../src/components/uiController';
import { qData, answerData } from '../../src/components/questionData';
import { AnalyticsEvents } from '../../src/components/analyticsEvents';
import { App } from '../../src/App';
import { bucket, bucketItem } from '../../src//assessment/bucketData';
import { BaseQuiz } from '../../src/baseQuiz';
import { fetchAssessmentBuckets } from '../../src/components/jsonUtils';
import { TreeNode, sortedArrayToIDsBST } from '../../src/components/tNode';
import { randFrom, shuffleArray } from '../../src/components/mathUtils';
import { AudioController } from '../../src/components/audioController';

enum searchStage {
  BinarySearch,
  LinearSearchUp,
  LinearSearchDown,
}

export enum BucketGenMode {
  RandomBST,
  LinearArrayBased,
}

export class Assessment extends BaseQuiz {
  public HasQuestionsLeft(): boolean {
    throw new Error('Method not implemented.');
  }
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

  public currentLinearBucketIndex: number;
  public currentLinearTargetIndex: number;

  protected bucketGenMode: BucketGenMode = BucketGenMode.RandomBST;

  private MAX_STARS_COUNT_IN_LINEAR_MODE = 20;

  constructor(dataURL: string, unityBridge: any) {
    super();
    this.dataURL = dataURL;
    this.unityBridge = unityBridge;
    this.questionNumber = 0;
    console.log('app initialized');
    this.setupUIHandlers();
  }
  private setupUIHandlers(): void {
    UIController.SetButtonPressAction(this.handleAnswerButtonPress);
    UIController.SetStartAction(this.startAssessment);
    UIController.SetExternalBucketControlsGenerationHandler(this.generateDevModeBucketControlsInContainer);
  }
  public Run(applink: App): void {
    this.app = applink;
    this.buildBuckets(this.bucketGenMode).then((result) => {
      console.log(this.currentBucket);
      this.unityBridge.SendLoaded();
    });
  }

  public handleBucketGenModeChange(event: Event): void {
    this.bucketGenMode = parseInt(this.devModeBucketGenSelect.value) as BucketGenMode;
    this.buildBuckets(this.bucketGenMode).then(() => {
      this.updateBucketInfo();
    });
  }

  public handleCorrectLabelShownChange(): void {
    UIController.getInstance().SetCorrectLabelVisibility(this.isCorrectLabelShown);
  }

  public handleAnimationSpeedMultiplierChange(): void {
    UIController.getInstance().SetAnimationSpeedMultiplier(this.animationSpeedMultiplier);
  }

  public handleBucketInfoShownChange(): void {
    this.updateBucketInfo();
  }

  public handleBucketControlsShownChange(): void {
    UIController.getInstance().SetBucketControlsVisibility(this.isBucketControlsEnabled);
  }

  public generateDevModeBucketControlsInContainer = (container: HTMLElement, clickHandler: () => void) => {
    if (this.isInDevMode && this.bucketGenMode === BucketGenMode.LinearArrayBased) {
      container.innerHTML = '';
      for (let i = 0; i < this.currentBucket.items.length; i++) {
        let item = this.currentBucket.items[i];
        let itemButton = document.createElement('button');
        let index = i;
        itemButton.innerText = item.itemName;
        itemButton.style.margin = '2px';
        itemButton.onclick = () => {
          this.currentLinearTargetIndex = index;
          this.currentBucket.usedItems = [];
          console.log('Clicked on item ' + item.itemName + ' at index ' + this.currentLinearTargetIndex);
          const newQ = this.buildNewQuestion();
          UIController.getInstance().answersContainer.style.visibility = 'hidden';
          for (let b in UIController.getInstance().buttons) {
            UIController.getInstance().buttons[b].style.visibility = 'hidden';
          }
          UIController.getInstance().shown = false;
          UIController.getInstance().nextQuestion = newQ;
          UIController.getInstance().questionsContainer.innerHTML = '';
          UIController.getInstance().questionsContainer.style.display = 'none';
          UIController.ShowQuestion(newQ);
          AudioController.PlayAudio(
            this.buildNewQuestion().promptAudio,
            UIController.getInstance().showOptions,
            UIController.ShowAudioAnimation
          );
        };
        container.append(itemButton);
      }

      let prevButton = document.createElement('button');
      prevButton.innerText = 'Prev Bucket';
      if (this.currentLinearBucketIndex == 0) {
        prevButton.disabled = true;
      }
      prevButton.addEventListener('click', () => {
        if (this.currentLinearBucketIndex > 0) {
          this.currentLinearBucketIndex--;
          this.currentLinearTargetIndex = 0;
          this.tryMoveBucket(false);
          UIController.ReadyForNext(this.buildNewQuestion());
          this.updateBucketInfo();
        }
        if (this.currentLinearBucketIndex == 0) {
          prevButton.disabled = true;
        }
      });

      let nextButton = document.createElement('button');
      nextButton.innerText = 'Next Bucket';
      if (this.currentLinearBucketIndex == this.buckets.length - 1) {
        nextButton.disabled = true;
      }
      nextButton.addEventListener('click', () => {
        if (this.currentLinearBucketIndex < this.buckets.length - 1) {
          this.currentLinearBucketIndex++;
          this.currentLinearTargetIndex = 0;
          this.tryMoveBucket(false);
          UIController.ReadyForNext(this.buildNewQuestion());
          this.updateBucketInfo();
        }
      });

      let buttonsContainer = document.createElement('div');
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.flexDirection = 'row';
      buttonsContainer.style.justifyContent = 'center';
      buttonsContainer.style.alignItems = 'center';
      buttonsContainer.appendChild(prevButton);
      buttonsContainer.appendChild(nextButton);

      container.appendChild(buttonsContainer);
    }
  };

  public updateBucketInfo = () => {
    if (this.currentBucket != null) {
      this.devModeBucketInfoContainer.innerHTML = `Bucket: ${this.currentBucket.bucketID}<br/>Correct: ${this.currentBucket.numCorrect}<br/>Tried: ${this.currentBucket.numTried}<br/>Failed: ${this.currentBucket.numConsecutiveWrong}`;
    }
  };

  public startAssessment = () => {
    UIController.ReadyForNext(this.buildNewQuestion());
    if (this.isInDevMode) {
      this.hideDevModeButton();
    }
  };

  public buildBuckets = async (bucketGenMode: BucketGenMode) => {
    if (this.buckets === undefined || this.buckets.length === 0) {
      const res = fetchAssessmentBuckets(this.app.GetDataURL()).then((result) => {
        this.buckets = result;
        this.numBuckets = result.length;
        this.bucketArray = Array.from(Array(this.numBuckets), (_, i) => i + 1);
        let usedIndices = new Set<number>();
        usedIndices.add(0);
        let rootOfIDs = sortedArrayToIDsBST(
          this.buckets[0].bucketID - 1,
          this.buckets[this.buckets.length - 1].bucketID,
          usedIndices
        );
        let bucketsRoot = this.convertToBucketBST(rootOfIDs, this.buckets);
        this.basalBucket = this.numBuckets + 1;
        this.ceilingBucket = -1;
        this.currentNode = bucketsRoot;
        this.tryMoveBucket(false);
      });
      return res;
    } else {
      if (bucketGenMode === BucketGenMode.RandomBST) {
        return new Promise<void>((resolve, reject) => {
          let usedIndices = new Set<number>();
          usedIndices.add(0);
          let rootOfIDs = sortedArrayToIDsBST(
            this.buckets[0].bucketID - 1,
            this.buckets[this.buckets.length - 1].bucketID,
            usedIndices
          );
          let bucketsRoot = this.convertToBucketBST(rootOfIDs, this.buckets);
          this.basalBucket = this.numBuckets + 1;
          this.ceilingBucket = -1;
          this.currentNode = bucketsRoot;
          this.tryMoveBucket(false);
          resolve();
        });
      } else if (bucketGenMode === BucketGenMode.LinearArrayBased) {
        return new Promise<void>((resolve, reject) => {
          this.currentLinearBucketIndex = 0;
          this.currentLinearTargetIndex = 0;
          this.tryMoveBucket(false);
          resolve();
        });
      }
    }
  };

  public convertToBucketBST = (node: TreeNode, buckets: bucket[]) => {
    if (node === null) return node;

    let bucketId = node.value;
    node.value = buckets.find((bucket) => bucket.bucketID === bucketId);
    if (node.left !== null) node.left = this.convertToBucketBST(node.left, buckets);
    if (node.right !== null) node.right = this.convertToBucketBST(node.right, buckets);

    return node;
  };

  public initBucket = (bucket: bucket) => {
    this.currentBucket = bucket;
    this.currentBucket.usedItems = [];
    this.currentBucket.numTried = 0;
    this.currentBucket.numCorrect = 0;
    this.currentBucket.numConsecutiveWrong = 0;
    this.currentBucket.tested = true;
    this.currentBucket.passed = false;
  };

  public handleAnswerButtonPress = (answer: number, elapsed: number) => {
    if (this.bucketGenMode === BucketGenMode.RandomBST) {
      AnalyticsEvents.sendAnswered(this.currentQuestion, answer, elapsed);
    }
    this.updateCurrentBucketValuesAfterAnswering(answer);
    const isAnswerCorrect = this.currentQuestion.answer.correct === answer;

    if (isAnswerCorrect) {
      UIController.updateFeedbackAfterAnswer(this.bucketGenMode === BucketGenMode.LinearArrayBased, isAnswerCorrect);
      AudioController.playCorrectSound();
    } else {
      UIController.updateFeedbackAfterAnswer(this.bucketGenMode === BucketGenMode.LinearArrayBased, isAnswerCorrect);
      AudioController.playWrongSound();
    }

    if (this.bucketGenMode === BucketGenMode.RandomBST) {
      if (this.currentBucket.numTried >= 1) {
        this.moveToNextBucket();
      }
    }

    if (this.bucketGenMode === BucketGenMode.LinearArrayBased) {
      if (this.currentLinearTargetIndex < this.currentBucket.items.length - 1) {
        this.currentLinearTargetIndex++;
        UIController.ReadyForNext(this.buildNewQuestion());
      } else {
        this.currentLinearBucketIndex++;
        this.currentLinearTargetIndex = 0;
        this.tryMoveBucket(false);
        UIController.ReadyForNext(this.buildNewQuestion());
      }
    }
  };

  public updateCurrentBucketValuesAfterAnswering = (answer: number) => {
    const isAnswerCorrect = this.currentQuestion.answer.correct === answer;
    this.currentBucket.numTried++;

    if (isAnswerCorrect) {
      this.currentBucket.numCorrect++;
      this.currentBucket.numConsecutiveWrong = 0;
    } else {
      this.currentBucket.numConsecutiveWrong++;
    }
  };

  public buildNewQuestion = (): qData => {
    const targetItem = this.currentBucket.items[this.currentLinearTargetIndex];
    const foils = this.generateFoils(this.currentBucket.items, targetItem);
    return new qData(targetItem, foils, this.unityBridge);
  };

  private generateFoils(items: bucketItem[], target: bucketItem): bucketItem[] {
    let foils = shuffleArray(items)
      .filter((item) => item !== target)
      .slice(0, 3);
    foils.push(target);
    return shuffleArray(foils);
  }

  private moveToNextBucket(): void {
    const bucketId = this.currentBucket.bucketID;
    if (this.currentBucket.numConsecutiveWrong >= 2) {
      this.ceilingBucket = Math.min(bucketId, this.ceilingBucket);
      this.tryMoveBucket(false);
    } else if (this.currentBucket.numCorrect >= 2) {
      this.basalBucket = Math.max(bucketId, this.basalBucket);
      this.tryMoveBucket(true);
    }
  }

  private tryMoveBucket(moveDown: boolean): void {
    while (true) {
      const nextNode = moveDown ? this.currentNode.left : this.currentNode.right;
      if (nextNode) {
        this.currentNode = nextNode;
        this.initBucket(this.currentNode.value as bucket);
        break;
      } else {
        UIController.getInstance().EndAssessment();
        break;
      }
    }
  }
}
