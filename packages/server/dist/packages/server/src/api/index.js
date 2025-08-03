"use strict";
/**
 * Main API Router - Coordinates all API route modules
 * Follows AI-native architecture: minimal context, explicit contracts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAllRoutes = setupAllRoutes;
const simple_routes_1 = require("./simple-routes");
const conversations_1 = require("./conversations");
const messages_1 = require("./messages");
const artifacts_1 = require("./artifacts");
const mcp_1 = require("./mcp");
const ollama_1 = require("./ollama");
const title_generation_1 = require("./title-generation");
const logs_1 = __importDefault(require("./logs"));
/**
 * Setup all API routes with dependency injection
 * Each route module receives only the services it needs
 */
function setupAllRoutes(app, services) {
    // Basic health/status routes
    (0, simple_routes_1.setupSimpleRoutes)(app, services.modelRegistryService);
    // Core feature routes
    (0, conversations_1.setupConversationRoutes)(app, services.conversationService);
    (0, messages_1.setupMessageRoutes)(app, services.messageService);
    (0, artifacts_1.setupArtifactRoutes)(app, services.artifactService);
    // Integration routes
    (0, mcp_1.setupMcpRoutes)(app, services.mcpService);
    (0, ollama_1.setupOllamaRoutes)(app, services.modelRegistryService);
    (0, title_generation_1.setupTitleGenerationRoutes)(app, services.titleGenerationService);
    // Observability routes
    app.use('/api/logs', logs_1.default);
    console.log('✅ All API routes configured');
}
//# sourceMappingURL=index.js.map