/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'], // Include files for coverage
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFiles: ['./jest.setup.js'],
  coverageThreshold: {
    global: {
      branches: 80, // Minimum branch coverage %
      functions: 80, // Minimum function coverage %
      lines: 80, // Minimum line coverage %
      statements: 80, // Minimum statement coverage %
    },
  },
};
