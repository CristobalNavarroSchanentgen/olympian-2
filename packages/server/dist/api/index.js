/**
 * Main API Router - Coordinates all API route modules
 * Follows AI-native architecture: minimal context, explicit contracts
 */
import { setupSimpleRoutes as setupSimpleRoutes } from './simple-routes';
import { setupConversationRoutes } from './conversations';
import { setupMessageRoutes } from './messages';
import { setupArtifactRoutes } from './artifacts';
import { setupMcpRoutes } from './mcp';
import { setupOllamaRoutes } from './ollama';
import { setupTitleGenerationRoutes } from "./title-generation";
import logsRouter from './logs';
/**
 * Setup all API routes with dependency injection
 * Each route module receives only the services it needs
 */
export function setupAllRoutes(app, services) {
    // Basic health/status routes
    setupSimpleRoutes(app, services.modelRegistryService);
    // Core feature routes
    setupConversationRoutes(app, services.conversationService);
    setupMessageRoutes(app, services.messageService);
    setupArtifactRoutes(app, services.artifactService);
    // Integration routes
    setupMcpRoutes(app, services.mcpService);
    setupOllamaRoutes(app, services.modelRegistryService);
    setupTitleGenerationRoutes(app, services.titleGenerationService);
    // Observability routes
    app.use('/api/logs', logsRouter);
    console.log('✅ All API routes configured');
}
//# sourceMappingURL=index.js.map