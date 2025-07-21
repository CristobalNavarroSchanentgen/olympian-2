import { HealthStatus } from '../../../models/connection/health-status';
import { checkHealth } from '../../../utils/health-checker';

/**
 * Health monitor adapter for Ollama connections
 * Transforms health checking utilities for ollama-connector feature
 */

export interface HealthMonitorAdapter {
  startMonitoring(connectionId: string, endpoint: string): void;
  stopMonitoring(connectionId: string): void;
  getHealthStatus(connectionId: string): Promise<HealthStatus>;
  onHealthChange(connectionId: string, callback: (status: HealthStatus) => void): void;
}

const monitors = new Map<string, NodeJS.Timeout>();
const healthCallbacks = new Map<string, ((status: HealthStatus) => void)[]>();
const lastHealthStatus = new Map<string, HealthStatus>();

export function createHealthMonitorAdapter(): HealthMonitorAdapter {
  return {
    startMonitoring(connectionId, endpoint) {
      // Stop existing monitor if any
      this.stopMonitoring(connectionId);
      
      const monitor = setInterval(async () => {
        try {
          const health = await checkHealth(endpoint, {
            timeout: 5000,
            checkEndpoints: ['/api/tags', '/api/version']
          });
          
          const status: HealthStatus = {
            healthy: health.healthy,
            lastCheck: new Date(),
            responseTime: health.responseTime,
            error: health.error,
            details: {
              endpoint: endpoint,
              checks: health.checks || []
            }
          };
          
          // Store status and notify callbacks
          lastHealthStatus.set(connectionId, status);
          this.notifyHealthChange(connectionId, status);
          
        } catch (error) {
          const status: HealthStatus = {
            healthy: false,
            lastCheck: new Date(),
            responseTime: 0,
            error: error.message,
            details: {
              endpoint: endpoint,
              checks: []
            }
          };
          
          lastHealthStatus.set(connectionId, status);
          this.notifyHealthChange(connectionId, status);
        }
      }, 30000); // Check every 30 seconds
      
      monitors.set(connectionId, monitor);
    },

    stopMonitoring(connectionId) {
      const monitor = monitors.get(connectionId);
      if (monitor) {
        clearInterval(monitor);
        monitors.delete(connectionId);
      }
      
      // Clean up callbacks and status
      healthCallbacks.delete(connectionId);
      lastHealthStatus.delete(connectionId);
    },

    async getHealthStatus(connectionId) {
      // Return cached status if available
      const cached = lastHealthStatus.get(connectionId);
      if (cached) {
        return cached;
      }
      
      // Return default unhealthy status
      return {
        healthy: false,
        lastCheck: new Date(),
        responseTime: 0,
        error: 'No health data available',
        details: {
          endpoint: 'unknown',
          checks: []
        }
      };
    },

    onHealthChange(connectionId, callback) {
      const callbacks = healthCallbacks.get(connectionId) || [];
      callbacks.push(callback);
      healthCallbacks.set(connectionId, callbacks);
    },

    notifyHealthChange(connectionId: string, status: HealthStatus) {
      const callbacks = healthCallbacks.get(connectionId) || [];
      callbacks.forEach(callback => {
        try {
          callback(status);
        } catch (error) {
          console.error('Health callback error:', error);
        }
      });
    }
  };
}
