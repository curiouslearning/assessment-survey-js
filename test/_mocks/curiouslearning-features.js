const featureFlagsService = {
  init: jest.fn(),
  initialize: jest.fn().mockResolvedValue(undefined),
  isFeatureEnabled: jest.fn().mockReturnValue(false),
  getExperiment: jest.fn().mockReturnValue({}),
  getDynamicConfig: jest.fn().mockReturnValue({}),
  loadFeatures: jest.fn(),
  clearCache: jest.fn(),
  resetForTesting: jest.fn(),
};

module.exports = { featureFlagsService };
