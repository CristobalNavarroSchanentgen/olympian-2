/**
 * Availability Adapter - Server Implementation
 */
export class AvailabilityAdapterImpl {
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
    // Implementation of missing contract methods
    async checkModelAvailability(modelId) {
        try {
            const health = await this.checkModelHealth(modelId);
            return health.available;
        }
        catch (error) {
            console.error(`Error checking availability for ${modelId}:`, error);
            return false;
        }
    }
    async getAvailableModels() {
        try {
            if (!this.ollamaService.isConnected()) {
                console.warn("Ollama service not connected");
                return [];
            }
            // Get list of models from Ollama
            const models = await this.ollamaService.getModels();
            return models.map(model => model.name);
        }
        catch (error) {
            console.error("Error getting available models:", error);
            return [];
        }
    }
}
//# sourceMappingURL=availability-adapter.js.map