/**
 * Ollama connection model - pure types only
 */

export interface OllamaConnection {
  readonly id: string;
  readonly name: string;
  readonly endpoint: string;
  readonly status: ConnectionStatus;
  readonly lastConnected?: Date;
  readonly metadata: ConnectionMetadata;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ConnectionMetadata {
  readonly version?: string;
  readonly latency?: number;
  readonly modelCount: number;
  readonly lastHealthCheck?: Date;
  readonly errorMessage?: string;
}

export interface ConnectionConfig {
  readonly endpoint: string;
  readonly timeout: number;
  readonly retryAttempts: number;
  readonly healthCheckInterval: number;
}

export interface ConnectionHealth {
  readonly healthy: boolean;
  readonly latency: number;
  readonly timestamp: Date;
  readonly details: HealthDetails;
}

export interface HealthDetails {
  readonly version: string;
  readonly modelsAvailable: boolean;
  readonly memoryUsage?: number;
  readonly errors: string[];
}
