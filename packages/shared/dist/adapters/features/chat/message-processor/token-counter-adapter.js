"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenCounterAdapter = createTokenCounterAdapter;
const token_counter_1 = require("../../../utils/token-counter");
function createTokenCounterAdapter() {
    return {
        countMessageTokens(message) {
            let total = (0, token_counter_1.countTokens)(message.content);
            // Add tokens for images if present
            if (message.images && message.images.length > 0) {
                // Vision models typically use ~500-1000 tokens per image
                total += message.images.length * 750;
            }
            // Add tokens for role and metadata
            total += (0, token_counter_1.countTokens)(message.role) + 10; // Role + formatting
            return total;
        },
        countConversationTokens(messages) {
            return messages.reduce((total, message) => {
                return total + this.countMessageTokens(message);
            }, 0);
        },
        estimateResponseTokens(prompt, model) {
            const baseTokens = (0, token_counter_1.countTokens)(prompt);
            // Model-specific multipliers for response estimation
            const multipliers = {
                'gpt-4': 0.3,
                'gpt-3.5': 0.25,
                'claude': 0.35,
                'llama': 0.3,
                'mistral': 0.25
            };
            const modelKey = Object.keys(multipliers).find(key => model.toLowerCase().includes(key)) || 'llama';
            return Math.round(baseTokens * multipliers[modelKey]);
        },
        checkTokenBudget(messages, budget) {
            const totalTokens = this.countConversationTokens(messages);
            return totalTokens <= budget;
        },
        trimToFitBudget(messages, budget) {
            if (this.checkTokenBudget(messages, budget)) {
                return messages;
            }
            // Always keep the last message (current user input)
            const lastMessage = messages[messages.length - 1];
            const remainingMessages = messages.slice(0, -1);
            // Calculate tokens for last message
            const lastMessageTokens = this.countMessageTokens(lastMessage);
            const availableBudget = budget - lastMessageTokens;
            if (availableBudget <= 0) {
                // If the last message exceeds budget, return only it (truncated if needed)
                return [lastMessage];
            }
            // Trim from the beginning while preserving conversation flow
            const trimmed = [];
            let currentTokens = 0;
            // Work backwards through remaining messages
            for (let i = remainingMessages.length - 1; i >= 0; i--) {
                const message = remainingMessages[i];
                const messageTokens = this.countMessageTokens(message);
                if (currentTokens + messageTokens <= availableBudget) {
                    trimmed.unshift(message);
                    currentTokens += messageTokens;
                }
                else {
                    break;
                }
            }
            return [...trimmed, lastMessage];
        },
        getTokenStats(messages) {
            if (messages.length === 0) {
                return {
                    total: 0,
                    byRole: [],
                    average: 0,
                    median: 0,
                    distribution: []
                };
            }
            const tokenCounts = messages.map(m => this.countMessageTokens(m));
            const total = tokenCounts.reduce((sum, count) => sum + count, 0);
            // Group by role
            const roleGroups = {};
            messages.forEach(message => {
                const tokens = this.countMessageTokens(message);
                roleGroups[message.role] = (roleGroups[message.role] || 0) + tokens;
            });
            const byRole = Object.entries(roleGroups).map(([role, tokens]) => ({
                role,
                tokens
            }));
            // Calculate statistics
            const average = total / messages.length;
            const sortedCounts = [...tokenCounts].sort((a, b) => a - b);
            const median = sortedCounts[Math.floor(sortedCounts.length / 2)];
            // Token distribution
            const distribution = [
                { range: '0-50', count: tokenCounts.filter(c => c <= 50).length },
                { range: '51-200', count: tokenCounts.filter(c => c > 50 && c <= 200).length },
                { range: '201-500', count: tokenCounts.filter(c => c > 200 && c <= 500).length },
                { range: '500+', count: tokenCounts.filter(c => c > 500).length }
            ];
            return {
                total,
                byRole,
                average,
                median,
                distribution
            };
        },
        calculateCost(tokens, model) {
            // Rough cost estimates (per 1K tokens in USD)
            const costs = {
                'gpt-4': 0.03,
                'gpt-3.5': 0.002,
                'claude': 0.01,
                'llama': 0.0, // Local models
                'mistral': 0.0
            };
            const modelKey = Object.keys(costs).find(key => model.toLowerCase().includes(key)) || 'llama';
            return (tokens / 1000) * costs[modelKey];
        }
    };
}
//# sourceMappingURL=token-counter-adapter.js.map