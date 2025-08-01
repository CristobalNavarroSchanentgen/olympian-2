/**
 * Smart Model Router Feature
 * Intelligent model selection based on content analysis
 */

import { 
  ModelSelectionAdapter, 
  ContentAnalysisAdapter, 
  AvailabilityAdapter, 
  RouterEventPublisher,
  ModelSelection,
  ContentAnalysis,
  SmartModelRouterConfig 
} from './contract';

export interface SmartModelRouter {
  selectOptimalModel(content: string): Promise<string>;
  getCurrentSelection(): Promise<ModelSelection>;
  updateModelSelection(selection: ModelSelection): Promise<void>;
  analyzeAndRoute(content: string): Promise<string>;
}

export interface SmartModelRouterDependencies {
  modelSelection: ModelSelectionAdapter;
  contentAnalysis: ContentAnalysisAdapter;
  availability: AvailabilityAdapter;
  eventPublisher: RouterEventPublisher;
  config: SmartModelRouterConfig;
}

export * from './contract';
