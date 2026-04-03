import { appendChildren, createElement, TemplateSection } from '../assessment-template-engine';

export class DevModeSettingsModalSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    const modal = createElement('div', {
      id: 'devModeSettingsModal',
      style: this.context.sections.devModeSettingsModal ? undefined : 'display: none',
    });

    const title = createElement('p', {
      style: 'font-size: 26px',
      text: this.context.text.devModeTitle,
    });

    const settingsForm = createElement('form', { id: 'devModeSettingsContainer' });

    const bucketGenerationLabel = createElement('span', {
      className: this.context.classNames.devModeLabel,
      text: this.context.text.bucketGenerationLabel,
    });

    const bucketGenerationSelect = createElement('select', { id: 'devModeBucketGenSelect' });
    bucketGenerationSelect.appendChild(
      createElement('option', {
        attrs: { value: '0' },
        text: this.context.text.randomBucketModeLabel,
      })
    );
    bucketGenerationSelect.appendChild(
      createElement('option', {
        attrs: { value: '1' },
        text: this.context.text.sequentialBucketModeLabel,
      })
    );

    const correctTargetLabel = createElement('span', {
      className: this.context.classNames.devModeLabel,
      text: this.context.text.correctTargetLabel,
    });
    const correctTargetControls = this.createCheckboxRow(
      'devModeCorrectLabelShownCheckbox',
      this.context.text.correctTargetHelpText
    );

    const bucketDetailsLabel = createElement('span', {
      className: this.context.classNames.devModeLabel,
      text: this.context.text.bucketDetailsLabel,
    });
    const bucketDetailsControls = this.createCheckboxRow(
      'devModeBucketInfoShownCheckbox',
      this.context.text.bucketDetailsHelpText
    );

    const bucketControlsLabel = createElement('span', {
      className: this.context.classNames.devModeLabel,
      text: this.context.text.bucketControlsLabel,
    });
    const bucketControls = this.createCheckboxRow(
      'devModeBucketControlsShownCheckbox',
      this.context.text.bucketControlsHelpText
    );

    const animationSpeedLabel = createElement('span', {
      className: this.context.classNames.devModeLabel,
      text: this.context.text.animationSpeedLabel,
    });

    const animationControls = createElement('div', {
      style: 'width: 100%; position: relative',
    });
    const animationRange = createElement('input', {
      id: 'devModeAnimationSpeedMultiplierRange',
      attrs: {
        type: 'range',
        min: '0',
        max: '1',
        value: '1',
        step: '0.1',
      },
    });

    const animationLabels = createElement('div', {
      style: 'display: flex; width: 100%; justify-content: space-between',
    });
    const fasterText = createElement('span', {
      style: 'font-size: 12px',
      text: this.context.text.fasterLabel,
    });
    const animationSpeedValue = createElement('span', {
      id: 'devModeAnimationSpeedMultiplierValue',
      text: '1',
    });
    const slowerText = createElement('span', {
      style: 'font-size: 12px',
      text: this.context.text.slowerLabel,
    });

    appendChildren(animationLabels, [fasterText, animationSpeedValue, slowerText]);
    appendChildren(animationControls, [animationRange, animationLabels]);

    appendChildren(settingsForm, [
      bucketGenerationLabel,
      bucketGenerationSelect,
      correctTargetLabel,
      correctTargetControls,
      bucketDetailsLabel,
      bucketDetailsControls,
      bucketControlsLabel,
      bucketControls,
      animationSpeedLabel,
      animationControls,
    ]);

    appendChildren(modal, [title, settingsForm]);
    return modal;
  }

  private createCheckboxRow(inputId: string, labelText: string): HTMLDivElement {
    const controls = createElement('div', {
      style: 'display: flex; align-items: center; height: 40px; gap: 8px',
    });

    const checkbox = createElement('input', {
      id: inputId,
      attrs: {
        type: 'checkbox',
      },
    });

    const label = createElement('label', {
      attrs: {
        for: inputId,
      },
      text: labelText,
    });

    appendChildren(controls, [checkbox, label]);
    return controls;
  }
}
