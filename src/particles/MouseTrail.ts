/**
 * MouseTrail — Cursor-Following Particle Effect
 *
 * Spawns particles at the cursor position that drift and fade,
 * creating an ethereal trail effect.
 *
 * "Motion conveys meaning" — your presence leaves traces in the mirror.
 */

import * as THREE from 'three';
import { ParticleManager, SpawnConfig } from './ParticleManager';
import { randomRange } from '../utils/math';
import { COLONY_COLORS } from '../core/KagamiExperience';

export interface MouseTrailConfig {
  enabled: boolean;
  spawnInterval: number; // ms between spawns
  trailLength: number; // max particles in trail
  particleLife: number; // seconds
  driftSpeed: number;
  colorCycle: boolean;
}

const DEFAULT_CONFIG: MouseTrailConfig = {
  enabled: true,
  spawnInterval: 50, // 20 particles per second max
  trailLength: 20,
  particleLife: 2,
  driftSpeed: 0.02,
  colorCycle: true,
};

/**
 * MouseTrail creates particles that follow the cursor
 */
export class MouseTrail {
  private config: MouseTrailConfig;
  private particleManager: ParticleManager;
  private camera: THREE.Camera;

  // Mouse state
  private mousePosition: THREE.Vector2 = new THREE.Vector2();
  private worldPosition: THREE.Vector3 = new THREE.Vector3();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private isMouseInView: boolean = false;

  // Spawning control
  private lastSpawnTime: number = 0;
  private trailParticleIds: number[] = [];
  private colorPhase: number = 0;

  // Reduced motion
  private prefersReducedMotion: boolean;

  // Colony colors for cycling
  private colonyColors = Object.values(COLONY_COLORS);

  constructor(
    particleManager: ParticleManager,
    camera: THREE.Camera,
    config: Partial<MouseTrailConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.particleManager = particleManager;
    this.camera = camera;

    this.prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable if reduced motion
    if (this.prefersReducedMotion) {
      this.config.enabled = false;
    }

    // Set up mouse listeners
    this.setupListeners();
  }

  /**
   * Set up mouse event listeners
   */
  private setupListeners(): void {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseenter', () => (this.isMouseInView = true));
    window.addEventListener('mouseleave', () => (this.isMouseInView = false));

    // Touch support
    window.addEventListener('touchmove', this.handleTouchMove.bind(this), {
      passive: true,
    });
    window.addEventListener('touchstart', () => (this.isMouseInView = true));
    window.addEventListener('touchend', () => (this.isMouseInView = false));
  }

  /**
   * Handle mouse movement
   */
  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.isMouseInView = true;
  }

  /**
   * Handle touch movement
   */
  private handleTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      this.isMouseInView = true;
    }
  }

  /**
   * Update world position from screen coordinates
   */
  private updateWorldPosition(): void {
    this.raycaster.setFromCamera(this.mousePosition, this.camera);

    // Project to a plane at z = -3 (in front of camera)
    const distance = 3;
    this.worldPosition
      .copy(this.raycaster.ray.direction)
      .multiplyScalar(distance)
      .add(this.raycaster.ray.origin);
  }

  /**
   * Update trail - call this every frame
   */
  update(time: number): void {
    if (!this.config.enabled || !this.isMouseInView) return;

    // Update world position
    this.updateWorldPosition();

    // Check spawn interval
    if (time - this.lastSpawnTime < this.config.spawnInterval) return;

    // Limit trail length
    if (this.trailParticleIds.length >= this.config.trailLength) {
      // Remove oldest
      this.trailParticleIds.shift();
    }

    // Spawn new particle
    const spawnConfig: SpawnConfig = {
      position: this.worldPosition.clone(),
      velocity: new THREE.Vector3(
        randomRange(-this.config.driftSpeed, this.config.driftSpeed),
        randomRange(0, this.config.driftSpeed * 2), // Slight upward drift
        randomRange(-this.config.driftSpeed, this.config.driftSpeed)
      ),
      life: this.config.particleLife,
      size: randomRange(0.3, 0.8),
    };

    // Color cycling
    if (this.config.colorCycle) {
      this.colorPhase += 0.05;
      const colorIndex = Math.floor(this.colorPhase) % this.colonyColors.length;
      spawnConfig.color = this.colonyColors[colorIndex];
    } else {
      spawnConfig.color = COLONY_COLORS.void;
    }

    const particle = this.particleManager.spawn(spawnConfig);
    if (particle) {
      this.trailParticleIds.push(particle.id);
    }

    this.lastSpawnTime = time;
  }

  /**
   * Enable/disable trail
   */
  setEnabled(enabled: boolean): void {
    if (this.prefersReducedMotion && enabled) {
      console.warn('[MouseTrail] Disabled due to prefers-reduced-motion');
      return;
    }
    this.config.enabled = enabled;
  }

  /**
   * Check if trail is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Set spawn interval
   */
  setSpawnInterval(ms: number): void {
    this.config.spawnInterval = Math.max(16, ms); // Min 60fps
  }

  /**
   * Set color cycling
   */
  setColorCycle(enabled: boolean): void {
    this.config.colorCycle = enabled;
  }

  /**
   * Get current mouse world position
   */
  getWorldPosition(): THREE.Vector3 {
    return this.worldPosition.clone();
  }

  /**
   * Get normalized mouse position (-1 to 1)
   */
  getNormalizedPosition(): THREE.Vector2 {
    return this.mousePosition.clone();
  }
}
