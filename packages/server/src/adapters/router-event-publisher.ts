/**
 * Router Event Publisher - Server Implementation
 */

import { RouterEventPublisher } from '@olympian/shared/features/chat/smart-model-router/contract';
import { ModelRouted, RoutingFailed } from '@olympian/shared/events';

export class RouterEventPublisherImpl implements RouterEventPublisher {
  publishModelRouted(event: ModelRouted): void {
    console.log('📡 Model Routed:', {
      model: event.model,
      reason: event.reason,
      contentType: event.analysisResult.contentType,
      timestamp: event.timestamp
    });
    
    // TODO: Integrate with proper event system when available
    // For now, just log to console
  }

  publishRoutingFailed(event: RoutingFailed): void {
    console.error('❌ Routing Failed:', {
      failedModel: event.failedModel,
      error: event.error,
      fallbackModel: event.fallbackModel,
      timestamp: event.timestamp
    });
    
    // TODO: Integrate with proper event system when available
    // For now, just log to console
  }
}
