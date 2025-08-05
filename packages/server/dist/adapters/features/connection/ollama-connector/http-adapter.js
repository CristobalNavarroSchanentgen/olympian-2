/**
 * HTTP Adapter for Ollama Connector
 * Transforms between HTTP client utility and ollama-connector feature expectations
 */
export class OllamaHttpAdapter {
    httpClient;
    baseUrl;
    constructor(httpClient, baseUrl = '/api/ollama') {
        this.httpClient = httpClient;
        this.baseUrl = baseUrl;
    }
    async getStatus() {
        const response = await this.httpClient.get(`${this.baseUrl}/status`);
        return response.data;
    }
    async getModels() {
        const response = await this.httpClient.get(`${this.baseUrl}/models`);
        return response.data;
    }
}
//# sourceMappingURL=http-adapter.js.map