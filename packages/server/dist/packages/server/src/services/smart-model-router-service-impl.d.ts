/**
 * Smart Model Router Service Implementation
 * Initializes SmartModelRouter with all required dependencies
 */
import { SmartModelRouter } from '@olympian/shared/features/chat/smart-model-router';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { OllamaService } from './ollama-service';
export declare class SmartModelRouterService {
    private smartModelRouter;
    constructor(modelRegistryService: ModelRegistryService, ollamaService: OllamaService);
    getRouter(): SmartModelRouter;
}
