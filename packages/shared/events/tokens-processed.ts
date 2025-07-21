/**
 * Tokens processed event
 */

export interface TokensProcessedEvent {
  readonly type: 'tokens-processed';
  readonly conversationId: string;
  readonly messageId: string;
  readonly tokenCount: number;
  readonly cumulativeTokens: number;
  readonly timestamp: Date;
  readonly metadata: {
    readonly model: string;
    readonly processingTime: number;
    readonly streamingComplete: boolean;
    readonly contextWindowUsed: number;
  };
}

export function createTokensProcessedEvent(
  conversationId: string,
  messageId: string,
  tokenCount: number,
  cumulativeTokens: number,
  model: string,
  processingTime: number,
  streamingComplete: boolean,
  contextWindowUsed: number
): TokensProcessedEvent {
  return {
    type: 'tokens-processed',
    conversationId,
    messageId,
    tokenCount,
    cumulativeTokens,
    timestamp: new Date(),
    metadata: {
      model,
      processingTime,
      streamingComplete,
      contextWindowUsed
    }
  };
}
