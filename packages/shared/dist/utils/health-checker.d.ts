/**
 * Health Checker Utility
 * Pure functions for checking service health
 * Follows AI-Native architecture - utility functions only
 */
import type { HealthStatus } from '../models/connection/health-status';
/**
 * Health check configuration
 */
export interface HealthCheckConfig {
    timeout: number;
    retries: number;
    retryDelay: number;
    endpoints: string[];
}
/**
 * Health check result for a single endpoint
 */
export interface HealthCheckResult {
    endpoint: string;
    status: 'healthy' | 'unhealthy' | 'timeout' | 'error';
    responseTime: number;
    error?: string;
    details?: Record<string, unknown>;
    timestamp: Date;
}
/**
 * Aggregated health status
 */
export interface AggregatedHealth {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    checks: HealthCheckResult[];
    summary: {
        total: number;
        healthy: number;
        unhealthy: number;
        errors: number;
    };
}
/**
 * Check health of a single HTTP endpoint
 */
export declare function checkHttpEndpoint(url: string, timeout?: number): Promise<HealthCheckResult>;
/**
 * Check health of Ollama instance
 */
export declare function checkOllamaHealth(baseUrl?: string): Promise<HealthCheckResult>;
/**
 * Check health of MCP server process
 */
export declare function checkMcpServerHealth(serverId: string, processId?: number): Promise<HealthCheckResult>;
/**
 * Perform health checks on multiple endpoints
 */
export declare function performHealthChecks(config: HealthCheckConfig): Promise<AggregatedHealth>;
/**
 * Aggregate health check results
 */
export declare function aggregateHealthResults(checks: HealthCheckResult[]): AggregatedHealth;
/**
 * Convert health results to status object
 */
export declare function toHealthStatus(aggregated: AggregatedHealth): HealthStatus;
//# sourceMappingURL=health-checker.d.ts.map