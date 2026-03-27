import {
  appendChildren,
  createElement,
  hiddenDisplayStyle,
  joinClassNames,
  type ResolvedTemplateConfig,
  TemplateContext,
  TemplateSection,
} from './dom-template/assessment-template-engine';
import {
  DevModeSettingsModalSection,
  LandingPageWrapperSection,
  QuestionViewWrapperSection,
} from './dom-template/sections';
import type {
  AssessmentSurveyTemplateConfig,
  HostTheme,
  TemplateClassNames,
  TemplateSections,
  TemplateTextOverrides,
} from './dom-template/assessment-template-contracts';
import { normalizeBaseUrl, normalizeHostTheme } from './dom-template/assessment-template-resolvers';

export type {
  AssessmentSurveyTemplateConfig,
  HostTheme,
  TemplateClassNames,
  TemplateSections,
  TemplateTextOverrides,
} from './dom-template/assessment-template-contracts';
export { normalizeBaseUrl, normalizeHostTheme, withBase } from './dom-template/assessment-template-resolvers';

const DEFAULT_SECTIONS: TemplateSections = {
  loadingScreen: true,
  endingScreen: true,
  devModeBucketInfo: true,
  devModeToggleButton: true,
  devModeSettingsModal: true,
};

const DEFAULT_TEXT: TemplateTextOverrides = {
  feedbackText: 'kuyancomeka!',
  endingScreenText: 'click to exit!',
  devModeTitle: 'Dev Mode Settings',
  devModeTogglePrimary: 'Dev',
  devModeToggleSecondary: 'Mode',
  loadingAltText: 'Loading Animation',
  bucketGenerationLabel: 'Assessment bucket generation mode',
  randomBucketModeLabel: 'Randomized Middle Point BST',
  sequentialBucketModeLabel: 'Sequential Array Based',
  correctTargetLabel: 'Show a Label on correct target',
  correctTargetHelpText: 'Show correct label on answer button',
  bucketDetailsLabel: 'Show bucket details on screen',
  bucketDetailsHelpText: 'Show bucket index, tried and passed',
  bucketControlsLabel: 'Enable bucket controls',
  bucketControlsHelpText: 'Enable item buttons, next and prev buckets',
  animationSpeedLabel: 'Animations speed',
  fasterLabel: '<- Faster',
  slowerLabel: 'Slower ->',
};

const DEFAULT_CLASS_NAMES: TemplateClassNames = {
  bodyWrapper: 'bodyWrapper',
  hostThemeFtmDim: 'as-host-theme-ftm-dim',
  landingPageWrapper: 'landingPageWrapper',
  landingMonster: 'landingMonster',
  questionViewWrapper: 'questionViewWrapper',
  starWrapper: 'starWrapper',
  chestWrapper: 'chestWrapper',
  chestDiv: 'chestdiv',
  questionContainer: 'questionContainer',
  answerContainer: 'answerContainer',
  answerButton: 'answerButton',
  nextQuestionInput: 'nextQuestionInput',
  feedbackContainer: 'feedbackContainer',
  feedbackHidden: 'hidden',
  endingPageWrapper: 'endingPageWrapper',
  devModeLabel: 'devModeLabel',
};

/**
 * Builds the stylesheet link node for renderer-managed styles.
 */
class StylesheetLinkSection extends TemplateSection<HTMLLinkElement> {
  public render(): HTMLLinkElement {
    return createElement('link', {
      attrs: {
        rel: 'stylesheet',
        href: this.context.resolveAsset(this.context.stylesheetPath),
      },
    });
  }
}

/**
 * Builds the ending screen wrapper section.
 */
class EndingPageWrapperSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    return createElement('div', {
      id: 'endWrap',
      className: this.context.classNames.endingPageWrapper,
      style: 'display: none',
      text: this.context.text.endingScreenText,
    });
  }
}

/**
 * Builds the optional dev-mode bucket info container.
 */
class DevModeBucketInfoSection extends TemplateSection<HTMLDivElement> {
  public render(): HTMLDivElement {
    return createElement('div', {
      id: 'devModeBucketInfoContainer',
      style: hiddenDisplayStyle(this.context.sections.devModeBucketInfo),
    });
  }
}

/**
 * Builds the dev-mode modal toggle button section.
 */
class DevModeToggleButtonSection extends TemplateSection<HTMLDivElement> {
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

/**
 * Composes all top-level gameplay sections into the body wrapper.
 */
class BodyWrapperSection extends TemplateSection<HTMLDivElement> {
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

/**
 * Orchestrates full template assembly into a document fragment.
 */
class AssessmentSurveyTemplateBuilder {
  constructor(private readonly context: TemplateContext) {}

  /**
   * Builds the complete renderer output as a document fragment.
   */
  public build(): DocumentFragment {
    const fragment = document.createDocumentFragment();

    if (this.context.includeStylesheetLink) {
      fragment.appendChild(new StylesheetLinkSection(this.context).render());
    }

    fragment.appendChild(new BodyWrapperSection(this.context).render());

    return fragment;
  }
}

/**
 * Resolves partial caller config into a full renderable config object.
 */
function resolveTemplateConfig(config: AssessmentSurveyTemplateConfig = {}): ResolvedTemplateConfig {
  return {
    assetBaseUrl: normalizeBaseUrl(config.assetBaseUrl ?? ''),
    hostTheme: normalizeHostTheme(config.hostTheme),
    includeStylesheetLink: config.includeStylesheetLink ?? true,
    stylesheetPath: config.stylesheetPath ?? 'css/style.css',
    rootRelativeAssetPaths: config.rootRelativeAssetPaths ?? true,
    sections: {
      ...DEFAULT_SECTIONS,
      ...(config.sections ?? {}),
    },
    text: {
      ...DEFAULT_TEXT,
      ...(config.text ?? {}),
    },
    classNames: {
      ...DEFAULT_CLASS_NAMES,
      ...(config.classNames ?? {}),
    },
  };
}

/**
 * Builds a full assessment-survey DOM fragment from configuration.
 */
export function buildAssessmentSurveyFragment(config: AssessmentSurveyTemplateConfig = {}): DocumentFragment {
  const resolvedConfig = resolveTemplateConfig(config);
  const context = new TemplateContext(resolvedConfig);
  return new AssessmentSurveyTemplateBuilder(context).build();
}

/**
 * Mounts the generated fragment by replacing all children of a root element.
 */
export function mountAssessmentSurveyFragment(root: HTMLElement, config: AssessmentSurveyTemplateConfig = {}): void {
  root.replaceChildren(buildAssessmentSurveyFragment(config));
}
