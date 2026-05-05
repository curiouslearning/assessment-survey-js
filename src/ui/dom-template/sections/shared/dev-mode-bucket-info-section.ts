import { createElement, hiddenDisplayStyle, TemplateSection } from '../../assessment-template-engine';

export class DevModeBucketInfoSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    return createElement('div', {
      id: 'devModeBucketInfoContainer',
      style: hiddenDisplayStyle(this.context.sections.devModeBucketInfo),
    });
  }
}
