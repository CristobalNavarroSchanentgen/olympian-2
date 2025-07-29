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

// Helper Functions (extracted from adapter methods)
function buildConversationContextHelper(messages: Message[], maxTokens: number): MemoryContext {
  const optimized = optimizeMessageHistory(messages, maxTokens, { 
    prioritizeRecent: true, 
    keepSystemMessages: true, 
    summarizeOld: false, 
    maxMessages: 20 
  });
  
  const conversationId = messages[0]?.conversationId || 'unknown';
  const usedTokens = optimized.length * 100; // rough estimate
  
  return createMemoryContext(conversationId, maxTokens, usedTokens);
}

function optimizeContextHelper(context: MemoryContext, targetTokens: number): MemoryContext {
  if (context.usedTokens <= targetTokens) {
    return context;
  }
  
  const newUsedTokens = Math.min(context.usedTokens, targetTokens);
  
  return {
    ...context,
    usedTokens: newUsedTokens,
    availableTokens: context.tokenBudget - newUsedTokens,
    lastUpdated: new Date()
  };
}

function generateContextStatsHelper(context: MemoryContext): ContextStats {
  return {
    totalMessages: 0,
    tokenUsage: context.usedTokens,
    compressionRatio: context.usedTokens / context.tokenBudget,
    lastOptimizedAt: context.lastUpdated
  };
}

function validateContextHelper(context: MemoryContext): ContextValidation {
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

export function createContextAdapter(): ContextAdapter {
  return {
    buildConversationContext: buildConversationContextHelper,
    optimizeContext: optimizeContextHelper,
    getContextStats: generateContextStatsHelper,
    validateContext: validateContextHelper
  };
}