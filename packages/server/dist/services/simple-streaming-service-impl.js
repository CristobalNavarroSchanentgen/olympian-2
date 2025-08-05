export class SimpleStreamingServiceImpl {
    async startStream() {
        return new ReadableStream({
            start(controller) {
                controller.enqueue({ content: 'Mock response', complete: true });
                controller.close();
            }
        });
    }
    async stopStream() { return true; }
    async getActiveStreams() { return []; }
    async supportsStreaming() { return true; }
}
//# sourceMappingURL=simple-streaming-service-impl.js.map