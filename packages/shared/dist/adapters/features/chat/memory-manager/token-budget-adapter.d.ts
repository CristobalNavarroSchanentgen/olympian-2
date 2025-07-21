import { Message } from '../../../models/chat';
/**
 * Token budget adapter for memory management
 * Transforms token budget utilities for memory-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by memory-manager
 */
export interface TokenBudgetAdapter {
    calculateBudget(messages: Message[], maxTokens: number, reserveRatio?: number): BudgetInfo;
    checkBudgetCompliance(messages: Message[], budget: BudgetInfo): ComplianceResult;
    optimizeBudgetAllocation(messages: Message[], totalBudget: number): BudgetAllocation;
    suggestBudgetAdjustments(current: BudgetInfo, usage: BudgetUsage): BudgetSuggestion[];
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
    efficiency: number;
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
    utilizationRate: number;
    efficiency: number;
    trends: UsageTrend[];
}
export interface UsageTrend {
    category: string;
    direction: 'increasing' | 'decreasing' | 'stable';
    rate: number;
}
export interface BudgetProjection {
    projectedTotal: number;
    projectedByCategory: Record<string, number>;
    riskLevel: 'low' | 'medium' | 'high';
    recommendedActions: string[];
}
export declare function createTokenBudgetAdapter(): TokenBudgetAdapter;
//# sourceMappingURL=token-budget-adapter.d.ts.map