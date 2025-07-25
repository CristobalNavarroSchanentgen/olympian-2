/**
 * Feature Contract: Chat Memory Manager
 *
 * Manages conversation context, token budgets, and memory optimization.
 */
import { Message } from '../../../models/chat';
import { MemoryContext } from '../../../models/chat';
import { MemoryService } from '../../../services/memory-service';
import { ContextUpdated, MemoryCleaned } from '../../../events';
import { MemoryManagerConfig } from '../../../config/features/chat/memory-manager/schema';
export interface MemoryManagerContract {
    /**
     * Build optimized context for model request
     */
    buildContext(params: {
        conversationId: string;
        tokenBudget: number;
        includeSystemPrompt?: boolean;
        preserveRecent?: number;
    }): Promise<{
        context: Message[];
        tokensUsed: number;
        messagesIncluded: number;
        compressionApplied: boolean;
    }>;
    /**
     * Update context with new message
     */
    updateContext(conversationId: string, message: Message): Promise<MemoryContext>;
    /**
     * Get current context for conversation
     */
    getContext(conversationId: string): Promise<MemoryContext | null>;
    /**
     * Clean old messages to prevent memory overflow
     */
    cleanMemory(conversationId: string, options?: {
        forceClean?: boolean;
        retainMessages?: number;
        preserveImportant?: boolean;
    }): Promise<{
        messagesRemoved: number;
        tokensFreed: number;
        compressionApplied: boolean;
    }>;
    /**
     * Compress conversation history into summary
     */
    compressHistory(conversationId: string, options?: {
        compressionRatio?: number;
        preserveRecent?: number;
        summaryTokenLimit?: number;
    }): Promise<{
        originalTokens: number;
        compressedTokens: number;
        compressionRatio: number;
        summary: string;
    }>;
    /**
     * Calculate optimal token budget for conversation
     */
    calculateTokenBudget(params: {
        conversationId: string;
        model: string;
        maxTokens?: number;
        reserveTokens?: number;
    }): Promise<{
        totalBudget: number;
        contextBudget: number;
        responseBudget: number;
        systemPromptTokens: number;
    }>;
    /**
     * Validate if new content fits within budget
     */
    validateTokenBudget(params: {
        conversationId: string;
        newContent: string;
        images?: string[];
        tokenBudget: number;
    }): Promise<{
        fitsInBudget: boolean;
        currentTokens: number;
        newTokens: number;
        totalTokens: number;
        suggestedCleanup?: number;
    }>;
    /**
     * Get memory usage statistics for conversation
     */
    getMemoryStats(conversationId: string): Promise<{
        totalMessages: number;
        totalTokens: number;
        contextTokens: number;
        oldestMessage: Date;
        lastCleanup: Date | null;
        compressionRatio: number;
    }>;
    /**
     * Get global memory statistics
     */
    getGlobalMemoryStats(): Promise<{
        totalConversations: number;
        totalMessages: number;
        totalTokens: number;
        averageTokensPerConversation: number;
        memoryPressure: number;
    }>;
    updateConfig(config: Partial<MemoryManagerConfig>): Promise<void>;
    getConfig(): MemoryManagerConfig;
}
export interface ContextAdapter {
    buildOptimalContext(messages: Message[], tokenBudget: number): {
        context: Message[];
        tokensUsed: number;
        strategy: string;
    };
    prioritizeMessages(messages: Message[]): Message[];
    compressMessages(messages: Message[], targetTokens: number): string;
}
export interface TokenBudgetAdapter {
    calculateBudget(model: string, maxTokens: number): {
        contextBudget: number;
        responseBudget: number;
        systemBudget: number;
    };
    estimateMessageTokens(message: Message): number;
    validateBudget(messages: Message[], budget: number): boolean;
}
export interface MemoryEventPublisher {
    publishContextUpdated(event: ContextUpdated): void;
    publishMemoryCleaned(event: MemoryCleaned): void;
}
export interface MemoryManagerDependencies {
    memoryService: MemoryService;
    contextAdapter: ContextAdapter;
    tokenBudgetAdapter: TokenBudgetAdapter;
    eventPublisher: MemoryEventPublisher;
    config: MemoryManagerConfig;
}
//# sourceMappingURL=contract.d.ts.map