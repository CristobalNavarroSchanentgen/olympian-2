/**
 * Simple Event Bus Utility
 * Pure functions for event management
 */

type EventListener = (data: any) => void;

class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();

  emit(eventName: string, data: any): void {
    const eventListeners = this.listeners.get(eventName) || [];
    eventListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Event listener error for ${eventName}:`, error);
      }
    });
  }

  on(eventName: string, listener: EventListener): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  off(eventName: string, listener: EventListener): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}

export const eventBus = new EventBus();
