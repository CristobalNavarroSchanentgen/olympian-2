/**
 * Ollama Connector Contract
 * Defines interfaces for connecting to and managing Ollama service
 */

export interface OllamaStatus {
  connected: boolean;
  baseUrl: string;
  version?: string;
  lastChecked?: Date;
}

export interface ModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    families?: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface ModelsResponse {
  models: ModelInfo[];
  count?: number;
}

export interface ConnectionConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  error?: string;
  timestamp: Date;
}

export interface OllamaConnectorContract {
  /**
   * Get current connection status to Ollama service
   */
  getStatus(): Promise<OllamaStatus>;
  
  /**
   * Get list of available models from Ollama
   * Returns the full response with models array and count
   */
  getModels(): Promise<ModelsResponse>;
  
  /**
   * Test connection to Ollama service
   */
  testConnection(config?: ConnectionConfig): Promise<HealthCheckResult>;
  
  /**
   * Initialize connection with configuration
   */
  initialize(config: ConnectionConfig): Promise<void>;
  
  /**
   * Check if a specific model is available
   */
  isModelAvailable(modelName: string): Promise<boolean>;
  
  /**
   * Get detailed information about a specific model
   */
  getModelInfo(modelName: string): Promise<ModelInfo | null>;
  
  /**
   * Refresh model list cache
   */
  refreshModels(): Promise<void>;
}
