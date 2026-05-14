// Shared sections — used by both legacy and new-ui body wrappers
export { LandingPageWrapperSection } from './shared/landing-page-wrapper-section';
export { LoadingScreenSection } from './shared/loading-screen-section';
export { DevModeSettingsModalSection } from './shared/dev-mode-settings-modal-section';
export { EndingPageWrapperSection } from './shared/ending-page-wrapper-section';
export { DevModeBucketInfoSection } from './shared/dev-mode-bucket-info-section';
export { DevModeToggleButtonSection } from './shared/dev-mode-toggle-button-section';

// Legacy sections — click-based interaction; do not modify for new-ui work
export { QuestionViewWrapperSection } from './legacy/question-view-wrapper-section';
export { LegacyBodyWrapperSection } from './legacy/legacy-body-wrapper-section';

// Drag-drop sections — drag-and-drop interaction
export { DraggableQuestionViewWrapperSection } from './drag-drop/draggable-question-view-wrapper-section';
export { DragDropBodyWrapperSection } from './drag-drop/drag-drop-body-wrapper-section';