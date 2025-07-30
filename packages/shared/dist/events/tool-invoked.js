/**
 * Tool invoked event
 */
export function createToolInvokedEvent(toolName, serverName, invocationId, arguments_, timeout, retryCount = 0, conversationId, messageId) {
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