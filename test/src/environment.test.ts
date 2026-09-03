import { resolveEnvironment, resolveBuildBasePath, buildBasePath, environment } from '../../src/environment';

describe('environment', () => {
  describe('resolveEnvironment', () => {
    it('Given NODE_ENV is "production", When resolving the environment, Then it resolves to "production"', () => {
      expect(resolveEnvironment('production')).toBe('production');
    });

    it('Given NODE_ENV is "test", When resolving the environment, Then it resolves to "test"', () => {
      expect(resolveEnvironment('test')).toBe('test');
    });

    it('Given NODE_ENV is "development", When resolving the environment, Then it resolves to "develop"', () => {
      expect(resolveEnvironment('development')).toBe('develop');
    });

    it('Given NODE_ENV is undefined, When resolving the environment, Then it falls back to "develop"', () => {
      expect(resolveEnvironment(undefined)).toBe('develop');
    });

    it('Given NODE_ENV is an unrecognized string, When resolving the environment, Then it falls back to "develop"', () => {
      expect(resolveEnvironment('staging')).toBe('develop');
    });
  });

  describe('resolveBuildBasePath', () => {
    it('Given the environment is "test", When resolving the build base path, Then it is "/assessment-survey-js"', () => {
      expect(resolveBuildBasePath('test')).toBe('/assessment-survey-js');
    });

    it('Given the environment is "develop", When resolving the build base path, Then it is empty', () => {
      expect(resolveBuildBasePath('develop')).toBe('');
    });

    it('Given the environment is "production", When resolving the build base path, Then it is empty', () => {
      expect(resolveBuildBasePath('production')).toBe('');
    });
  });

  describe('buildBasePath (module-level constant)', () => {
    it('Given the test suite always runs with environment "test", When reading buildBasePath, Then it matches resolveBuildBasePath(environment)', () => {
      expect(environment).toBe('test');
      expect(buildBasePath).toBe(resolveBuildBasePath(environment));
      expect(buildBasePath).toBe('/assessment-survey-js');
    });
  });
});
