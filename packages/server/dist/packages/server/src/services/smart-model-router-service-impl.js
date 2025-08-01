"use strict";
/**
 * Smart Model Router Service Implementation
 * Initializes SmartModelRouter with all required dependencies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartModelRouterService = void 0;
const smart_model_router_1 = require("@olympian/shared/features/chat/smart-model-router");
// Import server-side adapters
const content_analysis_adapter_1 = require("../adapters/content-analysis-adapter");
const model_selection_adapter_1 = require("../adapters/model-selection-adapter");
const availability_adapter_1 = require("../adapters/availability-adapter");
const router_event_publisher_1 = require("../adapters/router-event-publisher");
class SmartModelRouterService {
    smartModelRouter;
    constructor(modelRegistryService, ollamaService) {
        // Initialize adapters with dependencies
        const contentAnalysisAdapter = new content_analysis_adapter_1.ContentAnalysisAdapterImpl();
        const modelSelectionAdapter = new model_selection_adapter_1.ModelSelectionAdapterImpl();
        const availabilityAdapter = new availability_adapter_1.AvailabilityAdapterImpl(ollamaService);
        const eventPublisher = new router_event_publisher_1.RouterEventPublisherImpl();
        // Create SmartModelRouter with all dependencies
        this.smartModelRouter = new smart_model_router_1.SmartModelRouter({
            modelRegistryService,
            contentAnalysisAdapter,
            modelSelectionAdapter,
            availabilityAdapter,
            eventPublisher
        });
        console.log('🧠 Smart Model Router initialized with all adapters');
    }
    getRouter() {
        return this.smartModelRouter;
    }
}
exports.SmartModelRouterService = SmartModelRouterService;
//# sourceMappingURL=smart-model-router-service-impl.js.map