import { HealthStatus } from '../../../../models/connection/health-status';
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
export declare function createHealthMonitorAdapter(): HealthMonitorAdapter;
//# sourceMappingURL=health-monitor-adapter.d.ts.map