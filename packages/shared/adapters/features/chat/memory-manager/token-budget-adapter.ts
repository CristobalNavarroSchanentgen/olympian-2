import { Message } from '../../../../models/chat/index';
import { countTokens } from '../../../../utils/token-counter';

/**
 * Token Budget Adapter
 * Transforms token budget operations for memory-manager feature
 */

export interface TokenBudgetAdapter {
  allocateBudget(totalBudget: number, requirements: BudgetRequirements): BudgetAllocation;
  trackUsage(messages: Message[], budget: BudgetAllocation): BudgetUsage;
  validateUsage(usage: BudgetUsage, budget: BudgetAllocation): BudgetValidation;
  optimizeBudget(usage: BudgetUsage, budget: BudgetAllocation): BudgetOptimization;
  getBudgetMetrics(usage: BudgetUsage, budget: BudgetAllocation): BudgetMetrics;
  projectUsage(messages: Message[], budget: BudgetAllocation): UsageProjection;
}

export interface BudgetRequirements {
  systemTokens: number;
  userTokens: number;
  assistantTokens: number;
  contextTokens: number;
  responseTokens: number;
}

export interface BudgetAllocation {
  total: number;
  system: number;
  user: number;
  assistant: number;
  context: number;
  response: number;
  reserve: number;
}

export interface BudgetUsage {
  total: number;
  byCategory: Record<string, number>;
  breakdown: BudgetBreakdown;
  efficiency: number;
  trends: UsageTrend[];
}

export interface BudgetBreakdown {
  systemMessages: number;
  userMessages: number;
  assistantMessages: number;
  images: number;
  metadata: number;
  total: number;
}

export interface UsageTrend {
  category: string;
  growth: number;
  prediction: number;
}

export interface BudgetValidation {
  isValid: boolean;
  overages: BudgetOverage[];
  warnings: string[];
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface BudgetOverage {
  category: string;
  allocated: number;
  used: number;
  overage: number;
  percentage: number;
}

export interface BudgetOptimization {
  recommendedAllocation: BudgetAllocation;
  projectedSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface BudgetMetrics {
  utilization: number;
  efficiency: number;
  distribution: Record<string, number>;
  trends: UsageTrend[];
}

export interface UsageProjection {
  timeframe: string;
  projectedUsage: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// Helper functions (moved outside the adapter for scope clarity)
function calculateBreakdown(messages: Message[]): BudgetBreakdown {
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
    
    if (message.images?.length) {
      images += message.images.length * 765; // Standard image tokens
    }
    
    metadata += 10; // Approximate metadata overhead
  });
  
  return {
    systemMessages,
    userMessages,
    assistantMessages,
    images,
    metadata,
    total: systemMessages + userMessages + assistantMessages + images + metadata
  };
}

export function createTokenBudgetAdapter(): TokenBudgetAdapter {
  return {
    allocateBudget(totalBudget, requirements) {
      const allocation: BudgetAllocation = {
        total: totalBudget,
        system: requirements.systemTokens,
        user: requirements.userTokens,
        assistant: requirements.assistantTokens,
        context: requirements.contextTokens,
        response: requirements.responseTokens,
        reserve: Math.max(0, totalBudget - (
          requirements.systemTokens + 
          requirements.userTokens + 
          requirements.assistantTokens + 
          requirements.contextTokens + 
          requirements.responseTokens
        ))
      };
      
      return allocation;
    },

    trackUsage(messages, budget) {
      const breakdown = calculateBreakdown(messages);
      
      return {
        total: breakdown.total,
        byCategory: {
          system: breakdown.systemMessages,
          user: breakdown.userMessages,
          assistant: breakdown.assistantMessages,
          images: breakdown.images,
          metadata: breakdown.metadata
        },
        breakdown,
        efficiency: breakdown.total / budget.total,
        trends: []
      };
    },

    validateUsage(usage, budget) {
      const overages: BudgetOverage[] = [];
      const warnings: string[] = [];
      
      if (usage.total > budget.total) {
        overages.push({
          category: 'total',
          allocated: budget.total,
          used: usage.total,
          overage: usage.total - budget.total,
          percentage: (usage.total - budget.total) / budget.total * 100
        });
      }
      
      const severity = overages.length > 0 ? 'high' : 'low';
      const recommendations = overages.length > 0 
        ? ['Reduce context size', 'Optimize message content']
        : [];
      
      return {
        isValid: overages.length === 0,
        overages,
        warnings,
        severity,
        recommendations
      };
    },

    optimizeBudget(usage, budget) {
      const recommendedAllocation = { ...budget };
      
      // Simple optimization - redistribute based on actual usage
      const totalUsed = usage.total;
      const efficiency = totalUsed / budget.total;
      
      if (efficiency > 0.9) {
        recommendedAllocation.reserve = Math.floor(budget.total * 0.1);
      }
      
      return {
        recommendedAllocation,
        projectedSavings: 0,
        riskLevel: 'low' as const,
        recommendations: ['Monitor usage patterns']
      };
    },

    getBudgetMetrics(usage, budget) {
      return {
        utilization: usage.total / budget.total,
        efficiency: usage.efficiency,
        distribution: usage.byCategory,
        trends: usage.trends
      };
    },

    projectUsage(messages, budget) {
      const breakdown = calculateBreakdown(messages);
      const projectedUsage = breakdown.total * 1.2; // 20% growth estimate
      
      return {
        timeframe: '1 hour',
        projectedUsage,
        riskLevel: projectedUsage > budget.total ? 'high' : 'low',
        recommendations: projectedUsage > budget.total 
          ? ['Consider budget increase', 'Optimize content']
          : ['Current usage is sustainable']
      };
    }
  };
}
