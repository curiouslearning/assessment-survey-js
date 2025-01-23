import CacheModel from '../../src/components/cacheModel';

describe('CacheModel', () => {
  let cacheModel: CacheModel;
  const mockAppName = 'TestApp';
  const mockContentFilePath = '/path/to/content/file';
  const mockAudioVisualResources = new Set<string>(['resource1', 'resource2']);

  beforeEach(() => {
    cacheModel = new CacheModel(mockAppName, mockContentFilePath, mockAudioVisualResources);
  });

  it('should initialize properties correctly via the constructor', () => {
    expect(cacheModel.appName).toBe(mockAppName);
    expect(cacheModel.contentFilePath).toBe(mockContentFilePath);
    expect(cacheModel.audioVisualResources).toEqual(mockAudioVisualResources);
  });

  it('should set a new app name using setAppName()', () => {
    const newAppName = 'UpdatedApp';
    cacheModel.setAppName(newAppName);
    expect(cacheModel.appName).toBe(newAppName);
  });

  it('should set a new content file path using setContentFilePath()', () => {
    const newContentFilePath = '/new/path/to/content';
    cacheModel.setContentFilePath(newContentFilePath);
    expect(cacheModel.contentFilePath).toBe(newContentFilePath);
  });

  it('should replace audio visual resources using setAudioVisualResources()', () => {
    const newResources = new Set<string>(['newResource1', 'newResource2']);
    cacheModel.setAudioVisualResources(newResources);
    expect(cacheModel.audioVisualResources).toEqual(newResources);
  });

  it('should add a new item to audioVisualResources if it does not exist', () => {
    const newItem = 'resource3';
    cacheModel.addItemToAudioVisualResources(newItem);
    expect(cacheModel.audioVisualResources.has(newItem)).toBe(true);
  });

  it('should not add a duplicate item to audioVisualResources', () => {
    const duplicateItem = 'resource1'; // Already in the initial resources
    const initialSize = cacheModel.audioVisualResources.size;
    cacheModel.addItemToAudioVisualResources(duplicateItem);
    expect(cacheModel.audioVisualResources.size).toBe(initialSize);
  });
});
