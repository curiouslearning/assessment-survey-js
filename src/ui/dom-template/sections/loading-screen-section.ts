import { appendChildren, createElement, TemplateSection } from '../assessment-template-engine';

export class LoadingScreenSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const loadingScreen = createElement('div', { id: 'loadingScreen' });
    const loadingGif = createElement('img', {
      id: 'loading-gif',
      attrs: {
        src: this.context.resolveAsset('img/loadingImg.gif'),
        alt: this.context.text.loadingAltText,
      },
    });
    const progressContainer = createElement('div', { id: 'progressBarContainer' });
    progressContainer.appendChild(createElement('div', { id: 'progressBar' }));

    appendChildren(loadingScreen, [loadingGif, progressContainer]);
    return loadingScreen;
  }
}
