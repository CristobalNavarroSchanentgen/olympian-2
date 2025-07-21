"use strict";
/**
 * Message sent event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageSentEvent = createMessageSentEvent;
function createMessageSentEvent(messageId, conversationId, role, content, tokenCount, imageCount = 0, model) {
    return {
        type: 'message-sent',
        messageId,
        conversationId,
        role,
        content,
        timestamp: new Date(),
        metadata: {
            tokenCount,
            hasImages: imageCount > 0,
            imageCount,
            model
        }
    };
}
//# sourceMappingURL=message-sent.js.map