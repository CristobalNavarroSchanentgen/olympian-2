"use strict";
/**
 * Router Event Publisher - Server Implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterEventPublisherImpl = void 0;
class RouterEventPublisherImpl {
    publishModelRouted(event) {
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
    publishRoutingFailed(event) {
        console.error('❌ Routing Failed:', {
            conversationId: event.conversationId,
            requestedCapabilities: event.requestedCapabilities,
            error: event.error,
            timestamp: event.timestamp
        });
        // TODO: Integrate with proper event system when available
        // For now, just log to console
    }
}
exports.RouterEventPublisherImpl = RouterEventPublisherImpl;
//# sourceMappingURL=router-event-publisher.js.map