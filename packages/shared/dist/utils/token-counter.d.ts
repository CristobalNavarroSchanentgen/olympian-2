/**
 * Token Counter Utility
 * Pure functions for counting tokens
 */
export interface TokenCount {
    prompt: number;
    completion: number;
    total: number;
}
export interface TokenBreakdown {
    messages: number;
    context: number;
    system: number;
    images: number;
    total: number;
}
export declare function countTokens(text: string): number;
export declare function countMessageTokens(content: string, role?: string): TokenCount;
export declare function calculateTokenBreakdown(messages: any[]): TokenBreakdown;
export declare function estimateTokens(text: string): number;
//# sourceMappingURL=token-counter.d.ts.map