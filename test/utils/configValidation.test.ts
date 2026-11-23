import { validateAssessmentConfig } from '../../src/utils/configValidation';

// FM-981 AC2: a malformed/missing config produces a clear error/log rather than a
// silent (cryptic) failure. validateAssessmentConfig is the pure core of that:
// fatal problems -> `errors`, suspicious-but-loadable -> `warnings`.

const bucket = (bucketID: number, items: any[]) => ({
  bucketID,
  items,
  usedItems: [],
  numTried: 0,
  numCorrect: 0,
  numConsecutiveWrong: 0,
  tested: false,
  passed: false,
  score: 0,
});

describe('validateAssessmentConfig (FM-981)', () => {
  describe('valid configs → no errors', () => {
    it('accepts a spelling assessment with authored foils', () => {
      const data = {
        appType: 'assessment',
        assessmentType: 'spelling',
        buckets: [bucket(1, [{ itemName: 'uwa', itemText: 'uwa', foils: ['iwa', 'uva', 'uaw'] }])],
      };
      expect(validateAssessmentConfig(data)).toEqual({ errors: [], warnings: [] });
    });

    it('accepts a letter-sounds assessment (no foils, no warnings)', () => {
      const data = {
        appType: 'assessment',
        assessmentType: 'letter-sounds',
        buckets: [bucket(1, [{ itemName: 'h', itemText: 'h' }])],
      };
      expect(validateAssessmentConfig(data)).toEqual({ errors: [], warnings: [] });
    });

    it('accepts a survey config', () => {
      const data = { appType: 'survey', questions: [{ promptText: 'hi' }] };
      expect(validateAssessmentConfig(data).errors).toEqual([]);
    });
  });

  describe('fatal errors → block loading', () => {
    it('flags a missing appType', () => {
      const result = validateAssessmentConfig({});
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/appType/);
    });

    it('flags an unknown appType', () => {
      const result = validateAssessmentConfig({ appType: 'quiz' });
      expect(result.errors[0]).toMatch(/quiz/);
    });

    it('flags an assessment with no buckets', () => {
      const result = validateAssessmentConfig({ appType: 'assessment', assessmentType: 'spelling' });
      expect(result.errors).toContain('Assessment config has no buckets.');
    });

    it('flags an assessment with an empty buckets array', () => {
      const result = validateAssessmentConfig({ appType: 'assessment', assessmentType: 'spelling', buckets: [] });
      expect(result.errors).toContain('Assessment config has no buckets.');
    });

    it('flags a bucket that has no items (naming the bucketID)', () => {
      const data = { appType: 'assessment', assessmentType: 'spelling', buckets: [bucket(7, [])] };
      const result = validateAssessmentConfig(data);
      expect(result.errors).toContain('Bucket 7 has no items.');
    });
  });

  describe('warnings → still loads', () => {
    it('warns (does not error) on a missing assessmentType', () => {
      const data = { appType: 'assessment', buckets: [bucket(1, [{ itemName: 'a', itemText: 'a' }])] };
      const result = validateAssessmentConfig(data);
      expect(result.errors).toEqual([]);
      expect(result.warnings.some((w) => /assessmentType/.test(w))).toBe(true);
    });

    it('warns (does not error) on an unrecognized assessmentType', () => {
      const data = { appType: 'assessment', assessmentType: 'phonics', buckets: [bucket(1, [{ itemName: 'a', itemText: 'a' }])] };
      const result = validateAssessmentConfig(data);
      expect(result.errors).toEqual([]);
      expect(result.warnings.some((w) => /phonics/.test(w))).toBe(true);
    });

    it('warns on a spelling item with no authored foils (falls back to random)', () => {
      const data = {
        appType: 'assessment',
        assessmentType: 'spelling',
        buckets: [bucket(1, [{ itemName: 'uwa', itemText: 'uwa', foils: ['iwa', 'uva', 'uaw'] }, { itemName: 'ba', itemText: 'ba' }])],
      };
      const result = validateAssessmentConfig(data);
      expect(result.errors).toEqual([]);
      expect(result.warnings.some((w) => /foils/.test(w))).toBe(true);
    });
  });
});
