/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@curiouslearning/analytics$': '<rootDir>/node_modules/@curiouslearning/analytics/dist/index.js',
    '^@curiouslearning/core$': '<rootDir>/test/_mocks/curiouslearning-core.js',
    '^@analytics/(.*)$': '<rootDir>/src/analytics/$1',
    '^@assessment/(.*)$': '<rootDir>/src/assessment/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@configs/(.*)$': '<rootDir>/src/config/$1',
    '^@survey/(.*)$': '<rootDir>/src/survey/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
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
