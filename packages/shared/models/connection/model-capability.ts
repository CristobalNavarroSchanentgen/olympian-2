/**
 * Model capability model - pure types only
 */

export interface ModelCapability {
  readonly modelName: string;
  readonly capabilities: CapabilitySet;
  readonly isCustom: boolean;
  readonly detectedAt: Date;
  readonly metadata: ModelMetadata;
}

export interface CapabilitySet {
  readonly supportsChat: boolean;
  readonly supportsVision: boolean;
  readonly supportsStreaming: boolean;
  readonly supportsTools: boolean;
  readonly contextWindow: number;
  readonly maxTokens: number;
}

export interface ModelMetadata {
  readonly size: string;
  readonly family: string;
  readonly version?: string;
  readonly parameterCount?: string;
  readonly quantization?: string;
}

export interface DetectionMethod {
  readonly name: string;
  readonly priority: number;
  readonly testFunction: string;
  readonly successCriteria: string;
}

export interface DetectionResult {
  readonly modelName: string;
  readonly method: string;
  readonly success: boolean;
  readonly capabilities?: CapabilitySet;
  readonly error?: string;
  readonly duration: number;
}

export interface CapabilityOverride {
  readonly modelName: string;
  readonly capabilities: Partial<CapabilitySet>;
  readonly reason: string;
  readonly appliedAt: Date;
}
