/**
 * ClickPattern — Click Combination Detection
 *
 * Detects click patterns like triple-click and long press.
 * Triggers secrets and interactions.
 *
 * "Motion conveys meaning" — even clicks tell a story.
 */

import { secretManager } from './SecretManager';
import { FIBONACCI_MS } from '../utils/craft';

export type ClickPatternType = 'triple' | 'long_press' | 'double';

interface ClickEvent {
  timestamp: number;
  x: number;
  y: number;
}

/**
 * ClickPattern detects click combinations
 */
export class ClickPattern {
  private clicks: ClickEvent[] = [];
  private readonly MULTI_CLICK_WINDOW = 500; // ms between clicks
  private readonly LONG_PRESS_DURATION = 1000; // 1 second
  private readonly CLICK_DISTANCE_THRESHOLD = 50; // pixels

  private longPressTimeout: ReturnType<typeof setTimeout> | null = null;
  private pressStartTime: number = 0;
  private pressPosition: { x: number; y: number } | null = null;

  // Callbacks
  private onTripleClick: (() => void) | null = null;
  private onLongPress: (() => void) | null = null;
  private onDoubleClick: ((x: number, y: number) => void) | null = null;

  constructor() {}

  /**
   * Handle mousedown event
   */
  handleMouseDown(event: MouseEvent): void {
    this.pressStartTime = performance.now();
    this.pressPosition = { x: event.clientX, y: event.clientY };

    // Start long press timer
    this.longPressTimeout = setTimeout(() => {
      this.onLongPressDetected();
    }, this.LONG_PRESS_DURATION);
  }

  /**
   * Handle mouseup event
   */
  handleMouseUp(event: MouseEvent): void {
    // Cancel long press
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    const pressDuration = performance.now() - this.pressStartTime;

    // Only count as click if it wasn't a long press
    if (pressDuration < this.LONG_PRESS_DURATION) {
      this.registerClick(event.clientX, event.clientY);
    }

    this.pressPosition = null;
  }

  /**
   * Handle mouse leave (cancel long press)
   */
  handleMouseLeave(): void {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
    this.pressPosition = null;
  }

  /**
   * Register a click and check for patterns
   */
  private registerClick(x: number, y: number): void {
    const now = performance.now();

    // Clean old clicks
    this.clicks = this.clicks.filter(
      click => now - click.timestamp < this.MULTI_CLICK_WINDOW
    );

    // Check if click is in same area as previous clicks
    const isSameArea = this.clicks.every(click => {
      const dx = click.x - x;
      const dy = click.y - y;
      return Math.sqrt(dx * dx + dy * dy) < this.CLICK_DISTANCE_THRESHOLD;
    });

    if (!isSameArea) {
      // Reset if click is in different area
      this.clicks = [];
    }

    // Add new click
    this.clicks.push({ timestamp: now, x, y });

    // Check patterns
    this.checkPatterns(x, y);
  }

  /**
   * Check for click patterns
   */
  private checkPatterns(x: number, y: number): void {
    const clickCount = this.clicks.length;

    if (clickCount === 2) {
      // Double click detected
      if (this.onDoubleClick) {
        this.onDoubleClick(x, y);
      }
    } else if (clickCount >= 3) {
      // Triple click detected
      this.onTripleClickDetected();
      this.clicks = []; // Reset
    }
  }

  /**
   * Called when triple click is detected
   */
  private onTripleClickDetected(): void {
    secretManager.discover('triple_click');

    if (this.onTripleClick) {
      this.onTripleClick();
    }
  }

  /**
   * Called when long press is detected
   */
  private onLongPressDetected(): void {
    this.longPressTimeout = null;

    secretManager.discover('long_press');

    if (this.onLongPress) {
      this.onLongPress();
    }

    // Visual feedback - create ripple effect
    if (this.pressPosition) {
      this.createRipple(this.pressPosition.x, this.pressPosition.y);
    }
  }

  /**
   * Create a visual ripple effect
   */
  private createRipple(x: number, y: number): void {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,168,83,0.4) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
      animation: rippleExpand ${FIBONACCI_MS[4]}ms ease-out forwards;
    `;

    // Add keyframes if not present
    if (!document.getElementById('kagami-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'kagami-ripple-style';
      style.textContent = `
        @keyframes rippleExpand {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), FIBONACCI_MS[4]);
  }

  /**
   * Set triple click callback
   */
  setTripleClickCallback(callback: () => void): void {
    this.onTripleClick = callback;
  }

  /**
   * Set long press callback
   */
  setLongPressCallback(callback: () => void): void {
    this.onLongPress = callback;
  }

  /**
   * Set double click callback
   */
  setDoubleClickCallback(callback: (x: number, y: number) => void): void {
    this.onDoubleClick = callback;
  }

  /**
   * Get click count (for debugging)
   */
  getClickCount(): number {
    return this.clicks.length;
  }

  /**
   * Reset state
   */
  reset(): void {
    this.clicks = [];
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
    this.pressPosition = null;
  }
}

// Export a pre-configured instance
export const clickPattern = new ClickPattern();
