import { ModelCapability } from '../../../models/connection';
import { detectCapabilities } from '../../../utils/capability-detector';

/**
 * Capability scanner adapter for model detection
 * Transforms capability detection utilities for model-detector feature
 */

export interface CapabilityScannerAdapter {
  scanModelCapabilities(modelName: string, endpoint: string): Promise<ModelCapability>;
  batchScanCapabilities(models: string[], endpoint: string): Promise<ModelCapability[]>;
  testVisionCapability(modelName: string, endpoint: string): Promise<boolean>;
  detectOptimalSettings(capability: ModelCapability): OptimalSettings;
}

export interface OptimalSettings {
  contextWindow: number;
  temperature: number;
  maxTokens: number;
  stopSequences: string[];
  streaming: boolean;
}

export function createCapabilityScannerAdapter(): CapabilityScannerAdapter {
  return {
    async scanModelCapabilities(modelName, endpoint) {
      try {
        const capabilities = await detectCapabilities(modelName, {
          endpoint,
          timeout: 30000,
          methods: [
            'model-info',
            'test-chat',
            'vision-test',
            'context-test',
            'parameter-analysis',
            'family-detection',
            'size-analysis',
            'performance-test'
          ]
        });
        
        return {
          modelName,
          capabilities: capabilities.detected,
          contextWindow: capabilities.contextWindow || 4096,
          supportsVision: capabilities.vision || false,
          supportsStreaming: capabilities.streaming !== false,
          maxTokens: capabilities.maxTokens || 2048,
          isCustom: false,
          detectedAt: new Date(),
          confidence: capabilities.confidence || 0.8,
          metadata: {
            endpoint,
            detectionMethods: capabilities.methods || [],
            family: capabilities.family || 'unknown',
            size: capabilities.size || 'unknown',
            performance: capabilities.performance || {}
          }
        };
      } catch (error) {
        return {
          modelName,
          capabilities: ['text'], // Fallback to basic text capability
          contextWindow: 4096,
          supportsVision: false,
          supportsStreaming: true,
          maxTokens: 2048,
          isCustom: false,
          detectedAt: new Date(),
          confidence: 0.1,
          metadata: {
            endpoint,
            error: error.message,
            detectionMethods: [],
            family: 'unknown',
            size: 'unknown'
          }
        };
      }
    },

    async batchScanCapabilities(models, endpoint) {
      const results: ModelCapability[] = [];
      
      // Process models in parallel but with concurrency limit
      const concurrency = 3;
      for (let i = 0; i < models.length; i += concurrency) {
        const batch = models.slice(i, i + concurrency);
        
        const batchResults = await Promise.all(
          batch.map(model => this.scanModelCapabilities(model, endpoint))
        );
        
        results.push(...batchResults);
        
        // Small delay between batches to avoid overwhelming the server
        if (i + concurrency < models.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      return results;
    },

    async testVisionCapability(modelName, endpoint) {
      try {
        const visionTest = await detectCapabilities(modelName, {
          endpoint,
          timeout: 15000,
          methods: ['vision-test'],
          testImage: true
        });
        
        return visionTest.vision === true;
      } catch (error) {
        // If vision test fails, check model name patterns
        const visionKeywords = ['vision', 'llava', 'gpt-4v', 'claude-3'];
        return visionKeywords.some(keyword => 
          modelName.toLowerCase().includes(keyword)
        );
      }
    },

    detectOptimalSettings(capability) {
      const settings: OptimalSettings = {
        contextWindow: capability.contextWindow,
        temperature: 0.7,
        maxTokens: Math.min(capability.maxTokens, capability.contextWindow * 0.3),
        stopSequences: [],
        streaming: capability.supportsStreaming
      };
      
      // Adjust settings based on model family
      const family = capability.metadata?.family?.toLowerCase() || '';
      
      if (family.includes('llama')) {
        settings.temperature = 0.8;
        settings.stopSequences = ['### Human:', '### Assistant:'];
      }
      
      if (family.includes('mistral')) {
        settings.temperature = 0.7;
        settings.stopSequences = ['[INST]', '[/INST]'];
      }
      
      if (family.includes('claude')) {
        settings.temperature = 0.9;
        settings.maxTokens = Math.min(4096, capability.contextWindow * 0.5);
      }
      
      // Adjust for model size
      const size = capability.metadata?.size || '';
      if (size.includes('7b') || size.includes('small')) {
        settings.maxTokens = Math.min(settings.maxTokens, 1024);
      }
      
      if (size.includes('70b') || size.includes('large')) {
        settings.maxTokens = Math.min(settings.maxTokens, 8192);
      }
      
      // Vision models need different settings
      if (capability.supportsVision) {
        settings.maxTokens = Math.min(settings.maxTokens, 2048);
        settings.temperature = 0.7; // More consistent for vision tasks
      }
      
      return settings;
    }
  };
}
