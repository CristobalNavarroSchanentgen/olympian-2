"use strict";
/**
 * Message Processor Feature
 * Handles message creation, processing, and title generation triggers
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
exports.MessageProcessor = void 0;
class MessageProcessor {
    titleGenerationService;
    conversationService;
    messageService;
    eventEmitter;
    constructor(titleGenerationService, conversationService, messageService, eventEmitter) {
        this.titleGenerationService = titleGenerationService;
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.eventEmitter = eventEmitter;
    }
    async createMessage(request) {
        const message = await this.messageService.create(request);
        // Check if this is the first user message in conversation
        if (request.role === 'user') {
            await this.triggerTitleGenerationIfFirst(request.conversationId, request.content);
        }
        this.eventEmitter.emit('message-sent', { message });
        return message;
    }
    async getMessages(conversationId) {
        return this.messageService.getByConversation(conversationId);
    }
    async processMessage(messageId) {
        const message = await this.messageService.getById(messageId);
        if (!message)
            throw new Error('Message ' + messageId + ' not found');
        const processedMessage = { ...message, updatedAt: new Date() };
        this.eventEmitter.emit('message-received', { message: processedMessage });
        return processedMessage;
    }
    async *streamResponse(messageId) {
        yield {
            id: messageId,
            content: 'Streaming not yet implemented',
            done: true
        };
    }
    async updateMessage(id, content) {
        const updated = await this.messageService.update(id, { content });
        if (updated) {
            this.eventEmitter.emit('message-updated', { message: updated });
        }
        return updated;
    }
    async deleteMessage(id) {
        const deleted = await this.messageService.delete(id);
        if (deleted) {
            this.eventEmitter.emit('message-deleted', { messageId: id });
        }
        return deleted;
    }
    async getTokenCount(content, model) {
        return Math.ceil(content.length / 4);
    }
    async triggerTitleGenerationIfFirst(conversationId, content) {
        try {
            const conversation = await this.conversationService.getById(conversationId);
            if (!conversation || conversation.title !== 'New Conversation') {
                return;
            }
            const messages = await this.messageService.getByConversation(conversationId);
            const userMessages = messages.filter((m) => m.role === 'user');
            if (userMessages.length === 1) {
                setImmediate(async () => {
                    try {
                        const generatedTitle = await this.titleGenerationService.autoGenerateTitle(conversationId, content);
                        await this.conversationService.updateTitle(conversationId, generatedTitle);
                        this.eventEmitter.emit('conversation-title-generated', {
                            conversationId,
                            oldTitle: 'New Conversation',
                            newTitle: generatedTitle,
                            confidence: 1.0,
                            fallbackUsed: false,
                            timestamp: new Date()
                        });
                    }
                    catch (error) {
                        console.error('Failed to generate conversation title:', error);
                    }
                });
            }
        }
        catch (error) {
            console.error('Error in title generation trigger:', error);
        }
    }
}
exports.MessageProcessor = MessageProcessor;
__exportStar(require("./contract"), exports);
//# sourceMappingURL=index.js.map