import {
  appendChildren,
  createElement,
  START_BUTTON_ICON_SVG,
  TemplateSection,
} from '../assessment-template-engine';
import { LoadingScreenSection } from './loading-screen-section';

export class LandingPageWrapperSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const landingWrapper = createElement('div', {
      id: 'landWrap',
      className: this.context.classNames.landingPageWrapper,
    });

    const landingMonster = createElement('img', {
      className: this.context.classNames.landingMonster,
      attrs: {
        src: this.context.resolveAsset('img/monster.png'),
      },
    });

    const startButton = createElement('button', { id: 'startButton' });
    startButton.innerHTML = START_BUTTON_ICON_SVG.trim();

    appendChildren(landingWrapper, [
      landingMonster,
      document.createElement('br'),
      startButton,
      this.context.sections.loadingScreen ? new LoadingScreenSection(this.context).render() : null,
    ]);

    return landingWrapper;
  }
}
