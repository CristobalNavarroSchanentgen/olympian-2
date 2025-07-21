/**
 * Models detected event
 */
export interface ModelsDetectedEvent {
    readonly type: 'models-detected';
    readonly connectionId: string;
    readonly models: DetectedModel[];
    readonly timestamp: Date;
    readonly metadata: {
        readonly detectionMethod: 'scan' | 'list' | 'custom';
        readonly totalModels: number;
        readonly detectionTime: number;
        readonly errors: string[];
    };
}
export interface DetectedModel {
    readonly name: string;
    readonly size: string;
    readonly family: string;
    readonly capabilities: {
        readonly supportsChat: boolean;
        readonly supportsVision: boolean;
        readonly supportsStreaming: boolean;
        readonly contextWindow: number;
    };
}
export declare function createModelsDetectedEvent(connectionId: string, models: DetectedModel[], detectionMethod: 'scan' | 'list' | 'custom', detectionTime: number, errors?: string[]): ModelsDetectedEvent;
//# sourceMappingURL=models-detected.d.ts.map