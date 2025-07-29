import { ModelCapability } from '../../../../models/connection';
import { detectCapabilities } from '../../../../utils/capability-detector';

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

// Helper functions extracted from business logic
async function scanSingleModelCapability(modelName: string, endpoint: string): Promise<ModelCapability> {
  const id = 'capability_' + modelName + '_' + Date.now();
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
      id,
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
      id,
      modelName,
      capabilities: ['text'],
      contextWindow: 4096,
      supportsVision: false,
      supportsStreaming: true,
      maxTokens: 2048,
      isCustom: false,
      detectedAt: new Date(),
      confidence: 0.1,
      metadata: {
        endpoint,
        error: (error instanceof Error ? error.message : String(error)),
        detectionMethods: [],
        family: 'unknown',
        size: 'unknown'
      }
    };
  }
}

async function batchScanModels(models: string[], endpoint: string): Promise<ModelCapability[]> {
  const results: ModelCapability[] = [];
  const concurrency = 3;
  for (let i = 0; i < models.length; i += concurrency) {
    const batch = models.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(model => scanSingleModelCapability(model, endpoint))
    );
    results.push(...batchResults);
    if (i + concurrency < models.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return results;
}

async function testModelVisionCapability(modelName: string, endpoint: string): Promise<boolean> {
  try {
    const visionTest = await detectCapabilities(modelName, {
      endpoint,
      timeout: 15000,
      methods: ['vision-test'],
      testImage: true
    });
    return visionTest.vision === true;
  } catch (error) {
    const visionKeywords = ['vision', 'llava', 'gpt-4v', 'claude-3'];
    return visionKeywords.some(keyword => 
      modelName.toLowerCase().includes(keyword)
    );
  }
}

function calculateOptimalSettings(capability: ModelCapability): OptimalSettings {
  const settings: OptimalSettings = {
    contextWindow: capability.contextWindow || 4096,
    temperature: 0.7,
    maxTokens: Math.min(capability.maxTokens || 2048, (capability.contextWindow || 4096) * 0.3),
    stopSequences: [],
    streaming: capability.supportsStreaming || true
  };
  
  const familyValue = capability.metadata?.family;
  const family = (typeof familyValue === 'string') ? familyValue.toLowerCase() : '';
  
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
    settings.maxTokens = Math.min(4096, (capability.contextWindow || 4096) * 0.5);
  }
  
  const sizeValue = capability.metadata?.size;
  const size = (typeof sizeValue === 'string') ? sizeValue : '';
  if (size.includes('7b') || size.includes('small')) {
    settings.maxTokens = Math.min(settings.maxTokens, 1024);
  }
  
  if (size.includes('70b') || size.includes('large')) {
    settings.maxTokens = Math.min(settings.maxTokens, 8192);
  }
  
  if (capability.supportsVision) {
    settings.maxTokens = Math.min(settings.maxTokens, 2048);
    settings.temperature = 0.7;
  }
  
  return settings;
}

export function createCapabilityScannerAdapter(): CapabilityScannerAdapter {
  return {
    async scanModelCapabilities(modelName: string, endpoint: string) {
      return scanSingleModelCapability(modelName, endpoint);
    },

    async batchScanCapabilities(models: string[], endpoint: string) {
      return batchScanModels(models, endpoint);
    },

    async testVisionCapability(modelName: string, endpoint: string) {
      return testModelVisionCapability(modelName, endpoint);
    },

    detectOptimalSettings(capability: ModelCapability) {
      return calculateOptimalSettings(capability);
    }
  };
}
