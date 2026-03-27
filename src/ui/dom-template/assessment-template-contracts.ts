export type HostTheme = 'default' | 'ftm-dim';

export type TemplateSections = {
  loadingScreen: boolean;
  endingScreen: boolean;
  devModeBucketInfo: boolean;
  devModeToggleButton: boolean;
  devModeSettingsModal: boolean;
};

export type TemplateTextOverrides = {
  feedbackText: string;
  endingScreenText: string;
  devModeTitle: string;
  devModeTogglePrimary: string;
  devModeToggleSecondary: string;
  loadingAltText: string;
  bucketGenerationLabel: string;
  randomBucketModeLabel: string;
  sequentialBucketModeLabel: string;
  correctTargetLabel: string;
  correctTargetHelpText: string;
  bucketDetailsLabel: string;
  bucketDetailsHelpText: string;
  bucketControlsLabel: string;
  bucketControlsHelpText: string;
  animationSpeedLabel: string;
  fasterLabel: string;
  slowerLabel: string;
};

export type TemplateClassNames = {
  bodyWrapper: string;
  hostThemeFtmDim: string;
  landingPageWrapper: string;
  landingMonster: string;
  questionViewWrapper: string;
  starWrapper: string;
  chestWrapper: string;
  chestDiv: string;
  questionContainer: string;
  answerContainer: string;
  answerButton: string;
  nextQuestionInput: string;
  feedbackContainer: string;
  feedbackHidden: string;
  endingPageWrapper: string;
  devModeLabel: string;
};

export interface AssessmentSurveyTemplateConfig {
  assetBaseUrl?: string;
  hostTheme?: HostTheme | string | null;
  includeStylesheetLink?: boolean;
  stylesheetPath?: string;
  rootRelativeAssetPaths?: boolean;
  sections?: Partial<TemplateSections>;
  text?: Partial<TemplateTextOverrides>;
  classNames?: Partial<TemplateClassNames>;
}
