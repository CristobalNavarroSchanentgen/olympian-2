import { StreamingService, ActiveStream } from '@olympian/shared/services/streaming-service';
import { StreamingToken } from '@olympian/shared/models/chat/message';
export declare class SimpleStreamingServiceImpl implements StreamingService {
    startStream(): Promise<ReadableStream<StreamingToken>>;
    stopStream(): Promise<boolean>;
    getActiveStreams(): Promise<ActiveStream[]>;
    supportsStreaming(): Promise<boolean>;
}
