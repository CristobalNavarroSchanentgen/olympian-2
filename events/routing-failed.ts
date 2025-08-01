/**
 * Routing Failed Event
 * Published when model routing fails for a request
 */

export interface RoutingFailed {
  conversationId: string;
  requestedCapabilities: string[];
  error: string;
  timestamp: string;
}
