/**
 * System Status Models
 * Defines types for system-wide status monitoring
 */

export interface MCPServer {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting';
  connected: boolean;
  lastPing?: Date;
  error?: string;
}

export interface DatabaseStatus {
  connected: boolean;
  connectionCount?: number;
  latency?: number;
  error?: string;
}

export interface OllamaStatus {
  connected: boolean;
  models?: string[];
  version?: string;
  error?: string;
}

export interface MCPStatus {
  servers: MCPServer[];
  totalConnected?: number;
  errors?: string[];
}

export interface SystemStatusUpdate {
  database?: DatabaseStatus;
  mcp?: MCPStatus;
  ollama?: OllamaStatus;
  timestamp?: Date;
}

export interface SystemHealthSnapshot {
  database: boolean;
  mcp: boolean;
  ollama: boolean;
  overall: 'healthy' | 'degraded' | 'unhealthy';
  lastUpdate: Date;
}
