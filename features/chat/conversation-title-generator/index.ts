/**
 * Conversation Title Generator Feature
 * Handles AI-powered conversation title generation
 */

import type { 
  ConversationTitleGeneratorContract,
  TitleGenerationRequest,
  TitleGenerationResponse,
  TitleGenerationConfig
} from './contract';

export class ConversationTitleGenerator implements ConversationTitleGeneratorContract {
  private config: TitleGenerationConfig;
  private ollamaAdapter: any;
  private promptAdapter: any;

  constructor(
    ollamaAdapter: any,
    promptAdapter: any,
    initialConfig: TitleGenerationConfig
  ) {
    this.ollamaAdapter = ollamaAdapter;
    this.promptAdapter = promptAdapter;
    this.config = initialConfig;
  }

  async generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse> {
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
      const prompt = this.promptAdapter.createTitlePrompt(
        request.firstMessage,
        this.config.maxTitleLength
      );

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
    } catch (error) {
      console.error('Title generation failed:', error);
      return {
        conversationId: request.conversationId,
        generatedTitle: this.generateFallbackTitle(request.firstMessage),
        fallbackUsed: true,
        model: request.model || this.config.defaultModel
      };
    }
  }

  async isEnabled(): Promise<boolean> {
    return this.config.enabled;
  }

  async getConfig(): Promise<TitleGenerationConfig> {
    return { ...this.config };
  }

  async updateConfig(updates: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig> {
    this.config = { ...this.config, ...updates };
    return { ...this.config };
  }

  private generateFallbackTitle(message: string): string {
    // Create a simple fallback title from the first few words
    const words = message.trim().split(/\s+/).slice(0, 5);
    const title = words.join(' ');
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  }
}

export * from './contract';
