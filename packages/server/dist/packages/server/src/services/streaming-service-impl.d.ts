import { StreamingService, StreamingOptions, ActiveStream } from '@olympian/shared/services/streaming-service';
import { StreamingToken } from '@olympian/shared/models/chat/message';
/**
 * Streaming Service Implementation
 * Handles real-time data streaming operations
 */
export declare class StreamingServiceImpl implements StreamingService {
    private activeStreams;
    startStream(conversationId: string, messageId: string, model: string, prompt: string, options?: StreamingOptions): Promise<ReadableStream<StreamingToken>>;
    stopStream(streamId: string): Promise<boolean>;
    getActiveStreams(): Promise<ActiveStream[]>;
    supportsStreaming(model: string): Promise<boolean>;
}
