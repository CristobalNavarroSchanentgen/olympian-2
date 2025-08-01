/**
 * Smart Model Router Tests
 */

import { SmartModelRouter } from './index';
import { SmartModelRouterDependencies } from './contract';
import { ModelCapabilityDefinition } from '../../../models/connection';

// Mock dependencies for testing
const mockModelRegistryService = {
  async getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]> {
    return [
      {
        name: 'llama3.2:3b',
        capabilities: ['text-generation'],
        hasVision: false,
        description: 'Lightweight text generation'
      },
      {
        name: 'llama3.2-vision:11b',
        capabilities: ['text-generation', 'vision'],
        hasVision: true,
        description: 'Vision and text model'
      },
      {
        name: 'phi4:14b',
        capabilities: ['text-generation', 'reasoning'],
        hasVision: false,
        description: 'Advanced reasoning model'
      }
    ];
  },
  async getModelCapability() { return null; },
  async validateModelAccess() { return { allowed: true }; },
  async isRegistryMode() { return true; }
};

const mockContentAnalysisAdapter = {
  async analyzeTextComplexity(content: string) {
    return {
      complexity: content.length > 100 ? 'complex' as const : 'simple' as const,
      suggestedCapabilities: content.includes('explain') ? ['reasoning'] : []
    };
  },
  async detectImageContent(images: string[]) {
    return {
      hasImages: images.length > 0,
      requiresProcessing: images.length > 0
    };
  }
};

const mockModelSelectionAdapter = {
  filterTextModels(models: ModelCapabilityDefinition[]) {
    return models.filter(m => !m.hasVision);
  },
  filterVisionModels(models: ModelCapabilityDefinition[]) {
    return models.filter(m => m.hasVision);
  },
  rankModelsByPreference(models: ModelCapabilityDefinition[]) {
    return models.sort((a, b) => a.name.localeCompare(b.name));
  }
};

const mockAvailabilityAdapter = {
  async checkModelHealth() {
    return { available: true, healthy: true, responseTime: 500 };
  },
  async pingModel() {
    return 500;
  }
};

const mockEventPublisher = {
  publishModelRouted: () => {},
  publishRoutingFailed: () => {}
};

const mockDeps: SmartModelRouterDependencies = {
  modelRegistryService: mockModelRegistryService,
  contentAnalysisAdapter: mockContentAnalysisAdapter,
  modelSelectionAdapter: mockModelSelectionAdapter,
  availabilityAdapter: mockAvailabilityAdapter,
  eventPublisher: mockEventPublisher
};

describe('SmartModelRouter', () => {
  let router: SmartModelRouter;

  beforeEach(() => {
    router = new SmartModelRouter(mockDeps);
  });

  test('routes to vision model when images present', async () => {
    const result = await router.routeMessage({
      content: 'What do you see in this image?',
      images: ['base64-image-data']
    });

    expect(result.selectedModel).toBe('llama3.2-vision:11b');
    expect(result.routingReason).toBe('vision-required');
  });

  test('routes to text model for text-only content', async () => {
    const result = await router.routeMessage({
      content: 'Hello, how are you?'
    });

    expect(result.selectedModel).toBe('llama3.2:3b');
    expect(result.routingReason).toBe('default');
  });

  test('respects user preference for text model', async () => {
    const result = await router.routeMessage({
      content: 'Hello world',
      userPreferences: {
        preferredTextModel: 'phi4:14b'
      }
    });

    expect(result.selectedModel).toBe('phi4:14b');
    expect(result.routingReason).toBe('user-preference');
  });

  test('analyzes content complexity correctly', async () => {
    const complexResult = await router.analyzeContent({
      content: 'Please explain the complex reasoning behind quantum mechanics and provide detailed analysis'
    });

    expect(complexResult.complexity).toBe('complex');
    expect(complexResult.suggestedCapabilities).toContain('reasoning');
  });

  test('handles routing failures gracefully', async () => {
    const result = await router.handleRoutingFailure({
      failedModel: 'non-existent-model',
      originalRequest: { content: 'test' },
      error: new Error('Model not found')
    });

    expect(result.fallbackModel).toBeDefined();
    expect(result.strategy).toBeDefined();
  });
});
