/**
 * Simple Event Bus Utility
 * Pure functions for event management
 */
type EventListener = (data: any) => void;
declare class EventBus {
    private listeners;
    emit(eventName: string, data: any): void;
    on(eventName: string, listener: EventListener): void;
    off(eventName: string, listener: EventListener): void;
}
export declare const eventBus: EventBus;
export {};
