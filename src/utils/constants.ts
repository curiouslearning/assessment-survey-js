/**
 * Application-wide constants
 */

export const APP_VERSION = 'v1.1.3';

export const STORAGE_KEYS = {
  FINAL_SCORE: 'assessment_final_score',
} as const;

export const TIMING = {
  LONG_PRESS_DURATION: 3000, // 3 seconds in milliseconds
  QUESTION_END_TIMEOUT_SHORT: 500, // milliseconds
  QUESTION_END_TIMEOUT_LONG: 4000, // milliseconds
  FEEDBACK_DISPLAY_DURATION: 2000, // milliseconds
} as const;

export const ASSESSMENT_TYPES = {
  LETTER_SOUNDS: 'letter-sounds',
  SIGHT_WORDS: 'sight-words',
} as const;

export const ASSESSMENT_DISPLAY_NAMES = {
  LETTER_SOUNDS: 'Letter Sounds',
  SIGHT_WORDS: 'Sight Words',
  DEFAULT: 'Assessment',
} as const;

export const DEV_MODE_INDICATORS = [
  'localhost',
  '127.0.0.1',
  'assessmentdev',
] as const;

export const BUCKET_CONSTANTS = {
  MIN_CORRECT_TO_PASS: 4,
  MAX_TRIES_PER_BUCKET: 5,
  MAX_CONSECUTIVE_WRONG: 2,
  PERFECT_SCORE_MULTIPLIER: 100,
  SCORE_PER_CORRECT: 5, // Used in score calculation: (numCorrect / 5) * 100
} as const;

export const ANIMATION = {
  MIN_SPEED_MULTIPLIER: 0.2,
  DEFAULT_SPEED_MULTIPLIER: 1.0,
} as const;

export const MAX_STARS_IN_LINEAR_MODE = 20;
