/**
 * ParticleManager — Object Pool for Efficient Particle Rendering
 *
 * Uses THREE.InstancedMesh for single draw call rendering of all particles.
 * Maximum 80 particles (PERF.maxOrbs constraint).
 *
 * "Every pixel matters" — each particle is deliberately placed.
 */

import * as THREE from 'three';
import { eventBus } from '../core/EventBus';
import { PERF, COLONY_COLORS } from '../core/KagamiExperience';
import { randomInSphere, randomRange } from '../utils/math';

export interface Particle {
  id: number;
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  targetPosition: THREE.Vector3 | null;
  life: number;
  maxLife: number;
  color: THREE.Color;
  size: number;
  baseSize: number;
  colony: keyof typeof COLONY_COLORS | null;
}

export interface SpawnConfig {
  position?: THREE.Vector3;
  velocity?: THREE.Vector3;
  color?: THREE.Color | string;
  size?: number;
  life?: number;
  colony?: keyof typeof COLONY_COLORS;
  targetPosition?: THREE.Vector3;
}

/**
 * ParticleManager handles the lifecycle and rendering of all particles
 */
export class ParticleManager {
  private pool: Particle[] = [];
  private mesh: THREE.InstancedMesh;
  private dummy: THREE.Object3D = new THREE.Object3D();
  private colorAttribute: THREE.InstancedBufferAttribute;

  private readonly MAX_PARTICLES: number;
  private activeCount: number = 0;

  // Reduced motion flag
  private prefersReducedMotion: boolean;

  constructor(scene: THREE.Scene, maxParticles: number = PERF.maxOrbs) {
    this.MAX_PARTICLES = maxParticles;
    this.prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create geometry (icosahedron for organic feel)
    const geometry = new THREE.IcosahedronGeometry(0.05, 1);

    // Create material with glow effect
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    // Create instanced mesh
    this.mesh = new THREE.InstancedMesh(geometry, material, this.MAX_PARTICLES);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;

    // Per-instance colors
    const colors = new Float32Array(this.MAX_PARTICLES * 3);
    this.colorAttribute = new THREE.InstancedBufferAttribute(colors, 3);
    geometry.setAttribute('color', this.colorAttribute);
    material.vertexColors = true;

    // Initialize particle pool
    for (let i = 0; i < this.MAX_PARTICLES; i++) {
      this.pool.push({
        id: i,
        active: false,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        targetPosition: null,
        life: 0,
        maxLife: 1,
        color: new THREE.Color(COLONY_COLORS.void),
        size: 1,
        baseSize: 1,
        colony: null,
      });

      // Hide inactive particles
      this.dummy.position.set(0, -1000, 0);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    scene.add(this.mesh);

    // Listen for spawn events
    eventBus.on('particle:spawn', (e) => {
      const { count, color, position } = e.payload;
      for (let i = 0; i < count; i++) {
        this.spawn({
          position: position
            ? new THREE.Vector3(position.x, position.y, position.z)
            : undefined,
          color: color || undefined,
        });
      }
    });

    eventBus.on('particle:burst', (e) => {
      this.burst(e.payload.intensity);
    });

    eventBus.on('particle:clear', () => {
      this.clearAll();
    });
  }

  /**
   * Spawn a new particle
   */
  spawn(config: SpawnConfig = {}): Particle | null {
    // Find inactive particle
    const particle = this.pool.find(p => !p.active);
    if (!particle) {
      console.warn('[ParticleManager] Pool exhausted');
      return null;
    }

    // Configure particle
    particle.active = true;
    particle.position.copy(config.position || randomInSphere(3));
    particle.velocity.copy(config.velocity || new THREE.Vector3(
      randomRange(-0.01, 0.01),
      randomRange(-0.01, 0.01),
      randomRange(-0.01, 0.01)
    ));
    particle.acceleration.set(0, 0, 0);
    particle.targetPosition = config.targetPosition || null;

    // Color
    if (config.color) {
      if (typeof config.color === 'string') {
        particle.color.set(config.color);
      } else {
        particle.color.copy(config.color);
      }
    } else {
      particle.color.set(COLONY_COLORS.void);
    }

    // Colony assignment
    particle.colony = config.colony || null;
    if (particle.colony && !config.color) {
      particle.color.set(COLONY_COLORS[particle.colony]);
    }

    // Size and life
    particle.baseSize = config.size || randomRange(0.5, 1.5);
    particle.size = particle.baseSize;
    particle.maxLife = config.life || randomRange(5, 15);
    particle.life = particle.maxLife;

    this.activeCount++;

    return particle;
  }

  /**
   * Spawn multiple particles in a burst pattern
   */
  burst(intensity: number = 1, center?: THREE.Vector3): void {
    const count = Math.min(Math.floor(10 * intensity), this.MAX_PARTICLES - this.activeCount);
    const origin = center || new THREE.Vector3(0, 1.6, -2);

    for (let i = 0; i < count; i++) {
      const direction = randomInSphere(1).normalize();
      const speed = randomRange(0.05, 0.15) * intensity;

      this.spawn({
        position: origin.clone(),
        velocity: direction.multiplyScalar(speed),
        life: randomRange(1, 3),
        size: randomRange(0.8, 1.5),
      });
    }

    eventBus.emit('audio:trigger', { sound: 'discover' });
  }

  /**
   * Update all particles
   */
  update(deltaTime: number, breathingPhase: number = 1): void {
    const dt = Math.min(deltaTime, 0.1); // Cap delta to prevent tunneling

    for (const particle of this.pool) {
      if (!particle.active) continue;

      // Decrease life
      particle.life -= dt;
      if (particle.life <= 0) {
        this.deactivate(particle);
        continue;
      }

      // Skip physics if reduced motion
      if (!this.prefersReducedMotion) {
        // Apply acceleration to velocity
        particle.velocity.add(
          particle.acceleration.clone().multiplyScalar(dt)
        );

        // Apply velocity to position
        particle.position.add(
          particle.velocity.clone().multiplyScalar(dt)
        );

        // Spring toward target if set
        if (particle.targetPosition) {
          const direction = particle.targetPosition.clone().sub(particle.position);
          particle.velocity.add(direction.multiplyScalar(0.02));
          particle.velocity.multiplyScalar(0.95); // Damping
        }

        // Reset acceleration for next frame
        particle.acceleration.set(0, 0, 0);
      }

      // Breathing size modulation
      const lifeRatio = particle.life / particle.maxLife;
      const fadeIn = Math.min(lifeRatio * 5, 1); // Quick fade in
      const fadeOut = Math.min((1 - lifeRatio) * 5, 1); // Fade out at end
      particle.size = particle.baseSize * fadeIn * (1 - fadeOut * 0.5) * breathingPhase;

      // Update instance matrix
      this.updateInstance(particle);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.colorAttribute.needsUpdate = true;
  }

  /**
   * Update a single particle's instance data
   */
  private updateInstance(particle: Particle): void {
    this.dummy.position.copy(particle.position);
    this.dummy.scale.setScalar(particle.size);
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(particle.id, this.dummy.matrix);

    // Update color
    const offset = particle.id * 3;
    this.colorAttribute.array[offset] = particle.color.r;
    this.colorAttribute.array[offset + 1] = particle.color.g;
    this.colorAttribute.array[offset + 2] = particle.color.b;
  }

  /**
   * Deactivate a particle
   */
  private deactivate(particle: Particle): void {
    particle.active = false;
    particle.life = 0;

    // Hide particle
    this.dummy.position.set(0, -1000, 0);
    this.dummy.scale.set(0, 0, 0);
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(particle.id, this.dummy.matrix);

    this.activeCount--;
  }

  /**
   * Clear all particles
   */
  clearAll(): void {
    for (const particle of this.pool) {
      if (particle.active) {
        this.deactivate(particle);
      }
    }
  }

  /**
   * Get all active particles
   */
  getActive(): Particle[] {
    return this.pool.filter(p => p.active);
  }

  /**
   * Get active particle count
   */
  getActiveCount(): number {
    return this.activeCount;
  }

  /**
   * Apply force to all active particles
   */
  applyForce(force: THREE.Vector3): void {
    for (const particle of this.pool) {
      if (particle.active) {
        particle.acceleration.add(force);
      }
    }
  }

  /**
   * Apply radial force from a point
   */
  applyRadialForce(center: THREE.Vector3, strength: number, radius: number): void {
    for (const particle of this.pool) {
      if (!particle.active) continue;

      const direction = particle.position.clone().sub(center);
      const distance = direction.length();

      if (distance < radius && distance > 0.01) {
        const falloff = 1 - distance / radius;
        const force = direction.normalize().multiplyScalar(strength * falloff);
        particle.acceleration.add(force);
      }
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
