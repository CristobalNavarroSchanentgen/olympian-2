/**
 * Health Status Models
 */

export type HealthLevel = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthMetadata {
  [key: string]: unknown;
}

export interface HealthStatus {
  status: HealthLevel;
  timestamp: Date;
  services: Record<string, {
    status: string;
    responseTime: number;
    error?: string;
    lastCheck: Date;
  }>;
  metadata: HealthMetadata;
}
