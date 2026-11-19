/**
 * CLT-175: when a standalone assessment finishes inside the Curious Reader (CR) Android app, it
 * closes its own WebView screen through the container's existing JS bridge
 * (`window.Android.closeWebView()`), which returns the learner to the CR app home screen.
 * Embedded players (e.g. Feed The Monster, `platform: 'ftm'`) never opt in, and plain browsers have
 * no bridge, so nothing happens there.
 */

/** How long the end screen stays up before closing; also lets queued web analytics flush. */
export const HOST_CLOSE_DELAY_MS = 3000;

/**
 * Longest the close waits for the `completed` analytics event to be confirmed as handed off for
 * sending. Past this (offline, analytics blocked) the screen closes anyway.
 */
export const COMPLETED_ANALYTICS_MAX_WAIT_MS = 5000;

/** Resolves after `delayMs`. */
export function waitFor(delayMs: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, delayMs)));
}

/** The part of the CR container's `window.Android` bridge used to close the screen. */
export interface AndroidCloseBridge {
  closeWebView?: () => void;
}

export interface HostCloseDecisionInput {
  /** Set only by the standalone entry point (`startStandaloneApp`). */
  closeHostOnComplete: boolean;
  appType: string;
  bridge: AndroidCloseBridge | null | undefined;
}

/** True when a finished quiz should close the CR container screen it runs in. */
export function shouldCloseHostOnCompletion({ closeHostOnComplete, appType, bridge }: HostCloseDecisionInput): boolean {
  return closeHostOnComplete && appType === 'assessment' && typeof bridge?.closeWebView === 'function';
}

/** Reads the CR container bridge from a window-like object, if present. */
export function getAndroidCloseBridge(win: { Android?: unknown } | undefined): AndroidCloseBridge | null {
  const candidate = win?.Android;
  if (candidate && typeof candidate === 'object') {
    return candidate as AndroidCloseBridge;
  }
  return null;
}
