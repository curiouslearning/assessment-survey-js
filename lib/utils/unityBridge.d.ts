/**
 * Module that wraps Unity calls for sending messages from the webview to Unity.
 */
export declare class UnityBridge {
    private unityReference;
    constructor();
    SendMessage(message: string): void;
    SendLoaded(): void;
    SendClose(): void;
}
