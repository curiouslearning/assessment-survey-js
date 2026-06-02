import { appendChildren, createElement, TemplateSection } from '../../assessment-template-engine';

export class LoadingScreenSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const loadingScreen = createElement('div', {
      id: 'loadingScreen',
      style:
        'position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;z-index:100;background-color:white;flex-direction:column',
    });
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
