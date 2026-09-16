import { EventType, EventCallback } from './types.js';

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventType, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(event: EventType, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  public emit(event: EventType, payload?: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((callback) => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

