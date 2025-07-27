"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContextAdapter = createContextAdapter;
const context_manager_1 = require("../../../../utils/context-manager");
function createContextAdapter() {
    return {
        buildConversationContext(messages, maxTokens) {
            const optimized = (0, context_manager_1.optimizeMessageHistory)(messages, maxTokens, { prioritizeRecent: true, keepSystemMessages: true, summarizeOld: false, maxMessages: 20 });
            const conversationId = messages[0]?.conversationId || 'unknown';
            const usedTokens = optimized.length * 100; // rough estimate
            return (0, context_manager_1.createMemoryContext)(conversationId, maxTokens, usedTokens);
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
    };
}
//# sourceMappingURL=context-adapter.js.map