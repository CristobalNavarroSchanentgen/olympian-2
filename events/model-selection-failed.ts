/**
 * Model Selection Failed Event
 * Emitted when model selection fails
 */

export interface ModelSelectionFailedEvent {
  attemptedModel: string;
  error: string;
  timestamp: Date;
  suggestedAlternatives?: string[];
  source: 'text-selector' | 'vision-selector' | 'smart-router';
}

