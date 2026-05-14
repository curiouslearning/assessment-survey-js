import { createElement, TemplateSection } from '../../assessment-template-engine';

export class EndingPageWrapperSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    return createElement('div', {
      id: 'endWrap',
      className: this.context.classNames.endingPageWrapper,
      style: 'display: none',
      text: this.context.text.endingScreenText,
    });
  }
}
