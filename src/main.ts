/**
 * Kagami Main Entry Point
 *
 * 鏡 (Kagami) — "In the mirror, we see not what is, but what could be."
 *
 * This module initializes the Kagami WebXR experience and sets up
 * keyboard navigation and chapter controls.
 */

import { KagamiExperience, CHAPTERS } from './core/KagamiExperience';

// Fibonacci timing for consistent animation durations
const FIBONACCI_MS = [89, 144, 233, 377, 610, 987] as const;

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
  const kagami = new KagamiExperience(container);

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
  if (vrButton) {
    vrButton.addEventListener('click', async () => {
      vrButton.disabled = true;
      vrButton.textContent = 'Entering...';

      const success = await kagami.initWebXR();

      if (success) {
        vrButton.textContent = 'Exit VR';
        vrButton.disabled = false;
      } else {
        vrButton.textContent = 'VR Unavailable';
        vrButton.setAttribute('aria-label', 'VR mode is not available on this device');
      }
    });

    // Check VR support
    if (!navigator.xr) {
      vrButton.disabled = true;
      vrButton.textContent = 'VR Not Supported';
    }
  }

  // Set up chapter navigation
  if (chapterNav) {
    const dots = chapterNav.querySelectorAll('.chapter-dot');

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        // Update visual state
        dots.forEach(d => {
          d.classList.remove('active');
          d.removeAttribute('aria-current');
        });
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');

        // Navigate to chapter
        kagami.goToChapter(index);
      });
    });
  }

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (event) => {
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
    }
  });

  let currentChapter = 0;

  function navigateChapter(delta: number): void {
    const newChapter = Math.max(0, Math.min(CHAPTERS.length - 1, currentChapter + delta));
    navigateToChapter(newChapter);
  }

  function navigateToChapter(index: number): void {
    currentChapter = index;
    kagami.goToChapter(index);

    // Update navigation dots
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

  // Log to console for those who explore (Transcendent layer)
  console.log(
    '%c🪞 Kagami v1.0.0',
    'font-size: 14px; color: #D4A853; font-weight: bold;'
  );
  console.log(
    '%cType window.鏡.reflect() to discover more.',
    'color: #F5E6C8; font-style: italic;'
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
