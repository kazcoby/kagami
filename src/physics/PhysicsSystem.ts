/**
 * PhysicsSystem — Unified Physics Engine
 *
 * Manages all physics forces and applies them to particles.
 * Supports spring dynamics, magnetic cursor, gravity wells, and more.
 *
 * "Motion conveys meaning" — physics brings the mirror to life.
 */

import * as THREE from 'three';
import { ParticleManager } from '../particles/ParticleManager';
import { eventBus } from '../core/EventBus';
import {
  calculateSpringForce,
  calculateMagneticForce,
  calculateGravityForce,
  calculateTurbulenceForce,
  calculateBoundaryForce,
} from './forces';

export interface GravityWell {
  id: string;
  position: THREE.Vector3;
  strength: number;
  radius: number;
  falloff: 'constant' | 'linear' | 'quadratic';
  active: boolean;
}

export interface PhysicsConfig {
  enabled: boolean;
  magneticCursor: boolean;
  magneticStrength: number;
  magneticRadius: number;
  globalGravity: THREE.Vector3;
  damping: number;
  bounds: THREE.Box3;
  boundaryStrength: number;
}

const DEFAULT_CONFIG: PhysicsConfig = {
  enabled: true,
  magneticCursor: true,
  magneticStrength: 0.5,
  magneticRadius: 3.0,
  globalGravity: new THREE.Vector3(0, -0.01, 0),
  damping: 0.98,
  bounds: new THREE.Box3(
    new THREE.Vector3(-10, -5, -10),
    new THREE.Vector3(10, 10, 10)
  ),
  boundaryStrength: 0.5,
};

/**
 * PhysicsSystem applies forces to particles
 */
export class PhysicsSystem {
  private config: PhysicsConfig;
  private particleManager: ParticleManager;
  private gravityWells: Map<string, GravityWell> = new Map();

  // Cursor state
  private cursorPosition: THREE.Vector3 = new THREE.Vector3(0, 1.6, -3);
  private cursorActive: boolean = false;
  private cursorRepel: boolean = false;

  // Time tracking
  private time: number = 0;

  // Reduced motion
  private prefersReducedMotion: boolean;

  constructor(
    particleManager: ParticleManager,
    config: Partial<PhysicsConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.particleManager = particleManager;

    this.prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.prefersReducedMotion) {
      this.config.enabled = false;
    }

    // Listen for physics events
    eventBus.on('physics:magnetic', (e) => {
      this.cursorActive = e.payload.active;
      this.cursorRepel = e.payload.repel || false;
    });

    eventBus.on('physics:shake', (e) => {
      this.shake(e.payload.intensity);
    });

    // Set up input listeners
    this.setupInputListeners();
  }

  /**
   * Set up mouse/keyboard listeners for magnetic cursor
   */
  private setupInputListeners(): void {
    // Track Shift key for repulsion mode
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') {
        this.cursorRepel = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.cursorRepel = false;
      }
    });
  }

  /**
   * Update cursor position (called from MouseTrail)
   */
  setCursorPosition(position: THREE.Vector3): void {
    this.cursorPosition.copy(position);
    this.cursorActive = true;
  }

  /**
   * Update physics simulation
   */
  update(deltaTime: number): void {
    if (!this.config.enabled || this.prefersReducedMotion) return;

    // Cap delta to prevent tunneling
    const cappedDelta = Math.min(deltaTime, 0.1);
    this.time += cappedDelta;

    const particles = this.particleManager.getActive();

    for (const particle of particles) {
      const totalForce = new THREE.Vector3(0, 0, 0);

      // Global gravity
      totalForce.add(this.config.globalGravity);

      // Magnetic cursor
      if (this.config.magneticCursor && this.cursorActive) {
        const distance = particle.position.distanceTo(this.cursorPosition);
        if (distance < this.config.magneticRadius) {
          const strength = this.cursorRepel
            ? -this.config.magneticStrength
            : this.config.magneticStrength;
          const magneticForce = calculateMagneticForce(
            particle.position,
            this.cursorPosition,
            strength,
            0.2,
            this.config.magneticRadius
          );
          totalForce.add(magneticForce);
        }
      }

      // Gravity wells
      for (const well of this.gravityWells.values()) {
        if (!well.active) continue;

        const distance = particle.position.distanceTo(well.position);
        if (distance < well.radius) {
          const gravityForce = calculateGravityForce(
            particle.position,
            well.position,
            well.strength,
            well.falloff
          );
          totalForce.add(gravityForce);
        }
      }

      // Spring to target (if particle has one)
      if (particle.targetPosition) {
        const springForce = calculateSpringForce(
          particle.position,
          particle.targetPosition,
          particle.velocity,
          0.1,
          0.5
        );
        totalForce.add(springForce);
      }

      // Boundary forces
      const boundaryForce = calculateBoundaryForce(
        particle.position,
        this.config.bounds,
        this.config.boundaryStrength,
        1.0
      );
      totalForce.add(boundaryForce);

      // Light turbulence
      const turbulence = calculateTurbulenceForce(
        particle.position,
        this.time,
        0.01,
        0.5
      );
      totalForce.add(turbulence);

      // Apply force to acceleration
      particle.acceleration.add(totalForce);

      // Apply damping to velocity
      particle.velocity.multiplyScalar(this.config.damping);
    }
  }

  /**
   * Apply shake effect (scatter particles)
   */
  shake(intensity: number = 1): void {
    const particles = this.particleManager.getActive();

    for (const particle of particles) {
      const randomForce = new THREE.Vector3(
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity
      );
      particle.velocity.add(randomForce);
    }

    eventBus.emit('audio:trigger', { sound: 'discover' });
  }

  /**
   * Add a gravity well
   */
  addGravityWell(well: Omit<GravityWell, 'active'>): void {
    this.gravityWells.set(well.id, { ...well, active: true });
  }

  /**
   * Remove a gravity well
   */
  removeGravityWell(id: string): void {
    this.gravityWells.delete(id);
  }

  /**
   * Set gravity well active state
   */
  setGravityWellActive(id: string, active: boolean): void {
    const well = this.gravityWells.get(id);
    if (well) {
      well.active = active;
    }
  }

  /**
   * Clear all gravity wells
   */
  clearGravityWells(): void {
    this.gravityWells.clear();
  }

  /**
   * Configure for a specific chapter
   */
  configureForChapter(chapterIndex: number): void {
    this.clearGravityWells();

    switch (chapterIndex) {
      case 0: // The Void - central pull
        this.addGravityWell({
          id: 'void-center',
          position: new THREE.Vector3(0, 1.6, -3),
          strength: 0.02,
          radius: 5,
          falloff: 'quadratic',
        });
        break;

      case 2: // The Anvil (Forge) - upward lift
        this.config.globalGravity.set(0, 0.02, 0);
        break;

      case 3: // Currents (Flow) - vortex effect
        // Vortex is handled in update with special logic
        this.addGravityWell({
          id: 'flow-vortex',
          position: new THREE.Vector3(0, 1.6, -3),
          strength: 0.01,
          radius: 4,
          falloff: 'linear',
        });
        break;

      case 7: // Crystallization - multiple wells
        const vertices = [
          new THREE.Vector3(0, 3, -3),
          new THREE.Vector3(0, 0, -3),
          new THREE.Vector3(2, 1.5, -2),
          new THREE.Vector3(-2, 1.5, -2),
          new THREE.Vector3(0, 1.5, -1),
          new THREE.Vector3(0, 1.5, -5),
        ];
        vertices.forEach((pos, i) => {
          this.addGravityWell({
            id: `crystal-${i}`,
            position: pos,
            strength: 0.03,
            radius: 2,
            falloff: 'quadratic',
          });
        });
        break;

      default:
        // Reset to default gravity
        this.config.globalGravity.set(0, -0.01, 0);
    }
  }

  /**
   * Enable/disable physics
   */
  setEnabled(enabled: boolean): void {
    if (this.prefersReducedMotion && enabled) {
      console.warn('[PhysicsSystem] Disabled due to prefers-reduced-motion');
      return;
    }
    this.config.enabled = enabled;
  }

  /**
   * Set magnetic cursor strength
   */
  setMagneticStrength(strength: number): void {
    this.config.magneticStrength = strength;
  }

  /**
   * Set global gravity
   */
  setGlobalGravity(gravity: THREE.Vector3): void {
    this.config.globalGravity.copy(gravity);
  }
}
