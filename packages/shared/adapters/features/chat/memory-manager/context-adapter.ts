import { Message } from '../../../../models/chat/index';
import { MemoryContext } from '../../../../models/chat/index';
import { optimizeMessageHistory, createMemoryContext } from '../../../../utils/context-manager';

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

export function createContextAdapter(): ContextAdapter {
  return {
    buildConversationContext(messages, maxTokens) {
      const optimized = optimizeMessageHistory(messages, maxTokens, { prioritizeRecent: true, keepSystemMessages: true, summarizeOld: false, maxMessages: 20 });
      const conversationId = messages[0]?.conversationId || 'unknown';
      const usedTokens = optimized.length * 100; // rough estimate
      
      return createMemoryContext(conversationId, maxTokens, usedTokens);
    },

    optimizeContext(context, targetTokens) {
      // If already within target, return as-is
      if (context.usedTokens <= targetTokens) {
        return context;
      }
      
      // Create optimized context with reduced token count
      const newUsedTokens = Math.min(context.usedTokens, targetTokens);
      
      return {
        ...context,
        usedTokens: newUsedTokens,
        availableTokens: context.tokenBudget - newUsedTokens,
        lastUpdated: new Date()
      };
    },

    getContextStats(context) {
      return {
        totalMessages: 0, // Would be calculated from actual messages
        tokenUsage: context.usedTokens,
        compressionRatio: context.usedTokens / context.tokenBudget,
        lastOptimizedAt: context.lastUpdated
      };
    },

    validateContext(context) {
      const warnings: string[] = [];
      const recommendations: string[] = [];
      
      if (context.usedTokens > context.tokenBudget) {
        warnings.push('Context exceeds token budget');
        recommendations.push('Consider optimizing or reducing context size');
      }
      
      if (context.usedTokens / context.tokenBudget > 0.9) {
        warnings.push('Context is near token limit');
        recommendations.push('Prepare for context optimization');
      }
      
      return {
        isValid: warnings.length === 0,
        warnings,
        recommendations
      };
    }
  };
}
