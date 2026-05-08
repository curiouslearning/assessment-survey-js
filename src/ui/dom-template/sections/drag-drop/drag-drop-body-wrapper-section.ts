import { appendChildren, createElement, joinClassNames, TemplateSection } from '../../assessment-template-engine';
import { LandingPageWrapperSection } from '../shared/landing-page-wrapper-section';
import { EndingPageWrapperSection } from '../shared/ending-page-wrapper-section';
import { DevModeBucketInfoSection } from '../shared/dev-mode-bucket-info-section';
import { DevModeToggleButtonSection } from '../shared/dev-mode-toggle-button-section';
import { DevModeSettingsModalSection } from '../shared/dev-mode-settings-modal-section';
import { DraggableQuestionViewWrapperSection } from './draggable-question-view-wrapper-section';

/**
 * Composes the drag-and-drop gameplay sections into the body wrapper.
 * Uses DraggableQuestionViewWrapperSection which will have its own assets
 * independent of the legacy template.
 */
export class DragDropBodyWrapperSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const bodyWrapper = createElement('div', {
      className: joinClassNames(
        this.context.classNames.bodyWrapper,
        'as-ui-mode-new',
        this.context.hostTheme === 'ftm-dim' ? this.context.classNames.hostThemeFtmDim : undefined
      ),
    });

    appendChildren(bodyWrapper, [
      new LandingPageWrapperSection(this.context).render(),
      new DraggableQuestionViewWrapperSection(this.context).render(),
      this.context.sections.endingScreen ? new EndingPageWrapperSection(this.context).render() : null,
      new DevModeBucketInfoSection(this.context).render(),
      new DevModeToggleButtonSection(this.context).render(),
      new DevModeSettingsModalSection(this.context).render(),
    ]);

    return bodyWrapper;
  }
}
