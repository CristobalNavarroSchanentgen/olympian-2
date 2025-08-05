import { defaultEventBus as eventBus } from '@olympian/shared/utils/event-bus';
import { debugMiddleware, validationMiddleware, metricsMiddleware } from '@olympian/shared/utils/event-middleware';

/**
 * Event System Initialization
 * 
 * Sets up the event bus with middleware for the application.
 * Should be called once during app initialization.
 */
export function initializeEventSystem(): void {
  // Add middleware in order of execution
  eventBus.addMiddleware(validationMiddleware);
  eventBus.addMiddleware(debugMiddleware);
  eventBus.addMiddleware(metricsMiddleware);
  
  console.log('[EVENT SYSTEM] Initialized with middleware');
}

/**
 * Cleanup function for tests or app shutdown
 */
export function cleanupEventSystem(): void {
  eventBus.clear();
  console.log('[EVENT SYSTEM] Cleaned up');
}
