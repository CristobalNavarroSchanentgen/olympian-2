// AI-Native Event Bus Utility (Layer 5)
// Pure functions for event system management and routing
// Zero dependencies, zero side effects - accessible through adapters only

export type EventHandler<T = any> = (payload: T) => void | Promise<void>;

export interface EventSubscription {
  unsubscribe: () => void;
}

export interface EventBusContract {
  emit<T = any>(eventName: string, payload: T): void;
  subscribe<T = any>(eventName: string, handler: EventHandler<T>): EventSubscription;
  unsubscribe(eventName: string, handler: EventHandler): void;
  clear(): void;
  getSubscriberCount(eventName: string): number;
}

// Simple in-memory event bus implementation
// This is a pure utility - no context awareness
class SimpleEventBus implements EventBusContract {
  private subscribers = new Map<string, Set<EventHandler>>();

  emit<T = any>(eventName: string, payload: T): void {
    const handlers = this.subscribers.get(eventName);
    if (handlers) {
      // Execute handlers in next tick to avoid blocking
      Promise.resolve().then(() => {
        handlers.forEach(handler => {
          try {
            handler(payload);
          } catch (error) {
            console.error(`Event handler error for ${eventName}:`, error);
          }
        });
      });
    }
  }

  subscribe<T = any>(eventName: string, handler: EventHandler<T>): EventSubscription {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
    }
    
    this.subscribers.get(eventName)!.add(handler);
    
    return {
      unsubscribe: () => this.unsubscribe(eventName, handler)
    };
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.subscribers.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.subscribers.delete(eventName);
      }
    }
  }

  clear(): void {
    this.subscribers.clear();
  }

  getSubscriberCount(eventName: string): number {
    return this.subscribers.get(eventName)?.size ?? 0;
  }
}

// Factory function for creating event bus instances
export function createEventBus(): EventBusContract {
  return new SimpleEventBus();
}

// Default singleton instance for simple use cases
export const defaultEventBus = createEventBus();
