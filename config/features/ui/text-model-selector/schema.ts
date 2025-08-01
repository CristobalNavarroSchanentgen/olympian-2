/**
 * Text Model Selector Configuration Schema
 */

export interface TextModelSelectorConfig {
  defaultModel?: string;
  allowedModels?: string[];
  autoSelectBest: boolean;
  persistSelection: boolean;
  showCapabilities: boolean;
  filterCriteria: {
    minContextLength?: number;
    requiresTextGeneration: boolean;
    excludeVisionOnly: boolean;
  };
}

