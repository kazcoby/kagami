/**
 * KonamiCode — Classic Arrow Sequence Detection
 *
 * ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * "Discovery rewards exploration" — the code lives on.
 */

import { secretManager } from './SecretManager';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

/**
 * KonamiCode detector
 */
export class KonamiCode {
  private currentIndex: number = 0;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private readonly TIMEOUT_MS = 2000; // Reset after 2 seconds of inactivity
  private callback: (() => void) | null = null;

  constructor(callback?: () => void) {
    this.callback = callback || null;
  }

  /**
   * Handle a keydown event
   * @returns true if the sequence was completed
   */
  handleKeydown(event: KeyboardEvent): boolean {
    // Reset timeout
    this.resetTimeout();

    // Get the expected key
    const expectedKey = KONAMI_SEQUENCE[this.currentIndex];

    // Check if the pressed key matches
    if (event.code === expectedKey) {
      this.currentIndex++;

      // Check if sequence is complete
      if (this.currentIndex === KONAMI_SEQUENCE.length) {
        this.complete();
        return true;
      }
    } else {
      // Wrong key - check if it's the start of a new sequence
      if (event.code === KONAMI_SEQUENCE[0]) {
        this.currentIndex = 1;
      } else {
        this.currentIndex = 0;
      }
    }

    return false;
  }

  /**
   * Reset the timeout
   */
  private resetTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.currentIndex = 0;
    }, this.TIMEOUT_MS);
  }

  /**
   * Called when sequence is complete
   */
  private complete(): void {
    this.currentIndex = 0;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    // Trigger secret
    secretManager.discover('konami');

    // Execute callback if provided
    if (this.callback) {
      this.callback();
    }
  }

  /**
   * Get current progress (for debugging)
   */
  getProgress(): { current: number; total: number; sequence: string[] } {
    return {
      current: this.currentIndex,
      total: KONAMI_SEQUENCE.length,
      sequence: KONAMI_SEQUENCE.slice(0, this.currentIndex),
    };
  }

  /**
   * Reset the detector
   */
  reset(): void {
    this.currentIndex = 0;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  /**
   * Set callback for completion
   */
  setCallback(callback: () => void): void {
    this.callback = callback;
  }
}

// Export a pre-configured instance
export const konamiCode = new KonamiCode();
