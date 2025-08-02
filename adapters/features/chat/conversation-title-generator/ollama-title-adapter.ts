/**
 * Ollama Title Adapter
 * Transforms title generation requests for Ollama API
 */

export interface OllamaCompletionRequest {
  model: string;
  prompt: string;
  maxTokens: number;
  temperature: number;
}

export interface OllamaCompletionResponse {
  content: string;
  tokens: number;
}

export class OllamaTitleAdapter {
  private httpClient: any;
  private baseUrl: string;

  constructor(httpClient: any, baseUrl: string = 'http://localhost:11434') {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  async generateCompletion(request: OllamaCompletionRequest): Promise<OllamaCompletionResponse> {
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
    } catch (error) {
      console.error('Ollama title generation failed:', error);
      throw new Error('Failed to generate title via Ollama');
    }
  }

  async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      const response = await this.httpClient.get(`${this.baseUrl}/api/tags`);
      const models = response.data.models || [];
      return models.some((model: any) => model.name === modelName);
    } catch (error) {
      console.error('Failed to check model availability:', error);
      return false;
    }
  }
}
