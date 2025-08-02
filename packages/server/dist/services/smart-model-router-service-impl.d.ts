/**
 * Smart Model Router Service Implementation
 * Initializes SmartModelRouter with all required dependencies
 */
import { SmartModelRouter } from '@olympian/shared/features/chat/smart-model-router';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { OllamaService } from './ollama-service';
export declare class SmartModelRouterService implements SmartModelRouter {
    private contentAnalysisAdapter;
    private modelSelectionAdapter;
    private eventPublisher;
    constructor(modelRegistryService: ModelRegistryService, ollamaService: OllamaService);
    selectOptimalModel(content: string): Promise<string>;
    getCurrentSelection(): Promise<any>;
    updateModelSelection(selection: any): Promise<void>;
    analyzeAndRoute(content: string): Promise<string>;
    getRouter(): SmartModelRouter;
}
