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
declare class EventBus {
    private listeners;
    private middlewares;
    /**
     * Subscribe to events of a specific type
     */
    subscribe<T>(eventType: string, callback: EventCallback<T>): EventSubscription;
    /**
     * Publish an event to all subscribers
     */
    publish<T extends {
        type: string;
    }>(event: T): Promise<void>;
    /**
     * Add middleware for event processing
     */
    addMiddleware(middleware: (event: any) => void): void;
    /**
     * Remove all listeners (for cleanup)
     */
    clear(): void;
}
export declare const eventBus: EventBus;
export type { EventCallback, EventSubscription };
//# sourceMappingURL=event-bus.d.ts.map