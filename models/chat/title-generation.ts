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
  suggestedTitle: string;
  confidence: number;
  fallbackUsed: boolean;
  processingTime?: number;
}

export interface TitleGenerationSettings {
  enabled: boolean;
  autoGenerate: boolean;
  model: string;
  maxLength: number;
  fallbackTitle: string;
  promptTemplate: string;
}
