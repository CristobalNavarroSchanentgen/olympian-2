import { Message } from '../../../models/chat';
import { countTokens } from '../../../utils/token-counter';

/**
 * Token budget adapter for memory management
 * Transforms token budget utilities for memory-manager feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by memory-manager
 */

export interface TokenBudgetAdapter {
  // Budget calculation
  calculateBudget(messages: Message[], maxTokens: number, reserveRatio?: number): BudgetInfo;
  checkBudgetCompliance(messages: Message[], budget: BudgetInfo): ComplianceResult;
  
  // Budget optimization
  optimizeBudgetAllocation(messages: Message[], totalBudget: number): BudgetAllocation;
  suggestBudgetAdjustments(current: BudgetInfo, usage: BudgetUsage): BudgetSuggestion[];
  
  // Usage tracking
  trackBudgetUsage(messages: Message[], budget: BudgetInfo): BudgetUsage;
  projectFutureUsage(currentUsage: BudgetUsage, projectedMessages: number): BudgetProjection;
}

export interface BudgetInfo {
  total: number;
  context: number;
  response: number;
  system: number;
  reserve: number;
  breakdown: BudgetBreakdown;
}

export interface BudgetBreakdown {
  systemMessages: number;
  userMessages: number;
  assistantMessages: number;
  images: number;
  metadata: number;
}

export interface ComplianceResult {
  compliant: boolean;
  overages: BudgetOverage[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface BudgetOverage {
  category: string;
  allocated: number;
  used: number;
  overage: number;
}

export interface BudgetAllocation {
  context: number;
  response: number;
  system: number;
  reserve: number;
  efficiency: number; // 0-1 score
}

export interface BudgetSuggestion {
  type: 'increase' | 'decrease' | 'reallocate';
  category: string;
  amount: number;
  reason: string;
  impact: string;
}

export interface BudgetUsage {
  total: number;
  byCategory: Record<string, number>;
  utilizationRate: number; // 0-1
  efficiency: number; // 0-1
  trends: UsageTrend[];
}

export interface UsageTrend {
  category: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number; // Change rate per message
}

export interface BudgetProjection {
  projectedTotal: number;
  projectedByCategory: Record<string, number>;
  riskLevel: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}

export function createTokenBudgetAdapter(): TokenBudgetAdapter {
  return {
    calculateBudget(messages, maxTokens, reserveRatio = 0.1) {
      const reserve = Math.floor(maxTokens * reserveRatio);
      const available = maxTokens - reserve;
      
      // Allocate 70% for context, 30% for response
      const context = Math.floor(available * 0.7);
      const response = available - context;
      
      // Calculate system message allocation (usually small but important)
      const systemMessages = messages.filter(m => m.role === 'system');
      const systemTokens = systemMessages.reduce((sum, m) => sum + countTokens(m.content), 0);
      const system = Math.min(systemTokens + 100, Math.floor(context * 0.2)); // Cap at 20% of context
      
      const breakdown = this.calculateBreakdown(messages);
      
      return {
        total: maxTokens,
        context: context - system,
        response,
        system,
        reserve,
        breakdown
      };
    },

    checkBudgetCompliance(messages, budget) {
      const usage = this.trackBudgetUsage(messages, budget);
      const overages: BudgetOverage[] = [];
      
      // Check each category
      if (usage.byCategory.system > budget.system) {
        overages.push({
          category: 'system',
          allocated: budget.system,
          used: usage.byCategory.system,
          overage: usage.byCategory.system - budget.system
        });
      }
      
      if (usage.byCategory.context > budget.context) {
        overages.push({
          category: 'context',
          allocated: budget.context,
          used: usage.byCategory.context,
          overage: usage.byCategory.context - budget.context
        });
      }
      
      const totalUsed = usage.total;
      const totalAvailable = budget.total - budget.reserve;
      
      if (totalUsed > totalAvailable) {
        overages.push({
          category: 'total',
          allocated: totalAvailable,
          used: totalUsed,
          overage: totalUsed - totalAvailable
        });
      }
      
      const compliant = overages.length === 0;
      const severity = this.calculateSeverity(overages, budget);
      
      const recommendations = this.generateRecommendations(overages, usage, budget);
      
      return {
        compliant,
        overages,
        recommendations,
        severity
      };
    },

    optimizeBudgetAllocation(messages, totalBudget) {
      const currentUsage = this.trackBudgetUsage(messages, this.calculateBudget(messages, totalBudget));
      
      // Analyze message patterns
      const systemRatio = currentUsage.byCategory.system / currentUsage.total;
      const contextRatio = currentUsage.byCategory.context / currentUsage.total;
      
      // Optimize based on actual usage patterns
      const reserve = Math.floor(totalBudget * 0.1);
      const available = totalBudget - reserve;
      
      // Adjust allocations based on usage patterns
      let systemAllocation = Math.max(currentUsage.byCategory.system, Math.floor(available * 0.1));
      let contextAllocation = Math.floor((available - systemAllocation) * 0.75);
      let responseAllocation = available - systemAllocation - contextAllocation;
      
      // Ensure minimum response allocation
      if (responseAllocation < Math.floor(totalBudget * 0.2)) {
        responseAllocation = Math.floor(totalBudget * 0.2);
        contextAllocation = available - systemAllocation - responseAllocation;
      }
      
      const efficiency = this.calculateAllocationEfficiency(
        { context: contextAllocation, response: responseAllocation, system: systemAllocation, reserve },
        currentUsage
      );
      
      return {
        context: contextAllocation,
        response: responseAllocation,
        system: systemAllocation,
        reserve,
        efficiency
      };
    },

    suggestBudgetAdjustments(current, usage) {
      const suggestions: BudgetSuggestion[] = [];
      
      // Check for under-utilization
      if (usage.utilizationRate < 0.7) {
        suggestions.push({
          type: 'decrease',
          category: 'total',
          amount: Math.floor(current.total * 0.1),
          reason: 'Low utilization rate detected',
          impact: 'Reduces memory pressure while maintaining functionality'
        });
      }
      
      // Check for over-utilization
      if (usage.utilizationRate > 0.9) {
        suggestions.push({
          type: 'increase',
          category: 'total',
          amount: Math.floor(current.total * 0.2),
          reason: 'High utilization rate may cause performance issues',
          impact: 'Provides more headroom for complex conversations'
        });
      }
      
      // Check category imbalances
      const contextUtilization = usage.byCategory.context / current.context;
      const responseAllowance = current.response;
      
      if (contextUtilization > 0.95 && responseAllowance > current.total * 0.4) {
        suggestions.push({
          type: 'reallocate',
          category: 'context',
          amount: Math.floor(responseAllowance * 0.2),
          reason: 'Context frequently near capacity',
          impact: 'Improves conversation flow by providing more context space'
        });
      }
      
      return suggestions;
    },

    trackBudgetUsage(messages, budget) {
      const breakdown = this.calculateBreakdown(messages);
      
      const byCategory = {
        system: breakdown.systemMessages,
        context: breakdown.userMessages + breakdown.assistantMessages,
        images: breakdown.images,
        metadata: breakdown.metadata
      };
      
      const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);
      const utilizationRate = total / (budget.total - budget.reserve);
      
      // Calculate efficiency (how well the budget is being used)
      const efficiency = Math.min(1, utilizationRate) * (total > 0 ? 1 : 0);
      
      const trends = this.calculateUsageTrends(messages);
      
      return {
        total,
        byCategory,
        utilizationRate,
        efficiency,
        trends
      };
    },

    projectFutureUsage(currentUsage, projectedMessages) {
      const avgTokensPerMessage = currentUsage.total / Math.max(1, projectedMessages);
      const projectedTotal = currentUsage.total + (projectedMessages * avgTokensPerMessage);
      
      const projectedByCategory: Record<string, number> = {};
      Object.entries(currentUsage.byCategory).forEach(([category, current]) => {
        const growthRate = this.getGrowthRateForCategory(category, currentUsage.trends);
        projectedByCategory[category] = current + (projectedMessages * growthRate);
      });
      
      const riskLevel = this.assessRiskLevel(projectedTotal, projectedByCategory);
      const recommendedActions = this.generateProjectionRecommendations(riskLevel, projectedByCategory);
      
      return {
        projectedTotal,
        projectedByCategory,
        riskLevel,
        recommendedActions
      };
    },

    // Helper methods
    calculateBreakdown(messages): BudgetBreakdown {
      let systemMessages = 0;
      let userMessages = 0;
      let assistantMessages = 0;
      let images = 0;
      let metadata = 0;
      
      messages.forEach(message => {
        const tokens = countTokens(message.content);
        
        switch (message.role) {
          case 'system':
            systemMessages += tokens;
            break;
          case 'user':
            userMessages += tokens;
            break;
          case 'assistant':
            assistantMessages += tokens;
            break;
        }
        
        if (message.images && message.images.length > 0) {
          images += message.images.length * 750; // Estimated tokens per image
        }
        
        metadata += 10; // Estimated metadata overhead per message
      });
      
      return {
        systemMessages,
        userMessages,
        assistantMessages,
        images,
        metadata
      };
    },

    calculateSeverity(overages: BudgetOverage[], budget: BudgetInfo): 'low' | 'medium' | 'high' {
      if (overages.length === 0) return 'low';
      
      const maxOverageRatio = Math.max(...overages.map(o => o.overage / o.allocated));
      
      if (maxOverageRatio > 0.5) return 'high';
      if (maxOverageRatio > 0.2) return 'medium';
      return 'low';
    },

    generateRecommendations(overages: BudgetOverage[], usage: BudgetUsage, budget: BudgetInfo): string[] {
      const recommendations = [];
      
      if (overages.some(o => o.category === 'system')) {
        recommendations.push('Consider simplifying system prompts or splitting them across multiple messages');
      }
      
      if (overages.some(o => o.category === 'context')) {
        recommendations.push('Enable context compression or increase conversation memory limits');
      }
      
      if (overages.some(o => o.category === 'total')) {
        recommendations.push('Increase total token budget or implement more aggressive memory management');
      }
      
      if (usage.efficiency < 0.5) {
        recommendations.push('Budget allocation may be inefficient - consider rebalancing categories');
      }
      
      return recommendations;
    },

    calculateAllocationEfficiency(allocation: BudgetAllocation, usage: BudgetUsage): number {
      // Calculate how well the allocation matches actual usage patterns
      const contextEfficiency = Math.min(1, usage.byCategory.context / allocation.context);
      const systemEfficiency = Math.min(1, usage.byCategory.system / allocation.system);
      
      // Weight by importance
      return (contextEfficiency * 0.6) + (systemEfficiency * 0.3) + (usage.efficiency * 0.1);
    },

    calculateUsageTrends(messages): UsageTrend[] {
      // Simplified trend calculation - in real implementation, this would analyze historical data
      return [
        { category: 'context', direction: 'stable', rate: 0 },
        { category: 'system', direction: 'stable', rate: 0 }
      ];
    },

    getGrowthRateForCategory(category: string, trends: UsageTrend[]): number {
      const trend = trends.find(t => t.category === category);
      return trend ? trend.rate : 50; // Default 50 tokens per message
    },

    assessRiskLevel(projectedTotal: number, projectedByCategory: Record<string, number>): 'low' | 'medium' | 'high' {
      // Simplified risk assessment
      if (projectedTotal > 8000) return 'high';
      if (projectedTotal > 6000) return 'medium';
      return 'low';
    },

    generateProjectionRecommendations(riskLevel: 'low' | 'medium' | 'high', projectedByCategory: Record<string, number>): string[] {
      const recommendations = [];
      
      if (riskLevel === 'high') {
        recommendations.push('Consider implementing aggressive memory management');
        recommendations.push('Enable context summarization');
      }
      
      if (riskLevel === 'medium') {
        recommendations.push('Monitor token usage closely');
        recommendations.push('Consider enabling context optimization');
      }
      
      return recommendations;
    }
  };
}
