"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaService {
    client;
    connected = false;
    baseUrl;
    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 60000
        });
        this.testConnection();
    }
    async testConnection() {
        try {
            await this.client.get('/api/tags');
            this.connected = true;
            console.log('🦙 Connected to Ollama');
        }
        catch (error) {
            this.connected = false;
            console.error('❌ Failed to connect to Ollama');
        }
    }
    isConnected() {
        return this.connected;
    }
    async getModels() {
        try {
            const response = await this.client.get('/api/tags');
            return response.data.models || [];
        }
        catch (error) {
            return [];
        }
    }
    async *streamChat(request) {
        try {
            const response = await this.client.post('/api/chat', {
                ...request,
                stream: true
            }, {
                responseType: 'stream'
            });
            let buffer = '';
            for await (const chunk of response.data) {
                buffer += chunk.toString();
                const lines = buffer.split("\n");
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            yield data;
                        }
                        catch (parseError) {
                            console.warn('Failed to parse chunk:', parseError);
                        }
                    }
                }
            }
        }
        catch (error) {
            throw new Error('Chat streaming failed');
        }
    }
    async chat(request) {
        try {
            const response = await this.client.post('/api/chat', {
                ...request,
                stream: false
            });
            return response.data;
        }
        catch (error) {
            throw new Error('Chat failed');
        }
    }
    getBaseUrl() {
        return this.baseUrl;
    }
}
exports.OllamaService = OllamaService;
//# sourceMappingURL=ollama-service.js.map