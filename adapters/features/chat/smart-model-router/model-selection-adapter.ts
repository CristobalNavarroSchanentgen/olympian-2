/**
 * Model Selection Adapter - Server Implementation
 */

import { ModelSelectionAdapter } from '../../../../packages/shared/features/chat/smart-model-router/contract';
import { ModelCapabilityDefinition } from '../../../../packages/shared/models/connection';

export class ModelSelectionAdapterImpl implements ModelSelectionAdapter {
  filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
    return models.filter(model => 
      model.capabilities.includes('text-generation') && 
      !(model.hasVision === true && !model.capabilities.includes('text-generation'))
    );
  }

  filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
    return models.filter(model => model.hasVision === true);
  }

  rankModelsByPreference(models: ModelCapabilityDefinition[], criteria: {
    speed?: number;
    capability?: number;
    reliability?: number;
  }): ModelCapabilityDefinition[] {
    const { speed = 0.3, capability = 0.5, reliability = 0.2 } = criteria;
    
    return models
      .map(model => {
        let score = 0;
        
        // Speed score (smaller models = faster)
        const modelSize = this.extractModelSize(model.name);
        const speedScore = modelSize > 0 ? Math.max(0, 1 - (modelSize / 20)) : 0.5;
        score += speed * speedScore;
        
        // Capability score
        let capabilityScore = 0.5;
        if (model.capabilities.includes('reasoning')) capabilityScore += 0.3;
        if (model.capabilities.includes('tools')) capabilityScore += 0.2;
        if (model.hasVision) capabilityScore += 0.1;
        score += capability * Math.min(capabilityScore, 1);
        
        // Reliability score
        let reliabilityScore = 0.7;
        if (model.name.includes('llama')) reliabilityScore = 0.9;
        if (model.name.includes('phi')) reliabilityScore = 0.8;
        if (model.name.includes('gemma')) reliabilityScore = 0.8;
        score += reliability * reliabilityScore;
        
        return { model, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.model);
  }

  extractModelSize(modelName: string): number {
    const match = modelName.match(/(\d+(?:\.\d+)?)b/i);
    return match ? parseFloat(match[1]) : 0;
  }

  // Implementation of missing contract methods
  async getCurrentSelection(): Promise<any> {
    // Return current model selection
    // For now, returning a default selection
    return {
      textModel: "llama3.2:1b",
      visionModel: "llava:latest",
      timestamp: Date.now()
    };
  }

  async updateSelection(selection: any): Promise<void> {
    // Update the current model selection
    // This would typically save to a preference store
    console.log("Model selection updated:", selection);
  }

  async validateSelection(selection: any): Promise<boolean> {
    // Validate that the selection is valid
    if (!selection.textModel || !selection.visionModel) {
      return false;
    }
    
    // Check if models exist and are available
    // For now, basic validation
    return typeof selection.textModel === "string" && 
           typeof selection.visionModel === "string" &&
           selection.timestamp > 0;
  }}
