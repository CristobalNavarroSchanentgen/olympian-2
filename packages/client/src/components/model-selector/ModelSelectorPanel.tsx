/**
 * ModelSelectorPanel Component
 * 
 * Combines TextModelDropdown and VisionModelDropdown into a unified panel
 * Provides comprehensive model selection interface
 */

import React from 'react';
import { TextModelDropdown } from './TextModelDropdown';
import { VisionModelDropdown } from './VisionModelDropdown';

interface ModelSelectorPanelProps {
  onTextModelChange?: (modelName: string) => void;
  onVisionModelChange?: (modelName: string, enableImageDetection: boolean) => void;
  disabled?: boolean;
  className?: string;
  showVisionSelector?: boolean;
  showTextSelector?: boolean;
}

export function ModelSelectorPanel({
  onTextModelChange,
  onVisionModelChange,
  disabled = false,
  className = '',
  showVisionSelector = true,
  showTextSelector = true
}: ModelSelectorPanelProps) {
  
  return (
    <div className={`space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-medium text-gray-900">Model Selection</h3>
        <p className="text-sm text-gray-500">Choose models for different types of content</p>
      </div>
      
      {showTextSelector && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Model
          </label>
          <TextModelDropdown 
            onModelChange={onTextModelChange}
            disabled={disabled}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            For text-only conversations and analysis
          </p>
        </div>
      )}
      
      {showVisionSelector && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vision Model
          </label>
          <VisionModelDropdown 
            onModelChange={onVisionModelChange}
            disabled={disabled}
            className="w-full"
            showImageDetectionToggle={true}
          />
          <p className="mt-1 text-xs text-gray-500">
            For conversations involving images and visual content
          </p>
        </div>
      )}
      
      {!showTextSelector && !showVisionSelector && (
        <div className="text-center py-8 text-gray-500">
          No model selectors enabled
        </div>
      )}
    </div>
  );
}
