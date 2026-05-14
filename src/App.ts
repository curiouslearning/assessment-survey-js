/**
 * App class that represents an entry point of the application.
 */
import { getUUID, getUserSource, getDataFile, getAppLanguageFromDataURL, getAppTypeFromDataURL, configureRuntimeConfig } from '@utils/urlUtils';
import { Survey } from '@survey/survey';
import { Assessment } from '@assessment/assessment';
import { UnityBridge } from '@utils/unityBridge';
import { BaseQuiz } from './baseQuiz';
import { fetchAppData, getDataURL, setDataBaseUrl } from '@utils/jsonUtils';
import { resolveAssetPath, setAssetBaseUrl } from '@utils/assetUtils';
import { Workbox } from 'workbox-window';
import CacheModel from '@components/cacheModel';
import { UIController } from '@ui/uiController';
import { AnalyticsEventsType, AnalyticsIntegration } from '@analytics/analytics-integration';
import { AnalyticsConfig } from '@analytics/base-analytics-integration';
import { AndroidInterface } from '@curiouslearning/core';
import { getLocation, getCommonAnalyticsEventsProperties, setCommonAnalyticsEventsProperties, setLocationProperty } from '@utils/AnalyticsUtils';
import { ASSET_PATHS } from '@configs/assetsPaths';
import { AssessmentUI } from '@ui/assessment-ui';
import { LegacyAssessmentUIAdapter } from '@ui/legacy';
import { DragDropAssessmentUI } from '@ui/drag-drop';
import { featureFlagsService } from '@curiouslearning/features';
import { mountAssessmentSurveyFragment } from '@ui/dom-template';
import type { AssessmentSurveyTemplateConfig } from '@ui/dom-template';

export type AssessmentUIMode = 'legacy' | 'new-ui';

/** Feature flag key that enables the drag-and-drop assessment UI at runtime. */
export const FEATURE_DRAG_DROP_UI = 'drag-drop-assessment-ui';

const appVersion: string = 'v1.1.3';

/**
 * Content version from the data file in format v0.1
 * Gets set when the content is loaded
 */
let contentVersion: string = '';

const broadcastChannel: BroadcastChannel = new BroadcastChannel('as-message-channel');

export interface AppStartupConfig {
  dataURL?: string;
  dataBaseUrl?: string;
  enableServiceWorker?: boolean;
  waitForWindowLoad?: boolean;
  skipLoadingScreen?: boolean;
  skipStartScreen?: boolean;
  uiRoot?: Document | ShadowRoot | HTMLElement;
  assetBaseUrl?: string;
  enableUnityBridge?: boolean;
  enableAndroidSummary?: boolean;
  enableParentPostMessage?: boolean;
  userId?: string;
  userSource?: string;
  requiredScore?: string;
  nextAssessment?: string;
  endpoint?: string;
  organization?: string;
  hostIntegrationAdapters?: HostIntegrationAdapters;
  analyticsConfig?: AnalyticsConfig;
  assessmentUIMode?: AssessmentUIMode;
  platform?: string;
  templateConfig?: Omit<AssessmentSurveyTemplateConfig, 'assessmentUIMode'>;
}

export interface SummaryData {
  app_type: string;
  score: number;
  time_spent: number;
}

export interface AssessmentCompletedPayload {
  type: 'assessment_completed';
  score: number;
}

export interface HostIntegrationAdapters {
  onLoaded?: () => void;
  onClose?: () => void;
  onSummaryData?: (summary: SummaryData) => void;
  onComplete?: (payload: AssessmentCompletedPayload) => void;
  onRewardTrigger?: (payload: AssessmentCompletedPayload) => void;
  onAssessmentCompleted?: (payload: AssessmentCompletedPayload) => void;
}

export class App {
  /** Could be 'assessment' or 'survey' based on the data file */
  public dataURL: string;

  public unityBridge;
  public analytics;
  public game: BaseQuiz;
  public analyticsIntegration: AnalyticsIntegration;
  cacheModel: CacheModel;
  public enableServiceWorker: boolean;
  public enableUnityBridge: boolean;
  public enableAndroidSummary: boolean;
  public enableParentPostMessage: boolean;
  public hostIntegrationAdapters: HostIntegrationAdapters;
  public assessmentUIMode: AssessmentUIMode;
  private readonly configuredUIMode: AssessmentUIMode | undefined;
  private assessmentUI: AssessmentUI;
  private uiRoot: Document | ShadowRoot | HTMLElement = document;
  private templateConfig: Omit<AssessmentSurveyTemplateConfig, 'assessmentUIMode'> = {};

  lang: string = 'english';

  constructor(config: AppStartupConfig = {}) {
    this.applyRuntimeConfig(config);
    this.applyHostIntegrationConfig(config);

    if (config.uiRoot) {
      this.uiRoot = config.uiRoot;
      // UIController.ConfigureRoot is called in spinUp() after the template is mounted.
    }

    this.configuredUIMode = config.assessmentUIMode;
    this.assessmentUIMode = config.assessmentUIMode ?? 'legacy';
    this.templateConfig = config.templateConfig ?? {};
    // Safe no-op placeholder — spinUp() resolves the final mode (config + flag)
    // and replaces this after mounting the template.
    this.assessmentUI = new LegacyAssessmentUIAdapter();

    this.unityBridge = this.enableUnityBridge ? new UnityBridge() : App.createNoopUnityBridge();

    console.log('Initializing app...');

    this.dataURL = config.dataURL ?? getDataFile();
    this.enableServiceWorker = config.enableServiceWorker ?? true;
    this.cacheModel = new CacheModel(this.dataURL, this.dataURL, new Set<string>());
  }

  public async spinUp(config: AppStartupConfig = {}) {
    this.applyRuntimeConfig(config);
    this.applyHostIntegrationConfig(config);

    const waitForWindowLoad = config.waitForWindowLoad ?? true;
    const skipLoadingScreen = config.skipLoadingScreen ?? false;
    const skipStartScreen = config.skipStartScreen ?? false;
    this.enableServiceWorker = config.enableServiceWorker ?? this.enableServiceWorker;

    if (config.analyticsConfig) {
      try {
        await AnalyticsIntegration.initializeAnalytics(config.analyticsConfig);
        this.analyticsIntegration = AnalyticsIntegration.getInstance();
      } catch (error) {
        console.warn('Analytics initialization failed. Continuing without analytics.', error);
      }
    }

    try {
      console.log('Initializing feature flags... With user:', {
        userID: config.userId ?? getUUID(),
        platform: config.platform ?? 'standalone',
      });
      featureFlagsService.init({ user: { userID: config.userId ?? getUUID(), custom: { platform: config.platform ?? 'standalone' } } });
      await featureFlagsService.initialize();
    } catch (error) {
      console.warn('Feature flags initialization failed. Continuing with defaults.', error);
    }

    // Resolve mode once — this single value drives both the template and the controller.
    this.assessmentUIMode = this.resolveAssessmentUIMode();
    this.applyUIStylesheet();

    // Mount template now that the mode is known, then wire UIController to the new DOM.
    if (this.uiRoot instanceof HTMLElement) {
      mountAssessmentSurveyFragment(this.uiRoot, {
        ...this.templateConfig,
        assessmentUIMode: this.assessmentUIMode,
      });
      UIController.ConfigureRoot(this.uiRoot);
    }

    // Controller uses the same resolved mode — no independent flag check.
    this.assessmentUI.dispose?.();
    this.assessmentUI = this.createAssessmentUI();
    this.assessmentUI.setGameReady(false);
    this.assessmentUI.setSkipStartScreen(skipStartScreen);

    if (skipLoadingScreen) {
      this.assessmentUI.setLoadingVisible(false);
    }

    const initialize = async () => {
      console.log('Window Loaded!');
      try {
        await this.initializeGame();
      } catch (error) {
        console.error('Failed to initialize game data:', error);
        this.assessmentUI.setLoadingVisible(false);
        this.assessmentUI.setContentLoaded(true);
        return;
      }

      if (skipLoadingScreen) {
        localStorage.setItem(this.cacheModel.appName, 'true');
        this.assessmentUI.setLoadingProgress(100);
        this.assessmentUI.setLoadingVisible(false);
        this.assessmentUI.setContentLoaded(true);
      }

      if (this.enableServiceWorker) {
        await this.registerServiceWorker(this.game, this.dataURL, skipLoadingScreen);
      } else {
        localStorage.setItem(this.cacheModel.appName, 'true');
        this.assessmentUI.setLoadingVisible(false);
        this.assessmentUI.setContentLoaded(true);
      }
    };

    if (!waitForWindowLoad || document.readyState === 'complete') {
      await initialize();
      return;
    }

    window.addEventListener('load', () => {
      initialize();
    });
  }

  private static createNoopUnityBridge() {
    return {
      SendMessage: (_message: string) => { },
      SendLoaded: () => { },
      SendClose: () => { },
    };
  }

  private applyRuntimeConfig(config: AppStartupConfig): void {
    if (typeof setAssetBaseUrl === 'function') {
      setAssetBaseUrl(config.assetBaseUrl ?? '');
    }
    if (typeof setDataBaseUrl === 'function') {
      setDataBaseUrl(config.dataBaseUrl ?? '');
    }

    configureRuntimeConfig({
      data: config.dataURL,
      cr_user_id: config.userId,
      userSource: config.userSource,
      requiredScore: config.requiredScore,
      nextAssessment: config.nextAssessment,
      endpoint: config.endpoint,
      organization: config.organization,
    });

    if (config.dataURL) {
      this.dataURL = config.dataURL;
      if (this.cacheModel) {
        this.cacheModel.setAppName(config.dataURL);
      }
    }
  }

  private applyHostIntegrationConfig(config: AppStartupConfig): void {
    this.enableUnityBridge = config.enableUnityBridge ?? this.enableUnityBridge ?? true;
    this.enableAndroidSummary = config.enableAndroidSummary ?? this.enableAndroidSummary ?? true;
    this.enableParentPostMessage = config.enableParentPostMessage ?? this.enableParentPostMessage ?? true;
    this.hostIntegrationAdapters = {
      ...(this.hostIntegrationAdapters ?? {}),
      ...(config.hostIntegrationAdapters ?? {}),
    };
  }

  private async initializeGame(): Promise<void> {
    await fetchAppData(this.dataURL).then((data) => {
      console.log('Assessment/Survey ' + appVersion + ' initializing!');
      console.log('App data loaded!');
      console.log(data);

      this.cacheModel.setContentFilePath(getDataURL(this.dataURL));

      UIController.SetFeedbackText?.(data['feedbackText']);

      let appType = data['appType'];
      const assessmentType = data['assessmentType'];

      if (appType == 'survey') {
        const questions = data['questions'] ?? [];

        for (const question of questions) {
          if (question.promptAudio) {
            this.cacheModel.addItemToAudioVisualResources(
              resolveAssetPath(
                ASSET_PATHS.AUDIO.itemAudio(this.dataURL, question.promptAudio.toLowerCase().trim())
              )
            );
          }
        }

        this.cacheModel.addItemToAudioVisualResources(
          resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(this.dataURL))
        );

        this.game = new Survey(this.dataURL, this.unityBridge);
      } else if (appType == 'assessment') {
        let buckets = data['buckets'];

        for (let i = 0; i < buckets.length; i++) {
          for (let j = 0; j < buckets[i].items.length; j++) {
            const audioItemURL = resolveAssetPath(
              ASSET_PATHS.AUDIO.itemAudio(this.dataURL, buckets[i].items[j].itemName.toLowerCase().trim() + '.mp3')
            );
            this.cacheModel.addItemToAudioVisualResources(audioItemURL);
          }
        }

        this.cacheModel.addItemToAudioVisualResources(resolveAssetPath(ASSET_PATHS.AUDIO.feedbackAudio(this.dataURL)));

        const assessmentUI = this.assessmentUI;
        this.game = new Assessment(this.dataURL, this.unityBridge, assessmentUI);
      }

      this.cacheModel.addItemToAudioVisualResources(resolveAssetPath(ASSET_PATHS.AUDIO.dingSfx));

      //caching SFX(s) for drag and drop
      this.cacheModel.addItemToAudioVisualResources(resolveAssetPath(ASSET_PATHS.AUDIO.DRAG_SOUND_EFFECTS.DRAG_START_POP));
      this.cacheModel.addItemToAudioVisualResources(resolveAssetPath(ASSET_PATHS.AUDIO.DRAG_SOUND_EFFECTS.HAPPY_TRUMPET_PLUS_SPARKLE));
      this.cacheModel.addItemToAudioVisualResources(resolveAssetPath(ASSET_PATHS.AUDIO.DRAG_SOUND_EFFECTS.RETURN_BOING));

      this.game.unityBridge = this.unityBridge;

      contentVersion = data['contentVersion'];

      this.setCommonProperties();
      this.logInitialAnalyticsEvents();

      this.game.Run(this);

      this.game.subscribe('ENDED', (gameInstance: BaseQuiz) => {
        const { score, startTime, endTime } = gameInstance;
        this.notifySummaryData({
          app_type: appType,
          score,
          time_spent: endTime - startTime,
        });

        if (appType === Assessment.TYPE) {
          const { cr_user_id, language } = getCommonAnalyticsEventsProperties();
          const androidInterface = new AndroidInterface({
            cr_user_id,
            app_id: appType,
            debug: false,
            log: false,
          });

          androidInterface.logUserSessionsData?.({
            type: assessmentType || appType,
            lang: language,
            score,
            max_score: gameInstance.max_score,
            time_spent: endTime - startTime,
            event_type: 'activity_completed',
          });
        }
      });
    });
  }

  async setCommonProperties() {
    setCommonAnalyticsEventsProperties(getUUID(), getAppLanguageFromDataURL(this.dataURL), getAppTypeFromDataURL(this.dataURL), getUserSource(), contentVersion, appVersion);
  }

  async logInitialAnalyticsEvents() {
    const lat_lang = await getLocation();
    setLocationProperty(lat_lang ?? 'NotAvailable');
    this.analyticsIntegration?.track(AnalyticsEventsType.OPENED, {});
    this.analyticsIntegration?.track(AnalyticsEventsType.USER_LOCATION, {});
    this.analyticsIntegration?.track(AnalyticsEventsType.INITIALIZE, { type: 'initialized' });
  }

  async registerServiceWorker(game: BaseQuiz, dataURL: string = '', skipLoadingScreen: boolean = false) {
    console.log('Registering service worker...');

    if ('serviceWorker' in navigator) {
      let wb = new Workbox('./sw.js', {});

      wb.register()
        .then((registration) => {
          console.log('Service worker registered!');
          this.handleServiceWorkerRegistation(registration);
        })
        .catch((err) => {
          console.log('Service worker registration failed: ' + err);
        });

      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      await navigator.serviceWorker.ready;

      console.log('Cache Model: ');
      console.log(this.cacheModel);

      // We need to check if there's a new version of the content file and in that case
      // remove the localStorage content name and version value

      console.log('Checking for content version updates...' + dataURL);

      fetch(this.cacheModel.contentFilePath + '?cache-bust=' + new Date().getTime(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        cache: 'no-store',
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error('Failed to fetch the content file from the server!');
            return;
          }
          const newContentFileData = await response.json();
          const aheadContentVersion = newContentFileData['contentVersion'];
          console.log('No Cache Content version: ' + aheadContentVersion);

          // We need to check here for the content version updates
          // If there's a new content version, we need to remove the cached content and reload
          // We are comparing here the contentVersion with the aheadContentVersion
          if (aheadContentVersion && contentVersion != aheadContentVersion) {
            console.log('Content version mismatch! Reloading...');
            localStorage.removeItem(this.cacheModel.appName);
            // Clear the cache for tht particular content
            caches.delete(this.cacheModel.appName);
            handleUpdateFoundMessage();
          }
        })
        .catch((error) => {
          console.error('Error fetching the content file: ' + error);
        });

      if (localStorage.getItem(this.cacheModel.appName) == null) {
        console.log('Caching!' + this.cacheModel.appName);
        if (!skipLoadingScreen) {
          this.assessmentUI.setLoadingVisible(true);
        }
        broadcastChannel.postMessage({
          command: 'Cache',
          data: {
            appData: this.cacheModel,
          },
        });
      } else {
        this.assessmentUI.setLoadingProgress(100);
        setTimeout(() => {
          this.assessmentUI.setLoadingVisible(false);
          this.assessmentUI.setContentLoaded(true);
        }, skipLoadingScreen ? 0 : 1500);
      }

      broadcastChannel.onmessage = (event) => {
        console.log(event.data.command + ' received from service worker!');
        if (event.data.command == 'Activated' && localStorage.getItem(this.cacheModel.appName) == null) {
          broadcastChannel.postMessage({
            command: 'Cache',
            data: {
              appData: this.cacheModel,
            },
          });
        }
      };
    } else {
      console.warn('Service workers are not supported in this browser.');
    }
  }

  handleServiceWorkerRegistation(registration: ServiceWorkerRegistration | undefined): void {
    try {
      registration?.installing?.postMessage({
        type: 'Registartion',
        value: this.lang,
      });
    } catch (err) {
      console.log('Service worker registration failed: ' + err);
    }
  }

  public GetDataURL(): string {
    return this.dataURL;
  }

  public dispose(): void {
    this.assessmentUI.dispose?.(); 
  }

  /**
   * Resolves the final UI mode by combining the explicit config value with the
   * remote feature flag. Call this once in spinUp() after flags have initialized.
   */
  private resolveAssessmentUIMode(): AssessmentUIMode {
    if (this.configuredUIMode !== undefined) {
      return this.configuredUIMode;
    }
    return featureFlagsService.isFeatureEnabled(FEATURE_DRAG_DROP_UI) ? 'new-ui' : 'legacy';
  }

  private applyUIStylesheet(): void {
    const link = document.getElementById('assessment-stylesheet') as HTMLLinkElement | null;
    if (!link) return;

    if (this.assessmentUIMode === 'new-ui') {
      link.href = link.href.replace('style.css', 'drag-drop-style.css');
    } else {
      link.href = link.href.replace('drag-drop-style.css', 'style.css');
    }
  }

  public createAssessmentUI(): AssessmentUI {
    return this.assessmentUIMode === 'new-ui'
      ? new DragDropAssessmentUI(this.uiRoot)
      : new LegacyAssessmentUIAdapter();
  }

  public notifyLoaded(): void {
    this.assessmentUI.setGameReady(true);

    if (this.enableUnityBridge) {
      this.unityBridge.SendLoaded();
    }

    this.hostIntegrationAdapters?.onLoaded?.();
  }

  public notifyClose(): void {
    if (this.enableUnityBridge) {
      this.unityBridge.SendClose();
    }

    this.hostIntegrationAdapters?.onClose?.();
  }

  public notifySummaryData(summaryData: SummaryData): void {
    if (this.enableAndroidSummary) {
      const { cr_user_id } = getCommonAnalyticsEventsProperties();
      const androidInterface = new AndroidInterface({
        cr_user_id,
        app_id: 'assessment',
      });
      androidInterface.logSummaryData?.(summaryData);
    }

    this.hostIntegrationAdapters?.onSummaryData?.(summaryData);
  }

  public createAssessmentCompletedPayload(score: number): AssessmentCompletedPayload {
    return {
      type: 'assessment_completed',
      score,
    };
  }

  public notifyComplete(payload: AssessmentCompletedPayload): void {
    this.hostIntegrationAdapters?.onComplete?.(payload);
  }

  public notifyRewardTrigger(payload: AssessmentCompletedPayload): void {
    this.hostIntegrationAdapters?.onRewardTrigger?.(payload);
  }

  public notifyAssessmentCompleted(score: number): void {
    const payload = this.createAssessmentCompletedPayload(score);

    if (this.enableParentPostMessage && window.parent) {
      window.parent.postMessage(payload, 'https://synapse.curiouscontent.org/');
    }

    this.notifyComplete(payload);
    this.notifyRewardTrigger(payload);
    this.hostIntegrationAdapters?.onAssessmentCompleted?.(payload);
  }
}

broadcastChannel.addEventListener('message', handleServiceWorkerMessage);

function handleServiceWorkerMessage(event): void {
  if (event.data.msg == 'Loading') {
    let progressValue = parseInt(event.data.data.progress);
    handleLoadingMessage(event, progressValue);
  }
  if (event.data.msg == 'UpdateFound') {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>.,update Found');
    handleUpdateFoundMessage();
  }
}

function handleLoadingMessage(event, progressValue): void {
  if (progressValue < 40 && progressValue >= 10) {
    UIController.SetLoadingProgress?.(progressValue);
  } else if (progressValue >= 100) {
    UIController.SetLoadingProgress?.(100);
    setTimeout(() => {
      UIController.SetLoadingVisible?.(false);
      UIController.SetContentLoaded?.(true);
    }, 1500);
    // add book with a name to local storage as cached
    localStorage.setItem(event.data.data.bookName, 'true');
    readLanguageDataFromCacheAndNotifyAndroidApp(event.data.data.bookName);
  }
}

function readLanguageDataFromCacheAndNotifyAndroidApp(bookName: string) {
  //@ts-ignore
  if (window.Android) {
    let isContentCached: boolean = localStorage.getItem(bookName) !== null;
    //@ts-ignore
    window.Android.cachedStatus(isContentCached);
  }
}

function handleUpdateFoundMessage(): void {
  let text = 'Update Found.\nPlease accept the update by pressing Ok.';
  if (confirm(text) == true) {
    window.location.reload();
  } else {
    text = 'Update will happen on the next launch.';
  }
}

export function createApp(config: AppStartupConfig = {}): App {
  return new App(config);
}

export function startStandaloneApp(config: AppStartupConfig = {}): App {
  console.log(config);
  const resolvedConfig: AppStartupConfig = { platform: 'standalone', ...config };
  const app = new App(resolvedConfig);
  app.spinUp(resolvedConfig);
  return app;
}
