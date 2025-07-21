"use strict";
/**
 * Feature Implementation: Chat Message Processor
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageProcessor = void 0;
class MessageProcessor {
    deps;
    activeStreams = new Map();
    constructor(deps) {
        this.deps = deps;
    }
    async processMessage(params) {
        // Create user message
        const userMessage = await this.deps.messageService.createMessage({
            conversationId: params.conversationId,
            role: "user",
            content: params.content,
            images: params.images
        });
        // Start streaming response
        const controller = new AbortController();
        this.activeStreams.set(userMessage.id, controller);
        const responseStream = this.deps.ollamaAdapter.streamChat({
            model: params.model,
            messages: [...(params.context || []), userMessage],
            systemPrompt: params.systemPrompt,
            signal: controller.signal
        });
        const responsePromise = this.processResponseStream(params.conversationId, responseStream, userMessage.id);
        return { userMessage, responseStream, responsePromise };
    }
    async continueMessage(messageId) {
        const message = await this.deps.messageService.getMessage(messageId);
        if (!message)
            throw new Error("Message not found");
        const controller = new AbortController();
        this.activeStreams.set(messageId, controller);
        const responseStream = this.deps.ollamaAdapter.continueGeneration({
            messageId,
            signal: controller.signal
        });
        const responsePromise = this.processResponseStream(message.conversationId, responseStream, messageId);
        return { responseStream, responsePromise };
    }
    async cancelMessage(messageId) {
        const controller = this.activeStreams.get(messageId);
        if (controller) {
            controller.abort();
            this.activeStreams.delete(messageId);
        }
    }
    async startStreaming(params) {
        return this.deps.streamingAdapter.createStream({
            conversationId: params.conversationId,
            callback: params.onToken
        });
    }
    async stopStreaming(streamId) {
        await this.deps.streamingAdapter.closeStream(streamId);
    }
    async regenerateResponse(messageId) {
        const message = await this.deps.messageService.getMessage(messageId);
        if (!message)
            throw new Error("Message not found");
        // Get previous context
        const context = await this.deps.messageService.getMessageContext(messageId);
        return this.processMessage({
            conversationId: message.conversationId,
            content: message.content,
            model: message.metadata?.model,
            context
        });
    }
    async editMessage(messageId, newContent) {
        const updated = await this.deps.messageService.updateMessage(messageId, {
            content: newContent,
            editedAt: new Date()
        });
        this.deps.websocketAdapter.emitMessageUpdated(updated);
        return updated;
    }
    async deleteMessage(messageId) {
        await this.deps.messageService.deleteMessage(messageId);
        this.deps.websocketAdapter.emitMessageDeleted(messageId);
    }
    async processResponseStream(conversationId, stream, relatedMessageId) {
        let fullContent = "";
        let aiMessage = null;
        for await (const token of stream) {
            fullContent += token;
            // Create AI message on first token
            if (!aiMessage) {
                aiMessage = await this.deps.messageService.createMessage({
                    conversationId,
                    role: "assistant",
                    content: token,
                    metadata: { relatedMessageId }
                });
            }
            else {
                // Update existing message
                aiMessage = await this.deps.messageService.updateMessage(aiMessage.id, {
                    content: fullContent
                });
            }
            // Emit streaming token
            this.deps.websocketAdapter.emitToken({
                messageId: aiMessage.id,
                token,
                fullContent
            });
        }
        if (!aiMessage) {
            throw new Error("No response generated");
        }
        // Mark as complete
        const finalMessage = await this.deps.messageService.updateMessage(aiMessage.id, {
            metadata: { ...aiMessage.metadata, completed: true }
        });
        this.deps.websocketAdapter.emitMessageComplete(finalMessage);
        return finalMessage;
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.MessageProcessor = MessageProcessor;
//# sourceMappingURL=index.js.map