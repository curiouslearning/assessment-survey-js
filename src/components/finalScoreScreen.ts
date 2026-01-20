/**
 * FinalScoreScreen component
 * 
 * Manages the persistent final assessment score screen that:
 * - Displays the final score and assessment name
 * - Requires a 3-second long press to confirm
 * - Locks all navigation until confirmed
 * - Persists score data locally
 * - Restores on app reopen if not confirmed
 */

import { ScoreData } from '../utils/types';
import { STORAGE_KEYS, TIMING, ASSESSMENT_TYPES, ASSESSMENT_DISPLAY_NAMES } from '../utils/constants';
import { logger } from '../utils/logger';

export class FinalScoreScreen {
  private static instance: FinalScoreScreen | null = null;

  private scoreContainer: HTMLElement;
  private scoreValueElement: HTMLElement;
  private assessmentNameElement: HTMLElement;
  private confirmButton: HTMLElement;
  private progressBar: HTMLElement;
  private closeButton: HTMLElement;

  private longPressTimer: number | null = null;
  private isLongPressing: boolean = false;
  private navigationLocked: boolean = false;
  private eventListenersSetup: boolean = false;

  // Android back button handler
  private androidBackButtonHandler: (e: PopStateEvent) => void;

  // Prevent swipe gestures
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartTime: number = 0;

  private constructor() {
    this.initElements();

    // Setup Android back button blocking handler
    this.androidBackButtonHandler = (e: PopStateEvent) => {
      if (this.navigationLocked) {
        // Push state again to prevent navigation
        window.history.pushState(null, '', window.location.href);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Setup event listeners (only once)
    this.setupEventListeners();
  }

  public static getInstance(): FinalScoreScreen {
    if (FinalScoreScreen.instance === null) {
      FinalScoreScreen.instance = new FinalScoreScreen();
    }
    return FinalScoreScreen.instance;
  }

  private initElements(): void {
    this.scoreContainer = document.getElementById('finalScoreScreen');
    this.scoreValueElement = document.getElementById('finalScoreValue');
    this.assessmentNameElement = document.getElementById('finalAssessmentName');
    this.confirmButton = document.getElementById('finalScoreConfirmButton');
    this.progressBar = document.getElementById('finalScoreProgressBar');
    this.closeButton = document.getElementById('finalScoreCloseButton');

    // Check if all required elements exist
    if (!this.scoreContainer || !this.scoreValueElement || !this.assessmentNameElement ||
      !this.confirmButton || !this.progressBar) {
      logger.error('FinalScoreScreen: Required DOM elements not found');
      return;
    }

    // Initially hide the close button
    if (this.closeButton) {
      this.closeButton.style.display = 'none';
    }
  }

  private setupEventListeners(): void {
    // Only set up listeners once
    if (this.eventListenersSetup) {
      return;
    }

    // Ensure elements exist before setting up listeners
    if (!this.confirmButton) {
      logger.warn('FinalScoreScreen: Confirm button not found, event listeners not set up');
      return;
    }

    // Long press handlers for confirm button
    this.confirmButton.addEventListener('touchstart', (e) => {
      this.handleLongPressStart(e);
    });

    this.confirmButton.addEventListener('touchend', (e) => {
      this.handleLongPressEnd(e);
    });

    this.confirmButton.addEventListener('touchcancel', (e) => {
      this.handleLongPressCancel(e);
    });

    // Mouse handlers for desktop testing
    this.confirmButton.addEventListener('mousedown', (e) => {
      this.handleLongPressStart(e);
    });

    this.confirmButton.addEventListener('mouseup', (e) => {
      this.handleLongPressEnd(e);
    });

    this.confirmButton.addEventListener('mouseleave', (e) => {
      this.handleLongPressCancel(e);
    });

    // Prevent default button click behavior
    this.confirmButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    // Disable close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    // Prevent swipe gestures
    document.addEventListener('touchstart', (e) => {
      if (this.navigationLocked && this.scoreContainer.style.display !== 'none') {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (this.navigationLocked && this.scoreContainer.style.display !== 'none') {
        // Block all touch movements when navigation is locked
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { passive: false });

    // Handle Android back button via popstate
    window.addEventListener('popstate', this.androidBackButtonHandler);

    // Push initial state to enable back button blocking
    window.history.pushState(null, '', window.location.href);

    // Mark listeners as set up
    this.eventListenersSetup = true;
  }

  private handleLongPressStart(e: Event): void {
    if (this.isLongPressing || this.longPressTimer !== null) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.isLongPressing = true;
    this.confirmButton.classList.add('long-pressing');
    this.progressBar.style.width = '0%';
    this.progressBar.style.transition = `width ${TIMING.LONG_PRESS_DURATION}ms linear`;

    // Trigger haptic feedback if available (Android WebView)
    this.triggerHapticFeedback();

    // Start the long press timer
    this.longPressTimer = window.setTimeout(() => {
      this.onLongPressComplete();
    }, TIMING.LONG_PRESS_DURATION);

    // Animate progress bar
    setTimeout(() => {
      if (this.isLongPressing) {
        this.progressBar.style.width = '100%';
      }
    }, 10);
  }

  private handleLongPressEnd(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    this.isLongPressing = false;
    this.confirmButton.classList.remove('long-pressing');
    this.progressBar.style.width = '0%';
    this.progressBar.style.transition = 'width 0.1s linear';
  }

  private handleLongPressCancel(e: Event): void {
    this.handleLongPressEnd(e);
  }

  private triggerHapticFeedback(): void {
    // Try to trigger haptic feedback via Android WebView interface
    if (window.Android?.vibrate) {
      window.Android.vibrate(50); // 50ms vibration
    } else if (navigator.vibrate) {
      // Standard Vibration API
      navigator.vibrate(50);
    }
  }

  private onLongPressComplete(): void {
    this.isLongPressing = false;
    this.longPressTimer = null;

    // Mark score as confirmed
    const scoreData = this.getStoredScoreData();
    if (scoreData) {
      scoreData.scoreConfirmed = true;
      this.saveScoreData(scoreData);
    }

    // Trigger haptic feedback for success
    this.triggerHapticFeedback();

    // Unlock navigation
    this.unlockNavigation();

    // Hide the score screen
    this.hide();

    // Navigate to home/landing screen
    this.navigateToHome();
  }

  /**
   * Maps assessment type to display name in English
   */
  private getAssessmentDisplayName(assessmentType: string): string {
    const normalizedType = assessmentType.toLowerCase().trim();

    if (
      normalizedType.includes(ASSESSMENT_TYPES.LETTER_SOUNDS) ||
      normalizedType.includes('lettersound')
    ) {
      return ASSESSMENT_DISPLAY_NAMES.LETTER_SOUNDS;
    } else if (
      normalizedType.includes(ASSESSMENT_TYPES.SIGHT_WORDS) ||
      normalizedType.includes('sightword')
    ) {
      return ASSESSMENT_DISPLAY_NAMES.SIGHT_WORDS;
    }

    // Fallback: try to parse from common patterns
    if (normalizedType.includes('letter')) {
      return ASSESSMENT_DISPLAY_NAMES.LETTER_SOUNDS;
    } else if (normalizedType.includes('sight') || normalizedType.includes('word')) {
      return ASSESSMENT_DISPLAY_NAMES.SIGHT_WORDS;
    }

    return ASSESSMENT_DISPLAY_NAMES.DEFAULT;
  }

  /**
   * Shows the final score screen with the given data
   */
  public show(score: number, maxScore: number, assessmentType: string): void {
    // Ensure elements are initialized
    if (!this.scoreContainer || !this.scoreValueElement || !this.assessmentNameElement) {
      this.initElements();
    }

    // Double-check elements exist
    if (!this.scoreContainer || !this.scoreValueElement || !this.assessmentNameElement) {
      logger.error('FinalScoreScreen: Cannot show - required elements not found');
      return;
    }

    const assessmentName = this.getAssessmentDisplayName(assessmentType);

    // Save score data to localStorage
    const scoreData: ScoreData = {
      score,
      maxScore,
      assessmentName,
      scoreConfirmed: false,
      timestamp: Date.now()
    };
    this.saveScoreData(scoreData);

    // Update UI
    this.scoreValueElement.textContent = score.toString();
    this.assessmentNameElement.textContent = assessmentName;

    // Show the screen
    this.scoreContainer.style.display = 'flex';

    // Lock navigation
    this.lockNavigation();

    // Hide other containers
    const landWrap = document.getElementById('landWrap');
    const gameWrap = document.getElementById('gameWrap');
    const endWrap = document.getElementById('endWrap');

    if (landWrap) landWrap.style.display = 'none';
    if (gameWrap) gameWrap.style.display = 'none';
    if (endWrap) endWrap.style.display = 'none';
  }

  /**
   * Hides the score screen
   */
  public hide(): void {
    this.scoreContainer.style.display = 'none';
  }

  /**
   * Checks if there's an unconfirmed score and restores it
   * Returns true if an unconfirmed score was found and restored
   */
  public checkAndRestore(): boolean {
    // Ensure elements are initialized
    if (!this.scoreContainer || !this.scoreValueElement || !this.assessmentNameElement) {
      this.initElements();
    }

    const scoreData = this.getStoredScoreData();

    if (scoreData && !scoreData.scoreConfirmed) {
      // Restore the score screen
      this.scoreValueElement.textContent = scoreData.score.toString();
      this.assessmentNameElement.textContent = scoreData.assessmentName;
      this.scoreContainer.style.display = 'flex';
      this.lockNavigation();

      // Hide other containers
      const landWrap = document.getElementById('landWrap');
      const gameWrap = document.getElementById('gameWrap');
      const endWrap = document.getElementById('endWrap');

      if (landWrap) landWrap.style.display = 'none';
      if (gameWrap) gameWrap.style.display = 'none';
      if (endWrap) endWrap.style.display = 'none';

      return true;
    }

    return false;
  }

  /**
   * Locks all navigation methods
   */
  private lockNavigation(): void {
    this.navigationLocked = true;

    // Disable close button visually and functionally
    if (this.closeButton) {
      this.closeButton.style.display = 'none';
      this.closeButton.style.pointerEvents = 'none';
    }

    // Prevent browser back button
    window.history.pushState(null, '', window.location.href);

    // Prevent Android back button via JavaScript bridge if available
    if (window.Android?.disableBackButton) {
      window.Android.disableBackButton(true);
    }

    // Prevent context menu
    document.addEventListener('contextmenu', this.preventContextMenu, true);

    // Prevent keyboard shortcuts
    document.addEventListener('keydown', this.preventKeyboardShortcuts, true);
  }

  /**
   * Unlocks navigation
   */
  private unlockNavigation(): void {
    this.navigationLocked = false;

    // Re-enable close button (though it should remain hidden)
    if (this.closeButton) {
      this.closeButton.style.pointerEvents = 'auto';
    }

    // Re-enable Android back button if available
    if (window.Android?.disableBackButton) {
      window.Android.disableBackButton(false);
    }

    // Remove event listeners
    document.removeEventListener('contextmenu', this.preventContextMenu, true);
    document.removeEventListener('keydown', this.preventKeyboardShortcuts, true);

    // Clear stored score data after a delay to ensure navigation completes
    setTimeout(() => {
      this.clearStoredScoreData();
    }, 1000);
  }

  private preventContextMenu = (e: Event): void => {
    if (this.navigationLocked) {
      e.preventDefault();
      e.stopPropagation();

    }
  };

  private preventKeyboardShortcuts = (e: KeyboardEvent): void => {
    if (this.navigationLocked) {
      // Block Escape, Backspace (when not in input), F5, Ctrl+R, etc.
      if (
        e.key === 'Escape' ||
        (e.key === 'Backspace' && (e.target as HTMLElement).tagName !== 'INPUT') ||
        e.key === 'F5' ||
        (e.ctrlKey && e.key === 'r') ||
        (e.ctrlKey && e.key === 'R')
      ) {
        e.preventDefault();
        e.stopPropagation();
        // No need to return false, as the function is typed to return void
      }
    }
  };
  /**
   * Navigates to the home/landing screen
   */
  private navigateToHome(): void {
    // Show landing screen
    const landingContainer = document.getElementById('landWrap');
    if (landingContainer) {
      landingContainer.style.display = 'flex';
    }
  }

  /**
   * Saves score data to localStorage
   */
  private saveScoreData(scoreData: ScoreData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FINAL_SCORE, JSON.stringify(scoreData));
    } catch (error) {
      logger.error('Failed to save score data', error);
    }
  }

  /**
   * Retrieves score data from localStorage
   */
  private getStoredScoreData(): ScoreData | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FINAL_SCORE);
      if (stored) {
        return JSON.parse(stored) as ScoreData;
      }
    } catch (error) {
      logger.error('Failed to retrieve score data', error);
    }
    return null;
  }

  /**
   * Clears stored score data
   */
  private clearStoredScoreData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.FINAL_SCORE);
    } catch (error) {
      logger.error('Failed to clear score data', error);
    }
  }

  /**
   * Checks if score is confirmed (utility method for external checks)
   */
  public isScoreConfirmed(): boolean {
    const scoreData = this.getStoredScoreData();
    return scoreData ? scoreData.scoreConfirmed : true; // Default to true if no data
  }
}
