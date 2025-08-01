/**
 * Model Routed Event
 * Published when a model has been successfully routed for a request
 */

export interface ModelRouted {
  conversationId: string;
  selectedModel: string;
  modelCapabilities: string[];
  routingReason: string;
  timestamp: string;
}
