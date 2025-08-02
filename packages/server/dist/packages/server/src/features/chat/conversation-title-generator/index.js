"use strict";
/**
 * Conversation Title Generator Implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationTitleGenerator = void 0;
exports.createConversationTitleGenerator = createConversationTitleGenerator;
const ollama_title_adapter_1 = require("../../../adapters/features/chat/conversation-title-generator/ollama-title-adapter");
const prompt_adapter_1 = require("../../../adapters/features/chat/conversation-title-generator/prompt-adapter");
const event_bus_1 = require("../../../utils/event-bus");
class ConversationTitleGenerator {
    maxTitleLength = 50;
    minMessageLength = 10;
    async generateTitle(request) {
        const { conversationId, firstMessage, model = 'llama3.2:1b' } = request;
        // Validate message is suitable for title generation
        if (!this.isValidForTitleGeneration(firstMessage)) {
            return {
                conversationId,
                generatedTitle: this.generateFallbackTitle(firstMessage),
                fallbackUsed: true,
                model: 'fallback'
            };
        }
        try {
            // Generate title prompt
            const prompt = prompt_adapter_1.promptAdapter.createTitlePrompt(firstMessage);
            // Call AI model through adapter
            const aiResponse = await ollama_title_adapter_1.ollamaTitleAdapter.generateTitle({
                prompt,
                model,
                maxTokens: 15,
                temperature: 0.7
            });
            const generatedTitle = this.cleanTitle(aiResponse.response);
            // Emit event for title generation
            event_bus_1.eventBus.emit('conversation-title-generated', {
                conversationId,
                title: generatedTitle,
                model,
                tokensUsed: aiResponse.tokensUsed
            });
            return {
                conversationId,
                generatedTitle,
                fallbackUsed: false,
                model,
                tokensUsed: aiResponse.tokensUsed
            };
        }
        catch (error) {
            console.warn('Title generation failed, using fallback:', error);
            const fallbackTitle = this.generateFallbackTitle(firstMessage);
            const errorMessage = error instanceof Error ? error.message : String(error);
            event_bus_1.eventBus.emit('conversation-title-generated', {
                conversationId,
                title: fallbackTitle,
                model: 'fallback',
                error: errorMessage
            });
            return {
                conversationId,
                generatedTitle: fallbackTitle,
                fallbackUsed: true,
                model: 'fallback'
            };
        }
    }
    generateFallbackTitle(firstMessage) {
        const words = firstMessage.trim().split(/\s+/).slice(0, 6);
        const preview = words.join(' ');
        if (preview.length > 3) {
            return preview.length > this.maxTitleLength
                ? preview.substring(0, this.maxTitleLength - 3) + '...'
                : preview;
        }
        return `Chat ${new Date().toLocaleDateString()}`;
    }
    isValidForTitleGeneration(message) {
        return Boolean(message &&
            message.trim().length >= this.minMessageLength &&
            message.trim().length <= 500 &&
            !/^\s*$/.test(message));
    }
    cleanTitle(title) {
        return title
            .replace(/^["']|["']$/g, '')
            .replace(/^(Title:|Chat:|Conversation:)\s*/i, '')
            .trim()
            .substring(0, this.maxTitleLength);
    }
}
exports.ConversationTitleGenerator = ConversationTitleGenerator;
function createConversationTitleGenerator() {
    return new ConversationTitleGenerator();
}
//# sourceMappingURL=index.js.map