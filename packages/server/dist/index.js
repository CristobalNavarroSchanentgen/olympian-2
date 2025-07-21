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
const database_service_fix_1 = require("./services/database-service-fix");
const mcp_manager_stub_1 = require("./mcp/mcp-manager-stub");
const websocket_handler_1 = require("./websocket/websocket-handler");
const ollama_service_1 = require("./services/ollama-service");
const simple_routes_1 = require("./api/simple-routes");
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
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
async function startServer() {
    try {
        // Initialize database
        const dbService = new database_service_fix_1.DatabaseService();
        await dbService.connect();
        console.log('📊 Database connected');
        // Initialize MCP Manager
        const mcpManager = new mcp_manager_stub_1.MCPManager();
        await mcpManager.initialize();
        console.log('🔧 MCP Manager initialized');
        // Initialize Ollama service
        const ollamaService = new ollama_service_1.OllamaService();
        console.log("🦙 Ollama service initialized");
        // Setup WebSocket handling
        const wsHandler = new websocket_handler_1.WebSocketHandler(io, dbService, mcpManager, ollamaService);
        console.log('🔌 WebSocket handler initialized');
        // Setup API routes
        (0, simple_routes_1.setupRoutes)(app);
        console.log('🛣️  API routes configured');
        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map