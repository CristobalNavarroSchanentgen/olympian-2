/**
 * Vision Model Selector Configuration Schema
 */

export interface VisionModelSelectorConfig {
  defaultModel?: string;
  allowedModels?: string[];
  autoSelectForVision: boolean;
  persistSelection: boolean;
  showCapabilities: boolean;
  filterCriteria: {
    requiresVision: boolean;
    minContextLength?: number;
    supportedImageFormats?: string[];
  };
}

