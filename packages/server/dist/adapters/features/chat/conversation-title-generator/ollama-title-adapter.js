"use strict";
/**
 * Ollama Title Adapter
 * Transforms title generation requests for Ollama API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaTitleAdapter = void 0;
class OllamaTitleAdapter {
    httpClient;
    baseUrl;
    constructor(httpClient, baseUrl = 'http://localhost:11434') {
        this.httpClient = httpClient;
        this.baseUrl = baseUrl;
    }
    async generateCompletion(request) {
        try {
            const response = await this.httpClient.post(`${this.baseUrl}/api/generate`, {
                model: request.model,
                prompt: request.prompt,
                stream: false,
                options: {
                    temperature: request.temperature,
                    num_predict: request.maxTokens,
                    stop: ['\n', '.', '!', '?']
                }
            });
            return {
                content: response.data.response || '',
                tokens: response.data.eval_count || 0
            };
        }
        catch (error) {
            console.error('Ollama title generation failed:', error);
            throw new Error('Failed to generate title via Ollama');
        }
    }
    async isModelAvailable(modelName) {
        try {
            const response = await this.httpClient.get(`${this.baseUrl}/api/tags`);
            const models = response.data.models || [];
            return models.some((model) => model.name === modelName);
        }
        catch (error) {
            console.error('Failed to check model availability:', error);
            return false;
        }
    }
}
exports.OllamaTitleAdapter = OllamaTitleAdapter;
//# sourceMappingURL=ollama-title-adapter.js.map