import { useEffect, useRef } from 'react';
import { eventBus, EventCallback, EventSubscription } from '@olympian/shared/utils/event-bus';

/**
 * React Hook for Event Subscriptions
 * 
 * Provides a React-friendly way to subscribe to events with automatic cleanup.
 */
export function useEventSubscription<T = any>(
  eventType: string, 
  callback: EventCallback<T>,
  dependencies: any[] = []
): void {
  const subscriptionRef = useRef<EventSubscription | null>(null);
  
  useEffect(() => {
    // Unsubscribe from previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    
    // Subscribe to the event
    subscriptionRef.current = eventBus.subscribe(eventType, callback);
    
    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [eventType, ...dependencies]);
}

/**
 * Hook for subscribing to multiple events at once
 */
export function useMultipleEventSubscriptions(
  subscriptions: Array<{ eventType: string; callback: EventCallback }>,
  dependencies: any[] = []
): void {
  const subscriptionsRef = useRef<EventSubscription[]>([]);
  
  useEffect(() => {
    // Clean up previous subscriptions
    subscriptionsRef.current.forEach(sub => sub.unsubscribe());
    subscriptionsRef.current = [];
    
    // Create new subscriptions
    subscriptionsRef.current = subscriptions.map(({ eventType, callback }) => 
      eventBus.subscribe(eventType, callback)
    );
    
    // Cleanup function
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = [];
    };
  }, dependencies);
}
