import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

// Service implementations  
import { getDatabaseService } from "./database";
import { ConversationServiceImpl } from "./services/conversation-service-impl";
import { MessageServiceImpl } from "./services/message-service-impl";
import { ArtifactServiceImpl } from "./services/artifact-service-impl";
import { McpServiceImpl } from "./services/mcp-service-impl";
import { ModelRegistryServiceImpl } from "./services/model-registry-service-impl";

// Model Selector Features
import { createTextModelSelector } from "../../../features/ui/text-model-selector";
import { createVisionModelSelector } from "../../../features/ui/vision-model-selector";

import { createTextModelFilterAdapter } from "../../../adapters/features/ui/text-model-selector/text-model-filter-adapter";
import { createVisionModelFilterAdapter } from "../../../adapters/features/ui/vision-model-selector/vision-model-filter-adapter";
import { createSelectionPersistenceAdapter } from "../../../adapters/features/ui/model-selector/selection-persistence-adapter";
import { createImageDetectionAdapter } from "../../../adapters/features/ui/vision-model-selector/image-detection-adapter";
// Infrastructure
import { MCPManager } from "./mcp/mcp-manager-stub";
import { WebSocketHandler } from "./websocket/websocket-handler";
import { OllamaService } from "./services/ollama-service";

// API setup
import { setupAllRoutes, ApiServices } from "./api";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000"
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

async function startServer() {
  try {
    // Initialize database
    const dbService = getDatabaseService();
    await dbService.connect();
    console.log("? Database indexes created");
    console.log("? MongoDB connected: olympian");
    console.log("? MongoDB connected and ready");

    // Initialize business logic services
    const conversationService = new ConversationServiceImpl();
    const messageService = new MessageServiceImpl();
    const artifactService = new ArtifactServiceImpl();
    const mcpService = new McpServiceImpl();
    console.log("? Business services initialized");

    // Initialize MCP Manager
    const mcpManager = new MCPManager();
    await mcpManager.initialize();
    console.log("? MCP Manager initialized");

    // Initialize Ollama service first (required by Model Registry)
    const ollamaService = new OllamaService();
    
    // Initialize model registry with Ollama service
    const modelRegistryService = new ModelRegistryServiceImpl(ollamaService);

    // Wait for initial model fetch from Ollama
    if ((modelRegistryService as any).forceRefresh) {
      console.log("⏳ Loading models from Ollama...");
      await (modelRegistryService as any).forceRefresh();
      console.log("✅ Models loaded successfully");
    }
    // Initialize WebSocket handler with all services
    const webSocketHandler = new WebSocketHandler(
      io,
      conversationService,
      messageService,
      mcpManager,
      ollamaService,
      modelRegistryService
    );
    console.log("? WebSocket handler initialized");

    // Initialize model selector adapters
    const textModelFilterAdapter = createTextModelFilterAdapter();
    const visionModelFilterAdapter = createVisionModelFilterAdapter();
    const selectionPersistenceAdapter = createSelectionPersistenceAdapter();
    const imageDetectionAdapter = createImageDetectionAdapter();

    // Initialize model selector features
    const textModelSelector = createTextModelSelector(
      modelRegistryService,
      textModelFilterAdapter,
      selectionPersistenceAdapter);

    const visionModelSelector = createVisionModelSelector(
      modelRegistryService,
      visionModelFilterAdapter,
      selectionPersistenceAdapter,
      imageDetectionAdapter);

    console.log("? All API routes configured");

    // Setup all API routes with service injection
    const apiServices: ApiServices = {
      conversationService,
      messageService,
      artifactService,
      mcpService,
      modelRegistryService
    };
    
    setupAllRoutes(app, apiServices);

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`? Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("? Failed to start server:", error);
    process.exit(1);
  }
}

startServer();