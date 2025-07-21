"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOllamaAdapter = createOllamaAdapter;
const http_client_1 = require("../../../utils/http-client");
function createOllamaAdapter(baseUrl) {
    return {
        async processMessage(model, messages, options = {}) {
            const payload = {
                model,
                messages: messages.map(transformMessage),
                stream: false,
                options: {
                    temperature: options.temperature || 0.7,
                    num_predict: options.maxTokens || -1,
                    stop: options.stop || []
                }
            };
            const response = await (0, http_client_1.httpRequest)({
                url: `${baseUrl}/api/chat`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                timeout: 30000
            });
            if (!response.ok) {
                throw new Error(`Ollama request failed: ${response.status}`);
            }
            const data = await response();
            return data.message.content;
        },
        async streamMessage(model, messages, onToken) {
            const payload = {
                model,
                messages: messages.map(transformMessage),
                stream: true
            };
            const response = await (0, http_client_1.httpRequest)({
                url: `${baseUrl}/api/chat`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                timeout: 60000
            });
            if (!response.ok) {
                throw new Error(`Ollama stream failed: ${response.status}`);
            }
            const reader = response.body?.getReader();
            if (!reader)
                throw new Error('No response body');
            const decoder = new TextDecoder();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            if (data.message?.content) {
                                onToken(data.message.content);
                            }
                        }
                        catch (e) {
                            // Skip invalid JSON lines
                        }
                    }
                }
            }
            finally {
                reader.releaseLock();
            }
        },
        async listModels() {
            const response = await (0, http_client_1.httpRequest)({
                url: `${baseUrl}/api/tags`,
                method: 'GET',
                timeout: 10000
            });
            if (!response.ok) {
                throw new Error(`Failed to list models: ${response.status}`);
            }
            const data = await response();
            return data.models.map(transformModelInfo);
        },
        async getModelInfo(name) {
            const response = await (0, http_client_1.httpRequest)({
                url: `${baseUrl}/api/show`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
                timeout: 10000
            });
            if (!response.ok) {
                throw new Error(`Failed to get model info: ${response.status}`);
            }
            const data = await response();
            return transformModelInfo(data);
        },
        async checkHealth() {
            try {
                const response = await (0, http_client_1.httpRequest)({
                    url: `${baseUrl}/api/tags`,
                    method: 'GET',
                    timeout: 5000
                });
                return response.ok;
            }
            catch {
                return false;
            }
        },
        async getVersion() {
            const response = await (0, http_client_1.httpRequest)({
                url: `${baseUrl}/api/version`,
                method: 'GET',
                timeout: 5000
            });
            if (!response.ok) {
                throw new Error(`Failed to get version: ${response.status}`);
            }
            const data = await response();
            return data.version || 'unknown';
        }
    };
}
function transformMessage(message) {
    return {
        role: message.role,
        content: message.content,
        images: message.images || []
    };
}
function transformModelInfo(model) {
    return {
        name: model.name,
        size: model.size || 0,
        digest: model.digest || '',
        capabilities: extractCapabilities(model)
    };
}
function extractCapabilities(model) {
    const caps = [];
    if (model.details?.family?.includes('vision'))
        caps.push('vision');
    if (model.details?.parameter_size)
        caps.push('text');
    return caps;
}
//# sourceMappingURL=ollama-adapter.js.map