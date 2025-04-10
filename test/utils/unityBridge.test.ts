import { UnityBridge } from '../../src/utils/unityBridge';

describe('UnityBridge Class', () => {
  let unityBridge: UnityBridge;

  beforeEach(() => {
    // Clear the global Unity mock and reinitialize UnityBridge
    (global as any).Unity = {
      call: jest.fn(),
    };
    unityBridge = new UnityBridge();
  });

  afterEach(() => {
    // Clean up the global Unity mock
    delete (global as any).Unity;
    jest.clearAllMocks();
  });

  test('constructor assigns Unity reference when Unity is defined', () => {
    expect((global as any).Unity).toBeDefined();
    expect(unityBridge).toHaveProperty('unityReference', (global as any).Unity);
  });

  test('constructor assigns null Unity reference when Unity is undefined', () => {
    delete (global as any).Unity;
    const localUnityBridge = new UnityBridge();
    expect(localUnityBridge).toHaveProperty('unityReference', null);
  });

  test('SendMessage calls Unity.call if Unity reference exists', () => {
    const message = 'Test Message';
    unityBridge.SendMessage(message);
    expect((global as any).Unity.call).toHaveBeenCalledWith(message);
  });

  test('SendMessage does not call Unity.call if Unity reference is null', () => {
    delete (global as any).Unity;
    const localUnityBridge = new UnityBridge();
    localUnityBridge.SendMessage('Test Message');
    expect((global as any).Unity?.call).toBeUndefined();
  });

  test('SendLoaded calls Unity.call with "loaded" if Unity reference exists', () => {
    unityBridge.SendLoaded();
    expect((global as any).Unity.call).toHaveBeenCalledWith('loaded');
  });

  test('SendLoaded logs message when Unity reference is null', () => {
    console.log = jest.fn();
    delete (global as any).Unity;

    const localUnityBridge = new UnityBridge();
    localUnityBridge.SendLoaded();
    expect(console.log).toHaveBeenCalledWith('would call Unity loaded now');
  });

  test('SendClose calls Unity.call with "close" if Unity reference exists', () => {
    unityBridge.SendClose();
    expect((global as any).Unity.call).toHaveBeenCalledWith('close');
  });

  test('SendClose logs message when Unity reference is null', () => {
    console.log = jest.fn();
    delete (global as any).Unity;

    const localUnityBridge = new UnityBridge();
    localUnityBridge.SendClose();
    expect(console.log).toHaveBeenCalledWith('would close Unity now');
  });
});
