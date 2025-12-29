/**
 * ConstellationSystem — Dynamic Line Connections Between Particles
 *
 * Draws shimmering lines between nearby particles, creating
 * constellation-like patterns that shift with movement.
 *
 * Uses spatial hashing for O(n) neighbor lookup instead of O(n^2).
 *
 * "Layers hide depth" — connections reveal hidden relationships.
 */

import * as THREE from 'three';
import { Particle } from './ParticleManager';
import { SpatialHash, distanceSquared, lerp } from '../utils/math';

export interface ConstellationConfig {
  connectionDistance: number;
  maxConnections: number;
  lineOpacity: number;
  lineColor: THREE.Color;
  fadeWithDistance: boolean;
}

const DEFAULT_CONFIG: ConstellationConfig = {
  connectionDistance: 2.0,
  maxConnections: 200,
  lineOpacity: 0.4,
  lineColor: new THREE.Color('#D4A853'), // Gold
  fadeWithDistance: true,
};

/**
 * ConstellationSystem renders lines between nearby particles
 */
export class ConstellationSystem {
  private config: ConstellationConfig;
  private lineGeometry: THREE.BufferGeometry;
  private lineMaterial: THREE.LineBasicMaterial;
  private lineSegments: THREE.LineSegments;
  private spatialHash: SpatialHash;

  // Pre-allocated buffers
  private positions: Float32Array;
  private colors: Float32Array;
  private connectionCount: number = 0;

  // Reduced motion flag
  private prefersReducedMotion: boolean;

  constructor(scene: THREE.Scene, config: Partial<ConstellationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create spatial hash with cell size equal to connection distance
    this.spatialHash = new SpatialHash(this.config.connectionDistance);

    // Pre-allocate buffers for max connections (2 vertices per line)
    const maxVertices = this.config.maxConnections * 2;
    this.positions = new Float32Array(maxVertices * 3);
    this.colors = new Float32Array(maxVertices * 3);

    // Create geometry
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.lineGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.colors, 3)
    );

    // Create material with vertex colors
    this.lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: this.config.lineOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create line segments
    this.lineSegments = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.lineSegments.frustumCulled = false;

    scene.add(this.lineSegments);
  }

  /**
   * Update constellation lines based on current particle positions
   */
  update(particles: Particle[], breathingPhase: number = 1): void {
    // Reset connection count
    this.connectionCount = 0;

    // Skip if reduced motion (show static or no lines)
    if (this.prefersReducedMotion) {
      this.lineGeometry.setDrawRange(0, 0);
      return;
    }

    // Build spatial hash
    this.spatialHash.clear();
    for (const particle of particles) {
      this.spatialHash.insert(particle.id, particle.position);
    }

    const distanceSquaredThreshold =
      this.config.connectionDistance * this.config.connectionDistance;

    // Track checked pairs to avoid duplicates
    const checkedPairs = new Set<string>();

    // Find connections using spatial hash
    for (const particle of particles) {
      const nearbyIds = this.spatialHash.getNearby(particle.position);

      for (const otherId of nearbyIds) {
        // Skip self
        if (otherId === particle.id) continue;

        // Skip already checked pairs
        const pairKey =
          particle.id < otherId
            ? `${particle.id}-${otherId}`
            : `${otherId}-${particle.id}`;
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        // Find the other particle
        const other = particles.find(p => p.id === otherId);
        if (!other) continue;

        // Check distance
        const distSq = distanceSquared(particle.position, other.position);
        if (distSq > distanceSquaredThreshold) continue;

        // Add connection if we have room
        if (this.connectionCount >= this.config.maxConnections) break;

        this.addConnection(particle, other, Math.sqrt(distSq), breathingPhase);
      }

      if (this.connectionCount >= this.config.maxConnections) break;
    }

    // Update geometry
    this.lineGeometry.attributes.position.needsUpdate = true;
    this.lineGeometry.attributes.color.needsUpdate = true;
    this.lineGeometry.setDrawRange(0, this.connectionCount * 2);
  }

  /**
   * Add a connection line between two particles
   */
  private addConnection(
    a: Particle,
    b: Particle,
    distance: number,
    breathingPhase: number
  ): void {
    const index = this.connectionCount * 6; // 2 vertices * 3 components

    // Positions
    this.positions[index] = a.position.x;
    this.positions[index + 1] = a.position.y;
    this.positions[index + 2] = a.position.z;
    this.positions[index + 3] = b.position.x;
    this.positions[index + 4] = b.position.y;
    this.positions[index + 5] = b.position.z;

    // Calculate opacity based on distance
    let opacity = 1;
    if (this.config.fadeWithDistance) {
      opacity = 1 - distance / this.config.connectionDistance;
      opacity = Math.pow(opacity, 2); // Quadratic falloff
    }

    // Apply breathing modulation
    opacity *= lerp(0.5, 1, breathingPhase);

    // Calculate color (blend between particle colors)
    const colorA = a.color;
    const colorB = b.color;
    const blendedColor = new THREE.Color().lerpColors(colorA, colorB, 0.5);

    // Apply opacity to color (since we're using additive blending)
    blendedColor.multiplyScalar(opacity);

    // Colors for both vertices
    this.colors[index] = blendedColor.r;
    this.colors[index + 1] = blendedColor.g;
    this.colors[index + 2] = blendedColor.b;
    this.colors[index + 3] = blendedColor.r;
    this.colors[index + 4] = blendedColor.g;
    this.colors[index + 5] = blendedColor.b;

    this.connectionCount++;
  }

  /**
   * Set line color
   */
  setColor(color: THREE.Color | string): void {
    if (typeof color === 'string') {
      this.config.lineColor.set(color);
    } else {
      this.config.lineColor.copy(color);
    }
  }

  /**
   * Set connection distance
   */
  setConnectionDistance(distance: number): void {
    this.config.connectionDistance = distance;
    this.spatialHash = new SpatialHash(distance);
  }

  /**
   * Get current connection count
   */
  getConnectionCount(): number {
    return this.connectionCount;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.lineGeometry.dispose();
    this.lineMaterial.dispose();
  }
}
