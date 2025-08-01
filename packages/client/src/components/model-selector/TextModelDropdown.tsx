/**
 * TextModelDropdown Component
 * 
 * Consumes TextModelSelectorContract through WebSocket events
 * Provides UI for selecting text-specific models
 */

import React from 'react';
import { useTextModelSelector } from '../../hooks/model-selector/useTextModelSelector';

interface TextModelDropdownProps {
  onModelChange?: (modelName: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TextModelDropdown({ 
  onModelChange, 
  disabled = false,
  className = '' 
}: TextModelDropdownProps) {
  const { 
    selectedModel, 
    availableModels, 
    isLoading, 
    error, 
    selectModel 
  } = useTextModelSelector();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const modelName = event.target.value;
    selectModel(modelName);
    onModelChange?.(modelName);
  };

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <select disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100">
          <option>Loading text models...</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedModel || ''}
        onChange={handleChange}
        disabled={disabled || isLoading}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select text model...</option>
        {availableModels.map((model) => (
          <option key={model.modelName} value={model.modelName}>
            {model.displayName || model.modelName}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="mt-1 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {selectedModel && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {selectedModel}
        </div>
      )}
    </div>
  );
}
