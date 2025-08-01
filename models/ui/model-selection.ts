/**
 * Model Selection Data Types
 * Pure types for model selection functionality
 */

export interface ModelSelection {
  textModel: string | null;
  visionModel: string | null;
  lastUpdated: Date;
  source: 'user-selection' | 'smart-routing' | 'default';
}

export interface ModelSelectorState {
  isLoading: boolean;
  availableTextModels: string[];
  availableVisionModels: string[];
  currentSelection: ModelSelection;
  error?: string;
}

