interface ICacheModel {
    appName: string;
    contentFilePath: string;
    audioVisualResources: Set<string>;
}
declare class CacheModel implements ICacheModel {
    appName: string;
    contentFilePath: string;
    audioVisualResources: Set<string>;
    constructor(appName: string, contentFilePath: string, audioVisualResources: Set<string>);
    setAppName(appName: string): void;
    setContentFilePath(contentFilePath: string): void;
    setAudioVisualResources(audioVisualResources: Set<string>): void;
    addItemToAudioVisualResources(item: string): void;
}
export default CacheModel;
