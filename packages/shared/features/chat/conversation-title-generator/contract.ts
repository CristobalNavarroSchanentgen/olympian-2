/**
 * Conversation Title Generator Contract
 * Generates contextual titles for conversations based on first user message
 */

import { TitleGenerationRequest, TitleGenerationResponse, TitleGenerationConfig } from '../../../models/chat/title-generation';

export interface ConversationTitleGeneratorContract {
  /**
   * Generate a title for a conversation based on the first message
   */
  generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
  
  /**
   * Check if title generation is enabled and configured
   */
  isEnabled(): Promise<boolean>;
  
  /**
   * Get current configuration
   */
  getConfig(): Promise<TitleGenerationConfig>;
  
  /**
   * Update title generation configuration
   */
  updateConfig(config: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig>;
}

export * from '../../../models/chat/title-generation';
