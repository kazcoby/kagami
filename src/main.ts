/**
 * Kagami Main Entry Point
 *
 * 鏡 (Kagami) — "In the mirror, we see not what is, but what could be."
 *
 * This module initializes the Kagami WebXR experience and sets up
 * all interaction handlers including hidden mechanics.
 */

import { KagamiExperience, CHAPTERS, FIBONACCI_MS } from './core/KagamiExperience';

// Hidden mechanics
import { konamiCode } from './mechanics/KonamiCode';
import { typedSequence } from './mechanics/TypedSequence';
import { clickPattern } from './mechanics/ClickPattern';
import { gyroscopeHandler } from './mechanics/GyroscopeHandler';
import { eventBus } from './core/EventBus';

// State
let kagami: KagamiExperience | null = null;
let currentChapter = 0;
let audioStarted = false;

/**
 * Initialize the Kagami experience
 */
async function init(): Promise<void> {
  const container = document.getElementById('kagami-container');
  const loading = document.getElementById('loading');
  const vrButton = document.getElementById('vr-button');
  const chapterNav = document.getElementById('chapter-nav');

  if (!container) {
    console.error('[Kagami] Container element not found');
    return;
  }

  // Create the experience
  kagami = new KagamiExperience(container);

  // Hide loading screen with smooth transition
  if (loading) {
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, FIBONACCI_MS[3])); // 377ms
    loading.classList.add('hidden');

    // Remove from DOM after transition
    setTimeout(() => loading.remove(), FIBONACCI_MS[4]); // 610ms
  }

  // Start animation loop
  kagami.animate();

  // Set up VR button
  setupVRButton(vrButton);

  // Set up chapter navigation
  setupChapterNavigation(chapterNav);

  // Set up keyboard navigation and hidden mechanics
  setupKeyboardListeners();

  // Set up click/touch handlers
  setupClickHandlers();

  // Set up gyroscope (mobile)
  setupGyroscope();

  // Start audio on first interaction
  setupAudioActivation();

  // Log to console for those who explore (Transcendent layer)
  console.log(
    '%c🪞 Kagami v2.0.0',
    'font-size: 14px; color: #D4A853; font-weight: bold;'
  );
  console.log(
    '%cType window.鏡.reflect() to discover more.',
    'color: #F5E6C8; font-style: italic;'
  );
}

/**
 * Set up VR button
 */
function setupVRButton(vrButton: HTMLElement | null): void {
  if (!vrButton || !kagami) return;

  vrButton.addEventListener('click', async () => {
    (vrButton as HTMLButtonElement).disabled = true;
    vrButton.textContent = 'Entering...';

    const success = await kagami!.initWebXR();

    if (success) {
      vrButton.textContent = 'Exit VR';
      (vrButton as HTMLButtonElement).disabled = false;
    } else {
      vrButton.textContent = 'VR Unavailable';
      vrButton.setAttribute('aria-label', 'VR mode is not available on this device');
    }
  });

  // Check VR support
  if (!navigator.xr) {
    (vrButton as HTMLButtonElement).disabled = true;
    vrButton.textContent = 'VR Not Supported';
  }
}

/**
 * Set up chapter navigation dots
 */
function setupChapterNavigation(chapterNav: HTMLElement | null): void {
  if (!chapterNav || !kagami) return;

  const dots = chapterNav.querySelectorAll('.chapter-dot');

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      navigateToChapter(index);
    });
  });
}

/**
 * Set up keyboard listeners for navigation and hidden mechanics
 */
function setupKeyboardListeners(): void {
  document.addEventListener('keydown', (event) => {
    // Skip if user is typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Chapter navigation
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        navigateChapter(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        navigateChapter(-1);
        break;
      case 'Home':
        navigateToChapter(0);
        break;
      case 'End':
        navigateToChapter(CHAPTERS.length - 1);
        break;
      case 'm':
      case 'M':
        // Toggle audio
        if (kagami) {
          kagami.toggleAudio();
        }
        break;
    }

    // Hidden mechanics detection
    konamiCode.handleKeydown(event);
    typedSequence.handleKeydown(event);
  });
}

/**
 * Set up click/touch handlers for hidden mechanics
 */
function setupClickHandlers(): void {
  // Mouse events
  document.addEventListener('mousedown', (e) => clickPattern.handleMouseDown(e));
  document.addEventListener('mouseup', (e) => clickPattern.handleMouseUp(e));
  document.addEventListener('mouseleave', () => clickPattern.handleMouseLeave());

  // Triple click triggers particle burst
  clickPattern.setTripleClickCallback(() => {
    eventBus.emit('particle:burst', { intensity: 1.5 });
  });

  // Long press activates magnetic repulsion
  clickPattern.setLongPressCallback(() => {
    eventBus.emit('physics:magnetic', { active: true, repel: true });
    setTimeout(() => {
      eventBus.emit('physics:magnetic', { active: false });
    }, FIBONACCI_MS[4]); // 610ms
  });
}

/**
 * Set up gyroscope for mobile devices
 */
async function setupGyroscope(): Promise<void> {
  if (!gyroscopeHandler.getIsSupported()) {
    return;
  }

  // Set up shake callback
  gyroscopeHandler.setShakeCallback(() => {
    eventBus.emit('physics:shake', { intensity: 2 });
  });

  // Request permission on first touch (iOS requirement)
  const requestPermission = async () => {
    const granted = await gyroscopeHandler.requestPermission();
    if (granted) {
      gyroscopeHandler.start();
    }
    // Remove listener after first attempt
    document.removeEventListener('touchstart', requestPermission);
  };

  document.addEventListener('touchstart', requestPermission, { once: true });
}

/**
 * Set up audio activation on first user interaction
 */
function setupAudioActivation(): void {
  const startAudio = async () => {
    if (audioStarted || !kagami) return;
    audioStarted = true;
    await kagami.startAudio();
  };

  // Start audio on first interaction
  document.addEventListener('click', startAudio, { once: true });
  document.addEventListener('keydown', startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });
}

/**
 * Navigate to relative chapter
 */
function navigateChapter(delta: number): void {
  const newChapter = Math.max(0, Math.min(CHAPTERS.length - 1, currentChapter + delta));
  navigateToChapter(newChapter);
}

/**
 * Navigate to specific chapter
 */
function navigateToChapter(index: number): void {
  if (!kagami) return;

  currentChapter = index;
  kagami.goToChapter(index);

  // Update navigation dots
  const chapterNav = document.getElementById('chapter-nav');
  if (chapterNav) {
    const dots = chapterNav.querySelectorAll('.chapter-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential external use
export { kagami, navigateToChapter };
