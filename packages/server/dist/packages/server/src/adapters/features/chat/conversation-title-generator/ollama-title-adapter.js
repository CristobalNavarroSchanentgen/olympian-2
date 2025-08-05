/**
 * Ollama Title Adapter
 * Transforms title generation requests into Ollama API calls
 */
import { httpClient } from '../../../../utils/http-client';
export const ollamaTitleAdapter = {
    async generateTitle(request) {
        try {
            const response = await httpClient.post('/api/ollama/generate', {
                model: request.model,
                prompt: request.prompt,
                options: {
                    num_predict: request.maxTokens,
                    temperature: request.temperature,
                    top_p: 0.9,
                    stop: ['\n', '.', '!', '?']
                },
                stream: false
            });
            return {
                response: response.data.response?.trim() || '',
                tokensUsed: response.data.eval_count,
                model: request.model
            };
        }
        catch (error) {
            console.error('Ollama title generation failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate title: ${errorMessage}`);
        }
    }
};
//# sourceMappingURL=ollama-title-adapter.js.map