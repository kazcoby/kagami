/**
 * GyroscopeHandler — Device Orientation and Motion
 *
 * Detects device tilt and shake gestures.
 * Particles respond to device movement.
 *
 * "Every pixel matters" — even the invisible ones.
 */

import { secretManager } from './SecretManager';
import { eventBus } from '../core/EventBus';

export interface DeviceOrientation {
  alpha: number; // Z-axis rotation (0-360)
  beta: number;  // X-axis rotation (-180 to 180)
  gamma: number; // Y-axis rotation (-90 to 90)
}

export interface DeviceMotion {
  x: number;
  y: number;
  z: number;
}

/**
 * GyroscopeHandler manages device orientation and motion
 */
export class GyroscopeHandler {
  private isSupported: boolean = false;
  private hasPermission: boolean = false;
  private isListening: boolean = false;

  // Current state
  private orientation: DeviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
  private motion: DeviceMotion = { x: 0, y: 0, z: 0 };

  // Shake detection
  private lastMotion: DeviceMotion = { x: 0, y: 0, z: 0 };
  private shakeThreshold: number = 15;
  private lastShakeTime: number = 0;
  private shakeCooldown: number = 1000; // 1 second between shakes

  // Callbacks
  private onOrientationChange: ((orientation: DeviceOrientation) => void) | null = null;
  private onShake: (() => void) | null = null;

  constructor() {
    // Check for support
    this.isSupported =
      typeof DeviceOrientationEvent !== 'undefined' ||
      typeof DeviceMotionEvent !== 'undefined';
  }

  /**
   * Request permission (required on iOS 13+)
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('[GyroscopeHandler] Device orientation not supported');
      return false;
    }

    // iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        this.hasPermission = permission === 'granted';
        if (!this.hasPermission) {
          console.warn('[GyroscopeHandler] Permission denied');
        }
        return this.hasPermission;
      } catch (error) {
        console.error('[GyroscopeHandler] Permission request failed:', error);
        return false;
      }
    }

    // No permission needed on other platforms
    this.hasPermission = true;
    return true;
  }

  /**
   * Start listening to device events
   */
  async start(): Promise<boolean> {
    if (!this.hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    if (this.isListening) return true;

    // Add event listeners
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
    window.addEventListener('devicemotion', this.handleMotion.bind(this));

    this.isListening = true;
    console.log('[GyroscopeHandler] Started listening');
    return true;
  }

  /**
   * Stop listening to device events
   */
  stop(): void {
    if (!this.isListening) return;

    window.removeEventListener('deviceorientation', this.handleOrientation.bind(this));
    window.removeEventListener('devicemotion', this.handleMotion.bind(this));

    this.isListening = false;
    console.log('[GyroscopeHandler] Stopped listening');
  }

  /**
   * Handle device orientation event
   */
  private handleOrientation(event: DeviceOrientationEvent): void {
    this.orientation = {
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    };

    if (this.onOrientationChange) {
      this.onOrientationChange(this.orientation);
    }
  }

  /**
   * Handle device motion event
   */
  private handleMotion(event: DeviceMotionEvent): void {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    this.motion = {
      x: acceleration.x || 0,
      y: acceleration.y || 0,
      z: acceleration.z || 0,
    };

    // Check for shake
    this.detectShake();

    // Store for next comparison
    this.lastMotion = { ...this.motion };
  }

  /**
   * Detect shake gesture
   */
  private detectShake(): void {
    const now = performance.now();

    // Check cooldown
    if (now - this.lastShakeTime < this.shakeCooldown) return;

    // Calculate acceleration delta
    const deltaX = Math.abs(this.motion.x - this.lastMotion.x);
    const deltaY = Math.abs(this.motion.y - this.lastMotion.y);
    const deltaZ = Math.abs(this.motion.z - this.lastMotion.z);

    const totalDelta = deltaX + deltaY + deltaZ;

    if (totalDelta > this.shakeThreshold) {
      this.lastShakeTime = now;
      this.onShakeDetected();
    }
  }

  /**
   * Called when shake is detected
   */
  private onShakeDetected(): void {
    console.log('[GyroscopeHandler] Shake detected!');

    // Trigger secret
    secretManager.discover('device_shake');

    // Emit physics event
    eventBus.emit('physics:shake', { intensity: 1.5 });

    if (this.onShake) {
      this.onShake();
    }
  }

  /**
   * Get current orientation
   */
  getOrientation(): DeviceOrientation {
    return { ...this.orientation };
  }

  /**
   * Get current motion
   */
  getMotion(): DeviceMotion {
    return { ...this.motion };
  }

  /**
   * Get normalized tilt for particle effects
   * Returns values from -1 to 1 for x and y
   */
  getNormalizedTilt(): { x: number; y: number } {
    return {
      x: Math.max(-1, Math.min(1, this.orientation.gamma / 45)), // gamma: -90 to 90
      y: Math.max(-1, Math.min(1, this.orientation.beta / 90)),  // beta: -180 to 180
    };
  }

  /**
   * Set orientation change callback
   */
  setOrientationCallback(callback: (orientation: DeviceOrientation) => void): void {
    this.onOrientationChange = callback;
  }

  /**
   * Set shake callback
   */
  setShakeCallback(callback: () => void): void {
    this.onShake = callback;
  }

  /**
   * Set shake threshold
   */
  setShakeThreshold(threshold: number): void {
    this.shakeThreshold = threshold;
  }

  /**
   * Check if gyroscope is supported
   */
  getIsSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }
}

// Export a pre-configured instance
export const gyroscopeHandler = new GyroscopeHandler();
