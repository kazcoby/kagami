/**
 * SecretManager — Discovery Tracking System
 *
 * Registry and reward system for hidden discoveries.
 * Persists to localStorage via StateManager.
 *
 * "Discovery rewards exploration" — every secret has a story.
 */

import { eventBus } from '../core/EventBus';
import { stateManager } from '../state/StateManager';
import { FIBONACCI_MS } from '../utils/craft';

export interface Secret {
  id: string;
  name: string;
  description: string;
  discovered: boolean;
  reward: () => void;
}

// All secrets in Kagami
const SECRETS_REGISTRY: Omit<Secret, 'discovered'>[] = [
  {
    id: 'konami',
    name: 'Konami Code',
    description: 'The classic sequence unlocks transcendent mode',
    reward: () => {
      eventBus.emit('particle:burst', { intensity: 2 });
      console.log('%c🎮 TRANSCENDENT MODE UNLOCKED',
        'font-size: 16px; color: #FFD93D; font-weight: bold;');
    },
  },
  {
    id: 'mirror_word',
    name: 'Mirror Word',
    description: 'Type "mirror" to see your reflection',
    reward: () => {
      // Flash golden overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: radial-gradient(circle, rgba(212,168,83,0.3) 0%, transparent 70%);
        pointer-events: none; animation: fadeOut ${FIBONACCI_MS[3]}ms ease-out forwards;
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), FIBONACCI_MS[3]);
      console.log('%c🪞 The mirror reveals itself', 'color: #D4A853;');
    },
  },
  {
    id: 'colony_word',
    name: 'Colony Word',
    description: 'Type "colony" to summon the seven',
    reward: () => {
      eventBus.emit('particle:spawn', { count: 7, color: '#D4A853' });
      console.log('%c🏛️ The Seven Colonies appear', 'color: #D4A853;');
    },
  },
  {
    id: 'kagami_word',
    name: 'Kagami Word',
    description: 'Type "kagami" to honor the mirror',
    reward: () => {
      console.log('%c鏡 — Kagami',
        'font-size: 24px; color: #D4A853; font-family: serif;');
      console.log('%c"In the mirror, we see not what is, but what could be."',
        'color: #F5E6C8; font-style: italic;');
    },
  },
  {
    id: 'kusama_word',
    name: 'Kusama Tribute',
    description: 'Type "kusama" to honor the artist',
    reward: () => {
      // Polka dot explosion
      eventBus.emit('particle:burst', { intensity: 3 });
      console.log('%c⚫ Yayoi Kusama — Infinity',
        'font-size: 16px; color: #FF6B6B;');
    },
  },
  {
    id: 'triple_click',
    name: 'Triple Click',
    description: 'Click three times quickly to burst',
    reward: () => {
      eventBus.emit('particle:burst', { intensity: 1.5 });
    },
  },
  {
    id: 'device_shake',
    name: 'Snow Globe',
    description: 'Shake your device to scatter particles',
    reward: () => {
      eventBus.emit('physics:shake', { intensity: 2 });
    },
  },
  {
    id: 'all_chapters',
    name: 'Complete Journey',
    description: 'Visit all eight chapters',
    reward: () => {
      eventBus.emit('particle:spawn', { count: 8, color: '#FFD93D' });
      console.log('%c✨ Journey Complete — All chapters explored',
        'font-size: 14px; color: #FFD93D; font-weight: bold;');
    },
  },
  {
    id: 'console_explorer',
    name: 'Console Explorer',
    description: 'Call window.鏡.reflect() in the console',
    reward: () => {
      console.log('%c🔮 You found the hidden path',
        'color: #B388FF; font-style: italic;');
    },
  },
  {
    id: 'long_press',
    name: 'Magnetic Hold',
    description: 'Hold click for 1 second',
    reward: () => {
      eventBus.emit('physics:magnetic', { active: true, repel: true });
      setTimeout(() => {
        eventBus.emit('physics:magnetic', { active: false });
      }, FIBONACCI_MS[4]);
    },
  },
];

/**
 * SecretManager tracks and rewards discoveries
 */
class SecretManagerImpl {
  private secrets: Map<string, Secret> = new Map();
  private totalSecrets: number;

  constructor() {
    // Initialize secrets from registry
    for (const secretDef of SECRETS_REGISTRY) {
      const discovered = stateManager.hasSecret(secretDef.id);
      this.secrets.set(secretDef.id, {
        ...secretDef,
        discovered,
      });
    }

    this.totalSecrets = SECRETS_REGISTRY.length;
  }

  /**
   * Discover a secret by ID
   */
  discover(id: string): boolean {
    const secret = this.secrets.get(id);
    if (!secret) {
      console.warn(`[SecretManager] Unknown secret: ${id}`);
      return false;
    }

    if (secret.discovered) {
      return false; // Already discovered
    }

    // Mark as discovered
    secret.discovered = true;
    stateManager.discoverSecret(id);

    // Emit event
    eventBus.emit('secret:discovered', { id, name: secret.name });
    eventBus.emit('audio:trigger', { sound: 'secret' });

    // Execute reward
    secret.reward();

    // Emit progress
    const progress = this.getProgress();
    eventBus.emit('secret:progress', progress);

    console.log(`[SecretManager] Discovered: ${secret.name} (${progress.found}/${progress.total})`);

    return true;
  }

  /**
   * Check if a secret has been discovered
   */
  isDiscovered(id: string): boolean {
    return this.secrets.get(id)?.discovered ?? false;
  }

  /**
   * Get list of all secret IDs
   */
  list(): string[] {
    return Array.from(this.secrets.keys());
  }

  /**
   * Get list of discovered secret IDs
   */
  listDiscovered(): string[] {
    return Array.from(this.secrets.values())
      .filter(s => s.discovered)
      .map(s => s.id);
  }

  /**
   * Check secret by name (for window.鏡 API)
   */
  check(name: string): boolean {
    // Find by ID or name
    for (const secret of this.secrets.values()) {
      if (secret.id === name || secret.name.toLowerCase() === name.toLowerCase()) {
        return secret.discovered;
      }
    }
    return false;
  }

  /**
   * Get discovery progress
   */
  getProgress(): { found: number; total: number } {
    const found = Array.from(this.secrets.values()).filter(s => s.discovered).length;
    return { found, total: this.totalSecrets };
  }

  /**
   * Get progress as string (for console)
   */
  progressString(): string {
    const { found, total } = this.getProgress();
    return `${found}/${total} secrets discovered`;
  }

  /**
   * Get secret details (for debugging)
   */
  getSecretDetails(id: string): Omit<Secret, 'reward'> | null {
    const secret = this.secrets.get(id);
    if (!secret) return null;

    return {
      id: secret.id,
      name: secret.name,
      description: secret.description,
      discovered: secret.discovered,
    };
  }

  /**
   * Reset all secrets (for testing)
   */
  reset(): void {
    for (const secret of this.secrets.values()) {
      secret.discovered = false;
    }
    stateManager.reset();
  }

  /**
   * Get public API for window.鏡
   */
  getPublicAPI(): {
    list: () => string[];
    check: (name: string) => boolean;
    progress: () => string;
  } {
    return {
      list: () => this.list(),
      check: (name: string) => this.check(name),
      progress: () => this.progressString(),
    };
  }
}

// Singleton export
export const secretManager = new SecretManagerImpl();

// Export type
export type SecretManager = typeof secretManager;
