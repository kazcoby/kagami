/**
 * AudioManager — Web Audio API Orchestration
 *
 * Central controller for all audio in Kagami.
 * Handles AudioContext lifecycle, master volume, and routing.
 *
 * "Every pixel matters" — and every frequency too.
 */

import { eventBus } from '../core/EventBus';
import { stateManager } from '../state/StateManager';
import { FIBONACCI_MS } from '../utils/craft';

export type AudioState = 'suspended' | 'running' | 'closed';

/**
 * AudioManager singleton
 */
class AudioManagerImpl {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  private initialized: boolean = false;
  private _enabled: boolean = true;

  // Callbacks for state changes
  private stateChangeCallbacks: Set<(state: AudioState) => void> = new Set();

  constructor() {
    // Check stored preference
    this._enabled = stateManager.audioEnabled;

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.suspend();
      } else if (this._enabled) {
        this.resume();
      }
    });

    // Listen for audio events
    eventBus.on('audio:trigger', () => {
      // Ensure audio is initialized on user interaction
      this.ensureInitialized();
    });
  }

  /**
   * Initialize AudioContext (must be called on user gesture)
   */
  async init(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      // Create AudioContext
      this.context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create master gain
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this._enabled ? 0.7 : 0;

      // Create compressor for dynamics control
      this.compressor = this.context.createDynamicsCompressor();
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      // Connect: source -> compressor -> masterGain -> destination
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);

      this.initialized = true;

      // Resume if suspended (happens on iOS)
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      console.log('[AudioManager] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[AudioManager] Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Ensure audio is initialized (call on user interaction)
   */
  async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
      return this.init();
    }
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
    return true;
  }

  /**
   * Get the AudioContext
   */
  getContext(): AudioContext | null {
    return this.context;
  }

  /**
   * Get the master gain node (connect sources here)
   */
  getMasterOutput(): GainNode | null {
    return this.compressor as unknown as GainNode; // Sources connect to compressor
  }

  /**
   * Get the compressor node
   */
  getCompressor(): DynamicsCompressorNode | null {
    return this.compressor;
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    if (!this.masterGain) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    const targetTime = this.context!.currentTime + FIBONACCI_MS[1] / 1000;

    this.masterGain.gain.linearRampToValueAtTime(clampedVolume, targetTime);
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.masterGain?.gain.value || 0;
  }

  /**
   * Enable/disable audio
   */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    stateManager.audioEnabled = enabled;

    if (this.masterGain && this.context) {
      const targetTime = this.context.currentTime + FIBONACCI_MS[2] / 1000;
      this.masterGain.gain.linearRampToValueAtTime(
        enabled ? 0.7 : 0,
        targetTime
      );
    }

    if (enabled && this.context?.state === 'suspended') {
      this.resume();
    }
  }

  /**
   * Check if audio is enabled
   */
  isEnabled(): boolean {
    return this._enabled;
  }

  /**
   * Suspend audio (pause processing)
   */
  suspend(): void {
    if (this.context && this.context.state === 'running') {
      this.context.suspend();
      this.notifyStateChange('suspended');
    }
  }

  /**
   * Resume audio
   */
  async resume(): Promise<void> {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
      this.notifyStateChange('running');
    }
  }

  /**
   * Get current audio state
   */
  getState(): AudioState {
    if (!this.context) return 'closed';
    return this.context.state as AudioState;
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: (state: AudioState) => void): () => void {
    this.stateChangeCallbacks.add(callback);
    return () => this.stateChangeCallbacks.delete(callback);
  }

  /**
   * Notify state change listeners
   */
  private notifyStateChange(state: AudioState): void {
    this.stateChangeCallbacks.forEach(cb => cb(state));
  }

  /**
   * Create an oscillator node
   */
  createOscillator(
    type: OscillatorType = 'sine',
    frequency: number = 440
  ): OscillatorNode | null {
    if (!this.context) return null;

    const osc = this.context.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    return osc;
  }

  /**
   * Create a gain node
   */
  createGain(value: number = 1): GainNode | null {
    if (!this.context) return null;

    const gain = this.context.createGain();
    gain.gain.value = value;
    return gain;
  }

  /**
   * Create a biquad filter
   */
  createFilter(
    type: BiquadFilterType = 'lowpass',
    frequency: number = 1000,
    Q: number = 1
  ): BiquadFilterNode | null {
    if (!this.context) return null;

    const filter = this.context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = Q;
    return filter;
  }

  /**
   * Get current time from AudioContext
   */
  getCurrentTime(): number {
    return this.context?.currentTime || 0;
  }

  /**
   * Check if audio is available
   */
  isAvailable(): boolean {
    return typeof AudioContext !== 'undefined' ||
           typeof (window as any).webkitAudioContext !== 'undefined';
  }
}

// Singleton export
export const audioManager = new AudioManagerImpl();

// Export type
export type AudioManager = typeof audioManager;
