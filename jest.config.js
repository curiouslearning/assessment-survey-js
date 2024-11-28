/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'], // Include files for coverage
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80, // Minimum branch coverage %
      functions: 80, // Minimum function coverage %
      lines: 80, // Minimum line coverage %
      statements: 80, // Minimum statement coverage %
    },
  },
};
