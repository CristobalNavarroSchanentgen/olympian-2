"use strict";
/**
 * Conversation created event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationCreatedEvent = createConversationCreatedEvent;
function createConversationCreatedEvent(conversationId, title, model, initiatedBy = 'user', memorySettings = { maxMessages: 20, maxTokens: 4000 }) {
    return {
        type: 'conversation-created',
        conversationId,
        title,
        model,
        timestamp: new Date(),
        metadata: {
            initiatedBy,
            memorySettings
        }
    };
}
//# sourceMappingURL=conversation-created.js.map