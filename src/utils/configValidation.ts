import { AssessmentType, KNOWN_ASSESSMENT_TYPES } from '@assessment/assessment-types';

/**
 * Result of validating a loaded assessment/survey configuration.
 * - `errors`   → fatal: the app cannot build a game from this config and should stop.
 * - `warnings` → non-fatal: the config still loads, but something is suspicious.
 */
export interface ConfigValidationResult {
  errors: string[];
  warnings: string[];
}

/**
 * Validates a parsed assessment/survey config JSON (FM-981, AC2).
 *
 * Fatal errors (block loading): unknown/missing appType; an assessment with no
 * buckets, or a bucket with no items.
 * Warnings (still loads): missing/unrecognized assessmentType; a spelling item
 * with no authored foils (it will fall back to random distractors).
 *
 * The design keeps existing behavior additive: any config that loads today still
 * loads (an unrecognized assessmentType only warns), while configs that would have
 * thrown a cryptic error now fail with a clear, specific message instead.
 */
export function validateAssessmentConfig(data: any): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const appType = data?.appType;
  if (appType !== 'assessment' && appType !== 'survey') {
    errors.push(`Unknown or missing appType ${JSON.stringify(appType)} (expected "assessment" or "survey").`);
    return { errors, warnings }; // nothing else can be validated meaningfully
  }

  if (appType === 'assessment') {
    const assessmentType = data?.assessmentType;
    if (!assessmentType) {
      warnings.push('Missing assessmentType on an assessment config.');
    } else if (!KNOWN_ASSESSMENT_TYPES.includes(assessmentType)) {
      warnings.push(`Unrecognized assessmentType "${assessmentType}" (known: ${KNOWN_ASSESSMENT_TYPES.join(', ')}).`);
    }

    const buckets = data?.buckets;
    if (!Array.isArray(buckets) || buckets.length === 0) {
      errors.push('Assessment config has no buckets.');
    } else {
      buckets.forEach((bucket: any, i: number) => {
        if (!Array.isArray(bucket?.items) || bucket.items.length === 0) {
          errors.push(`Bucket ${bucket?.bucketID ?? i} has no items.`);
        }
      });

      // Spelling-specific content check (soft): authored foils are expected.
      if (assessmentType === AssessmentType.Spelling) {
        const missingFoils = buckets
          .flatMap((bucket: any) => (Array.isArray(bucket?.items) ? bucket.items : []))
          .filter((item: any) => !Array.isArray(item?.foils) || item.foils.length === 0).length;
        if (missingFoils > 0) {
          warnings.push(
            `Spelling config: ${missingFoils} item(s) have no authored foils; they will fall back to random distractors.`
          );
        }
      }
    }
  }

  return { errors, warnings };
}
