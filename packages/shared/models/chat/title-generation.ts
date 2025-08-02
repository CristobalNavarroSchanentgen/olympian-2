/**
 * Title Generation Models
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

export interface TitleGenerationConfig {
  defaultModel: string;
  maxTitleLength: number;
  minMessageLength: number;
  temperature: number;
  enabled: boolean;
}