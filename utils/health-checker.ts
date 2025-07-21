/**
 * Health checking utility - pure functions
 */

import { HealthCheck, CheckStatus, HealthStatus } from '../models/connection/health-status.js';

export interface HealthCheckConfig {
  readonly name: string;
  readonly timeout: number;
  readonly retries: number;
  readonly interval: number;
}

export interface CheckResult {
  readonly status: CheckStatus;
  readonly message?: string;
  readonly duration: number;
  readonly details?: Record<string, unknown>;
}

/**
 * Evaluate health check result
 */
export function evaluateHealthCheck(
  config: HealthCheckConfig,
  result: CheckResult
): HealthCheck {
  return {
    name: config.name,
    status: result.status,
    message: result.message,
    duration: result.duration,
    details: result.details
  };
}

/**
 * Aggregate multiple health checks
 */
export function aggregateHealthChecks(
  checks: HealthCheck[]
): { status: CheckStatus; summary: string } {
  if (checks.length === 0) {
    return { status: 'fail', summary: 'No health checks configured' };
  }
  
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  
  if (failCount > 0) {
    return { 
      status: 'fail', 
      summary: \`\${failCount} check(s) failed, \${warnCount} warning(s)\`
    };
  }
  
  if (warnCount > 0) {
    return { 
      status: 'warn', 
      summary: \`\${warnCount} check(s) have warnings\`
    };
  }
  
  return { 
    status: 'pass', 
    summary: \`All \${checks.length} check(s) passed\`
  };
}

/**
 * Calculate service health status
 */
export function calculateServiceHealth(
  checks: HealthCheck[]
): { healthy: boolean; degraded: boolean } {
  const { status } = aggregateHealthChecks(checks);
  
  return {
    healthy: status === 'pass',
    degraded: status === 'warn'
  };
}

/**
 * Build health status from checks
 */
export function buildHealthStatus(
  service: string,
  checks: HealthCheck[],
  metadata: Record<string, unknown> = {}
): HealthStatus {
  const { healthy, degraded } = calculateServiceHealth(checks);
  
  let status: HealthStatus['status'];
  if (healthy) status = 'healthy';
  else if (degraded) status = 'degraded';
  else status = 'unhealthy';
  
  return {
    service,
    status,
    timestamp: new Date(),
    checks,
    metadata: {
      version: 'unknown',
      uptime: 0,
      connections: 0,
      ...metadata
    }
  };
}

/**
 * Check if health status is acceptable
 */
export function isHealthyStatus(status: HealthStatus): boolean {
  return status.status === 'healthy' || status.status === 'degraded';
}

/**
 * Calculate health score (0-100)
 */
export function calculateHealthScore(checks: HealthCheck[]): number {
  if (checks.length === 0) return 0;
  
  const weights = { pass: 100, warn: 50, fail: 0 };
  const totalScore = checks.reduce((sum, check) => {
    return sum + weights[check.status];
  }, 0);
  
  return Math.round(totalScore / checks.length);
}

/**
 * Determine if health check should be retried
 */
export function shouldRetryHealthCheck(
  result: CheckResult,
  retryCount: number,
  maxRetries: number
): boolean {
  if (retryCount >= maxRetries) return false;
  if (result.status === 'pass') return false;
  
  // Retry on failures but not on warnings
  return result.status === 'fail';
}

/**
 * Create default health check configs
 */
export function createDefaultHealthChecks(): HealthCheckConfig[] {
  return [
    {
      name: 'connectivity',
      timeout: 5000,
      retries: 2,
      interval: 30000
    },
    {
      name: 'response_time',
      timeout: 10000,
      retries: 1,
      interval: 60000
    },
    {
      name: 'resource_usage',
      timeout: 3000,
      retries: 1,
      interval: 120000
    }
  ];
}
