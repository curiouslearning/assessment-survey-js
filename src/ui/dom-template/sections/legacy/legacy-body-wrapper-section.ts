import { appendChildren, createElement, joinClassNames, TemplateSection } from '../../assessment-template-engine';
import { LandingPageWrapperSection } from '../shared/landing-page-wrapper-section';
import { EndingPageWrapperSection } from '../shared/ending-page-wrapper-section';
import { DevModeBucketInfoSection } from '../shared/dev-mode-bucket-info-section';
import { DevModeToggleButtonSection } from '../shared/dev-mode-toggle-button-section';
import { DevModeSettingsModalSection } from '../shared/dev-mode-settings-modal-section';
import { QuestionViewWrapperSection } from './question-view-wrapper-section';

/**
 * Composes the legacy (click-based) gameplay sections into the body wrapper.
 */
export class LegacyBodyWrapperSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const bodyWrapper = createElement('div', {
      className:
        this.context.hostTheme === 'ftm-dim'
          ? joinClassNames(this.context.classNames.bodyWrapper, this.context.classNames.hostThemeFtmDim)
          : this.context.classNames.bodyWrapper,
    });

    appendChildren(bodyWrapper, [
      new LandingPageWrapperSection(this.context).render(),
      new QuestionViewWrapperSection(this.context).render(),
      this.context.sections.endingScreen ? new EndingPageWrapperSection(this.context).render() : null,
      new DevModeBucketInfoSection(this.context).render(),
      new DevModeToggleButtonSection(this.context).render(),
      new DevModeSettingsModalSection(this.context).render(),
    ]);

    return bodyWrapper;
  }
}
