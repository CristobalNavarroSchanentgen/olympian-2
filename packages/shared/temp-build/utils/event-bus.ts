/**
 * Event Bus - AI-Native Architecture
 * 
 * Simple event system for pub/sub communication.
 * Pure utility - no business logic or external dependencies.
 */

type EventCallback<T = any> = (event: T) => void | Promise<void>;

interface EventSubscription {
  unsubscribe: () => void;
}

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private middlewares: Array<(event: any) => void> = [];

  /**
   * Subscribe to events of a specific type
   */
  subscribe<T>(eventType: string, callback: EventCallback<T>): EventSubscription {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback);
    
    return {
      unsubscribe: () => {
        const callbacks = this.listeners.get(eventType);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            this.listeners.delete(eventType);
          }
        }
      }
    };
  }

  /**
   * Publish an event to all subscribers
   */
  async publish<T extends { type: string }>(event: T): Promise<void> {
    // Apply middleware first
    this.middlewares.forEach(middleware => middleware(event));
    
    const callbacks = this.listeners.get(event.type);
    if (!callbacks) return;
    
    // Execute all callbacks (async support)
    const promises = Array.from(callbacks).map(callback => {
      try {
        return callback(event);
      } catch (error) {
        console.error(`Error in event callback for ${event.type}:`, error);
        return Promise.resolve();
      }
    });
    
    await Promise.all(promises);
  }

  /**
   * Add middleware for event processing
   */
  addMiddleware(middleware: (event: any) => void): void {
    this.middlewares.push(middleware);
  }

  /**
   * Remove all listeners (for cleanup)
   */
  clear(): void {
    this.listeners.clear();
    this.middlewares.length = 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Export types for use in other files
export type { EventCallback, EventSubscription };
