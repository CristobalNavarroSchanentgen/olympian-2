/**
 * Ollama Connection Models
 */

export type ServiceStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'failed';

export interface OllamaConnection {
  id: string;
  baseUrl: string;
  endpoint: string;
  status: ServiceStatus;
  version?: string;
  models: string[];
  lastPing?: Date;
  createdAt?: Date;  metadata: Record<string, unknown>;
}

// Connection health types
export interface ConnectionHealth {
  status: ServiceStatus;
  latency?: number;
  lastChecked: Date;
  errorCount: number;
  uptime?: number;
}
