/**
 * Math Utilities — Vector and Physics Calculations
 *
 * "Mathematics underlies aesthetics" — these are the formulas
 * that make particles dance and constellations form.
 */

import * as THREE from 'three';
import { FIBONACCI_MS } from './craft';

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Smooth step interpolation (ease in/out)
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Spring force calculation (Hooke's law with damping)
 *
 * F = -k * displacement - damping * velocity
 *
 * @param current - Current position
 * @param target - Target position (rest position)
 * @param velocity - Current velocity
 * @param stiffness - Spring stiffness (k), higher = snappier
 * @param damping - Damping coefficient, higher = less oscillation
 * @returns New velocity after applying spring force
 */
export function springForce(
  current: number,
  target: number,
  velocity: number,
  stiffness: number = 0.3,
  damping: number = 0.7
): number {
  const displacement = current - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = springForce + dampingForce;
  return velocity + acceleration;
}

/**
 * Spring force for 3D vectors
 */
export function springForce3D(
  current: THREE.Vector3,
  target: THREE.Vector3,
  velocity: THREE.Vector3,
  stiffness: number = 0.3,
  damping: number = 0.7
): THREE.Vector3 {
  const result = new THREE.Vector3();
  result.x = springForce(current.x, target.x, velocity.x, stiffness, damping);
  result.y = springForce(current.y, target.y, velocity.y, stiffness, damping);
  result.z = springForce(current.z, target.z, velocity.z, stiffness, damping);
  return result;
}

/**
 * Magnetic attraction/repulsion force
 *
 * F = strength / distance^2 (capped at maxForce)
 *
 * @param point - Position of the affected object
 * @param attractor - Position of the attractor/repulsor
 * @param strength - Force strength (negative for repulsion)
 * @param maxForce - Maximum force magnitude (prevents singularity)
 * @returns Force vector pointing toward (or away from) attractor
 */
export function magneticAttraction(
  point: THREE.Vector3,
  attractor: THREE.Vector3,
  strength: number = 1.0,
  maxForce: number = 5.0
): THREE.Vector3 {
  const direction = new THREE.Vector3().subVectors(attractor, point);
  const distance = direction.length();

  if (distance < 0.001) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Inverse square falloff
  const forceMagnitude = clamp(strength / (distance * distance), -maxForce, maxForce);

  return direction.normalize().multiplyScalar(forceMagnitude);
}

/**
 * Gravity force (constant direction, affected by distance)
 *
 * @param point - Position of the affected object
 * @param center - Position of gravity center
 * @param strength - Gravity strength
 * @param falloff - Distance falloff (0 = constant, 1 = linear, 2 = inverse square)
 */
export function gravityForce(
  point: THREE.Vector3,
  center: THREE.Vector3,
  strength: number = 1.0,
  falloff: number = 0
): THREE.Vector3 {
  const direction = new THREE.Vector3().subVectors(center, point);
  const distance = direction.length();

  if (distance < 0.001) {
    return new THREE.Vector3(0, 0, 0);
  }

  let forceMagnitude = strength;
  if (falloff === 1) {
    forceMagnitude = strength / distance;
  } else if (falloff === 2) {
    forceMagnitude = strength / (distance * distance);
  }

  return direction.normalize().multiplyScalar(forceMagnitude);
}

/**
 * Get Fibonacci duration by index
 */
export function fibonacciDuration(index: number): number {
  return FIBONACCI_MS[clamp(index, 0, FIBONACCI_MS.length - 1)];
}

/**
 * Get a random value from a range
 */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Get a random point on a sphere surface
 */
export function randomOnSphere(radius: number = 1): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

/**
 * Get a random point inside a sphere
 */
export function randomInSphere(radius: number = 1): THREE.Vector3 {
  const r = radius * Math.cbrt(Math.random());
  return randomOnSphere(r);
}

/**
 * Calculate distance squared (faster than distance for comparisons)
 */
export function distanceSquared(a: THREE.Vector3, b: THREE.Vector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Ease functions based on Catastrophe Theory
 */
export const ease = {
  // Fold (A2): Sudden emergence
  fold: (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },

  // Cusp (A3): Decisive transition with overshoot
  cusp: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Swallowtail (A4): Recovery arc with overshoot
  swallowtail: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Butterfly (A5): Complex oscillation
  butterfly: (t: number): number => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },
};

/**
 * Spatial hash for efficient neighbor lookups
 */
export class SpatialHash {
  private cellSize: number;
  private cells: Map<string, number[]> = new Map();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private getKey(x: number, y: number, z: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx},${cy},${cz}`;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(id: number, position: THREE.Vector3): void {
    const key = this.getKey(position.x, position.y, position.z);
    if (!this.cells.has(key)) {
      this.cells.set(key, []);
    }
    this.cells.get(key)!.push(id);
  }

  getNearby(position: THREE.Vector3): number[] {
    const results: number[] = [];
    const cx = Math.floor(position.x / this.cellSize);
    const cy = Math.floor(position.y / this.cellSize);
    const cz = Math.floor(position.z / this.cellSize);

    // Check neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${cx + dx},${cy + dy},${cz + dz}`;
          const cell = this.cells.get(key);
          if (cell) {
            results.push(...cell);
          }
        }
      }
    }

    return results;
  }
}
