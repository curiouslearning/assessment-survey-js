/**
 * Module that wraps Unity calls for sending messages from the webview to Unity.
 */

declare const Unity;

export class UnityBridge {
  private unityReference;

  constructor() {
    if (typeof Unity !== 'undefined') {
      this.unityReference = Unity;
    } else {
      this.unityReference = null;
    }
  }

  public SendMessage(message: string) {
    if (this.unityReference !== null) {
      this.unityReference.call(message);
    }
  }

  public SendLoaded() {
    if (this.unityReference !== null) {
      this.unityReference.call('loaded');
    } else {
      console.log('would call Unity loaded now');
    }
  }

  public SendClose() {
    if (this.unityReference !== null) {
      this.unityReference.call('close');
    } else {
      console.log('would close Unity now');
    }
  }
}
