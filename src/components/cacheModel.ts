// Interface that gets passed around the app components to gather all requried resources
// and that gets sent to the service worker for caching

interface ICacheModel {
    appName: string;
    contentFilePath: string;
    audioVisualResources: Set<string>;
}

class CacheModel implements ICacheModel {
    appName: string;
    contentFilePath: string;
    audioVisualResources: string[];

    constructor(appName: string, contentFilePath: string, audioVisualResources: string[]) {
        this.appName = appName;
        this.contentFilePath = contentFilePath;
        this.audioVisualResources = audioVisualResources;
    }

    public setAppName(appName: string) {
        this.appName = appName;
    }

    public setContentFilePath(contentFilePath: string) {
        this.contentFilePath = contentFilePath;
    }

    public setAudioVisualResources(audioVisualResources: string[]) {
        this.audioVisualResources = audioVisualResources;
    }
}

export default CacheModel;

