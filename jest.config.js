/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@curiouslearning/analytics$': '<rootDir>/node_modules/@curiouslearning/analytics/dist/index.js',
  },

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFiles: ['./jest.setup.js'],
  coverageThreshold: {
    // global: {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
  },
};
