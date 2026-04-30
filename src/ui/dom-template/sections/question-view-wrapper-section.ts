import {
  appendChildren,
  createElement,
  joinClassNames,
  TemplateSection,
} from '../assessment-template-engine';

export class QuestionViewWrapperSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const questionViewWrapper = createElement('div', {
      id: 'gameWrap',
      className: this.context.classNames.questionViewWrapper,
      style: 'display: none',
    });

    const starWrapper = createElement('div', {
      id: 'starWrapper',
      className: this.context.classNames.starWrapper,
    });

    const chestWrapper = createElement('div', {
      className: this.context.classNames.chestWrapper,
    });
    const chestDiv = createElement('div', {
      className: this.context.classNames.chestDiv,
    });
    chestDiv.appendChild(
      createElement('img', {
        id: 'chestImage',
        attrs: {
          src: this.context.resolveAsset('img/chestprogression/TreasureChestOpen01.svg'),
        },
      })
    );
    chestWrapper.appendChild(chestDiv);

    const questionContainer = createElement('div', {
      id: 'qWrap',
      className: this.context.classNames.questionContainer,
    });

    const answerContainer = createElement('div', {
      id: 'aWrap',
      className: this.context.classNames.answerContainer,
    });

    for (let index = 1; index <= 6; index += 1) {
      answerContainer.appendChild(
        createElement('div', {
          id: `answerButton${index}`,
          className: this.context.classNames.answerButton,
          text: String(index),
          style: index > 4 ? 'display: none' : undefined,
        })
      );
    }

    const controlsContainer = createElement('div');
    const nextQuestionInput = createElement('div', {
      className: this.context.classNames.nextQuestionInput,
    });
    nextQuestionInput.appendChild(createElement('div', { id: 'pbutton' }));

    const feedbackContainer = createElement('div', {
      id: 'feedbackWrap',
      className: joinClassNames(this.context.classNames.feedbackContainer, this.context.classNames.feedbackHidden),
      text: this.context.text.feedbackText,
    });

    appendChildren(controlsContainer, [nextQuestionInput, feedbackContainer]);

    appendChildren(questionViewWrapper, [starWrapper, chestWrapper, questionContainer, answerContainer, controlsContainer]);

    return questionViewWrapper;
  }
}
