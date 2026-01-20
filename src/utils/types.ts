/**
 * Shared TypeScript type definitions and interfaces
 */

import { bucket } from '../assessment/bucketData';
import { qData } from '../components/questionData';

/**
 * Assessment score data stored in localStorage
 */
export interface ScoreData {
  score: number;
  maxScore: number;
  assessmentName: string;
  scoreConfirmed: boolean;
  timestamp: number;
}

/**
 * Assessment configuration loaded from JSON
 */
export interface AssessmentConfig {
  quizName: string;
  appType: 'assessment' | 'survey';
  assessmentType?: string;
  feedbackText: string;
  contentVersion: string;
  buckets?: bucket[];
  questions?: unknown[];
}

/**
 * Assessment completion event data
 */
export interface AssessmentCompletionData {
  score: number;
  maxScore: number;
  basalBucket: number;
  ceilingBucket: number;
  buckets: bucket[];
  nextAssessment?: string;
  requiredScore?: number;
}

/**
 * Android WebView interface
 */
export interface AndroidWebViewInterface {
  vibrate?: (duration: number) => void;
  disableBackButton?: (disabled: boolean) => void;
  cachedStatus?: (isCached: boolean) => void;
}

/**
 * Extended window interface with Android bridge
 */
declare global {
  interface Window {
    Android?: AndroidWebViewInterface;
  }
}

/**
 * App data structure
 */
export interface AppData extends AssessmentConfig {
  [key: string]: unknown;
}

/**
 * Question builder options
 */
export interface QuestionBuilderOptions {
  targetItem: bucket['items'][0];
  foils: bucket['items'];
  questionNumber: number;
  currentBucket: bucket;
}
