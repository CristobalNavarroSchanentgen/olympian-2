/**
 * Vision Model Selected Event
 * Emitted when a vision model is successfully selected
 */

export interface VisionModelSelectedEvent {
  modelName: string;
  timestamp: Date;
  capabilities: string[];
  hasVision: boolean;
  source: 'user-selection' | 'smart-routing' | 'fallback';
}

