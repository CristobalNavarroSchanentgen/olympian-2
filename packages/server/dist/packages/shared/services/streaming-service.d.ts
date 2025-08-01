/**
 * Streaming service interface
 */
import { StreamingToken } from '../models/chat/message';
export interface StreamingService {
    /**
     * Start streaming response
     */
    startStream(conversationId: string, messageId: string, model: string, prompt: string, options?: StreamingOptions): Promise<ReadableStream<StreamingToken>>;
    /**
     * Stop active stream
     */
    stopStream(streamId: string): Promise<boolean>;
    /**
     * Get active streams
     */
    getActiveStreams(): Promise<ActiveStream[]>;
    /**
     * Check if streaming is supported for model
     */
    supportsStreaming(model: string): Promise<boolean>;
}
export interface StreamingOptions {
    readonly temperature?: number;
    readonly maxTokens?: number;
    readonly stopSequences?: string[];
    readonly timeout?: number;
}
export interface ActiveStream {
    readonly id: string;
    readonly conversationId: string;
    readonly messageId: string;
    readonly model: string;
    readonly startTime: Date;
    readonly tokenCount: number;
}
