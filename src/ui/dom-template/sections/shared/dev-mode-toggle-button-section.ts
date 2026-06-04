import { appendChildren, createElement, hiddenDisplayStyle, TemplateSection } from '../../assessment-template-engine';

export class DevModeToggleButtonSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const toggleContainer = createElement('div', {
      id: 'devModeModalToggleButtonContainer',
      style: hiddenDisplayStyle(this.context.sections.devModeToggleButton),
    });

    const toggleButton = createElement('button', {
      id: 'devModeModalToggleButton',
    });

    appendChildren(toggleButton, [
      document.createTextNode(this.context.text.devModeTogglePrimary),
      document.createElement('br'),
      document.createTextNode(this.context.text.devModeToggleSecondary),
    ]);

    toggleContainer.appendChild(toggleButton);
    return toggleContainer;
  }
}
