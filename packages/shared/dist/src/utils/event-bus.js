// AI-Native Event Bus Utility (Layer 5)
// Pure functions for event system management and routing
// Zero dependencies, zero side effects - accessible through adapters only
// Simple in-memory event bus implementation
// This is a pure utility - no context awareness
class SimpleEventBus {
    subscribers = new Map();
    emit(eventName, payload) {
        const handlers = this.subscribers.get(eventName);
        if (handlers) {
            // Execute handlers in next tick to avoid blocking
            Promise.resolve().then(() => {
                handlers.forEach(handler => {
                    try {
                        handler(payload);
                    }
                    catch (error) {
                        console.error(`Event handler error for ${eventName}:`, error);
                    }
                });
            });
        }
    }
    subscribe(eventName, handler) {
        if (!this.subscribers.has(eventName)) {
            this.subscribers.set(eventName, new Set());
        }
        this.subscribers.get(eventName).add(handler);
        return {
            unsubscribe: () => this.unsubscribe(eventName, handler)
        };
    }
    unsubscribe(eventName, handler) {
        const handlers = this.subscribers.get(eventName);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.subscribers.delete(eventName);
            }
        }
    }
    clear() {
        this.subscribers.clear();
    }
    getSubscriberCount(eventName) {
        return this.subscribers.get(eventName)?.size ?? 0;
    }
}
// Factory function for creating event bus instances
export function createEventBus() {
    return new SimpleEventBus();
}
// Default singleton instance for simple use cases
export const defaultEventBus = createEventBus();
//# sourceMappingURL=event-bus.js.map