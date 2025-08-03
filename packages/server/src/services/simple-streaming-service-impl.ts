import { StreamingService, StreamingOptions, ActiveStream } from '@olympian/shared/services/streaming-service';
import { StreamingToken } from '@olympian/shared/models/chat/message';

export class SimpleStreamingServiceImpl implements StreamingService {
  async startStream(): Promise<ReadableStream<StreamingToken>> {
    return new ReadableStream<StreamingToken>({
      start(controller) {
        controller.enqueue({ content: 'Mock response', complete: true });
        controller.close();
      }
    });
  }

  async stopStream(): Promise<boolean> { return true; }
  async getActiveStreams(): Promise<ActiveStream[]> { return []; }
  async supportsStreaming(): Promise<boolean> { return true; }
}
