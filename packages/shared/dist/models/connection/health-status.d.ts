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
    healthy?: boolean;
    responseTime?: number;
    error?: string;
    lastCheck?: Date;
    details?: Record<string, unknown>;
    checks?: unknown[];
}
export interface HealthCheckConfig {
    timeout: number;
    retries: number;
    retryDelay: number;
    endpoints: string[];
}
//# sourceMappingURL=health-status.d.ts.map