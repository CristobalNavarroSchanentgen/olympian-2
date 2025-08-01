/**
 * Integrated Model Selector Component
 * 
 * Combines model dropdown with intelligent recommendations
 */

import React from "react";
import { ModelDropdown, ModelRecommendation } from "../features/ui/model-selector";
import { useChatStore } from "../stores/chat-store";

interface ModelSelectorProps {
  className?: string;
}

export function ModelSelector({ className = "" }: ModelSelectorProps) {
  const { 
    selectedModel, 
    inputValue, 
    selectedImages,
    setSelectedModel,
    clearModelRecommendation 
  } = useChatStore();

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    clearModelRecommendation(); // Clear recommendation when manually selecting
  };

  const handleRecommendationAccept = (modelName: string) => {
    setSelectedModel(modelName);
    clearModelRecommendation();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Smart Recommendation */}
      {inputValue && (
        <ModelRecommendation
          content={inputValue}
          images={selectedImages}
          onRecommendationAccept={handleRecommendationAccept}
          showReason={true}
        />
      )}
      
      {/* Model Selection Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Model Selection
        </label>
        <ModelDropdown
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          filterBy="all"
          showCapabilities={true}
          showAvailability={true}
          placeholder="Choose a model..."
        />
      </div>
      
      {/* Quick Filter Buttons */}
      <div className="flex space-x-2">
        <ModelDropdown
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          filterBy="text"
          placeholder="Text models..."
        />
        <ModelDropdown
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          filterBy="vision"
          placeholder="Vision models..."
        />
      </div>
    </div>
  );
}
