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
export async function checkHttpEndpoint(
  url: string, 
  timeout: number = 5000
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'olympian-health-checker/1.0.0'
      }
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    return {
      endpoint: url,
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime,
      details: {
        status: response.status,
        statusText: response.statusText
      },
      timestamp: new Date()
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        endpoint: url,
        status: 'timeout',
        responseTime,
        error: 'Request timed out',
        timestamp: new Date()
      };
    }
    
    return {
      endpoint: url,
      status: 'error',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    };
  }
}

/**
 * Check health of Ollama instance
 */
export async function checkOllamaHealth(
  baseUrl: string = 'http://localhost:11434'
): Promise<HealthCheckResult> {
  return checkHttpEndpoint(`${baseUrl}/api/tags`);
}

/**
 * Check health of MCP server process
 */
export async function checkMcpServerHealth(
  serverId: string,
  processId?: number
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // In a real implementation, this would check the actual process
    const isRunning = processId ? await mockCheckProcess(processId) : false;
    const responseTime = Date.now() - startTime;
    
    return {
      endpoint: serverId,
      status: isRunning ? 'healthy' : 'unhealthy',
      responseTime,
      details: {
        processId,
        serverId
      },
      timestamp: new Date()
    };
  } catch (error) {
    return {
      endpoint: serverId,
      status: 'error',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    };
  }
}

/**
 * Perform health checks on multiple endpoints
 */
export async function performHealthChecks(
  config: HealthCheckConfig
): Promise<AggregatedHealth> {
  const checks: HealthCheckResult[] = [];
  
  for (const endpoint of config.endpoints) {
    let result: HealthCheckResult;
    let attempts = 0;
    
    do {
      result = await checkHttpEndpoint(endpoint, config.timeout);
      attempts++;
      
      if (result.status !== 'healthy' && attempts < config.retries) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    } while (result.status !== 'healthy' && attempts < config.retries);
    
    checks.push(result);
  }
  
  return aggregateHealthResults(checks);
}

/**
 * Aggregate health check results
 */
export function aggregateHealthResults(checks: HealthCheckResult[]): AggregatedHealth {
  const summary = {
    total: checks.length,
    healthy: checks.filter(c => c.status === 'healthy').length,
    unhealthy: checks.filter(c => c.status === 'unhealthy').length,
    errors: checks.filter(c => c.status === 'error' || c.status === 'timeout').length
  };
  
  let overall: 'healthy' | 'degraded' | 'unhealthy';
  
  if (summary.healthy === summary.total) {
    overall = 'healthy';
  } else if (summary.healthy > 0) {
    overall = 'degraded';
  } else {
    overall = 'unhealthy';
  }
  
  return {
    overall,
    checks,
    summary
  };
}

/**
 * Convert health results to status object
 */
export function toHealthStatus(aggregated: AggregatedHealth): HealthStatus {
  return {
    status: aggregated.overall,
    timestamp: new Date(),
    services: aggregated.checks.reduce((acc, check) => {
      acc[check.endpoint] = {
        status: check.status,
        responseTime: check.responseTime,
        error: check.error,
        lastCheck: check.timestamp
      };
      return acc;
    }, {} as Record<string, any>),
    metadata: {
      totalChecks: aggregated.summary.total,
      healthyCount: aggregated.summary.healthy,
      unhealthyCount: aggregated.summary.unhealthy,
      errorCount: aggregated.summary.errors
    }
  };
}

// Mock function for process checking
async function mockCheckProcess(processId: number): Promise<boolean> {
  // In real implementation, would use process.kill(processId, 0) or similar
  await new Promise(resolve => setTimeout(resolve, 50));
  return processId > 0;
}

// Generic health check wrapper for adapter compatibility
export async function checkHealth(
  endpoint: string, 
  timeout?: number
): Promise<HealthStatus> {
  const result = await checkHttpEndpoint(endpoint, timeout || 5000);
  return {
    status: result.status === "healthy" ? 'healthy' : 'unhealthy',
    timestamp: result.timestamp,
    services: {},
    metadata: {
      endpoint,
      responseTime: result.responseTime,
      lastCheck: result.timestamp
    }
  };
}
