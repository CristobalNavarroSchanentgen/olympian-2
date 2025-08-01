/**
 * Feature Contract: Smart Model Router
 *
 * Intelligently routes messages to appropriate models based on content analysis,
 * user preferences, and model availability.
 */
import { ModelCapabilityDefinition } from '../../../models/connection';
import { ModelRegistryService } from '../../../services';
import { ModelRouted, RoutingFailed } from '../../../events';
export interface SmartModelRouterContract {
    /**
     * Route message to best available model based on content analysis
     */
    routeMessage(params: {
        content: string;
        images?: string[];
        userPreferences?: {
            preferredTextModel?: string;
            preferredVisionModel?: string;
        };
        conversationContext?: {
            previousModel?: string;
            capabilities?: string[];
        };
    }): Promise<{
        selectedModel: string;
        routingReason: 'vision-required' | 'user-preference' | 'capability-match' | 'default';
        modelCapabilities: ModelCapabilityDefinition;
        fallbacks: string[];
    }>;
    /**
     * Get recommended model for specific capability requirements
     */
    getRecommendedModel(params: {
        requiredCapabilities: ('vision' | 'tools' | 'reasoning')[];
        contentType: 'text' | 'multimodal';
        prioritizeSpeed?: boolean;
    }): Promise<{
        model: string;
        confidence: number;
        alternatives: string[];
    }>;
    /**
     * Analyze content to determine required capabilities
     */
    analyzeContent(params: {
        content: string;
        images?: string[];
    }): Promise<{
        requiresVision: boolean;
        suggestedCapabilities: ('tools' | 'reasoning')[];
        complexity: 'simple' | 'moderate' | 'complex';
        contentType: 'text' | 'multimodal';
    }>;
    /**
     * Detect if images require vision processing
     */
    detectVisionRequirement(images: string[]): Promise<boolean>;
    /**
     * Check if specific model is available and healthy
     */
    checkModelAvailability(modelName: string): Promise<{
        available: boolean;
        healthy: boolean;
        estimatedResponseTime?: number;
    }>;
    /**
     * Get list of available models by category
     */
    getAvailableModels(): Promise<{
        textModels: ModelCapabilityDefinition[];
        visionModels: ModelCapabilityDefinition[];
        allModels: ModelCapabilityDefinition[];
    }>;
    /**
     * Get fallback models when primary choice fails
     */
    getFallbackModels(params: {
        originalModel: string;
        requiredCapabilities: string[];
        failureReason: 'unavailable' | 'timeout' | 'error';
    }): Promise<string[]>;
    /**
     * Handle routing failure with automatic fallback
     */
    handleRoutingFailure(params: {
        failedModel: string;
        originalRequest: {
            content: string;
            images?: string[];
        };
        error: Error;
    }): Promise<{
        fallbackModel: string;
        strategy: 'capability-match' | 'simple-fallback' | 'manual-selection';
    }>;
}
export interface ContentAnalysisAdapter {
    analyzeTextComplexity(content: string): Promise<{
        complexity: 'simple' | 'moderate' | 'complex';
        suggestedCapabilities: string[];
    }>;
    detectImageContent(images: string[]): Promise<{
        hasImages: boolean;
        requiresProcessing: boolean;
    }>;
}
export interface ModelSelectionAdapter {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
    rankModelsByPreference(models: ModelCapabilityDefinition[], criteria: {
        speed?: number;
        capability?: number;
        reliability?: number;
    }): ModelCapabilityDefinition[];
    extractModelSize(modelName: string): number;
}
export interface AvailabilityAdapter {
    checkModelHealth(modelName: string): Promise<{
        available: boolean;
        healthy: boolean;
        responseTime?: number;
    }>;
    pingModel(modelName: string): Promise<number>;
}
export interface RouterEventPublisher {
    publishModelRouted(event: ModelRouted): void;
    publishRoutingFailed(event: RoutingFailed): void;
}
export interface SmartModelRouterDependencies {
    modelRegistryService: ModelRegistryService;
    contentAnalysisAdapter: ContentAnalysisAdapter;
    modelSelectionAdapter: ModelSelectionAdapter;
    availabilityAdapter: AvailabilityAdapter;
    eventPublisher: RouterEventPublisher;
}
//# sourceMappingURL=contract.d.ts.map