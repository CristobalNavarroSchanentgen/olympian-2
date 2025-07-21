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

export const messageProcessorDefaults: MessageProcessorConfig = {
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

export function validateMessageProcessorConfig(
  config: unknown
): config is MessageProcessorConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.streaming === 'object' &&
    typeof c.processing === 'object' &&
    typeof c.ollama === 'object' &&
    typeof c.tokens === 'object'
  );
}
