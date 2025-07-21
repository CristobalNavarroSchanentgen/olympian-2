/**
 * Feature Contract: Ollama Connector
 * 
 * Manages connection to Ollama instance and model communication.
 */

import { OllamaConnection, ModelCapability, HealthStatus } from '../../../models/connection';
import { ConnectionService } from '../../../services/connection-service';
import { ConnectionEstablished, ConnectionLost, HealthChecked } from '../../../events';
import { OllamaConnectorConfig } from '../../../config/features/connection/ollama-connector/schema';

export interface OllamaConnectorContract {
  // === CONNECTION MANAGEMENT ===
  
  /**
   * Establish connection to Ollama instance
   */
  connect(connectionParams: {
    baseUrl: string;
    timeout?: number;
    validateConnection?: boolean;
  }): Promise<{
    connection: OllamaConnection;
    models: string[];
    version: string;
    status: 'connected' | 'failed';
  }>;
  
  /**
   * Disconnect from Ollama instance
   */
  disconnect(): Promise<void>;
  
  /**
   * Test connection health and responsiveness
   */
  testConnection(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    version: string;
    error?: string;
  }>;
  
  /**
   * Get current connection status
   */
  getConnectionStatus(): Promise<{
    isConnected: boolean;
    endpoint: string;
    uptime: number;
    lastHealthCheck: Date;
    modelsAvailable: number;
  }>;
  
  // === MODEL MANAGEMENT ===
  
  /**
   * List available models from Ollama
   */
  listModels(): Promise<Array<{
    name: string;
    size: number;
    digest: string;
    modifiedAt: Date;
    capabilities?: ModelCapability;
  }>>;
  
  /**
   * Get specific model information
   */
  getModel(modelName: string): Promise<{
    name: string;
    size: number;
    digest: string;
    details: Record<string, unknown>;
    capabilities?: ModelCapability;
  } | null>;
  
  /**
   * Pull/download model to Ollama
   */
  pullModel(modelName: string, options?: {
    progress?: (progress: number) => void;
    timeout?: number;
  }): Promise<{
    success: boolean;
    modelInfo: Record<string, unknown>;
    duration: number;
  }>;
  
  /**
   * Remove model from Ollama
   */
  removeModel(modelName: string): Promise<boolean>;
  
  // === REQUEST HANDLING ===
  
  /**
   * Send chat completion request
   */
  chatCompletion(params: {
    model: string;
    messages: Array<{
      role: string;
      content: string;
      images?: string[];
    }>;
    stream?: boolean;
    options?: Record<string, unknown>;
  }): Promise<{
    response: string | AsyncIterableIterator<string>;
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
    duration: number;
  }>;
  
  /**
   * Generate embeddings for text
   */
  generateEmbeddings(params: {
    model: string;
    prompt: string;
  }): Promise<{
    embeddings: number[];
    duration: number;
  }>;
  
  /**
   * Cancel ongoing request
   */
  cancelRequest(requestId: string): Promise<boolean>;
  
  // === HEALTH MONITORING ===
  
  /**
   * Start continuous health monitoring
   */
  startHealthMonitoring(interval?: number): Promise<void>;
  
  /**
   * Stop health monitoring
   */
  stopHealthMonitoring(): Promise<void>;
  
  /**
   * Get health status history
   */
  getHealthHistory(limit?: number): Promise<Array<{
    timestamp: Date;
    status: HealthStatus;
    responseTime: number;
    error?: string;
  }>>;
  
  // === CONFIGURATION ===
  
  updateConfig(config: Partial<OllamaConnectorConfig>): Promise<void>;
  getConfig(): OllamaConnectorConfig;
}

// === ADAPTER INTERFACES ===

export interface HttpAdapter {
  get(url: string, options?: {
    timeout?: number;
    headers?: Record<string, string>;
  }): Promise<{ data: unknown; status: number; headers: Record<string, string> }>;
  
  post(url: string, data: unknown, options?: {
    timeout?: number;
    headers?: Record<string, string>;
    stream?: boolean;
  }): Promise<{ data: unknown | AsyncIterableIterator<unknown>; status: number }>;
  
  delete(url: string, options?: {
    timeout?: number;
    headers?: Record<string, string>;
  }): Promise<{ status: number }>;
}

export interface HealthMonitorAdapter {
  startMonitoring(endpoint: string, interval: number, callback: (status: HealthStatus) => void): void;
  stopMonitoring(): void;
  checkHealth(endpoint: string): Promise<HealthStatus>;
  recordHealthCheck(status: HealthStatus): void;
}

// === EVENT PUBLISHERS ===

export interface ConnectionEventPublisher {
  publishConnectionEstablished(event: ConnectionEstablished): void;
  publishConnectionLost(event: ConnectionLost): void;
  publishHealthChecked(event: HealthChecked): void;
}

// === EXTERNAL DEPENDENCIES ===

export interface OllamaConnectorDependencies {
  connectionService: ConnectionService;
  httpAdapter: HttpAdapter;
  healthMonitorAdapter: HealthMonitorAdapter;
  eventPublisher: ConnectionEventPublisher;
  config: OllamaConnectorConfig;
}
