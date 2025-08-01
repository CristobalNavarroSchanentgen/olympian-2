/**
 * VisionModelDropdown Component
 * 
 * Consumes VisionModelSelectorContract through WebSocket events
 * Provides UI for selecting vision-capable models with image detection toggle
 */

import React from 'react';
import { useVisionModelSelector } from '../../hooks/model-selector/useVisionModelSelector';

interface VisionModelDropdownProps {
  onModelChange?: (modelName: string, enableImageDetection: boolean) => void;
  disabled?: boolean;
  className?: string;
  showImageDetectionToggle?: boolean;
}

export function VisionModelDropdown({ 
  onModelChange, 
  disabled = false,
  className = '',
  showImageDetectionToggle = true
}: VisionModelDropdownProps) {
  const { 
    selectedModel, 
    availableModels, 
    isLoading, 
    error, 
    imageDetectionEnabled,
    selectModel 
  } = useVisionModelSelector();

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const modelName = event.target.value;
    selectModel(modelName, imageDetectionEnabled);
    onModelChange?.(modelName, imageDetectionEnabled);
  };

  const handleImageDetectionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    if (selectedModel) {
      selectModel(selectedModel, enabled);
      onModelChange?.(selectedModel, enabled);
    }
  };

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <select disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100">
          <option>Loading vision models...</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedModel || ''}
        onChange={handleModelChange}
        disabled={disabled || isLoading}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select vision model...</option>
        {availableModels.map((model) => (
          <option key={model.modelName} value={model.modelName}>
            {model.displayName || model.modelName}
            {model.capabilities?.vision && ' 👁️'}
          </option>
        ))}
      </select>
      
      {showImageDetectionToggle && selectedModel && (
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="image-detection"
            checked={imageDetectionEnabled}
            onChange={handleImageDetectionToggle}
            disabled={disabled}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="image-detection" className="ml-2 text-sm text-gray-700">
            Enable automatic image detection
          </label>
        </div>
      )}
      
      {error && (
        <div className="mt-1 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {selectedModel && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {selectedModel}
          {imageDetectionEnabled && ' (Auto-detect images)'}
        </div>
      )}
    </div>
  );
}
