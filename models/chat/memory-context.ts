/**
 * Memory context model - pure types only
 */

export interface MemoryContext {
  readonly conversationId: string;
  readonly messages: ContextMessage[];
  readonly totalTokens: number;
  readonly windowSize: number;
  readonly lastUpdated: Date;
}

export interface ContextMessage {
  readonly id: string;
  readonly role: string;
  readonly content: string;
  readonly tokenCount: number;
  readonly priority: ContextPriority;
}

export type ContextPriority = 'system' | 'high' | 'medium' | 'low';

export interface ContextWindow {
  readonly maxTokens: number;
  readonly maxMessages: number;
  readonly reservedTokens: number;
}

export interface ContextStats {
  readonly totalMessages: number;
  readonly includedMessages: number;
  readonly totalTokens: number;
  readonly usedTokens: number;
  readonly availableTokens: number;
}

export interface ContextCleanupResult {
  readonly removedMessages: number;
  readonly savedTokens: number;
  readonly newMessageCount: number;
  readonly newTokenCount: number;
}
