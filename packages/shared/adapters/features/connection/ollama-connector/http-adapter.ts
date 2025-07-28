import { httpRequest } from '../../../../utils/http-client';
import { OllamaConnection } from '../../../../models/connection';

export interface HttpAdapter {
  testConnection(connection: OllamaConnection): Promise<any>;
  establishConnection(endpoint: string): Promise<OllamaConnection>;
  listModels(connection: OllamaConnection): Promise<any[]>;
  checkHealth(connection: OllamaConnection): Promise<any>;
}

export function createHttpAdapter(): HttpAdapter {
  return {
    async testConnection(connection) {
      const startTime = Date.now();
      try {
        const response = await httpRequest({
          url: connection.endpoint + '/api/tags',
          method: 'GET',
          timeout: 5000
        });
        return {
          success: response.ok,
          latency: Date.now() - startTime,
          capabilities: ['chat']
        };
      } catch (error) {
        return {
          success: false,
          latency: Date.now() - startTime,
          error: error.message
        };
      }
    },

    async establishConnection(endpoint) {
      const connection: OllamaConnection = {
        id: 'ollama_' + Date.now(),
        endpoint: endpoint,
        status: 'connecting',
        createdAt: new Date(),
        lastHealthCheck: new Date(),
        metadata: {}
      };
      
      const testResult = await this.testConnection(connection);
      connection.status = testResult.success ? 'connected' : 'failed';
      
      return connection;
    },

    async listModels(connection) {
      const response = await httpRequest({
        url: connection.endpoint + '/api/tags',
        method: 'GET',
        timeout: 10000
      });
      
      if (!response.ok) {
        throw new Error('Failed to list models');
      }
      
      const data = await response();
      return data.models || [];
    },

    async checkHealth(connection) {
      const startTime = Date.now();
      try {
        const response = await httpRequest({
          url: connection.endpoint + '/api/tags',
          method: 'GET',
          timeout: 5000
        });
        
        return {
          healthy: response.ok,
          responseTime: Date.now() - startTime,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          healthy: false,
          responseTime: Date.now() - startTime,
          timestamp: new Date(),
          error: error.message
        };
      }
    }
  };
}
