/**
 * Memory cleaned event
 */
export function createMemoryCleanedEvent(conversationId, messagesRemoved, tokensFreed, newMessageCount, newTokenCount, cleanupReason) {
    return {
        type: 'memory-cleaned',
        conversationId,
        timestamp: new Date(),
        metadata: {
            messagesRemoved,
            tokensFreed,
            newMessageCount,
            newTokenCount,
            cleanupReason
        }
    };
}
//# sourceMappingURL=memory-cleaned.js.map