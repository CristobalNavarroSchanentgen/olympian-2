/**
 * Router Events
 * Events related to model routing and selection
 */

export interface ModelRouted {
  conversationId: string;
  selectedModel: string;
  modelCapabilities: string[];
  routingReason: string;
  timestamp: string;
}

export interface RoutingFailed {
  conversationId: string;
  requestedCapabilities: string[];
  error: string;
  timestamp: string;
}
