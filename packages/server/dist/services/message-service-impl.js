"use strict";
/**
 * Message Service Implementation
 * MongoDB-backed persistence for messages
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServiceImpl = void 0;
const message_repository_1 = require("../database/message-repository");
const conversation_repository_1 = require("../database/conversation-repository");
class MessageServiceImpl {
    messageRepo;
    conversationRepo;
    constructor() {
        this.messageRepo = new message_repository_1.MessageRepository();
        this.conversationRepo = new conversation_repository_1.ConversationRepository();
    }
    async createMessage(conversationId, draft, role) {
        const now = new Date();
        const messageData = {
            conversationId,
            role,
            content: draft.content,
            createdAt: now,
            updatedAt: now,
            metadata: draft.metadata || {}
        };
        const message = await this.messageRepo.create(messageData);
        // Update conversation message count
        const count = await this.messageRepo.countByConversation(conversationId);
        await this.conversationRepo.updateMessageCount(conversationId, count);
        return message;
    }
    async getMessage(id) {
        return await this.messageRepo.findById(id);
    }
    async updateMessage(id, updates) {
        const updated = await this.messageRepo.update(id, updates);
        if (!updated) {
            return false;
        }
        return updated;
    }
    async deleteMessage(id) {
        const message = await this.messageRepo.findById(id);
        if (!message) {
            return false;
        }
        const deleted = await this.messageRepo.delete(id);
        if (!deleted) {
            return false;
        }
        // Update conversation message count
        const count = await this.messageRepo.countByConversation(message.conversationId);
        await this.conversationRepo.updateMessageCount(message.conversationId, count);
    }
    async getConversationMessages(conversationId, limit, offset) {
        return await this.messageRepo.findByConversation(conversationId, { limit, offset });
    }
    async listMessages(filter) {
        return await this.messageRepo.list(filter);
    }
    async getMessageCount(conversationId) {
        if (conversationId) {
            return await this.messageRepo.countByConversation(conversationId);
        }
        else {
            return await this.messageRepo.list({ limit: 0 }).then(() => 0);
        }
    }
    async getLatestMessages(conversationId, count) {
        return await this.messageRepo.getLatestInConversation(conversationId, count);
    }
    async searchMessages(query, conversationId, limit) {
        const filter = { limit };
        if (conversationId) {
            filter.conversationId = conversationId;
        }
        // Simple search implementation - MongoDB text search would be better for production
        const messages = await this.messageRepo.list(filter);
        return messages.filter(msg => msg.content.toLowerCase().includes(query.toLowerCase()));
    }
    async deleteConversationMessages(conversationId) {
        return await this.messageRepo.deleteByConversation(conversationId);
    }
}
exports.MessageServiceImpl = MessageServiceImpl;
async;
getLatestMessage(conversationId, string);
Promise < message_1.Message | null > {
    const: messages = await this.messageRepo.getLatestInConversation(conversationId, 1),
    return: messages.length > 0 ? messages[0] : null
};
async;
deleteMessages(messageIds, string[]);
Promise < number > {
    let, deletedCount = 0,
    for(, id, of, messageIds) {
        const deleted = await this.messageRepo.delete(id);
        if (deleted)
            deletedCount++;
    },
    return: deletedCount
};
//# sourceMappingURL=message-service-impl.js.map