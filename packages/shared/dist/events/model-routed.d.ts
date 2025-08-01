/**
 * Model Routed Event Schema
 * Published when a message is successfully routed to a model
 */
export interface ModelRouted {
    model: string;
    reason: 'vision-required' | 'user-preference' | 'capability-match' | 'default';
    analysisResult: {
        requiresVision: boolean;
        suggestedCapabilities: string[];
        complexity: 'simple' | 'moderate' | 'complex';
        contentType: 'text' | 'multimodal';
    };
    timestamp: Date;
}
export type ModelRoutedEventType = 'model-routed';
export declare const MODEL_ROUTED_EVENT: ModelRoutedEventType;
//# sourceMappingURL=model-routed.d.ts.map