"use strict";
/**
 * Conversation Title Generator Feature
 * Handles AI-powered conversation title generation
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
exports.ConversationTitleGenerator = void 0;
class ConversationTitleGenerator {
    config;
    ollamaAdapter;
    promptAdapter;
    constructor(ollamaAdapter, promptAdapter, initialConfig) {
        this.ollamaAdapter = ollamaAdapter;
        this.promptAdapter = promptAdapter;
        this.config = initialConfig;
    }
    async generateTitle(request) {
        if (!this.config.enabled || request.firstMessage.length < this.config.minMessageLength) {
            return {
                conversationId: request.conversationId,
                generatedTitle: this.generateFallbackTitle(request.firstMessage),
                fallbackUsed: true,
                model: request.model || this.config.defaultModel
            };
        }
        try {
            // Generate prompt using adapter
            const prompt = this.promptAdapter.createTitlePrompt(request.firstMessage, this.config.maxTitleLength);
            // Call Ollama through adapter
            const response = await this.ollamaAdapter.generateCompletion({
                model: request.model || this.config.defaultModel,
                prompt,
                maxTokens: 30,
                temperature: this.config.temperature
            });
            const title = this.promptAdapter.extractTitle(response.content);
            return {
                conversationId: request.conversationId,
                generatedTitle: title || this.generateFallbackTitle(request.firstMessage),
                fallbackUsed: !title,
                model: request.model || this.config.defaultModel,
                tokensUsed: response.tokens
            };
        }
        catch (error) {
            console.error('Title generation failed:', error);
            return {
                conversationId: request.conversationId,
                generatedTitle: this.generateFallbackTitle(request.firstMessage),
                fallbackUsed: true,
                model: request.model || this.config.defaultModel
            };
        }
    }
    async isEnabled() {
        return this.config.enabled;
    }
    async getConfig() {
        return { ...this.config };
    }
    async updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        return { ...this.config };
    }
    generateFallbackTitle(message) {
        // Create a simple fallback title from the first few words
        const words = message.trim().split(/\s+/).slice(0, 5);
        const title = words.join(' ');
        return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
}
exports.ConversationTitleGenerator = ConversationTitleGenerator;
__exportStar(require("./contract"), exports);
//# sourceMappingURL=index.js.map