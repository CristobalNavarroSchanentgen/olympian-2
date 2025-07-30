/**
 * Service Implementations Index
 * 
 * Exports all service implementations for easy import by components.
 * These implementations follow the AI-native architecture pattern.
 */

// Existing services
export { chatService } from './chat-service';

// New AI-native service implementations
export { layoutService } from './layout-service-impl';
export { reasoningService } from './reasoning-service-impl';

// Service types (re-exported for convenience)
export type { LayoutService } from '@olympian/shared/services/layout-service';
export type { ReasoningService } from '@olympian/shared/services/reasoning-service';
