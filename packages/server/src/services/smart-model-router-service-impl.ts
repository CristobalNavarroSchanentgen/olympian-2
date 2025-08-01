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

export class SmartModelRouterService implements SmartModelRouter {
  private contentAnalysisAdapter: any;
  private modelSelectionAdapter: any;
  private eventPublisher: any;

  constructor(
    modelRegistryService: ModelRegistryService,
    ollamaService: OllamaService
  ) {
    // Initialize adapters with dependencies
    const contentAnalysisAdapter = new ContentAnalysisAdapterImpl();
    const modelSelectionAdapter = new ModelSelectionAdapterImpl();
    const availabilityAdapter = new AvailabilityAdapterImpl(ollamaService);
    const eventPublisher = new RouterEventPublisherImpl();

    // Store adapters as instance properties
    this.contentAnalysisAdapter = contentAnalysisAdapter;
    this.modelSelectionAdapter = modelSelectionAdapter;
    this.eventPublisher = eventPublisher;
    // Create SmartModelRouter with all dependencies

    console.log("🧠 Smart Model Router initialized with all adapters");
  }

  // SmartModelRouter interface implementation
  async selectOptimalModel(content: string): Promise<string> {
    const analysis = await this.contentAnalysisAdapter.analyzeContent(content);
    return analysis.suggestedModel;
  }

  async getCurrentSelection(): Promise<any> {
    return await this.modelSelectionAdapter.getCurrentSelection();
  }

  async updateModelSelection(selection: any): Promise<void> {
    await this.modelSelectionAdapter.updateSelection(selection);
  }

  async analyzeAndRoute(content: string): Promise<string> {
    const optimalModel = await this.selectOptimalModel(content);
    this.eventPublisher.publishModelSwitched("previous", optimalModel);
    return optimalModel;
  }  getRouter(): SmartModelRouter {
    return this;
  }
}
