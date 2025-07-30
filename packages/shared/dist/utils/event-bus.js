/**
 * Event Bus - AI-Native Architecture
 *
 * Simple event system for pub/sub communication.
 * Pure utility - no business logic or external dependencies.
 */
class EventBus {
    listeners = new Map();
    middlewares = [];
    /**
     * Subscribe to events of a specific type
     */
    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType).add(callback);
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
    async publish(event) {
        // Apply middleware first
        this.middlewares.forEach(middleware => middleware(event));
        const callbacks = this.listeners.get(event.type);
        if (!callbacks)
            return;
        // Execute all callbacks (async support)
        const promises = Array.from(callbacks).map(callback => {
            try {
                return callback(event);
            }
            catch (error) {
                console.error(`Error in event callback for ${event.type}:`, error);
                return Promise.resolve();
            }
        });
        await Promise.all(promises);
    }
    /**
     * Add middleware for event processing
     */
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Remove all listeners (for cleanup)
     */
    clear() {
        this.listeners.clear();
        this.middlewares.length = 0;
    }
}
// Export singleton instance
export const eventBus = new EventBus();
//# sourceMappingURL=event-bus.js.map