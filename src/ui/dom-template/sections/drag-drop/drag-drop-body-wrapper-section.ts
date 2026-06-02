import { appendChildren, createElement, joinClassNames, TemplateSection } from '../../assessment-template-engine';
import { LandingPageWrapperSection } from '../shared/landing-page-wrapper-section';
import { EndingPageWrapperSection } from '../shared/ending-page-wrapper-section';
import { DevModeBucketInfoSection } from '../shared/dev-mode-bucket-info-section';
import { DevModeToggleButtonSection } from '../shared/dev-mode-toggle-button-section';
import { DevModeSettingsModalSection } from '../shared/dev-mode-settings-modal-section';
import { DraggableQuestionViewWrapperSection } from './draggable-question-view-wrapper-section';
import { LoadingScreenSection } from '../shared/loading-screen-section';

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

    // Loading screen is placed at body-wrapper level so `position:absolute` covers
    // the full app viewport (bodyWrapper has position:relative), not just the landing section.
    // LandingPageWrapperSection receives a context with loadingScreen:false to avoid a duplicate #loadingScreen.
    const landingContext = this.context.withSections({ loadingScreen: false });

    if (this.context.sections.loadingScreen) {
      bodyWrapper.appendChild(new LoadingScreenSection(this.context).render());
    }

    appendChildren(bodyWrapper, [
      new LandingPageWrapperSection(landingContext).render(),
      new DraggableQuestionViewWrapperSection(this.context).render(),
      this.context.sections.endingScreen ? new EndingPageWrapperSection(this.context).render() : null,
      new DevModeBucketInfoSection(this.context).render(),
      new DevModeToggleButtonSection(this.context).render(),
      new DevModeSettingsModalSection(this.context).render(),
    ]);

    return bodyWrapper;
  }
}
