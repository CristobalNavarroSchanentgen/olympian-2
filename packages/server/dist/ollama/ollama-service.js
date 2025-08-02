"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaServiceImpl = void 0;
class OllamaServiceImpl {
    isConnected() {
        return true;
    }
    async *streamChat(request) {
        yield {
            message: {
                content: "This is a test response from " + request.model
            }
        };
    }
}
exports.OllamaServiceImpl = OllamaServiceImpl;
//# sourceMappingURL=ollama-service.js.map