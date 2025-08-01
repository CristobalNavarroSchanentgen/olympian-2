/**
 * Model Recommendation Component
 * 
 * Shows smart model recommendations based on content analysis
 */

import React, { useEffect } from "react";
import { ModelRecommendationProps } from "./contract";
import { useModelRecommendation } from "./hooks";

export function ModelRecommendation({
  content,
  images,
  onRecommendationAccept,
  showReason = true
}: ModelRecommendationProps) {
  const { 
    recommendation, 
    isAnalyzing, 
    getRecommendation, 
    clearRecommendation 
  } = useModelRecommendation();

  // Get recommendation when content changes
  useEffect(() => {
    if (content.length > 10) { // Only analyze substantial content
      getRecommendation(content, images);
    } else {
      clearRecommendation();
    }
  }, [content, images, getRecommendation, clearRecommendation]);

  if (!content || content.length <= 10) {
    return null;
  }

  if (isAnalyzing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="text-sm text-blue-700">Analyzing content for best model...</span>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const getReasonText = (reason: string) => {
    switch (reason) {
      case "vision-required":
        return "Images detected - vision model recommended";
      case "user-preference":
        return "Based on your preferences";
      case "capability-match":
        return "Best match for content complexity";
      default:
        return "Recommended for this content";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-700 bg-green-50 border-green-200";
    if (confidence >= 0.6) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  return (
    <div className={`border rounded-md p-3 mb-4 ${getConfidenceColor(recommendation.confidence)}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">💡 Recommended:</span>
            <span className="text-sm font-semibold">{recommendation.model}</span>
            <span className="text-xs">({Math.round(recommendation.confidence * 100)}% match)</span>
          </div>
          {showReason && (
            <div className="text-xs mt-1 opacity-75">
              {getReasonText(recommendation.reason)}
            </div>
          )}
        </div>
        <button
          onClick={() => onRecommendationAccept(recommendation.model)}
          className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Use Model
        </button>
      </div>
    </div>
  );
}
