import {
    appendChildren,
    createElement,
    joinClassNames,
    TemplateSection,
} from '../../assessment-template-engine';

export class DraggableQuestionViewWrapperSection extends TemplateSection<HTMLDivElement> {
    public render(): HTMLDivElement {
        const questionViewWrapper = createElement('div', {
            id: 'gameWrap',
            className: this.context.classNames.questionViewWrapper,
            style: 'display: none',
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
                    src: this.context.resolveAsset('img/chestprogression/TreasureChestOpen01-new.svg'),
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
            style: 'grid-template-columns: repeat(4, minmax(0, 1fr)); min-height: unset; margin-top: 0;',
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

        // Feedback overlays the audio button — placed inside nextQuestionInput so
        // it can be absolutely positioned on top of #pbutton.
        nextQuestionInput.appendChild(feedbackContainer);
        controlsContainer.appendChild(nextQuestionInput);

        // Layout order: audio button (+ feedback overlay) → question → options (single row) → treasure chest
        appendChildren(questionViewWrapper, [
            controlsContainer,
            questionContainer,
            answerContainer,
            chestWrapper,
        ]);

        return questionViewWrapper;
    }
}
