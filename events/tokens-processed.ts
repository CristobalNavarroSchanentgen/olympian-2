/**
 * Tokens Processed Event
 * Emitted when tokens are processed for a message
 */

export interface TokensProcessedEvent {
  messageId: string;
  conversationId: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  modelUsed: string;
  timestamp: Date;
}
