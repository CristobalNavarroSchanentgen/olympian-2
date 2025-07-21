"use strict";
/**
 * Configuration Schema: Chat Message Processor
 *
 * Validates configuration for message processing and streaming.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageProcessorDefaults = void 0;
exports.validateMessageProcessorConfig = validateMessageProcessorConfig;
exports.messageProcessorDefaults = {
    streaming: {
        chunkSize: 64,
        bufferTimeout: 100,
        maxConcurrentStreams: 10,
        typewriterDelay: 50,
    },
    processing: {
        maxMessageLength: 100000,
        maxImagesPerMessage: 10,
        processingTimeout: 30000,
        retryAttempts: 2,
    },
    ollama: {
        requestTimeout: 60000,
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.9,
    },
    tokens: {
        countingMethod: 'approximate',
        averageTokensPerChar: 0.25,
        bufferPercentage: 10,
    },
};
function validateMessageProcessorConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.streaming === 'object' &&
        typeof c.processing === 'object' &&
        typeof c.ollama === 'object' &&
        typeof c.tokens === 'object');
}
//# sourceMappingURL=schema.js.map