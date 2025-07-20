/**
 * Vision processing result model - pure types only
 */

export interface ProcessingResult {
  readonly id: string;
  readonly imageId: string;
  readonly modelUsed: string;
  readonly result: VisionResult;
  readonly processingTime: number;
  readonly timestamp: Date;
}

export interface VisionResult {
  readonly success: boolean;
  readonly content?: string;
  readonly confidence?: number;
  readonly detections?: Detection[];
  readonly error?: string;
}

export interface Detection {
  readonly type: string;
  readonly label: string;
  readonly confidence: number;
  readonly boundingBox?: BoundingBox;
  readonly metadata?: Record<string, unknown>;
}

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ProcessingOptions {
  readonly model: string;
  readonly method: ProcessingMethod;
  readonly quality: QualityLevel;
  readonly includeDetections: boolean;
}

export type ProcessingMethod = 'direct' | 'hybrid' | 'separate';
export type QualityLevel = 'fast' | 'balanced' | 'accurate';
