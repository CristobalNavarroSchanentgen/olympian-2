"use strict";
/**
 * Simple Event Bus Utility
 * Pure functions for event management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = void 0;
class EventBus {
    listeners = new Map();
    emit(eventName, data) {
        const eventListeners = this.listeners.get(eventName) || [];
        eventListeners.forEach(listener => {
            try {
                listener(data);
            }
            catch (error) {
                console.error(`Event listener error for ${eventName}:`, error);
            }
        });
    }
    on(eventName, listener) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(listener);
    }
    off(eventName, listener) {
        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
            const index = eventListeners.indexOf(listener);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }
}
exports.eventBus = new EventBus();
//# sourceMappingURL=event-bus.js.map