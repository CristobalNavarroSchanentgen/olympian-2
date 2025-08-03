/**
 * Routing Failed Event Contract
 * Published when model routing fails and fallback is activated
 */

export interface RoutingFailed {
  failedModel: string;
  error: string;
  fallbackModel: string;
  timestamp: Date;
}

export type RoutingFailedEventType = 'routing-failed';
export const ROUTING_FAILED_EVENT: RoutingFailedEventType = 'routing-failed';
