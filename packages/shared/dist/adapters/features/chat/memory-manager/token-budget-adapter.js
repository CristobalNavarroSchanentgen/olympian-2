"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenBudgetAdapter = createTokenBudgetAdapter;
const token_counter_1 = require("../../../../utils/token-counter");
// Helper functions (moved outside the adapter for scope clarity)
// Helper functions (extracted for AI-native architecture clarity)
function allocateBudgetHelper(totalBudget, requirements) {
    return {
        total: totalBudget,
        system: requirements.systemTokens,
        user: requirements.userTokens,
        assistant: requirements.assistantTokens,
        context: requirements.contextTokens,
        response: requirements.responseTokens,
        reserve: Math.max(0, totalBudget - (requirements.systemTokens +
            requirements.userTokens +
            requirements.assistantTokens +
            requirements.contextTokens +
            requirements.responseTokens))
    };
}
function validateUsageHelper(usage, budget) {
    const overages = [];
    const warnings = [];
    if (usage.total > budget.total) {
        overages.push({
            category: "total",
            allocated: budget.total,
            used: usage.total,
            overage: usage.total - budget.total,
            percentage: (usage.total - budget.total) / budget.total * 100
        });
    }
    const severity = overages.length > 0 ? "high" : "low";
    const recommendations = overages.length > 0
        ? ["Reduce context size", "Optimize message content"]
        : [];
    return {
        isValid: overages.length === 0,
        overages,
        warnings,
        severity,
        recommendations
    };
}
function optimizeBudgetHelper(usage, budget) {
    const recommendedAllocation = { ...budget };
    const totalUsed = usage.total;
    const efficiency = totalUsed / budget.total;
    if (efficiency > 0.9) {
        recommendedAllocation.reserve = Math.floor(budget.total * 0.1);
    }
    return {
        recommendedAllocation,
        projectedSavings: 0,
        riskLevel: "low",
        recommendations: ["Monitor usage patterns"]
    };
}
function calculateBreakdown(messages) {
    let systemMessages = 0;
    let userMessages = 0;
    let assistantMessages = 0;
    let images = 0;
    let metadata = 0;
    messages.forEach(message => {
        const tokens = (0, token_counter_1.countTokens)(message.content);
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
function createTokenBudgetAdapter() {
    return {
        allocateBudget(totalBudget, requirements) {
            return allocateBudgetHelper(totalBudget, requirements);
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
            return validateUsageHelper(usage, budget);
        },
        optimizeBudget(usage, budget) {
            return optimizeBudgetHelper(usage, budget);
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
//# sourceMappingURL=token-budget-adapter.js.map