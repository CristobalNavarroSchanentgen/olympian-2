import { checkHealth } from '../../../../utils/health-checker';
const monitors = new Map();
const healthCallbacks = new Map();
const lastHealthStatus = new Map();
// Helper functions extracted from business logic
function triggerCallbacks(connectionId, status) {
    const callbacks = healthCallbacks.get(connectionId) || [];
    callbacks.forEach(callback => {
        try {
            callback(status);
        }
        catch (error) {
            console.error('Health callback error:', error);
        }
    });
}
function stopConnectionMonitoring(connectionId) {
    const monitor = monitors.get(connectionId);
    if (monitor) {
        clearInterval(monitor);
        monitors.delete(connectionId);
    }
    // Clean up callbacks and status
    healthCallbacks.delete(connectionId);
    lastHealthStatus.delete(connectionId);
}
function startConnectionMonitoring(connectionId, endpoint) {
    // Stop existing monitor if any
    stopConnectionMonitoring(connectionId);
    const monitor = setInterval(async () => {
        try {
            const status = await checkHealth(endpoint, 5000);
            // Store status and notify callbacks
            lastHealthStatus.set(connectionId, status);
            triggerCallbacks(connectionId, status);
        }
        catch (error) {
            const errorStatus = {
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
async function getConnectionHealthStatus(connectionId) {
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
function registerHealthChangeCallback(connectionId, callback) {
    const callbacks = healthCallbacks.get(connectionId) || [];
    callbacks.push(callback);
    healthCallbacks.set(connectionId, callbacks);
}
export function createHealthMonitorAdapter() {
    return {
        startMonitoring(connectionId, endpoint) {
            startConnectionMonitoring(connectionId, endpoint);
        },
        stopMonitoring(connectionId) {
            stopConnectionMonitoring(connectionId);
        },
        async getHealthStatus(connectionId) {
            return getConnectionHealthStatus(connectionId);
        },
        onHealthChange(connectionId, callback) {
            registerHealthChangeCallback(connectionId, callback);
        }
    };
}
//# sourceMappingURL=health-monitor-adapter.js.map