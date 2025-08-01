/**
 * WebSocket Event Handler: Text Model Selector
 * 
 * Handles text-model-selected, text-model-failed events from backend
 * Consumes TextModelSelectorContract through WebSocket events
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../useWebSocket';
import { ModelCapabilityDefinition } from '@olympian/shared';

interface TextModelSelectorState {
  selectedModel: string | null;
  availableModels: ModelCapabilityDefinition[];
  isLoading: boolean;
  error: string | null;
}

export function useTextModelSelector() {
  const socket = useWebSocket();
  const [state, setState] = useState<TextModelSelectorState>({
    selectedModel: null,
    availableModels: [],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for text model selection events
    socket.on('text-model-selected', (data: { 
      modelName: string; 
      reason: string;
      timestamp: string;
    }) => {
      setState(prev => ({
        ...prev,
        selectedModel: data.modelName,
        error: null
      }));
    });

    socket.on('model-selection-failed', (data: { 
      error: string; 
      modelType: 'text' | 'vision';
      attemptedModel?: string;
    }) => {
      if (data.modelType === 'text') {
        setState(prev => ({
          ...prev,
          error: data.error,
          isLoading: false
        }));
      }
    });

    // Request available text models on mount
    socket.emit('text-models:request');

    socket.on('text-models:available', (models: ModelCapabilityDefinition[]) => {
      setState(prev => ({
        ...prev,
        availableModels: models,
        isLoading: false
      }));
    });

    return () => {
      socket.off('text-model-selected');
      socket.off('model-selection-failed');
      socket.off('text-models:available');
    };
  }, [socket]);

  const selectModel = useCallback((modelName: string) => {
    if (!socket) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    socket.emit('text-model:select', { modelName });
  }, [socket]);

  const refreshModels = useCallback(() => {
    if (!socket) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    socket.emit('text-models:request');
  }, [socket]);

  return {
    ...state,
    selectModel,
    refreshModels
  };
}
