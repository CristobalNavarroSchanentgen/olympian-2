/**
 * Router Event Publisher - Server Implementation
 */
export class RouterEventPublisherImpl {
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
    // Implementation of missing contract methods
    publishRouterEvent(event) {
        console.log("📡 Router Event:", {
            type: event.type,
            payload: event.payload,
            timestamp: event.timestamp
        });
        // TODO: Integrate with proper event system when available
    }
    publishModelSwitched(from, to) {
        const event = {
            type: "model-switched",
            payload: { from, to },
            timestamp: Date.now()
        };
        console.log("🔄 Model Switched:", { from, to, timestamp: event.timestamp });
        // Publish as a router event
        this.publishRouterEvent(event);
    }
}
//# sourceMappingURL=router-event-publisher.js.map