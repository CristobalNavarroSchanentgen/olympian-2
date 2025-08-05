/**
 * Message Service Implementation
 * Database-backed storage using MongoDB
 */
import { MessageRepository } from '../database/message-repository';
import { ConversationRepository } from '../database/conversation-repository';
export class MessageServiceImpl {
    messageRepository;
    conversationRepository;
    constructor() {
        this.messageRepository = new MessageRepository();
        this.conversationRepository = new ConversationRepository();
    }
    async createMessage(conversationId, draft, role) {
        const now = new Date();
        const messageData = {
            conversationId,
            role,
            content: draft.content,
            images: draft.images,
            metadata: draft.metadata || {},
            createdAt: now,
            updatedAt: now
        };
        const message = await this.messageRepository.create(messageData);
        // Update conversation message count
        const count = await this.messageRepository.countByConversation(conversationId);
        await this.conversationRepository.updateMessageCount(conversationId, count);
        return message;
    }
    async getMessage(id) {
        return await this.messageRepository.findById(id);
    }
    async updateMessage(id, updates) {
        const updated = await this.messageRepository.update(id, updates);
        if (!updated) {
            throw new Error(`Message ${id} not found`);
        }
        return updated;
    }
    async getConversationMessages(conversationId) {
        return await this.messageRepository.findByConversation(conversationId);
    }
    async deleteMessage(id) {
        const message = await this.messageRepository.findById(id);
        if (!message) {
            throw new Error(`Message ${id} not found`);
        }
        const deleted = await this.messageRepository.delete(id);
        if (deleted) {
            // Update conversation message count
            const count = await this.messageRepository.countByConversation(message.conversationId);
            await this.conversationRepository.updateMessageCount(message.conversationId, count);
        }
        return deleted;
    }
    async getMessageCount(conversationId) {
        if (conversationId) {
            return await this.messageRepository.countByConversation(conversationId);
        }
        // Count all messages
        const allMessages = await this.messageRepository.list({ limit: 999999 });
        return allMessages.length;
    }
    async searchMessages(query, conversationId) {
        // Simple search - get all messages and filter by content
        const filter = conversationId ? { conversationId, limit: 1000 } : { limit: 1000 };
        const messages = await this.messageRepository.list(filter);
        return messages.filter(m => m.content.toLowerCase().includes(query.toLowerCase()));
    }
    async getLatestMessage(conversationId) {
        const messages = await this.messageRepository.getLatestInConversation(conversationId, 1);
        return messages[0] || null;
    }
    async deleteMessages(messageIds) {
        let deletedCount = 0;
        const conversationsToUpdate = new Set();
        for (const id of messageIds) {
            const message = await this.messageRepository.findById(id);
            if (message) {
                conversationsToUpdate.add(message.conversationId);
                const deleted = await this.messageRepository.delete(id);
                if (deleted)
                    deletedCount++;
            }
        }
        // Update conversation message counts
        for (const conversationId of conversationsToUpdate) {
            const count = await this.messageRepository.countByConversation(conversationId);
            await this.conversationRepository.updateMessageCount(conversationId, count);
        }
        return deletedCount;
    }
}
//# sourceMappingURL=message-service-impl.js.map