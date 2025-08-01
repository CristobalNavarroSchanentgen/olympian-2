/**
 * Availability Adapter - Server Implementation
 */
import { AvailabilityAdapter } from '@olympian/shared/features/chat/smart-model-router/contract';
import { OllamaService } from '../services/ollama-service';
export declare class AvailabilityAdapterImpl implements AvailabilityAdapter {
    private ollamaService;
    constructor(ollamaService: OllamaService);
    checkModelHealth(modelName: string): Promise<{
        available: boolean;
        healthy: boolean;
        responseTime?: undefined;
    } | {
        available: boolean;
        healthy: boolean;
        responseTime: number;
    }>;
    pingModel(modelName: string): Promise<number>;
}
