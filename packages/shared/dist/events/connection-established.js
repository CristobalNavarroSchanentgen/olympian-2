"use strict";
/**
 * Connection established event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectionEstablishedEvent = createConnectionEstablishedEvent;
function createConnectionEstablishedEvent(connectionId, endpoint, connectionType, latency, retryAttempt = 0, version, capabilities) {
    return {
        type: 'connection-established',
        connectionId,
        endpoint,
        timestamp: new Date(),
        metadata: {
            connectionType,
            latency,
            version,
            capabilities,
            retryAttempt
        }
    };
}
//# sourceMappingURL=connection-established.js.map