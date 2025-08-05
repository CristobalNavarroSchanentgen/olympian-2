/**
 * Message Processor Feature
 * Handles message creation, processing, and title generation triggers
 */
export class MessageProcessor {
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
export * from './contract';
//# sourceMappingURL=index.js.map