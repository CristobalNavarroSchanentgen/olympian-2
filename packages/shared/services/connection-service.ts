/**
 * Connection service contract
 */

import { OllamaConnection, ConnectionHealth } from '../models/connection/ollama-connection';

export interface ConnectionService {
  /**
   * Establish connection to Ollama
   */
  connect(endpoint: string): Promise<OllamaConnection>;

  /**
   * Disconnect from Ollama
   */
  disconnect(connectionId: string): Promise<boolean>;

  /**
   * Get connection status
   */
  getConnection(connectionId: string): Promise<OllamaConnection | null>;

  /**
   * Get all connections
   */
  getAllConnections(): Promise<OllamaConnection[]>;

  /**
   * Test connection health
   */
  testConnection(endpoint: string): Promise<ConnectionHealth>;

  /**
   * Get connection health
   */
  getConnectionHealth(connectionId: string): Promise<ConnectionHealth | null>;

  /**
   * Check if endpoint is reachable
   */
  isEndpointReachable(endpoint: string): Promise<boolean>;

  /**
   * Get Ollama version
   */
  getOllamaVersion(connectionId: string): Promise<string | null>;

  /**
   * List available models
   */
  listModels(connectionId: string): Promise<ModelInfo[]>;

  /**
   * Get model information
   */
  getModelInfo(connectionId: string, modelName: string): Promise<ModelInfo | null>;
}

export interface ModelInfo {
  readonly name: string;
  readonly size: string;
  readonly digest: string;
  readonly family: string;
  readonly format: string;
  readonly parameter_size: string;
  readonly quantization_level: string;
}
