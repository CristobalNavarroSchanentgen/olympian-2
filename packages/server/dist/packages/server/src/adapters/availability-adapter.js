"use strict";
/**
 * Availability Adapter - Server Implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityAdapterImpl = void 0;
class AvailabilityAdapterImpl {
    ollamaService;
    constructor(ollamaService) {
        this.ollamaService = ollamaService;
    }
    async checkModelHealth(modelName) {
        try {
            const startTime = Date.now();
            // Check if Ollama service is connected
            if (!this.ollamaService.isConnected()) {
                return { available: false, healthy: false };
            }
            // Try to ping the model
            const responseTime = await this.pingModel(modelName);
            return {
                available: true,
                healthy: responseTime < 10000,
                responseTime
            };
        }
        catch (error) {
            return { available: false, healthy: false };
        }
    }
    async pingModel(modelName) {
        try {
            const startTime = Date.now();
            // Use a minimal request to test model availability
            const testRequest = {
                model: modelName,
                messages: [{ role: 'user', content: 'ping' }],
                stream: false,
                options: {
                    max_tokens: 1,
                    temperature: 0
                }
            };
            // Try to get a response from the model
            const generator = this.ollamaService.streamChat(testRequest);
            const firstChunk = await generator.next();
            const endTime = Date.now();
            return endTime - startTime;
        }
        catch (error) {
            throw new Error(`Failed to ping model ${modelName}: ${error}`);
        }
    }
}
exports.AvailabilityAdapterImpl = AvailabilityAdapterImpl;
//# sourceMappingURL=availability-adapter.js.map