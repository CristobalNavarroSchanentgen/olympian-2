"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthMonitorAdapter = createHealthMonitorAdapter;
const health_checker_1 = require("../../../utils/health-checker");
const monitors = new Map();
const healthCallbacks = new Map();
const lastHealthStatus = new Map();
function createHealthMonitorAdapter() {
    return {
        startMonitoring(connectionId, endpoint) {
            // Stop existing monitor if any
            this.stopMonitoring(connectionId);
            const monitor = setInterval(async () => {
                try {
                    const health = await (0, health_checker_1.checkHealth)(endpoint, {
                        timeout: 5000,
                        checkEndpoints: ['/api/tags', '/api/version']
                    });
                    const status = {
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
                }
                catch (error) {
                    const status = {
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
        notifyHealthChange(connectionId, status) {
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
    };
}
//# sourceMappingURL=health-monitor-adapter.js.map