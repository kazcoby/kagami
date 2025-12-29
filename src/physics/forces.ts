/**
 * Forces — Physics Force Calculations
 *
 * Pure functions for calculating physical forces.
 * Used by PhysicsSystem to update particle motion.
 *
 * "Mathematics underlies aesthetics" — these equations create beauty.
 */

import * as THREE from 'three';
import { clamp } from '../utils/math';

/**
 * Spring force using Hooke's law with damping
 *
 * F = -k * displacement - damping * velocity
 */
export function calculateSpringForce(
  position: THREE.Vector3,
  target: THREE.Vector3,
  velocity: THREE.Vector3,
  stiffness: number = 0.3,
  damping: number = 0.7
): THREE.Vector3 {
  const displacement = position.clone().sub(target);
  const springForce = displacement.multiplyScalar(-stiffness);
  const dampingForce = velocity.clone().multiplyScalar(-damping);
  return springForce.add(dampingForce);
}

/**
 * Magnetic attraction/repulsion force
 *
 * F = strength / distance^2 (inverse square law)
 */
export function calculateMagneticForce(
  position: THREE.Vector3,
  attractor: THREE.Vector3,
  strength: number = 1.0,
  minDistance: number = 0.1,
  maxDistance: number = 10.0
): THREE.Vector3 {
  const direction = attractor.clone().sub(position);
  const distance = clamp(direction.length(), minDistance, maxDistance);

  if (distance < 0.001) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Inverse square falloff
  const forceMagnitude = strength / (distance * distance);

  return direction.normalize().multiplyScalar(forceMagnitude);
}

/**
 * Gravity force toward a point
 */
export function calculateGravityForce(
  position: THREE.Vector3,
  center: THREE.Vector3,
  strength: number = 1.0,
  falloffType: 'constant' | 'linear' | 'quadratic' = 'constant'
): THREE.Vector3 {
  const direction = center.clone().sub(position);
  const distance = direction.length();

  if (distance < 0.001) {
    return new THREE.Vector3(0, 0, 0);
  }

  let forceMagnitude = strength;

  switch (falloffType) {
    case 'linear':
      forceMagnitude = strength / distance;
      break;
    case 'quadratic':
      forceMagnitude = strength / (distance * distance);
      break;
  }

  return direction.normalize().multiplyScalar(forceMagnitude);
}

/**
 * Directional gravity (like real gravity)
 */
export function calculateDirectionalGravity(
  direction: THREE.Vector3,
  strength: number = 9.8
): THREE.Vector3 {
  return direction.clone().normalize().multiplyScalar(strength);
}

/**
 * Vortex force (circular motion around an axis)
 */
export function calculateVortexForce(
  position: THREE.Vector3,
  center: THREE.Vector3,
  axis: THREE.Vector3,
  strength: number = 1.0,
  pullStrength: number = 0.1
): THREE.Vector3 {
  // Vector from center to position
  const toPosition = position.clone().sub(center);

  // Project onto plane perpendicular to axis
  const axisNorm = axis.clone().normalize();
  const projected = toPosition.clone().sub(
    axisNorm.clone().multiplyScalar(toPosition.dot(axisNorm))
  );

  const distance = projected.length();
  if (distance < 0.001) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Tangential force (perpendicular to radius, in plane)
  const tangent = new THREE.Vector3().crossVectors(axisNorm, projected).normalize();
  const tangentialForce = tangent.multiplyScalar(strength);

  // Optional pull toward center
  const pullForce = projected.normalize().multiplyScalar(-pullStrength);

  return tangentialForce.add(pullForce);
}

/**
 * Turbulence force (pseudo-random noise-based)
 */
export function calculateTurbulenceForce(
  position: THREE.Vector3,
  time: number,
  strength: number = 0.5,
  frequency: number = 1.0
): THREE.Vector3 {
  // Simple noise approximation using sin waves
  const x = Math.sin(position.x * frequency + time) *
            Math.cos(position.y * frequency * 0.7 + time * 0.8);
  const y = Math.sin(position.y * frequency + time * 1.1) *
            Math.cos(position.z * frequency * 0.8 + time * 0.9);
  const z = Math.sin(position.z * frequency + time * 0.9) *
            Math.cos(position.x * frequency * 0.6 + time * 1.2);

  return new THREE.Vector3(x, y, z).multiplyScalar(strength);
}

/**
 * Boundary force (keeps particles within bounds)
 */
export function calculateBoundaryForce(
  position: THREE.Vector3,
  bounds: THREE.Box3,
  strength: number = 1.0,
  softness: number = 0.5
): THREE.Vector3 {
  const force = new THREE.Vector3(0, 0, 0);

  // X bounds
  if (position.x < bounds.min.x + softness) {
    force.x = strength * (1 - (position.x - bounds.min.x) / softness);
  } else if (position.x > bounds.max.x - softness) {
    force.x = -strength * (1 - (bounds.max.x - position.x) / softness);
  }

  // Y bounds
  if (position.y < bounds.min.y + softness) {
    force.y = strength * (1 - (position.y - bounds.min.y) / softness);
  } else if (position.y > bounds.max.y - softness) {
    force.y = -strength * (1 - (bounds.max.y - position.y) / softness);
  }

  // Z bounds
  if (position.z < bounds.min.z + softness) {
    force.z = strength * (1 - (position.z - bounds.min.z) / softness);
  } else if (position.z > bounds.max.z - softness) {
    force.z = -strength * (1 - (bounds.max.z - position.z) / softness);
  }

  return force;
}

/**
 * Separation force (particles avoid each other)
 */
export function calculateSeparationForce(
  position: THREE.Vector3,
  neighbors: THREE.Vector3[],
  separationRadius: number = 0.5,
  strength: number = 1.0
): THREE.Vector3 {
  const force = new THREE.Vector3(0, 0, 0);
  let count = 0;

  for (const neighbor of neighbors) {
    const diff = position.clone().sub(neighbor);
    const distance = diff.length();

    if (distance > 0 && distance < separationRadius) {
      // Stronger repulsion when closer
      const repulsion = diff.normalize().multiplyScalar(
        strength * (1 - distance / separationRadius)
      );
      force.add(repulsion);
      count++;
    }
  }

  if (count > 0) {
    force.divideScalar(count);
  }

  return force;
}

/**
 * Cohesion force (particles move toward group center)
 */
export function calculateCohesionForce(
  position: THREE.Vector3,
  neighbors: THREE.Vector3[],
  strength: number = 0.1
): THREE.Vector3 {
  if (neighbors.length === 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Find center of mass
  const center = new THREE.Vector3(0, 0, 0);
  for (const neighbor of neighbors) {
    center.add(neighbor);
  }
  center.divideScalar(neighbors.length);

  // Force toward center
  return center.sub(position).multiplyScalar(strength);
}

/**
 * Alignment force (particles match velocity of neighbors)
 */
export function calculateAlignmentForce(
  velocity: THREE.Vector3,
  neighborVelocities: THREE.Vector3[],
  strength: number = 0.1
): THREE.Vector3 {
  if (neighborVelocities.length === 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Average velocity
  const avgVelocity = new THREE.Vector3(0, 0, 0);
  for (const vel of neighborVelocities) {
    avgVelocity.add(vel);
  }
  avgVelocity.divideScalar(neighborVelocities.length);

  // Steer toward average
  return avgVelocity.sub(velocity).multiplyScalar(strength);
}
