/**
 * Context Manager Utility
 * Pure functions for managing conversation context
 */
import type { Message } from '../models/chat/message';
import type { MemoryContext } from '../models/chat/memory-context';
export interface ContextWindow {
    maxTokens: number;
    reservedSystemTokens: number;
    reservedResponseTokens: number;
    availableForHistory: number;
}
export interface OptimizationStrategy {
    prioritizeRecent: boolean;
    keepSystemMessages: boolean;
    summarizeOld: boolean;
    maxMessages: number;
}
export declare function calculateContextWindow(maxTokens?: number, systemTokens?: number, responseTokens?: number): ContextWindow;
export declare function optimizeMessageHistory(messages: Message[], availableTokens: number, strategy: OptimizationStrategy): Message[];
export declare function createMemoryContext(conversationId: string, tokenBudget: number, usedTokens?: number): MemoryContext;
//# sourceMappingURL=context-manager.d.ts.map