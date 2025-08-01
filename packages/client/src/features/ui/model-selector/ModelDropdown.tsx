/**
 * Model Dropdown Component
 * 
 * Dropdown selector for choosing models with availability indicators
 */

import React, { useMemo } from "react";
import { ModelDropdownProps } from "./contract";
import { useModelSelector } from "./hooks";

export function ModelDropdown({
  selectedModel,
  onModelChange,
  filterBy = "all",
  showRecommendations = false,
  showCapabilities = true,
  showAvailability = true,
  placeholder = "Select a model...",
  disabled = false
}: ModelDropdownProps) {
  const { 
    availableModels, 
    isLoading, 
    availability 
  } = useModelSelector();

  // Filter models based on filterBy prop
  const filteredModels = useMemo(() => {
    switch (filterBy) {
      case "text":
        return availableModels.textModels;
      case "vision":
        return availableModels.visionModels;
      default:
        return availableModels.allModels;
    }
  }, [availableModels, filterBy]);

  if (isLoading) {
    return (
      <div className="relative">
        <select disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100">
          <option>Loading models...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedModel || ""}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">{placeholder}</option>
        {filteredModels.map((model) => (
          <option 
            key={model.modelName} 
            value={model.modelName}
          >
            {model.modelName}
          </option>
        ))}
      </select>
      
      <div className="mt-1 text-xs text-gray-500">
        {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""} available
      </div>
    </div>
  );
}
