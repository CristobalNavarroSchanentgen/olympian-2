"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStreamingServiceImpl = void 0;
class SimpleStreamingServiceImpl {
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
exports.SimpleStreamingServiceImpl = SimpleStreamingServiceImpl;
//# sourceMappingURL=simple-streaming-service-impl.js.map