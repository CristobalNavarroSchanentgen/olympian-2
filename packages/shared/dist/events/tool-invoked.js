"use strict";
/**
 * Tool invoked event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToolInvokedEvent = createToolInvokedEvent;
function createToolInvokedEvent(toolName, serverName, invocationId, arguments_, timeout, retryCount = 0, conversationId, messageId) {
    return {
        type: 'tool-invoked',
        toolName,
        serverName,
        invocationId,
        arguments: arguments_,
        timestamp: new Date(),
        metadata: {
            conversationId,
            messageId,
            timeout,
            retryCount
        }
    };
}
//# sourceMappingURL=tool-invoked.js.map