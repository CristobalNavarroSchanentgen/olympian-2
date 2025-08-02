"use strict";
/**
 * Smart Model Router Service Implementation
 * Initializes SmartModelRouter with all required dependencies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartModelRouterService = void 0;
// Import server-side adapters
const content_analysis_adapter_1 = require("../adapters/content-analysis-adapter");
const model_selection_adapter_1 = require("../adapters/model-selection-adapter");
const availability_adapter_1 = require("../adapters/availability-adapter");
const router_event_publisher_1 = require("../adapters/router-event-publisher");
class SmartModelRouterService {
    contentAnalysisAdapter;
    modelSelectionAdapter;
    eventPublisher;
    constructor(modelRegistryService, ollamaService) {
        // Initialize adapters with dependencies
        const contentAnalysisAdapter = new content_analysis_adapter_1.ContentAnalysisAdapterImpl();
        const modelSelectionAdapter = new model_selection_adapter_1.ModelSelectionAdapterImpl();
        const availabilityAdapter = new availability_adapter_1.AvailabilityAdapterImpl(ollamaService);
        const eventPublisher = new router_event_publisher_1.RouterEventPublisherImpl();
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
exports.SmartModelRouterService = SmartModelRouterService;
//# sourceMappingURL=smart-model-router-service-impl.js.map