/**
 * Conversation Title Generator Implementation
 */

import { ConversationTitleGeneratorContract, TitleGenerationRequest, TitleGenerationResponse } from './contract';
import { ollamaTitleAdapter } from '../../../adapters/features/chat/conversation-title-generator/ollama-title-adapter';
import { promptAdapter } from '../../../adapters/features/chat/conversation-title-generator/prompt-adapter';
import { eventBus } from '../../../utils/event-bus';

export class ConversationTitleGenerator implements ConversationTitleGeneratorContract {
  private readonly maxTitleLength = 50;
  private readonly minMessageLength = 10;

  async generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse> {
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
      const prompt = promptAdapter.createTitlePrompt(firstMessage);
      
      // Call AI model through adapter
      const aiResponse = await ollamaTitleAdapter.generateTitle({
        prompt,
        model,
        maxTokens: 15,
        temperature: 0.7
      });

      const generatedTitle = this.cleanTitle(aiResponse.response);
      
      // Emit event for title generation
      eventBus.emit('conversation-title-generated', {
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
    } catch (error) {
      console.warn('Title generation failed, using fallback:', error);
      
      const fallbackTitle = this.generateFallbackTitle(firstMessage);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      eventBus.emit('conversation-title-generated', {
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

  generateFallbackTitle(firstMessage: string): string {
    const words = firstMessage.trim().split(/\s+/).slice(0, 6);
    const preview = words.join(' ');
    
    if (preview.length > 3) {
      return preview.length > this.maxTitleLength 
        ? preview.substring(0, this.maxTitleLength - 3) + '...'
        : preview;
    }
    
    return `Chat ${new Date().toLocaleDateString()}`;
  }

  isValidForTitleGeneration(message: string): boolean {
    return Boolean(
      message && 
      message.trim().length >= this.minMessageLength &&
      message.trim().length <= 500 &&
      !/^\s*$/.test(message)
    );
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/^["']|["']$/g, '')
      .replace(/^(Title:|Chat:|Conversation:)\s*/i, '')
      .trim()
      .substring(0, this.maxTitleLength);
  }
}

export function createConversationTitleGenerator(): ConversationTitleGeneratorContract {
  return new ConversationTitleGenerator();
}