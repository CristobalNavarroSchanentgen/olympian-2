/**
 * Smart Model Router Service Implementation
 * Initializes SmartModelRouter with all required dependencies
 */

import { SmartModelRouter } from '@olympian/shared/features/chat/smart-model-router';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { OllamaService } from './ollama-service';

// Import server-side adapters
import { ContentAnalysisAdapterImpl } from '../adapters/content-analysis-adapter';
import { ModelSelectionAdapterImpl } from '../adapters/model-selection-adapter';
import { AvailabilityAdapterImpl } from '../adapters/availability-adapter';
import { RouterEventPublisherImpl } from '../adapters/router-event-publisher';

export class SmartModelRouterService {
  private smartModelRouter: SmartModelRouter;

  constructor(
    modelRegistryService: ModelRegistryService,
    ollamaService: OllamaService
  ) {
    // Initialize adapters with dependencies
    const contentAnalysisAdapter = new ContentAnalysisAdapterImpl();
    const modelSelectionAdapter = new ModelSelectionAdapterImpl();
    const availabilityAdapter = new AvailabilityAdapterImpl(ollamaService);
    const eventPublisher = new RouterEventPublisherImpl();

    // Create SmartModelRouter with all dependencies
    this.smartModelRouter = new SmartModelRouter({
      modelRegistryService,
      contentAnalysisAdapter,
      modelSelectionAdapter,
      availabilityAdapter,
      eventPublisher
    });

    console.log('🧠 Smart Model Router initialized with all adapters');
  }

  getRouter(): SmartModelRouter {
    return this.smartModelRouter;
  }
}
