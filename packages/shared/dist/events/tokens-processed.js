"use strict";
/**
 * Tokens processed event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokensProcessedEvent = createTokensProcessedEvent;
function createTokensProcessedEvent(conversationId, messageId, tokenCount, cumulativeTokens, model, processingTime, streamingComplete, contextWindowUsed) {
    return {
        type: 'tokens-processed',
        conversationId,
        messageId,
        tokenCount,
        cumulativeTokens,
        timestamp: new Date(),
        metadata: {
            model,
            processingTime,
            streamingComplete,
            contextWindowUsed
        }
    };
}
//# sourceMappingURL=tokens-processed.js.map