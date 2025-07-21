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
export interface ContextWindow {
    maxTokens: number;
    usedTokens: number;
    availableTokens: number;
    messageIds: string[];
}
export interface ContextStats {
    totalMessages: number;
    tokenUsage: number;
    compressionRatio: number;
    lastOptimizedAt: Date;
}
//# sourceMappingURL=memory-context.d.ts.map