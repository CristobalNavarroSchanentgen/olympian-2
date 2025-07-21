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

export function createModelsDetectedEvent(
  connectionId: string,
  models: DetectedModel[],
  detectionMethod: 'scan' | 'list' | 'custom',
  detectionTime: number,
  errors: string[] = []
): ModelsDetectedEvent {
  return {
    type: 'models-detected',
    connectionId,
    models,
    timestamp: new Date(),
    metadata: {
      detectionMethod,
      totalModels: models.length,
      detectionTime,
      errors
    }
  };
}
