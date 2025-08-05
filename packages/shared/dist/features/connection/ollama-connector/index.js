/**
 * Feature Implementation: Ollama Connector
 */
export class OllamaConnector {
    deps;
    currentConnection = null;
    healthCheckInterval = null;
    constructor(deps) {
        this.deps = deps;
    }
    async connect(endpoint, options) {
        const connectionTest = await this.deps.httpAdapter.testConnection(endpoint, {
            timeout: options?.timeout || this.deps.config.connection.timeout,
            retries: options?.retries || this.deps.config.connection.retries
        });
        if (!connectionTest.success) {
            throw new Error(`Failed to connect to Ollama: ${connectionTest.error}`);
        }
        this.currentConnection = {
            id: this.generateConnectionId(),
            endpoint,
            status: "connected",
            connectedAt: new Date(),
            latency: connectionTest.latency,
            version: connectionTest.version,
            metadata: options?.metadata || {}
        };
        // Start health monitoring
        this.startHealthMonitoring();
        this.deps.eventPublisher.publishConnectionEstablished({
            connectionId: this.currentConnection.id,
            endpoint,
            latency: connectionTest.latency,
            timestamp: new Date()
        });
        return this.currentConnection;
    }
    async disconnect() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        if (this.currentConnection) {
            const connectionId = this.currentConnection.id;
            this.currentConnection = null;
            this.deps.eventPublisher.publishConnectionLost({
                connectionId,
                timestamp: new Date()
            });
        }
    }
    async testConnection(endpoint) {
        const testEndpoint = endpoint || this.currentConnection?.endpoint;
        if (!testEndpoint) {
            throw new Error("No endpoint specified for connection test");
        }
        return await this.deps.httpAdapter.testConnection(testEndpoint);
    }
    async getHealth() {
        if (!this.currentConnection) {
            return {
                status: "disconnected",
                healthy: false,
                message: "No active connection",
                checkedAt: new Date()
            };
        }
        return await this.deps.healthMonitor.checkHealth(this.currentConnection.endpoint);
    }
    async listModels() {
        this.ensureConnected();
        const response = await this.deps.httpAdapter.request({
            method: "GET",
            url: `${this.currentConnection.endpoint}/api/tags`,
            timeout: this.deps.config.requests.timeout
        });
        return response.models || [];
    }
    async getModelInfo(modelName) {
        this.ensureConnected();
        const response = await this.deps.httpAdapter.request({
            method: "POST",
            url: `${this.currentConnection.endpoint}/api/show`,
            data: { name: modelName },
            timeout: this.deps.config.requests.timeout
        });
        return response;
    }
    async pullModel(modelName) {
        this.ensureConnected();
        return this.deps.httpAdapter.streamRequest({
            method: "POST",
            url: `${this.currentConnection.endpoint}/api/pull`,
            data: { name: modelName }
        });
    }
    async deleteModel(modelName) {
        this.ensureConnected();
        await this.deps.httpAdapter.request({
            method: "DELETE",
            url: `${this.currentConnection.endpoint}/api/delete`,
            data: { name: modelName },
            timeout: this.deps.config.requests.timeout
        });
    }
    async generateCompletion(params) {
        this.ensureConnected();
        return this.deps.httpAdapter.streamRequest({
            method: "POST",
            url: `${this.currentConnection.endpoint}/api/generate`,
            data: {
                model: params.model,
                prompt: params.prompt,
                stream: true,
                options: params.options
            }
        });
    }
    async chatCompletion(params) {
        this.ensureConnected();
        return this.deps.httpAdapter.streamRequest({
            method: "POST",
            url: `${this.currentConnection.endpoint}/api/chat`,
            data: {
                model: params.model,
                messages: params.messages,
                stream: true,
                options: params.options
            }
        });
    }
    async embeddings(params) {
        this.ensureConnected();
        const response = await this.deps.httpAdapter.request({
            method: "POST",
            url: `${this.currentConnection.endpoint}/api/embeddings`,
            data: {
                model: params.model,
                prompt: params.prompt
            },
            timeout: this.deps.config.requests.timeout
        });
        return response.embedding;
    }
    getConnection() {
        return this.currentConnection;
    }
    isConnected() {
        return this.currentConnection?.status === "connected";
    }
    ensureConnected() {
        if (!this.isConnected()) {
            throw new Error("Not connected to Ollama");
        }
    }
    startHealthMonitoring() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
        this.healthCheckInterval = setInterval(async () => {
            try {
                const health = await this.getHealth();
                if (!health.healthy && this.currentConnection) {
                    this.currentConnection.status = "error";
                    this.deps.eventPublisher.publishConnectionLost({
                        connectionId: this.currentConnection.id,
                        timestamp: new Date()
                    });
                }
            }
            catch (error) {
                console.error("Health check failed:", error);
            }
        }, this.deps.config.health.checkInterval);
    }
    generateConnectionId() {
        return `ollama-${Date.now()}-${Math.random().toString(36).substr(2)}`;
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
//# sourceMappingURL=index.js.map