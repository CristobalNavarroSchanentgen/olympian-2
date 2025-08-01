export interface OllamaService {
  isConnected(): boolean;
  streamChat(request: any): AsyncIterable<any>;
}

export class OllamaServiceImpl implements OllamaService {
  isConnected(): boolean {
    return true;
  }

  async *streamChat(request: any): AsyncIterable<any> {
    yield {
      message: {
        content: "This is a test response from " + request.model
      }
    };
  }
}
