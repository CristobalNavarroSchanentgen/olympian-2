import { Message } from '../../../../models/chat/index';
import { MemoryContext } from '../../../../models/chat/index';
/**
 * Context adapter for memory management
 * Transforms context operations for memory-manager feature
 */
export interface ContextAdapter {
    buildConversationContext(messages: Message[], maxTokens: number): MemoryContext;
    optimizeContext(context: MemoryContext, targetTokens: number): MemoryContext;
    getContextStats(context: MemoryContext): ContextStats;
    validateContext(context: MemoryContext): ContextValidation;
}
export interface ContextStats {
    totalMessages: number;
    tokenUsage: number;
    compressionRatio: number;
    lastOptimizedAt: Date;
}
export interface ContextValidation {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
}
export declare function createContextAdapter(): ContextAdapter;
//# sourceMappingURL=context-adapter.d.ts.map