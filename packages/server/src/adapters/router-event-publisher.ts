/**
 * Router Event Publisher - Server Implementation
 */

import { RouterEventPublisher } from '@olympian/shared/features/chat/smart-model-router/contract';
import { ModelRouted, RoutingFailed } from '@olympian/shared/events';

export class RouterEventPublisherImpl implements RouterEventPublisher {
  publishModelRouted(event: ModelRouted): void {
    console.log('📡 Model Routed:', {
      selectedModel: event.selectedModel,
      routingReason: event.routingReason,
      modelCapabilities: event.modelCapabilities,
      conversationId: event.conversationId,
      timestamp: event.timestamp
    });
    
    // TODO: Integrate with proper event system when available
    // For now, just log to console
  }

  publishRoutingFailed(event: RoutingFailed): void {
    console.error('❌ Routing Failed:', {
      conversationId: event.conversationId,
      requestedCapabilities: event.requestedCapabilities,
      error: event.error,
      timestamp: event.timestamp
    });
    
    // TODO: Integrate with proper event system when available
    // For now, just log to console
  }

  // Implementation of missing contract methods
  publishRouterEvent(event: any): void {
    console.log("📡 Router Event:", {
      type: event.type,
      payload: event.payload,
      timestamp: event.timestamp
    });
    
    // TODO: Integrate with proper event system when available
  }

  publishModelSwitched(from: string, to: string): void {
    const event = {
      type: "model-switched",
      payload: { from, to },
      timestamp: Date.now()
    };
    
    console.log("🔄 Model Switched:", { from, to, timestamp: event.timestamp });
    
    // Publish as a router event
    this.publishRouterEvent(event);
  }}
