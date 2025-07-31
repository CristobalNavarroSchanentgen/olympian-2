"use strict";
/**
 * Message Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServiceImpl = void 0;
class MessageServiceImpl {
    messages = new Map();
    conversationMessages = new Map();
    nextId = 1;
    async createMessage(conversationId, draft, role) {
        const id = `msg_${this.nextId++}`;
        const now = new Date();
        const message = {
            id,
            conversationId,
            role,
            content: draft.content,
            createdAt: now,
            updatedAt: now,
            metadata: draft.metadata || {}
        };
        this.messages.set(id, message);
        // Track message in conversation
        if (!this.conversationMessages.has(conversationId)) {
            this.conversationMessages.set(conversationId, []);
        }
        this.conversationMessages.get(conversationId).push(id);
        return message;
    }
    async getMessage(id) {
        return this.messages.get(id) || null;
    }
    async updateMessage(id, updates) {
        const message = this.messages.get(id);
        if (!message) {
            throw new Error(`Message ${id} not found`);
        }
        const updated = {
            ...message,
            ...updates,
            updatedAt: new Date()
        };
        this.messages.set(id, updated);
        return updated;
    }
    async getConversationMessages(conversationId) {
        const messageIds = this.conversationMessages.get(conversationId) || [];
        const messages = messageIds
            .map(id => this.messages.get(id))
            .filter((msg) => msg !== undefined);
        // Sort by creation time
        return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    async deleteMessage(id) {
        const message = this.messages.get(id);
        if (!message) {
            throw new Error(`Message ${id} not found`);
        }
        // Remove from conversation tracking
        const conversationId = message.conversationId;
        const messageIds = this.conversationMessages.get(conversationId) || [];
        const updatedIds = messageIds.filter(msgId => msgId !== id);
        this.conversationMessages.set(conversationId, updatedIds);
        // Remove the message
        this.messages.delete(id);
        return true;
    } // Additional interface methods
    async getMessageCount(conversationId) {
        if (conversationId) {
            return this.messages.size > 0 ? Array.from(this.messages.values()).filter(m => m.conversationId === conversationId).length : 0;
        }
        return this.messages.size;
    }
    async searchMessages(query, conversationId) {
        let filtered = Array.from(this.messages.values()).filter(m => m.content.toLowerCase().includes(query.toLowerCase()));
        if (conversationId) {
            filtered = filtered.filter(m => m.conversationId === conversationId);
        }
        return filtered;
    }
    async getLatestMessage(conversationId) {
        const messages = Array.from(this.messages.values())
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return messages[0] || null;
    }
    async deleteMessages(messageIds) {
        let deletedCount = 0;
        messageIds.forEach(id => {
            if (this.messages.delete(id)) {
                deletedCount++;
                // Remove from conversation messages mapping
                for (const [conversationId, msgIds] of this.conversationMessages.entries()) {
                    const index = msgIds.indexOf(id);
                    if (index > -1) {
                        msgIds.splice(index, 1);
                        break;
                    }
                }
            }
        });
        return deletedCount;
    }
}
exports.MessageServiceImpl = MessageServiceImpl;
//# sourceMappingURL=message-service-impl.js.map