"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpAdapter = createHttpAdapter;
const http_client_1 = require("../../../../utils/http-client");
// Helper functions extracted from business logic
async function testOllamaConnection(connection) {
    const startTime = Date.now();
    try {
        const response = await (0, http_client_1.httpRequest)(connection.endpoint + '/api/tags', {
            method: 'GET',
            timeout: 5000
        });
        return {
            success: response.ok,
            latency: Date.now() - startTime,
            capabilities: ['chat']
        };
    }
    catch (error) {
        return {
            success: false,
            latency: Date.now() - startTime,
            error: (error instanceof Error ? error.message : String(error))
        };
    }
}
async function createOllamaConnection(endpoint) {
    const connection = {
        id: 'ollama_' + Date.now(),
        baseUrl: endpoint,
        endpoint: endpoint,
        status: 'connecting',
        models: [],
        createdAt: new Date(),
        lastPing: new Date(),
        metadata: {}
    };
    const testResult = await testOllamaConnection(connection);
    connection.status = testResult.success ? 'connected' : 'failed';
    return connection;
}
async function fetchModelList(connection) {
    const response = await (0, http_client_1.httpRequest)(connection.endpoint + '/api/tags', {
        method: 'GET',
        timeout: 10000
    });
    if (!response.ok) {
        throw new Error('Failed to list models');
    }
    const data = response.data;
    return data.models || [];
}
async function checkConnectionHealth(connection) {
    const startTime = Date.now();
    try {
        const response = await (0, http_client_1.httpRequest)(connection.endpoint + '/api/tags', {
            method: 'GET',
            timeout: 5000
        });
        return {
            healthy: response.ok,
            responseTime: Date.now() - startTime,
            timestamp: new Date()
        };
    }
    catch (error) {
        return {
            healthy: false,
            responseTime: Date.now() - startTime,
            timestamp: new Date(),
            error: (error instanceof Error ? error.message : String(error))
        };
    }
}
function createHttpAdapter() {
    return {
        async testConnection(connection) {
            return testOllamaConnection(connection);
        },
        async establishConnection(endpoint) {
            return createOllamaConnection(endpoint);
        },
        async listModels(connection) {
            return fetchModelList(connection);
        },
        async checkHealth(connection) {
            return checkConnectionHealth(connection);
        }
    };
}
//# sourceMappingURL=http-adapter.js.map