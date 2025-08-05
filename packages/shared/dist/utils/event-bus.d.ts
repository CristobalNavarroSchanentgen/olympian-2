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
export declare function createEventBus(): EventBusContract;
export declare const defaultEventBus: EventBusContract;
//# sourceMappingURL=event-bus.d.ts.map