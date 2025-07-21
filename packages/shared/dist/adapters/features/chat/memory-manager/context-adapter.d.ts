import { Message } from '../../../models/chat';
import { MemoryContext } from '../../../models/chat';
/**
 * Context adapter for memory management
 * Transforms context optimization utilities for memory-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by memory-manager
 */
export interface ContextAdapter {
    buildConversationContext(messages: Message[], maxTokens: number): MemoryContext;
    optimizeContext(context: MemoryContext, targetTokens: number): MemoryContext;
    analyzeContextQuality(context: MemoryContext): ContextQuality;
    getContextStatistics(context: MemoryContext): ContextStatistics;
    applyCompressionStrategy(context: MemoryContext, ratio: number): MemoryContext;
    applySummaryStrategy(context: MemoryContext): MemoryContext;
}
export interface ContextQuality {
    score: number;
    completeness: number;
    relevance: number;
    coherence: number;
    suggestions: string[];
}
export interface ContextStatistics {
    totalMessages: number;
    includedMessages: number;
    totalTokens: number;
    averageMessageTokens: number;
    contextCoverage: number;
    compressionRatio: number;
}
export declare function createContextAdapter(): ContextAdapter;
//# sourceMappingURL=context-adapter.d.ts.map