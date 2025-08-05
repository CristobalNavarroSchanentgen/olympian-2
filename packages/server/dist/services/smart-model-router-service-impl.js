/**
 * Smart Model Router Service Implementation
 * Initializes SmartModelRouter with all required dependencies
 */
// Import server-side adapters
import { ContentAnalysisAdapterImpl } from '../adapters/content-analysis-adapter';
import { ModelSelectionAdapterImpl } from '../adapters/model-selection-adapter';
import { AvailabilityAdapterImpl } from '../adapters/availability-adapter';
import { RouterEventPublisherImpl } from '../adapters/router-event-publisher';
export class SmartModelRouterService {
    contentAnalysisAdapter;
    modelSelectionAdapter;
    eventPublisher;
    constructor(modelRegistryService, ollamaService) {
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
    async selectOptimalModel(content) {
        const analysis = await this.contentAnalysisAdapter.analyzeContent(content);
        return analysis.suggestedModel;
    }
    async getCurrentSelection() {
        return await this.modelSelectionAdapter.getCurrentSelection();
    }
    async updateModelSelection(selection) {
        await this.modelSelectionAdapter.updateSelection(selection);
    }
    async analyzeAndRoute(content) {
        const optimalModel = await this.selectOptimalModel(content);
        this.eventPublisher.publishModelSwitched("previous", optimalModel);
        return optimalModel;
    }
    getRouter() {
        return this;
    }
}
//# sourceMappingURL=smart-model-router-service-impl.js.map