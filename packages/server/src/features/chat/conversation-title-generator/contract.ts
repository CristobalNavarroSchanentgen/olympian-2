/**
 * Conversation Title Generator Contract
 * Generates contextual titles for conversations based on first user message
 */

export interface TitleGenerationRequest {
  conversationId: string;
  firstMessage: string;
  model?: string;
  maxLength?: number;
}

export interface TitleGenerationResponse {
  conversationId: string;
  generatedTitle: string;
  fallbackUsed: boolean;
  model: string;
  tokensUsed?: number;
}

export interface ConversationTitleGeneratorContract {
  /**
   * Generate a contextual title for a conversation based on the first user message
   */
  generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
  
  /**
   * Generate a fallback title when AI generation fails
   */
  generateFallbackTitle(firstMessage: string): string;
  
  /**
   * Validate if a message is suitable for title generation
   */
  isValidForTitleGeneration(message: string): boolean;
}