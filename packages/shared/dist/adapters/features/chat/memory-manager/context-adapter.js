import { optimizeMessageHistory, createMemoryContext } from '../../../../utils/context-manager';
// Helper Functions (extracted from adapter methods)
function buildConversationContextHelper(messages, maxTokens) {
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
function optimizeContextHelper(context, targetTokens) {
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
function generateContextStatsHelper(context) {
    return {
        totalMessages: 0,
        tokenUsage: context.usedTokens,
        compressionRatio: context.usedTokens / context.tokenBudget,
        lastOptimizedAt: context.lastUpdated
    };
}
function validateContextHelper(context) {
    const warnings = [];
    const recommendations = [];
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
export function createContextAdapter() {
    return {
        buildConversationContext: buildConversationContextHelper,
        optimizeContext: optimizeContextHelper,
        getContextStats: generateContextStatsHelper,
        validateContext: validateContextHelper
    };
}
//# sourceMappingURL=context-adapter.js.map