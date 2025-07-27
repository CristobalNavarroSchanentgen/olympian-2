import { Message } from '../../../../models/chat/index';
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
export declare function createTokenBudgetAdapter(): TokenBudgetAdapter;
//# sourceMappingURL=token-budget-adapter.d.ts.map