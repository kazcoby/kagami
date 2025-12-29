/**
 * AmbientDrone — Generative Background Soundscape
 *
 * Creates an evolving ambient drone using Web Audio synthesis.
 * Each chapter modulates the frequencies and timbres.
 *
 * "Layers hide depth" — the sound unfolds as you explore.
 */

import { audioManager } from './AudioManager';
import { eventBus } from '../core/EventBus';
import { FIBONACCI_MS } from '../utils/craft';

// Base frequencies (A1, A2, E3 - harmonic series)
const BASE_FREQUENCIES = [55, 110, 165];

// Chapter-specific frequency modifiers
const CHAPTER_MODIFIERS: Record<number, { freqMult: number; filterFreq: number; detune: number }> = {
  0: { freqMult: 1.0, filterFreq: 200, detune: 0 },      // Void - deep, minimal
  1: { freqMult: 1.2, filterFreq: 400, detune: 5 },      // Spark - brighter
  2: { freqMult: 0.9, filterFreq: 300, detune: 2 },      // Forge - warm
  3: { freqMult: 1.1, filterFreq: 500, detune: 8 },      // Flow - shimmer
  4: { freqMult: 1.0, filterFreq: 350, detune: 3 },      // Nexus - balanced
  5: { freqMult: 1.3, filterFreq: 600, detune: 0 },      // Beacon - clear
  6: { freqMult: 0.85, filterFreq: 250, detune: 10 },    // Grove - organic
  7: { freqMult: 1.5, filterFreq: 800, detune: 15 },     // Crystal - ethereal
};

/**
 * AmbientDrone creates a continuous generative soundscape
 */
export class AmbientDrone {
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private currentChapter: number = 0;
  private modulationPhase: number = 0;
  private modulationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Listen for chapter changes
    eventBus.on('chapter:enter', (e) => {
      this.setChapter(e.payload.index);
    });

    eventBus.on('audio:ambient', (e) => {
      this.setChapter(e.payload.chapter);
    });
  }

  /**
   * Start the ambient drone
   */
  async start(): Promise<void> {
    if (this.isPlaying) return;

    const initialized = await audioManager.ensureInitialized();
    if (!initialized) {
      console.warn('[AmbientDrone] AudioManager not available');
      return;
    }

    const ctx = audioManager.getContext();
    const output = audioManager.getMasterOutput();
    if (!ctx || !output) return;

    // Create master gain for this drone
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(output);

    // Create low-pass filter
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = CHAPTER_MODIFIERS[0].filterFreq;
    this.filter.Q.value = 2;
    this.filter.connect(this.masterGain);

    // Create oscillators for each base frequency
    const modifier = CHAPTER_MODIFIERS[this.currentChapter];

    for (let i = 0; i < BASE_FREQUENCIES.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
      osc.frequency.value = BASE_FREQUENCIES[i] * modifier.freqMult;
      osc.detune.value = modifier.detune * (i - 1); // Spread detuning

      const gain = ctx.createGain();
      gain.gain.value = i === 0 ? 0.4 : i === 1 ? 0.25 : 0.15; // Harmonic balance

      osc.connect(gain);
      gain.connect(this.filter);

      this.oscillators.push(osc);
      this.gains.push(gain);

      osc.start();
    }

    // Fade in
    const fadeTime = FIBONACCI_MS[4] / 1000; // 610ms
    this.masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + fadeTime);

    this.isPlaying = true;

    // Start modulation
    this.startModulation();

    console.log('[AmbientDrone] Started');
  }

  /**
   * Stop the ambient drone
   */
  stop(): void {
    if (!this.isPlaying) return;

    const ctx = audioManager.getContext();
    if (!ctx) return;

    // Stop modulation
    this.stopModulation();

    // Fade out
    if (this.masterGain) {
      const fadeTime = FIBONACCI_MS[4] / 1000;
      this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeTime);

      // Stop oscillators after fade
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {
            // Already stopped
          }
        });
        this.oscillators = [];
        this.gains = [];

        if (this.filter) {
          this.filter.disconnect();
          this.filter = null;
        }
        if (this.masterGain) {
          this.masterGain.disconnect();
          this.masterGain = null;
        }
      }, FIBONACCI_MS[4]);
    }

    this.isPlaying = false;
    console.log('[AmbientDrone] Stopped');
  }

  /**
   * Set chapter (changes drone character)
   */
  setChapter(chapterIndex: number): void {
    this.currentChapter = Math.max(0, Math.min(7, chapterIndex));

    if (!this.isPlaying) return;

    const ctx = audioManager.getContext();
    if (!ctx) return;

    const modifier = CHAPTER_MODIFIERS[this.currentChapter];
    const transitionTime = FIBONACCI_MS[3] / 1000; // 377ms
    const targetTime = ctx.currentTime + transitionTime;

    // Update oscillator frequencies
    for (let i = 0; i < this.oscillators.length; i++) {
      const osc = this.oscillators[i];
      const targetFreq = BASE_FREQUENCIES[i] * modifier.freqMult;
      const targetDetune = modifier.detune * (i - 1);

      osc.frequency.linearRampToValueAtTime(targetFreq, targetTime);
      osc.detune.linearRampToValueAtTime(targetDetune, targetTime);
    }

    // Update filter
    if (this.filter) {
      this.filter.frequency.linearRampToValueAtTime(modifier.filterFreq, targetTime);
    }

    console.log(`[AmbientDrone] Chapter ${chapterIndex} - freq mult: ${modifier.freqMult}`);
  }

  /**
   * Start slow modulation for evolving sound
   */
  private startModulation(): void {
    this.stopModulation();

    // Modulate at Fibonacci interval
    this.modulationInterval = setInterval(() => {
      this.modulate();
    }, FIBONACCI_MS[5]); // 987ms
  }

  /**
   * Stop modulation
   */
  private stopModulation(): void {
    if (this.modulationInterval) {
      clearInterval(this.modulationInterval);
      this.modulationInterval = null;
    }
  }

  /**
   * Apply subtle modulation
   */
  private modulate(): void {
    if (!this.isPlaying) return;

    const ctx = audioManager.getContext();
    if (!ctx) return;

    this.modulationPhase += 0.1;
    const modValue = Math.sin(this.modulationPhase);

    // Subtle gain modulation on harmonics
    for (let i = 1; i < this.gains.length; i++) {
      const baseGain = i === 1 ? 0.25 : 0.15;
      const modulation = baseGain * (1 + modValue * 0.1);
      this.gains[i].gain.linearRampToValueAtTime(
        modulation,
        ctx.currentTime + 0.5
      );
    }

    // Subtle filter modulation
    if (this.filter) {
      const modifier = CHAPTER_MODIFIERS[this.currentChapter];
      const filterMod = modifier.filterFreq * (1 + modValue * 0.15);
      this.filter.frequency.linearRampToValueAtTime(
        filterMod,
        ctx.currentTime + 0.5
      );
    }
  }

  /**
   * Check if drone is playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Toggle play/stop
   */
  toggle(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }
}
