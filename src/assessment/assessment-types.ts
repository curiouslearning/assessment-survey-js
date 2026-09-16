// Known assessment sub-types. Previously these were bare strings scattered in code
// (e.g. `assessmentType === 'spelling'`); this makes the set explicit and reusable.

export const AssessmentType = {
  LetterSounds: 'letter-sounds',
  SightWords: 'sight-words',
  Spelling: 'spelling',
} as const;

export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType];

/** All recognized assessment sub-types, for validation/iteration. */
export const KNOWN_ASSESSMENT_TYPES: readonly string[] = Object.values(AssessmentType);
