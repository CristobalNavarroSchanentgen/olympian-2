import { Message } from '../../../models/chat/message';
import { MemoryContext } from '../../../models/chat/memory-context';
import { optimizeContext, buildContext } from '../../../utils/context-manager';

/**
 * Context adapter for memory management
 * Transforms context optimization utilities for memory-manager feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by memory-manager
 */

export interface ContextAdapter {
  // Context building
  buildConversationContext(messages: Message[], maxTokens: number): MemoryContext;
  optimizeContext(context: MemoryContext, targetTokens: number): MemoryContext;
  
  // Context analysis
  analyzeContextQuality(context: MemoryContext): ContextQuality;
  getContextStatistics(context: MemoryContext): ContextStatistics;
  
  // Context strategies
  applyCompressionStrategy(context: MemoryContext, ratio: number): MemoryContext;
  applySummaryStrategy(context: MemoryContext): MemoryContext;
}

export interface ContextQuality {
  score: number; // 0-1
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
  contextCoverage: number; // Percentage of conversation included
  compressionRatio: number;
}

export function createContextAdapter(): ContextAdapter {
  return {
    buildConversationContext(messages, maxTokens) {
      const context = buildContext(messages, {
        maxTokens,
        preserveSystemMessages: true,
        preserveLastN: 3,
        strategy: 'balanced'
      });
      
      return {
        messages: context.messages,
        totalTokens: context.totalTokens,
        compressionRatio: messages.length > 0 ? context.messages.length / messages.length : 1,
        createdAt: new Date(),
        metadata: {
          originalCount: messages.length,
          strategy: 'balanced',
          maxTokens
        }
      };
    },

    optimizeContext(context, targetTokens) {
      if (context.totalTokens <= targetTokens) {
        return context;
      }
      
      const optimized = optimizeContext(context.messages, {
        targetTokens,
        preserveRecent: true,
        allowCompression: true
      });
      
      return {
        ...context,
        messages: optimized.messages,
        totalTokens: optimized.totalTokens,
        compressionRatio: context.messages.length > 0 ? 
          optimized.messages.length / context.messages.length : 1,
        metadata: {
          ...context.metadata,
          optimized: true,
          optimizedAt: new Date(),
          targetTokens
        }
      };
    },

    analyzeContextQuality(context) {
      const messages = context.messages;
      
      if (messages.length === 0) {
        return {
          score: 0,
          completeness: 0,
          relevance: 0,
          coherence: 0,
          suggestions: ['Add messages to analyze context quality']
        };
      }
      
      // Analyze completeness (conversation flow preservation)
      const hasSystemMessage = messages.some(m => m.role === 'system');
      const hasUserMessages = messages.some(m => m.role === 'user');
      const hasAssistantMessages = messages.some(m => m.role === 'assistant');
      
      const completeness = (
        (hasSystemMessage ? 0.3 : 0) +
        (hasUserMessages ? 0.4 : 0) +
        (hasAssistantMessages ? 0.3 : 0)
      );
      
      // Analyze relevance (recent vs old messages)
      const recentWeight = 0.7;
      const totalMessages = messages.length;
      const recentMessages = Math.ceil(totalMessages * 0.3);
      const relevance = recentWeight + ((totalMessages - recentMessages) / totalMessages) * (1 - recentWeight);
      
      // Analyze coherence (conversation flow)
      let coherence = 1.0;
      for (let i = 1; i < messages.length; i++) {
        const prev = messages[i - 1];
        const curr = messages[i];
        
        // Check for proper alternating patterns
        if (prev.role === curr.role && prev.role !== 'system') {
          coherence -= 0.1;
        }
      }
      coherence = Math.max(0, coherence);
      
      const score = (completeness + relevance + coherence) / 3;
      
      const suggestions = [];
      if (completeness < 0.8) suggestions.push('Consider including more diverse message types');
      if (relevance < 0.7) suggestions.push('Focus on more recent conversation context');
      if (coherence < 0.8) suggestions.push('Improve conversation flow preservation');
      if (context.totalTokens > (context.metadata?.maxTokens || 4000) * 0.9) {
        suggestions.push('Context approaching token limit - consider optimization');
      }
      
      return {
        score,
        completeness,
        relevance,
        coherence,
        suggestions
      };
    },

    getContextStatistics(context) {
      const originalCount = context.metadata?.originalCount || context.messages.length;
      
      return {
        totalMessages: originalCount,
        includedMessages: context.messages.length,
        totalTokens: context.totalTokens,
        averageMessageTokens: context.messages.length > 0 ? 
          context.totalTokens / context.messages.length : 0,
        contextCoverage: originalCount > 0 ? context.messages.length / originalCount : 1,
        compressionRatio: context.compressionRatio
      };
    },

    applyCompressionStrategy(context, ratio) {
      const targetCount = Math.floor(context.messages.length * ratio);
      
      if (targetCount >= context.messages.length) {
        return context;
      }
      
      // Keep system messages and recent messages
      const systemMessages = context.messages.filter(m => m.role === 'system');
      const otherMessages = context.messages.filter(m => m.role !== 'system');
      
      // Take the most recent messages to reach target count
      const recentCount = Math.max(1, targetCount - systemMessages.length);
      const recentMessages = otherMessages.slice(-recentCount);
      
      const compressedMessages = [...systemMessages, ...recentMessages];
      
      return {
        ...context,
        messages: compressedMessages,
        totalTokens: compressedMessages.reduce((sum, m) => sum + (m.metadata?.tokens || 100), 0),
        compressionRatio: context.messages.length > 0 ? 
          compressedMessages.length / context.messages.length : 1,
        metadata: {
          ...context.metadata,
          compressed: true,
          compressedAt: new Date(),
          compressionRatio: ratio
        }
      };
    },

    applySummaryStrategy(context) {
      // This is a simplified summary strategy
      // In a real implementation, this would use AI to generate summaries
      
      if (context.messages.length <= 5) {
        return context; // Too few messages to summarize
      }
      
      const systemMessages = context.messages.filter(m => m.role === 'system');
      const conversationMessages = context.messages.filter(m => m.role !== 'system');
      
      // Keep the last 3 messages and create a summary of the rest
      const recentMessages = conversationMessages.slice(-3);
      const toSummarize = conversationMessages.slice(0, -3);
      
      if (toSummarize.length === 0) {
        return context;
      }
      
      // Create a simple summary message
      const summaryContent = `[Previous conversation summary: ${toSummarize.length} messages covering topics discussed earlier in this conversation]`;
      
      const summaryMessage: Message = {
        id: `summary-${Date.now()}`,
        role: 'system',
        content: summaryContent,
        conversationId: context.messages[0]?.conversationId || '',
        createdAt: new Date(),
        metadata: {
          isSummary: true,
          summarizedCount: toSummarize.length,
          tokens: 50
        }
      };
      
      const summarizedMessages = [...systemMessages, summaryMessage, ...recentMessages];
      
      return {
        ...context,
        messages: summarizedMessages,
        totalTokens: summarizedMessages.reduce((sum, m) => sum + (m.metadata?.tokens || 100), 0),
        compressionRatio: context.messages.length > 0 ? 
          summarizedMessages.length / context.messages.length : 1,
        metadata: {
          ...context.metadata,
          summarized: true,
          summarizedAt: new Date(),
          summarizedCount: toSummarize.length
        }
      };
    }
  };
}
