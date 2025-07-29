import { HealthStatus } from '../../../../models/connection/health-status';
import { checkHealth } from '../../../../utils/health-checker';

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

// Helper functions extracted from business logic
function triggerCallbacks(connectionId: string, status: HealthStatus): void {
  const callbacks = healthCallbacks.get(connectionId) || [];
  callbacks.forEach(callback => {
    try {
      callback(status);
    } catch (error) {
      console.error('Health callback error:', error);
    }
  });
}

function stopConnectionMonitoring(connectionId: string): void {
  const monitor = monitors.get(connectionId);
  if (monitor) {
    clearInterval(monitor);
    monitors.delete(connectionId);
  }
  
  // Clean up callbacks and status
  healthCallbacks.delete(connectionId);
  lastHealthStatus.delete(connectionId);
}

function startConnectionMonitoring(connectionId: string, endpoint: string): void {
  // Stop existing monitor if any
  stopConnectionMonitoring(connectionId);
  
  const monitor = setInterval(async () => {
    try {
      const status = await checkHealth(endpoint, 5000);
      
      // Store status and notify callbacks
      lastHealthStatus.set(connectionId, status);
      triggerCallbacks(connectionId, status);
      
    } catch (error) {
      const errorStatus: HealthStatus = {
        status: 'unhealthy',
        timestamp: new Date(),
        services: {},
        metadata: {
          endpoint: endpoint,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        // Compatibility properties
        healthy: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date(),
        details: { endpoint }
      };
      
      lastHealthStatus.set(connectionId, errorStatus);
      triggerCallbacks(connectionId, errorStatus);
    }
  }, 30000); // Check every 30 seconds
  
  monitors.set(connectionId, monitor);
}

async function getConnectionHealthStatus(connectionId: string): Promise<HealthStatus> {
  // Return cached status if available
  const cached = lastHealthStatus.get(connectionId);
  if (cached) {
    return cached;
  }
  
  // Return default unhealthy status
  return {
    status: 'unhealthy',
    timestamp: new Date(),
    services: {},
    metadata: { error: 'No health data available' },
    // Compatibility properties
    healthy: false,
    responseTime: 0,
    error: 'No health data available',
    lastCheck: new Date(),
    details: { endpoint: 'unknown' }
  };
}

function registerHealthChangeCallback(connectionId: string, callback: (status: HealthStatus) => void): void {
  const callbacks = healthCallbacks.get(connectionId) || [];
  callbacks.push(callback);
  healthCallbacks.set(connectionId, callbacks);
}

export function createHealthMonitorAdapter(): HealthMonitorAdapter {
  return {
    startMonitoring(connectionId: string, endpoint: string): void {
      startConnectionMonitoring(connectionId, endpoint);
    },

    stopMonitoring(connectionId: string): void {
      stopConnectionMonitoring(connectionId);
    },

    async getHealthStatus(connectionId: string): Promise<HealthStatus> {
      return getConnectionHealthStatus(connectionId);
    },

    onHealthChange(connectionId: string, callback: (status: HealthStatus) => void): void {
      registerHealthChangeCallback(connectionId, callback);
    }
  };
}
