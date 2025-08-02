/**
 * Availability Adapter
 * Checks model health and availability status
 */
export interface AvailabilityAdapter {
    checkModelHealth(modelName: string): Promise<{
        available: boolean;
        healthy: boolean;
        responseTime?: number;
    }>;
    pingModel(modelName: string): Promise<number>;
}
export declare function createAvailabilityAdapter(ollamaBaseUrl?: string): AvailabilityAdapter;
