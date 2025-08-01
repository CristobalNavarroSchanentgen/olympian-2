/**
 * WebSocket Event Handler: Vision Model Selector
 * 
 * Handles vision-model-selected, model-selection-failed events from backend
 * Consumes VisionModelSelectorContract through WebSocket events
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../useWebSocket';
import { ModelCapabilityDefinition } from '@olympian/shared';

interface VisionModelSelectorState {
  selectedModel: string | null;
  availableModels: ModelCapabilityDefinition[];
  isLoading: boolean;
  error: string | null;
  imageDetectionEnabled: boolean;
}

export function useVisionModelSelector() {
  const socket = useWebSocket();
  const [state, setState] = useState<VisionModelSelectorState>({
    selectedModel: null,
    availableModels: [],
    isLoading: false,
    error: null,
    imageDetectionEnabled: false
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for vision model selection events
    socket.on('vision-model-selected', (data: { 
      modelName: string; 
      reason: string;
      imageDetection: boolean;
      timestamp: string;
    }) => {
      setState(prev => ({
        ...prev,
        selectedModel: data.modelName,
        imageDetectionEnabled: data.imageDetection,
        error: null
      }));
    });

    socket.on('model-selection-failed', (data: { 
      error: string; 
      modelType: 'text' | 'vision';
      attemptedModel?: string;
    }) => {
      if (data.modelType === 'vision') {
        setState(prev => ({
          ...prev,
          error: data.error,
          isLoading: false
        }));
      }
    });

    // Request available vision models on mount
    socket.emit('vision-models:request');

    socket.on('vision-models:available', (models: ModelCapabilityDefinition[]) => {
      setState(prev => ({
        ...prev,
        availableModels: models,
        isLoading: false
      }));
    });

    return () => {
      socket.off('vision-model-selected');
      socket.off('model-selection-failed');
      socket.off('vision-models:available');
    };
  }, [socket]);

  const selectModel = useCallback((modelName: string, enableImageDetection = false) => {
    if (!socket) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    socket.emit('vision-model:select', { 
      modelName, 
      imageDetection: enableImageDetection 
    });
  }, [socket]);

  const refreshModels = useCallback(() => {
    if (!socket) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    socket.emit('vision-models:request');
  }, [socket]);

  return {
    ...state,
    selectModel,
    refreshModels
  };
}
