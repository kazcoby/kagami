/**
 * StateManager — Persistent State Storage
 *
 * Wraps localStorage with type safety and versioning.
 * Tracks visits, discoveries, and user preferences.
 *
 * "Layers hide depth" — your progress persists across sessions.
 */

import { eventBus } from '../core/EventBus';

const STORAGE_KEY = 'kagami_state_v1';

export interface KagamiState {
  version: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  totalTimeSpent: number; // seconds
  secrets: Record<string, boolean>;
  chaptersVisited: number[];
  preferences: {
    audioEnabled: boolean;
    reducedMotion: boolean;
  };
}

const DEFAULT_STATE: KagamiState = {
  version: '1.0.0',
  visitCount: 0,
  firstVisit: '',
  lastVisit: '',
  totalTimeSpent: 0,
  secrets: {},
  chaptersVisited: [],
  preferences: {
    audioEnabled: true,
    reducedMotion: false,
  },
};

/**
 * StateManager singleton
 *
 * Usage:
 *   stateManager.incrementVisits();
 *   stateManager.discoverSecret('konami');
 *   const stats = stateManager.getStats();
 */
class StateManagerImpl {
  private state: KagamiState;
  private sessionStartTime: number;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.state = this.load();
    this.sessionStartTime = Date.now();

    // Update visit tracking
    const now = new Date().toISOString();
    if (!this.state.firstVisit) {
      this.state.firstVisit = now;
    }
    this.state.lastVisit = now;
    this.state.visitCount++;

    // Detect reduced motion preference
    this.state.preferences.reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Save initial state
    this.save();

    // Track time spent (save every 30 seconds)
    setInterval(() => this.updateTimeSpent(), 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => this.saveSync());

    // Listen for state events
    eventBus.on('state:save', () => this.save());
  }

  /**
   * Load state from localStorage
   */
  private load(): KagamiState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<KagamiState>;
        // Merge with defaults to handle missing fields
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (error) {
      console.warn('[StateManager] Failed to load state:', error);
    }
    return { ...DEFAULT_STATE };
  }

  /**
   * Save state to localStorage (debounced)
   */
  save(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => this.saveSync(), 100);
  }

  /**
   * Save state synchronously
   */
  private saveSync(): void {
    try {
      this.updateTimeSpent();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.warn('[StateManager] Failed to save state:', error);
    }
  }

  /**
   * Update total time spent
   */
  private updateTimeSpent(): void {
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    // Only add new time, not total session time
    const previousSessionTime = this.state.totalTimeSpent;
    this.state.totalTimeSpent = previousSessionTime +
      Math.min(30, sessionDuration - (this.state.totalTimeSpent - previousSessionTime));
  }

  /**
   * Record a secret discovery
   */
  discoverSecret(secretId: string): boolean {
    if (this.state.secrets[secretId]) {
      return false; // Already discovered
    }
    this.state.secrets[secretId] = true;
    this.save();
    return true;
  }

  /**
   * Check if a secret has been discovered
   */
  hasSecret(secretId: string): boolean {
    return this.state.secrets[secretId] === true;
  }

  /**
   * Get all discovered secrets
   */
  getDiscoveredSecrets(): string[] {
    return Object.keys(this.state.secrets).filter(id => this.state.secrets[id]);
  }

  /**
   * Record a chapter visit
   */
  visitChapter(chapterIndex: number): void {
    if (!this.state.chaptersVisited.includes(chapterIndex)) {
      this.state.chaptersVisited.push(chapterIndex);
      this.state.chaptersVisited.sort((a, b) => a - b);
      this.save();
    }
  }

  /**
   * Check if all chapters have been visited
   */
  hasVisitedAllChapters(totalChapters: number = 8): boolean {
    return this.state.chaptersVisited.length >= totalChapters;
  }

  /**
   * Get statistics for the window.kagami API
   */
  getStats(): {
    visitCount: number;
    secretsFound: number;
    chaptersVisited: number[];
    timeSpent: number;
    firstVisit: string;
  } {
    return {
      visitCount: this.state.visitCount,
      secretsFound: Object.keys(this.state.secrets).filter(id => this.state.secrets[id]).length,
      chaptersVisited: [...this.state.chaptersVisited],
      timeSpent: Math.round(this.state.totalTimeSpent),
      firstVisit: this.state.firstVisit,
    };
  }

  /**
   * Get/set audio preference
   */
  get audioEnabled(): boolean {
    return this.state.preferences.audioEnabled;
  }

  set audioEnabled(value: boolean) {
    this.state.preferences.audioEnabled = value;
    this.save();
  }

  /**
   * Get reduced motion preference
   */
  get prefersReducedMotion(): boolean {
    return this.state.preferences.reducedMotion;
  }

  /**
   * Export state as JSON string (for debugging)
   */
  exportState(): string {
    this.updateTimeSpent();
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Reset all state (for testing)
   */
  reset(): void {
    this.state = { ...DEFAULT_STATE };
    this.state.firstVisit = new Date().toISOString();
    this.state.lastVisit = this.state.firstVisit;
    this.state.visitCount = 1;
    this.sessionStartTime = Date.now();
    this.save();
  }
}

// Singleton export
export const stateManager = new StateManagerImpl();

// Export type for external use
export type StateManager = typeof stateManager;
