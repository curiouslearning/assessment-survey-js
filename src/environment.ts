export type Environment = 'develop' | 'test' | 'production';

/**
 * Pure resolver: maps the raw `NODE_ENV` build/run signal onto the library's own 3-way
 * `Environment` classification. Any unrecognized or missing value safely falls back to
 * `develop` rather than throwing or resolving to an empty/undefined value.
 */
export function resolveEnvironment(nodeEnv: string | undefined): Environment {
  switch (nodeEnv) {
    case 'production':
      return 'production';
    case 'test':
      return 'test';
    default:
      return 'develop';
  }
}

export const environment: Environment = resolveEnvironment(process.env.NODE_ENV);

/**
 * Pure resolver: the shared bucket that `test`-mode builds deploy to serves this project under
 * an `/assessment-survey-js` sub-path rather than its own root, so test-mode builds need their
 * own assets referenced under that same prefix. `develop`/`production` keep serving from their
 * existing dedicated buckets' roots and need no prefix.
 */
export function resolveBuildBasePath(env: Environment): string {
  return env === 'test' ? '/assessment-survey-js' : '';
}

export const buildBasePath: string = resolveBuildBasePath(environment);
