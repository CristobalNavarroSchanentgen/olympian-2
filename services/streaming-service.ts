export interface StreamingService {
  startStream(streamId: string, options: any): Promise<void>;
  stopStream(streamId: string): Promise<void>;
  isStreamActive(streamId: string): boolean;
  sendStreamData(streamId: string, data: any): Promise<void>;
}

