import { getAndroidCloseBridge, shouldCloseHostOnCompletion } from '../../src/utils/hostCloseUtils';

describe('Feature: close the CR app screen when a standalone assessment ends', () => {
  const bridge = { closeWebView: jest.fn() };

  it('Given the standalone page in the CR app, When an assessment ends, Then the screen should close', () => {
    expect(shouldCloseHostOnCompletion({ closeHostOnComplete: true, appType: 'assessment', bridge })).toBe(true);
  });

  it('Given an embedded player (e.g. Feed The Monster), When an assessment ends, Then it should NOT close', () => {
    expect(shouldCloseHostOnCompletion({ closeHostOnComplete: false, appType: 'assessment', bridge })).toBe(false);
  });

  it('Given a survey, When it ends, Then it should NOT close', () => {
    expect(shouldCloseHostOnCompletion({ closeHostOnComplete: true, appType: 'survey', bridge })).toBe(false);
  });

  it('Given a plain browser without the Android bridge, When an assessment ends, Then it should NOT close', () => {
    expect(shouldCloseHostOnCompletion({ closeHostOnComplete: true, appType: 'assessment', bridge: null })).toBe(false);
    expect(shouldCloseHostOnCompletion({ closeHostOnComplete: true, appType: 'assessment', bridge: {} })).toBe(false);
  });

  it('Given a window with or without window.Android, When the bridge is read, Then it is returned or null', () => {
    expect(getAndroidCloseBridge({ Android: bridge })).toBe(bridge);
    expect(getAndroidCloseBridge({})).toBeNull();
    expect(getAndroidCloseBridge(undefined)).toBeNull();
  });
});
