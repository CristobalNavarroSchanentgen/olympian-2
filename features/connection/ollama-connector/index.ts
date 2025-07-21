/**
 * Feature Implementation: Ollama Connector
 */

import { OllamaConnectorContract, OllamaConnectorDependencies } from "./contract";
import { OllamaConnection } from "../../../models/connection/ollama-connection";
import { HealthStatus } from "../../../models/connection/health-status";

export class OllamaConnector implements OllamaConnectorContract {
  private currentConnection: OllamaConnection | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  
  constructor(private deps: OllamaConnectorDependencies) {}

  async connect(endpoint: string, options?: any): Promise<OllamaConnection> {
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

  async disconnect(): Promise<void> {
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

  async testConnection(endpoint?: string): Promise<any> {
    const testEndpoint = endpoint || this.currentConnection?.endpoint;
    if (!testEndpoint) {
      throw new Error("No endpoint specified for connection test");
    }

    return await this.deps.httpAdapter.testConnection(testEndpoint);
  }

  async getHealth(): Promise<HealthStatus> {
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

  async listModels(): Promise<any[]> {
    this.ensureConnected();
    
    const response = await this.deps.httpAdapter.request({
      method: "GET",
      url: `${this.currentConnection!.endpoint}/api/tags`,
      timeout: this.deps.config.requests.timeout
    });

    return response.models || [];
  }

  async getModelInfo(modelName: string): Promise<any> {
    this.ensureConnected();
    
    const response = await this.deps.httpAdapter.request({
      method: "POST",
      url: `${this.currentConnection!.endpoint}/api/show`,
      data: { name: modelName },
      timeout: this.deps.config.requests.timeout
    });

    return response;
  }

  async pullModel(modelName: string): Promise<AsyncIterableIterator<any>> {
    this.ensureConnected();
    
    return this.deps.httpAdapter.streamRequest({
      method: "POST",
      url: `${this.currentConnection!.endpoint}/api/pull`,
      data: { name: modelName }
    });
  }

  async deleteModel(modelName: string): Promise<void> {
    this.ensureConnected();
    
    await this.deps.httpAdapter.request({
      method: "DELETE",
      url: `${this.currentConnection!.endpoint}/api/delete`,
      data: { name: modelName },
      timeout: this.deps.config.requests.timeout
    });
  }

  async generateCompletion(params: any): Promise<AsyncIterableIterator<string>> {
    this.ensureConnected();
    
    return this.deps.httpAdapter.streamRequest({
      method: "POST",
      url: `${this.currentConnection!.endpoint}/api/generate`,
      data: {
        model: params.model,
        prompt: params.prompt,
        stream: true,
        options: params.options
      }
    });
  }

  async chatCompletion(params: any): Promise<AsyncIterableIterator<string>> {
    this.ensureConnected();
    
    return this.deps.httpAdapter.streamRequest({
      method: "POST",
      url: `${this.currentConnection!.endpoint}/api/chat`,
      data: {
        model: params.model,
        messages: params.messages,
        stream: true,
        options: params.options
      }
    });
  }

  async embeddings(params: any): Promise<number[][]> {
    this.ensureConnected();
    
    const response = await this.deps.httpAdapter.request({
      method: "POST",
      url: `${this.currentConnection!.endpoint}/api/embeddings`,
      data: {
        model: params.model,
        prompt: params.prompt
      },
      timeout: this.deps.config.requests.timeout
    });

    return response.embedding;
  }

  getConnection(): OllamaConnection | null {
    return this.currentConnection;
  }

  isConnected(): boolean {
    return this.currentConnection?.status === "connected";
  }

  private ensureConnected(): void {
    if (!this.isConnected()) {
      throw new Error("Not connected to Ollama");
    }
  }

  private startHealthMonitoring(): void {
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
      } catch (error) {
        console.error("Health check failed:", error);
      }
    }, this.deps.config.health.checkInterval);
  }

  private generateConnectionId(): string {
    return `ollama-${Date.now()}-${Math.random().toString(36).substr(2)}`;
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
