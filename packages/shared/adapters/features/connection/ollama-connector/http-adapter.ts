import { httpRequest } from '../../../../utils/http-client';
import { OllamaConnection } from '../../../../models/connection';

/**
 * HTTP adapter for Ollama connector
 * Transforms HTTP utilities for ollama-connector feature
 */

export interface HttpAdapter {
  testConnection(connection: OllamaConnection): Promise<any>;
  establishConnection(endpoint: string): Promise<OllamaConnection>;
  listModels(connection: OllamaConnection): Promise<any[]>;
  checkHealth(connection: OllamaConnection): Promise<any>;
}

// Helper functions extracted from business logic
async function testOllamaConnection(connection: OllamaConnection): Promise<any> {
  const startTime = Date.now();
  try {
    const response = await httpRequest(connection.endpoint + '/api/tags', {
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
      error: (error instanceof Error ? error.message : String(error))
    };
  }
}

async function createOllamaConnection(endpoint: string): Promise<OllamaConnection> {
  const connection: OllamaConnection = {
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

async function fetchModelList(connection: OllamaConnection): Promise<any[]> {
  const response = await httpRequest(connection.endpoint + '/api/tags', {
    method: 'GET',
    timeout: 10000
  });
  
  if (!response.ok) {
    throw new Error('Failed to list models');
  }
  
  const data = response.data;
  return (data as any).models || [];
}

async function checkConnectionHealth(connection: OllamaConnection): Promise<any> {
  const startTime = Date.now();
  try {
    const response = await httpRequest(connection.endpoint + '/api/tags', {
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
      error: (error instanceof Error ? error.message : String(error))
    };
  }
}

export function createHttpAdapter(): HttpAdapter {
  return {
    async testConnection(connection: OllamaConnection) {
      return testOllamaConnection(connection);
    },

    async establishConnection(endpoint: string) {
      return createOllamaConnection(endpoint);
    },

    async listModels(connection: OllamaConnection) {
      return fetchModelList(connection);
    },

    async checkHealth(connection: OllamaConnection) {
      return checkConnectionHealth(connection);
    }
  };
}
