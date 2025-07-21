/**
 * Memory Context Models
 */

export interface MemoryContext {
  conversationId: string;
  tokenBudget: number;
  usedTokens: number;
  availableTokens: number;
  priority: number;
  lastUpdated: Date;
  metadata: Record<string, unknown>;
}
