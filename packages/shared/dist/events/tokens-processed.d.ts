/**
 * Tokens processed event
 */
export interface TokensProcessedEvent {
    readonly type: 'tokens-processed';
    readonly conversationId: string;
    readonly messageId: string;
    readonly tokenCount: number;
    readonly cumulativeTokens: number;
    readonly timestamp: Date;
    readonly metadata: {
        readonly model: string;
        readonly processingTime: number;
        readonly streamingComplete: boolean;
        readonly contextWindowUsed: number;
    };
}
export declare function createTokensProcessedEvent(conversationId: string, messageId: string, tokenCount: number, cumulativeTokens: number, model: string, processingTime: number, streamingComplete: boolean, contextWindowUsed: number): TokensProcessedEvent;
//# sourceMappingURL=tokens-processed.d.ts.map