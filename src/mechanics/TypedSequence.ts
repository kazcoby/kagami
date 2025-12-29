/**
 * TypedSequence — Hidden Word Detection
 *
 * Detects when users type specific words like "mirror", "colony", "kagami".
 * Words trigger secret discoveries.
 *
 * "Layers hide depth" — meaning emerges from keystrokes.
 */

import { secretManager } from './SecretManager';

interface WatchedWord {
  word: string;
  secretId: string;
  callback?: () => void;
}

const WATCHED_WORDS: WatchedWord[] = [
  { word: 'mirror', secretId: 'mirror_word' },
  { word: 'colony', secretId: 'colony_word' },
  { word: 'kagami', secretId: 'kagami_word' },
  { word: 'kusama', secretId: 'kusama_word' },
];

/**
 * TypedSequence detects hidden words
 */
export class TypedSequence {
  private buffer: string = '';
  private readonly MAX_BUFFER = 30;
  private readonly CLEAR_TIMEOUT_MS = 1500;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private watchedWords: WatchedWord[] = [...WATCHED_WORDS];

  constructor() {}

  /**
   * Handle a keydown event
   * @returns the detected word or null
   */
  handleKeydown(event: KeyboardEvent): string | null {
    // Ignore if user is typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return null;
    }

    // Ignore modifier keys
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return null;
    }

    // Only accept letter keys
    if (event.key.length !== 1 || !/[a-zA-Z]/.test(event.key)) {
      return null;
    }

    // Add to buffer
    this.buffer += event.key.toLowerCase();

    // Trim buffer if too long
    if (this.buffer.length > this.MAX_BUFFER) {
      this.buffer = this.buffer.slice(-this.MAX_BUFFER);
    }

    // Reset clear timeout
    this.resetTimeout();

    // Check for matches
    for (const watched of this.watchedWords) {
      if (this.buffer.endsWith(watched.word)) {
        this.onMatch(watched);
        return watched.word;
      }
    }

    return null;
  }

  /**
   * Reset the clear timeout
   */
  private resetTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.buffer = '';
    }, this.CLEAR_TIMEOUT_MS);
  }

  /**
   * Called when a word is matched
   */
  private onMatch(watched: WatchedWord): void {
    // Clear buffer after match
    this.buffer = '';

    // Trigger secret
    secretManager.discover(watched.secretId);

    // Execute callback if provided
    if (watched.callback) {
      watched.callback();
    }
  }

  /**
   * Register a custom word to watch
   */
  registerWord(word: string, secretId: string, callback?: () => void): void {
    // Check for duplicates
    if (this.watchedWords.some(w => w.word === word)) {
      console.warn(`[TypedSequence] Word already registered: ${word}`);
      return;
    }

    this.watchedWords.push({
      word: word.toLowerCase(),
      secretId,
      callback,
    });
  }

  /**
   * Unregister a word
   */
  unregisterWord(word: string): void {
    this.watchedWords = this.watchedWords.filter(w => w.word !== word.toLowerCase());
  }

  /**
   * Get current buffer (for debugging)
   */
  getBuffer(): string {
    return this.buffer;
  }

  /**
   * Get list of watched words
   */
  getWatchedWords(): string[] {
    return this.watchedWords.map(w => w.word);
  }

  /**
   * Clear the buffer
   */
  clear(): void {
    this.buffer = '';
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

// Export a pre-configured instance
export const typedSequence = new TypedSequence();
