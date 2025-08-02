"use strict";
/**
 * Conversation Manager Feature
 * Manages conversation lifecycle and title updates
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationManager = void 0;
class ConversationManager {
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
exports.ConversationManager = ConversationManager;
__exportStar(require("./contract"), exports);
//# sourceMappingURL=index.js.map