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
                    draggable: 'false',
                },
            })
        );

        chestWrapper.appendChild(chestDiv);

        // Starts hidden (same token as feedbackWrap) — Sentence Reading (FM-999 spike) fades
        // it in/out in the same slot as the feedback box; every other assessment type keeps
        // it permanently display:none (see DragDropAssessmentUI.prepareQuestion).
        const questionContainer = createElement('div', {
            id: 'qWrap',
            className: joinClassNames(this.context.classNames.questionContainer, this.context.classNames.feedbackHidden),
        });

        const answerContainer = createElement('div', {
            id: 'aWrap',
            className: this.context.classNames.answerContainer,
            style: 'grid-template-columns: repeat(4, minmax(0, 1fr)); min-height: unset; margin-top:25px;',
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

        // Sentence prompt (Sentence Reading) and feedback both overlay the audio button —
        // placed inside nextQuestionInput so they can be absolutely positioned on top of
        // #pbutton and crossfade in the same slot instead of shifting layout.
        nextQuestionInput.appendChild(questionContainer);
        nextQuestionInput.appendChild(feedbackContainer);
        controlsContainer.appendChild(nextQuestionInput);

        // Layout order: audio button (+ question/feedback overlay) → options (single row) → treasure chest
        appendChildren(questionViewWrapper, [
            controlsContainer,
            answerContainer,
            chestWrapper,
        ]);

        return questionViewWrapper;
    }
}
