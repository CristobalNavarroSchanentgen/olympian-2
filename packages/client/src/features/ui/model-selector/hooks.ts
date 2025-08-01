/**
 * Model Selector React Hooks
 * 
 * Custom hooks for model selection, recommendations, and availability monitoring
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ModelCapabilityDefinition } from '@olympian/shared';
import { UseModelSelectorReturn, UseModelRecommendationReturn } from './contract';

// Mock smart router service for now - will be replaced with actual service
interface SmartRouterService {
  getAvailableModels(): Promise<{
    textModels: ModelCapabilityDefinition[];
    visionModels: ModelCapabilityDefinition[];
    allModels: ModelCapabilityDefinition[];
  }>;
  routeMessage(params: any): Promise<{ selectedModel: string; routingReason: string }>;
  checkModelAvailability(modelName: string): Promise<{ available: boolean; healthy: boolean; estimatedResponseTime?: number }>;
}

// Mock service - will be injected properly later
const mockSmartRouter: SmartRouterService = {
  async getAvailableModels() {
    // This will be replaced with actual service call
    return {
      textModels: [],
      visionModels: [],
      allModels: []
    };
  },
  async routeMessage() {
    return { selectedModel: 'phi4:14b', routingReason: 'default' };
  },
  async checkModelAvailability() {
    return { available: true, healthy: true, estimatedResponseTime: 500 };
  }
};

/**
 * Main hook for model selection functionality
 */
export function useModelSelector(): UseModelSelectorReturn {
  const [availableModels, setAvailableModels] = useState<{
    textModels: ModelCapabilityDefinition[];
    visionModels: ModelCapabilityDefinition[];
    allModels: ModelCapabilityDefinition[];
  }>({
    textModels: [],
    visionModels: [],
    allModels: []
  });
  
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<Record<string, { 
    available: boolean; 
    healthy: boolean; 
    responseTime?: number 
  }>>({});

  // Load preferences from localStorage
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('model-preferences');
      return saved ? JSON.parse(saved) : {
        preferredTextModel: undefined,
        preferredVisionModel: undefined,
        autoSelect: true
      };
    } catch {
      return {
        preferredTextModel: undefined,
        preferredVisionModel: undefined,
        autoSelect: true
      };
    }
  });

  // Load available models on mount
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        const models = await mockSmartRouter.getAvailableModels();
        setAvailableModels(models);
        
        // Set default selection if none exists
        if (!selectedModel && models.allModels.length > 0) {
          const defaultModel = preferences.preferredTextModel || models.textModels[0]?.modelName;
          if (defaultModel) {
            setSelectedModel(defaultModel);
          }
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Check availability for all models
  const refreshAvailability = useCallback(async () => {
    const newAvailability: typeof availability = {};
    
    for (const model of availableModels.allModels) {
      try {
        const status = await mockSmartRouter.checkModelAvailability(model.modelName);
        newAvailability[model.modelName] = {
          available: status.available,
          healthy: status.healthy,
          responseTime: status.estimatedResponseTime
        };
      } catch (error) {
        newAvailability[model.modelName] = {
          available: false,
          healthy: false
        };
      }
    }
    
    setAvailability(newAvailability);
  }, [availableModels.allModels]);

  // Auto-refresh availability every 30 seconds
  useEffect(() => {
    refreshAvailability();
    const interval = setInterval(refreshAvailability, 30000);
    return () => clearInterval(interval);
  }, [refreshAvailability]);

  const selectModel = useCallback((modelName: string) => {
    setSelectedModel(modelName);
  }, []);

  const getRecommendation = useCallback(async (content: string, images?: string[]) => {
    try {
      const result = await mockSmartRouter.routeMessage({
        content,
        images,
        userPreferences: {
          preferredTextModel: preferences.preferredTextModel,
          preferredVisionModel: preferences.preferredVisionModel
        }
      });
      return result.selectedModel;
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      return selectedModel || availableModels.textModels[0]?.modelName || '';
    }
  }, [preferences, selectedModel, availableModels]);

  const updatePreferences = useCallback((newPrefs: Partial<typeof preferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    try {
      localStorage.setItem('model-preferences', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  return {
    availableModels,
    selectedModel,
    isLoading,
    availability,
    selectModel,
    refreshAvailability,
    getRecommendation,
    preferences,
    updatePreferences
  };
}

/**
 * Hook for getting model recommendations based on content
 */
export function useModelRecommendation(): UseModelRecommendationReturn {
  const [recommendation, setRecommendation] = useState<{
    model: string;
    reason: string;
    confidence: number;
  } | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getRecommendation = useCallback(async (content: string, images?: string[]) => {
    setIsAnalyzing(true);
    
    try {
      const result = await mockSmartRouter.routeMessage({
        content,
        images,
        userPreferences: {}
      });
      
      setRecommendation({
        model: result.selectedModel,
        reason: result.routingReason,
        confidence: 0.85 // Mock confidence
      });
    } catch (error) {
      console.error('Failed to analyze content:', error);
      setRecommendation(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearRecommendation = useCallback(() => {
    setRecommendation(null);
  }, []);

  return {
    recommendation,
    isAnalyzing,
    getRecommendation,
    clearRecommendation
  };
}
