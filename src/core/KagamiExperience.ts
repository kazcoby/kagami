/**
 * KagamiExperience — The Mirror of Infinite Reflection
 *
 * 鏡 (Kagami) — "In the mirror, we see not what is, but what could be."
 *
 * This is the main entry point for the Kagami WebXR experience,
 * orchestrating eight chapters of immersive reflection inspired by
 * Yayoi Kusama's infinity mirror installations.
 *
 * @author Kristi Jacoby <kristi.jacoby@canyons.edu>
 * @license MIT
 *
 * Craft Level: Transcendent
 * Theme: Hallows and Colonies
 */

import * as THREE from 'three';

// Core systems
import { eventBus } from './EventBus';
import { stateManager } from '../state/StateManager';

// Particle systems
import { ParticleManager } from '../particles/ParticleManager';
import { ConstellationSystem } from '../particles/ConstellationSystem';
import { MouseTrail } from '../particles/MouseTrail';

// Physics
import { PhysicsSystem } from '../physics/PhysicsSystem';

// Audio
import { audioManager } from '../audio/AudioManager';
import { AmbientDrone } from '../audio/AmbientDrone';
// Sound effects are triggered via eventBus

// Mechanics
import { secretManager } from '../mechanics/SecretManager';

// Fibonacci timing sequence — mathematics underlies aesthetics
export const FIBONACCI_MS = [89, 144, 233, 377, 610, 987] as const;

// Performance configuration — every pixel matters
export const PERF = {
  maxOrbs: 80,
  maxLights: 7,
  cubeUpdateRate: 30,
  sphereSegments: 16,
  enableGlow: true,
} as const;

// Colony colors from the Hallows and Colonies theme
export const COLONY_COLORS = {
  void: '#D4A853',      // Gold — The origin
  spark: '#FF7043',     // Creativity
  forge: '#FFB74D',     // Implementation
  flow: '#4DD0E1',      // Debugging
  nexus: '#B388FF',     // Integration
  beacon: '#FFE0B2',    // Architecture
  grove: '#81C784',     // Research
  crystal: '#4FC3F7',   // Testing
} as const;

// Chapter definitions — the eight stages of the journey
export interface ChapterConfig {
  id: number;
  name: string;
  particles: number;
  colony: keyof typeof COLONY_COLORS;
  description: string;
}

export const CHAPTERS: ChapterConfig[] = [
  { id: 1, name: 'The Void', particles: 60, colony: 'void', description: 'Origin — seven colonies + 60 polka dots' },
  { id: 2, name: 'Ignition', particles: 50, colony: 'spark', description: 'Explosive spark particles of creativity' },
  { id: 3, name: 'The Anvil', particles: 40, colony: 'forge', description: 'Molten droplets with upward motion' },
  { id: 4, name: 'Currents', particles: 45, colony: 'flow', description: '3 spiraling debugging streams' },
  { id: 5, name: 'The Web', particles: 12, colony: 'nexus', description: 'Network nodes + connection particles' },
  { id: 6, name: 'Lighthouse', particles: 48, colony: 'beacon', description: 'Central beacon + 8 rays' },
  { id: 7, name: 'The Grove', particles: 50, colony: 'grove', description: 'Branching tree structures' },
  { id: 8, name: 'Crystallization', particles: 43, colony: 'crystal', description: 'Octahedron geometry' },
];

/**
 * Main Kagami Experience class
 *
 * Initializes the WebXR environment and manages the eight-chapter journey.
 * Designed with accessibility in mind — provides fallbacks for non-VR users.
 */
export class KagamiExperience {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;

  private currentChapter: number = 0;
  private phase: number = 0;
  private xrSession: XRSession | null = null;

  // Systems
  private particleManager: ParticleManager;
  private constellations: ConstellationSystem;
  private mouseTrail: MouseTrail;
  private physics: PhysicsSystem;
  private ambientDrone: AmbientDrone;

  // Accessibility: respect motion preferences
  private readonly prefersReducedMotion: boolean;

  // Performance tracking
  private frameCount: number = 0;

  constructor(container: HTMLElement) {
    // Check motion preferences for accessibility
    this.prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.clock = new THREE.Clock();

    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07060B); // Void color

    // Camera with 80° FOV for immersive viewing
    this.camera = new THREE.PerspectiveCamera(
      80,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 0); // Standing height

    // WebGL renderer with optimal settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.xr.enabled = true;

    container.appendChild(this.renderer.domElement);

    // Initialize particle system
    this.particleManager = new ParticleManager(this.scene, PERF.maxOrbs);

    // Initialize constellation lines
    this.constellations = new ConstellationSystem(this.scene);

    // Initialize mouse trail
    this.mouseTrail = new MouseTrail(this.particleManager, this.camera);

    // Initialize physics
    this.physics = new PhysicsSystem(this.particleManager);

    // Initialize ambient drone
    this.ambientDrone = new AmbientDrone();

    // Add basic lighting
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize(container));

    // Set up hidden window object for transcendent discovery
    this.setupTranscendentLayer();

    // Spawn initial particles for The Void
    this.spawnChapterParticles(0);

    // Listen for chapter changes
    eventBus.on('chapter:enter', (e) => {
      this.physics.configureForChapter(e.payload.index);
    });

    // Announce to screen readers
    this.announceToScreenReader('Kagami experience loaded. Press Enter to begin.');
  }

  /**
   * Set up scene lighting
   */
  private setupLighting(): void {
    // Ambient light for base visibility
    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambient);

    // Gold point light for the void center
    const voidLight = new THREE.PointLight(
      new THREE.Color(COLONY_COLORS.void).getHex(),
      1,
      10
    );
    voidLight.position.set(0, 1.6, -3);
    this.scene.add(voidLight);
  }

  /**
   * Handle window resize
   */
  private handleResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  /**
   * Initialize WebXR session with graceful fallback
   */
  async initWebXR(): Promise<boolean> {
    if (!navigator.xr) {
      console.warn('[Kagami] WebXR not supported, using desktop mode');
      return false;
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-vr');
      if (!supported) {
        console.warn('[Kagami] Immersive VR not supported');
        return false;
      }

      this.xrSession = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'hand-tracking'],
      });

      await this.renderer.xr.setSession(this.xrSession);

      this.xrSession.addEventListener('end', () => {
        this.xrSession = null;
        this.announceToScreenReader('VR session ended');
      });

      this.announceToScreenReader('Entering VR mode');
      return true;
    } catch (error) {
      if ((error as DOMException).name === 'NotAllowedError') {
        console.warn('[Kagami] XR permission denied');
      }
      return false;
    }
  }

  /**
   * Navigate to a specific chapter
   */
  goToChapter(chapterIndex: number): void {
    if (chapterIndex < 0 || chapterIndex >= CHAPTERS.length) return;

    const previousChapter = this.currentChapter;
    this.currentChapter = chapterIndex;
    const chapter = CHAPTERS[chapterIndex];

    // Emit events
    eventBus.emit('chapter:exit', { index: previousChapter });
    eventBus.emit('chapter:enter', { index: chapterIndex, name: chapter.name });
    eventBus.emit('audio:trigger', { sound: 'chapter' });

    // Update ambient drone
    this.ambientDrone.setChapter(chapterIndex);

    // Track visit
    stateManager.visitChapter(chapterIndex);

    // Check for all chapters visited
    if (stateManager.hasVisitedAllChapters()) {
      secretManager.discover('all_chapters');
    }

    // Clear and spawn new particles
    this.particleManager.clearAll();
    this.spawnChapterParticles(chapterIndex);

    // Update constellation color
    this.constellations.setColor(COLONY_COLORS[chapter.colony]);

    // Announce chapter change for accessibility
    this.announceToScreenReader(
      `Chapter ${chapter.id}: ${chapter.name}. ${chapter.description}`
    );

    console.log(`[Kagami] Entering ${chapter.name} (${chapter.colony} colony)`);
  }

  /**
   * Spawn particles for a chapter
   */
  private spawnChapterParticles(chapterIndex: number): void {
    const chapter = CHAPTERS[chapterIndex];
    const color = COLONY_COLORS[chapter.colony];

    for (let i = 0; i < chapter.particles; i++) {
      this.particleManager.spawn({
        color,
        colony: chapter.colony,
        life: 10 + Math.random() * 10,
      });
    }
  }

  /**
   * Main animation loop with breathing effect
   */
  animate(): void {
    this.renderer.setAnimationLoop((time) => {
      const delta = this.clock.getDelta();

      // Global breathing phase (0.5 to 1.5 scale)
      if (!this.prefersReducedMotion) {
        this.phase = 0.5 + 0.5 * (1 + Math.sin(time * 0.001));
      } else {
        this.phase = 1; // Static for reduced motion
      }

      // Update all systems
      this.update(time, delta);

      // Render
      this.renderer.render(this.scene, this.camera);

      // Performance check
      this.checkPerformance(delta);
    });
  }

  /**
   * Update scene state each frame
   */
  private update(time: number, delta: number): void {
    // Update mouse trail
    this.mouseTrail.update(time);

    // Update physics (applies forces to particles)
    this.physics.update(delta);

    // Update cursor position for physics
    const cursorPos = this.mouseTrail.getWorldPosition();
    this.physics.setCursorPosition(cursorPos);

    // Update particles
    this.particleManager.update(delta, this.phase);

    // Update constellation lines
    const activeParticles = this.particleManager.getActive();
    this.constellations.update(activeParticles, this.phase);
  }

  /**
   * Check frame performance
   */
  private checkPerformance(delta: number): void {
    this.frameCount++;

    if (this.frameCount % 60 === 0) {
      const frameTime = delta * 1000;
      if (frameTime > 20) { // More than 20ms = under 50fps
        console.warn(`[Kagami] Frame budget exceeded: ${frameTime.toFixed(2)}ms`);
      }
    }
  }

  /**
   * Start ambient audio (call on user interaction)
   */
  async startAudio(): Promise<void> {
    await audioManager.init();
    this.ambientDrone.start();
  }

  /**
   * Toggle ambient audio
   */
  toggleAudio(): void {
    this.ambientDrone.toggle();
  }

  /**
   * Announce messages to screen readers
   */
  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement is read
    setTimeout(() => announcement.remove(), FIBONACCI_MS[4]); // 610ms
  }

  /**
   * Set up the transcendent discovery layer
   *
   * Hidden window object for those who explore deeply.
   * "Discovery rewards exploration"
   */
  private setupTranscendentLayer(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).鏡 = {
      // The mirror reveals itself to those who seek
      chapters: CHAPTERS.map(c => c.name),
      colonies: Object.keys(COLONY_COLORS),
      axioms: [
        'Every pixel matters',
        'Motion conveys meaning',
        'Discovery rewards exploration',
        'Layers hide depth',
        'Mathematics underlies aesthetics',
      ],
      fibonacci: FIBONACCI_MS,
      forKristi: 'The books became networks. The shelves became doorways.',

      // Statistics
      stats: () => stateManager.getStats(),

      // Secrets API
      secrets: secretManager.getPublicAPI(),

      // A gift for the curious
      reflect: () => {
        // Mark as discovered
        secretManager.discover('console_explorer');

        console.log('%c🪞 Kagami — The Mirror of Infinite Reflection',
          'font-size: 20px; color: #D4A853; font-family: Cinzel, serif;');
        console.log('%cYou found the hidden mirror. The journey rewards exploration.',
          'color: #F5E6C8; font-style: italic;');
        console.log('%c\nAvailable methods:', 'color: #B388FF;');
        console.log('%c  window.鏡.stats() — View your progress', 'color: #81C784;');
        console.log('%c  window.鏡.secrets.list() — List all secrets', 'color: #81C784;');
        console.log('%c  window.鏡.secrets.progress() — Check discovery progress', 'color: #81C784;');
        console.log('%c  window.鏡.summon("spark") — Summon a colony', 'color: #81C784;');
        return 'h(x) ≥ 0 — Always';
      },

      // Summon a colony animation
      summon: (colony: string) => {
        const colonyKey = colony.toLowerCase() as keyof typeof COLONY_COLORS;
        if (COLONY_COLORS[colonyKey]) {
          eventBus.emit('particle:spawn', {
            count: 10,
            color: COLONY_COLORS[colonyKey],
          });
          eventBus.emit('audio:trigger', { sound: 'discover' });
          console.log(`%c🏛️ ${colony} colony summoned`, `color: ${COLONY_COLORS[colonyKey]};`);
        } else {
          console.log('%cUnknown colony. Try: spark, forge, flow, nexus, beacon, grove, crystal',
            'color: #FF6B6B;');
        }
      },

      // Developer tools (hidden)
      _dev: {
        spawnParticles: (count: number = 10) => {
          eventBus.emit('particle:spawn', { count });
        },
        burst: (intensity: number = 1) => {
          eventBus.emit('particle:burst', { intensity });
        },
        shake: (intensity: number = 1) => {
          eventBus.emit('physics:shake', { intensity });
        },
        exportState: () => stateManager.exportState(),
      },
    };
  }

  /**
   * Get current chapter index
   */
  getCurrentChapter(): number {
    return this.currentChapter;
  }

  /**
   * Get particle manager (for external access)
   */
  getParticleManager(): ParticleManager {
    return this.particleManager;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.particleManager.dispose();
    this.constellations.dispose();
    this.ambientDrone.stop();
    this.renderer.dispose();
    if (this.xrSession) {
      this.xrSession.end();
    }
  }
}
