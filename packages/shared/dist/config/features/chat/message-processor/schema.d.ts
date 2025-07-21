/**
 * Configuration Schema: Chat Message Processor
 *
 * Validates configuration for message processing and streaming.
 */
export interface MessageProcessorConfig {
    readonly streaming: {
        readonly chunkSize: number;
        readonly bufferTimeout: number;
        readonly maxConcurrentStreams: number;
        readonly typewriterDelay: number;
    };
    readonly processing: {
        readonly maxMessageLength: number;
        readonly maxImagesPerMessage: number;
        readonly processingTimeout: number;
        readonly retryAttempts: number;
    };
    readonly ollama: {
        readonly requestTimeout: number;
        readonly maxTokens: number;
        readonly temperature: number;
        readonly topP: number;
    };
    readonly tokens: {
        readonly countingMethod: 'approximate' | 'exact';
        readonly averageTokensPerChar: number;
        readonly bufferPercentage: number;
    };
}
export declare const messageProcessorDefaults: MessageProcessorConfig;
export declare function validateMessageProcessorConfig(config: unknown): config is MessageProcessorConfig;
//# sourceMappingURL=schema.d.ts.map