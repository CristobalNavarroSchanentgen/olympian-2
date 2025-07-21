/**
 * Health status model - pure types only
 */

export interface HealthStatus {
  readonly service: string;
  readonly status: ServiceStatus;
  readonly timestamp: Date;
  readonly checks: HealthCheck[];
  readonly metadata: HealthMetadata;
}

export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export interface HealthCheck {
  readonly name: string;
  readonly status: CheckStatus;
  readonly message?: string;
  readonly duration: number;
  readonly details?: Record<string, unknown>;
}

export type CheckStatus = 'pass' | 'fail' | 'warn';

export interface HealthMetadata {
  readonly version: string;
  readonly uptime: number;
  readonly memoryUsage?: number;
  readonly cpuUsage?: number;
  readonly connections: number;
}

export interface ServiceHealth {
  readonly ollama: HealthStatus;
  readonly mongodb: HealthStatus;
  readonly mcpServers: Record<string, HealthStatus>;
  readonly overall: ServiceStatus;
}

export interface HealthHistory {
  readonly service: string;
  readonly entries: HealthStatus[];
  readonly timeRange: {
    readonly start: Date;
    readonly end: Date;
  };
}
