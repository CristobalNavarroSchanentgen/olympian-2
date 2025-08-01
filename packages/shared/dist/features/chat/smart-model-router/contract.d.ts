/**
 * Smart Model Router Feature Contract
 * Defines interfaces for intelligent model selection and routing
 */
export interface ModelSelectionAdapter {
    getCurrentSelection(): Promise<ModelSelection>;
    updateSelection(selection: ModelSelection): Promise<void>;
    validateSelection(selection: ModelSelection): Promise<boolean>;
}
export interface ContentAnalysisAdapter {
    analyzeContent(content: string): Promise<ContentAnalysis>;
    detectMediaType(content: string): Promise<MediaType>;
}
export interface AvailabilityAdapter {
    checkModelAvailability(modelId: string): Promise<boolean>;
    getAvailableModels(): Promise<string[]>;
}
export interface RouterEventPublisher {
    publishRouterEvent(event: RouterEvent): void;
    publishModelSwitched(from: string, to: string): void;
}
export interface ModelSelection {
    textModel: string;
    visionModel: string;
    timestamp: number;
}
export interface ContentAnalysis {
    hasImages: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
    suggestedModel: string;
}
export type MediaType = 'text' | 'image' | 'mixed';
export interface RouterEvent {
    type: string;
    payload: any;
    timestamp: number;
}
export interface SmartModelRouterConfig {
    enableAutoSwitching: boolean;
    fallbackModel: string;
    analysisThreshold: number;
}
//# sourceMappingURL=contract.d.ts.map