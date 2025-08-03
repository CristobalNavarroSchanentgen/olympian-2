"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
console.log("🔧 Loading modified index.ts with registry logic");
// Service implementations  
const database_1 = require("./database");
const conversation_service_impl_1 = require("./services/conversation-service-impl");
const message_service_impl_1 = require("./services/message-service-impl");
const artifact_service_impl_1 = require("./services/artifact-service-impl");
const mcp_service_impl_1 = require("./services/mcp-service-impl");
const model_registry_service_impl_1 = require("./services/model-registry-service-impl");
const title_generation_service_impl_1 = require("./services/title-generation-service-impl");
// Registry-aware model service imports
const model_registry_1 = require("../../../packages/shared/features/connection/model-registry");
const registry_loader_adapter_1 = require("../../../packages/shared/adapters/features/connection/model-registry/registry-loader-adapter");
// Model Selector Features
const text_model_selector_1 = require("../../../features/ui/text-model-selector");
const vision_model_selector_1 = require("../../../features/ui/vision-model-selector");
const text_model_filter_adapter_1 = require("../../../adapters/features/ui/text-model-selector/text-model-filter-adapter");
const vision_model_filter_adapter_1 = require("../../../adapters/features/ui/vision-model-selector/vision-model-filter-adapter");
const selection_persistence_adapter_1 = require("../../../adapters/features/ui/model-selector/selection-persistence-adapter");
const image_detection_adapter_1 = require("../../../adapters/features/ui/vision-model-selector/image-detection-adapter");
// Infrastructure
const mcp_manager_stub_1 = require("./mcp/mcp-manager-stub");
const websocket_handler_1 = require("./websocket/websocket-handler");
const ollama_service_1 = require("./services/ollama-service");
// API setup
const api_1 = require("./api");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000"
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
async function startServer() {
    try {
        // Initialize database
        const dbService = (0, database_1.getDatabaseService)();
        await dbService.connect();
        console.log("📊 Database indexes created");
        console.log("✅ MongoDB connected: olympian");
        console.log("📊 MongoDB connected and ready");
        // Initialize business logic services
        const conversationService = new conversation_service_impl_1.ConversationServiceImpl();
        const messageService = new message_service_impl_1.MessageServiceImpl();
        const artifactService = new artifact_service_impl_1.ArtifactServiceImpl();
        const mcpService = new mcp_service_impl_1.McpServiceImpl();
        const titleGenerationService = new title_generation_service_impl_1.TitleGenerationServiceImpl();
        console.log("💼 Business services initialized");
        // Initialize MCP Manager
        const mcpManager = new mcp_manager_stub_1.MCPManager();
        await mcpManager.initialize();
        console.log("🔧 MCP Manager initialized");
        // Initialize Ollama service first (required by Model Registry)
        const ollamaService = new ollama_service_1.OllamaService();
        // Initialize model registry based on AUTO_SCAN_MODELS setting
        const useRegistry = process.env.AUTO_SCAN_MODELS === 'false';
        let modelRegistryService;
        if (useRegistry) {
            console.log("📋 Using predefined model registry (AUTO_SCAN_MODELS=false)");
            const registryAdapter = (0, registry_loader_adapter_1.createRegistryLoaderAdapter)();
            const registryManager = (0, model_registry_1.createModelRegistryManager)({
                registryAdapter,
                config: { mode: 'registry' }
            });
            // Wrap in service interface
            modelRegistryService = {
                async getModelCapability(modelName) {
                    return await registryManager.getModelCapability(modelName);
                },
                async getAllModels() {
                    return await registryManager.getAllModels();
                },
                async getAllRegisteredModels() {
                    return await registryManager.getAllModels();
                },
                async validateModelAccess(modelName) {
                    return await registryManager.validateModelAccess(modelName);
                },
                async isRegistryMode() {
                    return true;
                }
            };
            const registryModels = await modelRegistryService.getAllModels();
            console.log('📋 Loaded ' + registryModels.length + ' models from predefined registry:');
            registryModels.forEach(model => {
                console.log('   • ' + model.modelName + ' (' + model.capabilities.join(', ') + ')');
            });
        }
        else {
            console.log("🔍 Using auto-scan mode (AUTO_SCAN_MODELS=true)");
            modelRegistryService = new model_registry_service_impl_1.ModelRegistryServiceImpl(ollamaService);
            // Wait for initial model fetch from Ollama
            if (modelRegistryService.forceRefresh) {
                console.log("⏳ Loading models from Ollama...");
                await modelRegistryService.forceRefresh();
                console.log("✅ Models loaded successfully");
            }
        }
        // Initialize WebSocket handler with all services
        const webSocketHandler = new websocket_handler_1.WebSocketHandler(io, conversationService, messageService, mcpManager, ollamaService, modelRegistryService, titleGenerationService);
        console.log("🔌 WebSocket handler initialized");
        // Initialize model selector adapters
        const textModelFilterAdapter = (0, text_model_filter_adapter_1.createTextModelFilterAdapter)();
        const visionModelFilterAdapter = (0, vision_model_filter_adapter_1.createVisionModelFilterAdapter)();
        const selectionPersistenceAdapter = (0, selection_persistence_adapter_1.createSelectionPersistenceAdapter)();
        const imageDetectionAdapter = (0, image_detection_adapter_1.createImageDetectionAdapter)();
        // Initialize model selector features
        const textModelSelector = (0, text_model_selector_1.createTextModelSelector)(textModelFilterAdapter, modelRegistryService, selectionPersistenceAdapter);
        const visionModelSelector = (0, vision_model_selector_1.createVisionModelSelector)(modelRegistryService, visionModelFilterAdapter, selectionPersistenceAdapter, imageDetectionAdapter);
        console.log("🎯 All API routes configured");
        // Setup all API routes with service injection
        const apiServices = {
            conversationService,
            messageService,
            artifactService,
            mcpService,
            modelRegistryService,
            titleGenerationService
        };
        (0, api_1.setupAllRoutes)(app, apiServices);
        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log('🚀 Server running on port ' + PORT);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map