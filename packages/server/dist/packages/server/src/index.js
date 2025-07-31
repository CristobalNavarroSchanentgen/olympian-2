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
// Service implementations  
const database_1 = require("./database");
const conversation_service_impl_1 = require("./services/conversation-service-impl");
const message_service_impl_1 = require("./services/message-service-impl");
const artifact_service_impl_1 = require("./services/artifact-service-impl");
const mcp_service_impl_1 = require("./services/mcp-service-impl");
const model_registry_service_impl_1 = require("./services/model-registry-service-impl");
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
        console.log("📊 MongoDB connected and ready");
        // Initialize business logic services
        const conversationService = new conversation_service_impl_1.ConversationServiceImpl();
        const messageService = new message_service_impl_1.MessageServiceImpl();
        const artifactService = new artifact_service_impl_1.ArtifactServiceImpl();
        const mcpService = new mcp_service_impl_1.McpServiceImpl();
        const modelRegistryService = new model_registry_service_impl_1.ModelRegistryServiceImpl();
        console.log("💼 Business services initialized");
        // Initialize infrastructure services
        const mcpManager = new mcp_manager_stub_1.MCPManager();
        await mcpManager.initialize();
        console.log("🔧 MCP Manager initialized");
        const ollamaService = new ollama_service_1.OllamaService();
        console.log("🦙 Ollama service initialized");
        // Setup WebSocket handling
        const wsHandler = new websocket_handler_1.WebSocketHandler(io, conversationService, messageService, mcpManager, ollamaService);
        console.log("🔌 WebSocket handler initialized");
        // Setup all API routes with service injection
        const apiServices = {
            conversationService,
            messageService,
            artifactService,
            mcpService,
            modelRegistryService
        };
        (0, api_1.setupAllRoutes)(app, apiServices);
        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map