/**
 * Feature Contract: Model Selector UI
 * 
 * Provides React components for model selection with real-time availability
 * and integration with smart model router for intelligent recommendations.
 */

import { ModelCapabilityDefinition } from '@olympian/shared';

export interface ModelSelectorContract {
  // === MODEL SELECTION ===
  
  /**
   * Get available models organized by category
   */
  getAvailableModels(): Promise<{
    textModels: ModelCapabilityDefinition[];
    visionModels: ModelCapabilityDefinition[];
    allModels: ModelCapabilityDefinition[];
  }>;
  
  /**
   * Get recommended model for current content
   */
  getRecommendedModel(params: {
    content: string;
    images?: string[];
    userPreferences?: {
      preferredTextModel?: string;
      preferredVisionModel?: string;
    };
  }): Promise<{
    model: string;
    reason: string;
    confidence: number;
  }>;
  
  // === USER PREFERENCES ===
  
  /**
   * Save user model preferences
   */
  savePreferences(preferences: {
    preferredTextModel?: string;
    preferredVisionModel?: string;
    autoSelect?: boolean;
  }): void;
  
  /**
   * Load user model preferences
   */
  loadPreferences(): {
    preferredTextModel?: string;
    preferredVisionModel?: string;
    autoSelect?: boolean;
  };
  
  // === AVAILABILITY MONITORING ===
  
  /**
   * Check real-time model availability
   */
  checkModelAvailability(modelName: string): Promise<{
    available: boolean;
    healthy: boolean;
    responseTime?: number;
  }>;
  
  /**
   * Subscribe to model availability updates
   */
  subscribeToAvailability(callback: (updates: {
    modelName: string;
    available: boolean;
    healthy: boolean;
  }[]) => void): () => void;
}

// === COMPONENT INTERFACES ===

export interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange: (modelName: string) => void;
  filterBy?: 'text' | 'vision' | 'all';
  showRecommendations?: boolean;
  disabled?: boolean;
}

export interface ModelDropdownProps extends ModelSelectorProps {
  placeholder?: string;
  showCapabilities?: boolean;
  showAvailability?: boolean;
}

export interface ModelRecommendationProps {
  content: string;
  images?: string[];
  onRecommendationAccept: (modelName: string) => void;
  showReason?: boolean;
}

// === HOOK INTERFACES ===

export interface UseModelSelectorReturn {
  // State
  availableModels: {
    textModels: ModelCapabilityDefinition[];
    visionModels: ModelCapabilityDefinition[];
    allModels: ModelCapabilityDefinition[];
  };
  selectedModel: string | null;
  isLoading: boolean;
  availability: Record<string, { available: boolean; healthy: boolean; responseTime?: number }>;
  
  // Actions
  selectModel: (modelName: string) => void;
  refreshAvailability: () => Promise<void>;
  getRecommendation: (content: string, images?: string[]) => Promise<string>;
  
  // Preferences
  preferences: {
    preferredTextModel?: string;
    preferredVisionModel?: string;
    autoSelect?: boolean;
  };
  updatePreferences: (prefs: Partial<typeof preferences>) => void;
}

export interface UseModelRecommendationReturn {
  recommendation: {
    model: string;
    reason: string;
    confidence: number;
  } | null;
  isAnalyzing: boolean;
  getRecommendation: (content: string, images?: string[]) => Promise<void>;
  clearRecommendation: () => void;
}

// === ADAPTER INTERFACES ===

export interface PreferencesAdapter {
  save(preferences: Record<string, unknown>): void;
  load(): Record<string, unknown>;
}

export interface AvailabilityAdapter {
  checkModel(modelName: string): Promise<{
    available: boolean;
    healthy: boolean;
    responseTime?: number;
  }>;
  
  subscribeToUpdates(callback: (updates: Array<{
    modelName: string;
    available: boolean;
    healthy: boolean;
  }>) => void): () => void;
}

// === EXTERNAL DEPENDENCIES ===

export interface ModelSelectorDependencies {
  smartModelRouter: any; // Will be injected from smart-model-router
  preferencesAdapter: PreferencesAdapter;
  availabilityAdapter: AvailabilityAdapter;
}
