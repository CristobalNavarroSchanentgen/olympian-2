/**
 * Text Model Selected Event
 * Emitted when a text model is successfully selected
 */

export interface TextModelSelectedEvent {
  modelName: string;
  timestamp: Date;
  capabilities: string[];
  source: 'user-selection' | 'smart-routing' | 'fallback';
}

