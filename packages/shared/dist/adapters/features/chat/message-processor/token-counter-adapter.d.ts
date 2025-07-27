import { Message } from '../../../../models/chat/index';
/**
 * Token counter adapter for message processing
 * Transforms token counting utilities for message-processor feature
 *
 * AI-Native Rule: This adapter is owned exclusively by message-processor
 */
export interface TokenCounterAdapter {
    countMessageTokens(message: Message): number;
    countConversationTokens(messages: Message[]): number;
    estimateResponseTokens(prompt: string, model: string): number;
    checkTokenBudget(messages: Message[], budget: number): boolean;
    trimToFitBudget(messages: Message[], budget: number): Message[];
    getTokenStats(messages: Message[]): TokenStatistics;
    calculateCost(tokens: number, model: string): number;
}
export interface TokenStatistics {
    total: number;
    byRole: {
        role: string;
        tokens: number;
    }[];
    average: number;
    median: number;
    distribution: {
        range: string;
        count: number;
    }[];
}
export declare function createTokenCounterAdapter(): TokenCounterAdapter;
//# sourceMappingURL=token-counter-adapter.d.ts.map