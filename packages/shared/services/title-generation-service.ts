/**
 * Title Generation Service Interface
 */

import type { TitleGenerationRequest, TitleGenerationResponse, TitleGenerationConfig } from '../models/chat/title-generation';

export interface TitleGenerationService {
  /**
   * Generate a title for a conversation
   */
  generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
  
  /**
   * Auto-generate title when first message is sent
   */
  autoGenerateTitle(conversationId: string, firstMessage: string): Promise<string>;
  
  /**
   * Check if title generation is available
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Get current configuration
   */
  getConfig(): Promise<TitleGenerationConfig>;
  
  /**
   * Update configuration
   */
  updateConfig(config: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig>;
}
