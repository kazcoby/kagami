/**
 * EventBus — Central Event Coordination
 *
 * Simple pub/sub system for decoupled communication between
 * Kagami systems (particles, audio, mechanics, state).
 *
 * "Discovery rewards exploration" — events flow like ripples in the mirror.
 */

import { FIBONACCI_MS } from '../utils/craft';

// Event type definitions
export type KagamiEventType =
  | 'particle:spawn'
  | 'particle:burst'
  | 'particle:clear'
  | 'secret:discovered'
  | 'secret:progress'
  | 'chapter:enter'
  | 'chapter:exit'
  | 'audio:trigger'
  | 'audio:ambient'
  | 'physics:magnetic'
  | 'physics:shake'
  | 'state:save'
  | 'state:load';

// Event payload types
export interface KagamiEventPayloads {
  'particle:spawn': { count: number; color?: string; position?: { x: number; y: number; z: number } };
  'particle:burst': { intensity: number };
  'particle:clear': void;
  'secret:discovered': { id: string; name: string };
  'secret:progress': { found: number; total: number };
  'chapter:enter': { index: number; name: string };
  'chapter:exit': { index: number };
  'audio:trigger': { sound: 'click' | 'discover' | 'chapter' | 'secret' };
  'audio:ambient': { chapter: number };
  'physics:magnetic': { active: boolean; repel?: boolean };
  'physics:shake': { intensity: number };
  'state:save': void;
  'state:load': void;
}

export interface KagamiEvent<T extends KagamiEventType = KagamiEventType> {
  type: T;
  payload: KagamiEventPayloads[T];
  timestamp: number;
}

type EventCallback<T extends KagamiEventType> = (event: KagamiEvent<T>) => void;

/**
 * Singleton EventBus for Kagami
 *
 * Usage:
 *   eventBus.on('secret:discovered', (e) => console.log(e.payload.name));
 *   eventBus.emit('secret:discovered', { id: 'konami', name: 'Konami Code' });
 */
class EventBusImpl {
  private listeners: Map<KagamiEventType, Set<EventCallback<any>>> = new Map();
  private eventHistory: KagamiEvent[] = [];
  private readonly maxHistory = 100;

  /**
   * Subscribe to an event type
   */
  on<T extends KagamiEventType>(type: T, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => this.off(type, callback);
  }

  /**
   * Unsubscribe from an event type
   */
  off<T extends KagamiEventType>(type: T, callback: EventCallback<T>): void {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit<T extends KagamiEventType>(type: T, payload: KagamiEventPayloads[T]): void {
    const event: KagamiEvent<T> = {
      type,
      payload,
      timestamp: performance.now(),
    };

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    // Notify listeners
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`[EventBus] Error in ${type} handler:`, error);
        }
      });
    }
  }

  /**
   * Emit an event after a Fibonacci delay
   */
  emitDelayed<T extends KagamiEventType>(
    type: T,
    payload: KagamiEventPayloads[T],
    fibonacciIndex: number = 0
  ): void {
    const delay = FIBONACCI_MS[Math.min(fibonacciIndex, FIBONACCI_MS.length - 1)];
    setTimeout(() => this.emit(type, payload), delay);
  }

  /**
   * Subscribe to an event type, but only fire once
   */
  once<T extends KagamiEventType>(type: T, callback: EventCallback<T>): () => void {
    const wrappedCallback: EventCallback<T> = (event) => {
      this.off(type, wrappedCallback);
      callback(event);
    };
    return this.on(type, wrappedCallback);
  }

  /**
   * Get recent event history (for debugging)
   */
  getHistory(): readonly KagamiEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Clear all listeners and history
   */
  clear(): void {
    this.listeners.clear();
    this.eventHistory = [];
  }
}

// Singleton export
export const eventBus = new EventBusImpl();

// Also export type for external type checking
export type EventBus = typeof eventBus;
