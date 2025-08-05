/**
 * Conversation Manager Feature
 * Manages conversation lifecycle and title updates
 */
export class ConversationManager {
    conversationService;
    eventEmitter;
    constructor(conversationService, eventEmitter) {
        this.conversationService = conversationService;
        this.eventEmitter = eventEmitter;
    }
    async getConversations() {
        return this.conversationService.getAll();
    }
    async getConversation(id) {
        return this.conversationService.getById(id);
    }
    async createConversation(request) {
        const conversation = await this.conversationService.create(request);
        this.eventEmitter.emit('conversation-created', { conversation });
        return conversation;
    }
    async updateConversation(id, updates) {
        const updated = await this.conversationService.update(id, updates);
        if (updated) {
            this.eventEmitter.emit('conversation-updated', { conversation: updated });
        }
        return updated;
    }
    async deleteConversation(id) {
        const deleted = await this.conversationService.delete(id);
        if (deleted) {
            this.eventEmitter.emit('conversation-deleted', { conversationId: id });
        }
        return deleted;
    }
    async archiveConversation(id) {
        const archived = await this.conversationService.archive(id);
        if (archived) {
            this.eventEmitter.emit('conversation-archived', { conversationId: id });
        }
        return archived;
    }
    async searchConversations(query) {
        return this.conversationService.search(query);
    }
    /**
     * Update conversation title (used by title generation)
     */
    async updateTitle(conversationId, title) {
        return this.updateConversation(conversationId, { title });
    }
}
export * from './contract';
//# sourceMappingURL=index.js.map