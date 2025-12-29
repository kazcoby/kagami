/**
 * SoundEffects — Synthesized Interaction Sounds
 *
 * Creates UI feedback sounds using Web Audio synthesis.
 * No audio files needed — all sounds are generated in real-time.
 *
 * Timing follows Fibonacci sequence:
 * - click: 89ms
 * - discover: 377ms
 * - chapter: 610ms
 * - secret: 987ms
 */

import { audioManager } from './AudioManager';
import { eventBus } from '../core/EventBus';
import { FIBONACCI_MS } from '../utils/craft';

export type SoundEffectType = 'click' | 'discover' | 'chapter' | 'secret';

/**
 * SoundEffects handles all UI audio feedback
 */
export class SoundEffects {
  private isInitialized: boolean = false;

  constructor() {
    // Listen for audio trigger events
    eventBus.on('audio:trigger', async (e) => {
      await this.play(e.payload.sound);
    });
  }

  /**
   * Initialize (called on first sound)
   */
  private async init(): Promise<boolean> {
    if (this.isInitialized) return true;

    const success = await audioManager.ensureInitialized();
    if (success) {
      this.isInitialized = true;
    }
    return success;
  }

  /**
   * Play a sound effect
   */
  async play(type: SoundEffectType): Promise<void> {
    if (!audioManager.isEnabled()) return;

    const initialized = await this.init();
    if (!initialized) return;

    switch (type) {
      case 'click':
        this.playClick();
        break;
      case 'discover':
        this.playDiscover();
        break;
      case 'chapter':
        this.playChapter();
        break;
      case 'secret':
        this.playSecret();
        break;
    }
  }

  /**
   * Click sound - short sine envelope (89ms)
   */
  private playClick(): void {
    const ctx = audioManager.getContext();
    const output = audioManager.getMasterOutput();
    if (!ctx || !output) return;

    const duration = FIBONACCI_MS[0] / 1000; // 89ms
    const now = ctx.currentTime;

    // Simple sine blip
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880; // A5

    const gain = ctx.createGain();
    gain.gain.value = 0;

    // Quick attack, quick decay
    gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(output);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Discover sound - rising frequency sweep (377ms)
   */
  private playDiscover(): void {
    const ctx = audioManager.getContext();
    const output = audioManager.getMasterOutput();
    if (!ctx || !output) return;

    const duration = FIBONACCI_MS[3] / 1000; // 377ms
    const now = ctx.currentTime;

    // Rising sweep
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440; // A4
    osc.frequency.exponentialRampToValueAtTime(880, now + duration * 0.8);

    // Second harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 660; // E5
    osc2.frequency.exponentialRampToValueAtTime(1320, now + duration * 0.8);

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.1, now + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const gain2 = ctx.createGain();
    gain2.gain.value = 0.06;
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(output);
    gain2.connect(output);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Chapter sound - chord swell (610ms)
   */
  private playChapter(): void {
    const ctx = audioManager.getContext();
    const output = audioManager.getMasterOutput();
    if (!ctx || !output) return;

    const duration = FIBONACCI_MS[4] / 1000; // 610ms
    const now = ctx.currentTime;

    // D major chord: D4, F#4, A4
    const frequencies = [293.66, 369.99, 440];
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    for (let i = 0; i < frequencies.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = frequencies[i];

      const gain = ctx.createGain();
      gain.gain.value = 0;

      // Staggered attack for richness
      const attackTime = now + i * 0.03;
      gain.gain.linearRampToValueAtTime(0, attackTime);
      gain.gain.linearRampToValueAtTime(0.08 - i * 0.015, attackTime + 0.1);
      gain.gain.linearRampToValueAtTime(0.06 - i * 0.01, now + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(output);

      oscillators.push(osc);
      gains.push(gain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    }
  }

  /**
   * Secret sound - ethereal bell (987ms)
   */
  private playSecret(): void {
    const ctx = audioManager.getContext();
    const output = audioManager.getMasterOutput();
    if (!ctx || !output) return;

    const duration = FIBONACCI_MS[5] / 1000; // 987ms
    const now = ctx.currentTime;

    // Bell-like sound with inharmonic partials
    const fundamentals = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major)
    const partials = [1, 2.4, 4.8, 6.2]; // Bell-like ratios

    for (let f = 0; f < fundamentals.length; f++) {
      for (let p = 0; p < partials.length; p++) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = fundamentals[f] * partials[p];

        const gain = ctx.createGain();
        const amplitude = 0.04 / (p + 1) / (f + 1); // Decreasing amplitude
        gain.gain.value = 0;

        // Bell envelope - sharp attack, long decay
        gain.gain.linearRampToValueAtTime(amplitude, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(
          amplitude * 0.3,
          now + duration * 0.3
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(output);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      }
    }

    // Add shimmer with slight pitch bend
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 1046.5; // C6
    shimmer.frequency.linearRampToValueAtTime(1108.73, now + duration); // C#6

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0;
    shimmerGain.gain.linearRampToValueAtTime(0.02, now + 0.1);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(output);

    shimmer.start(now);
    shimmer.stop(now + duration);
  }

  /**
   * Play a custom tone
   */
  playTone(frequency: number, duration: number = 0.2, type: OscillatorType = 'sine'): void {
    const ctx = audioManager.getContext();
    const output = audioManager.getMasterOutput();
    if (!ctx || !output) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(output);

    osc.start(now);
    osc.stop(now + duration);
  }
}

// Singleton export
export const soundEffects = new SoundEffects();
