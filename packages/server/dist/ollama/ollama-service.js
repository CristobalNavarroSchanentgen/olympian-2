export class OllamaServiceImpl {
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
//# sourceMappingURL=ollama-service.js.map