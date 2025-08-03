/**
 * Main API Router - Coordinates all API route modules
 * Follows AI-native architecture: minimal context, explicit contracts
 */

import { Express } from 'express';
import { setupSimpleRoutes as setupSimpleRoutes } from './simple-routes';
import { setupConversationRoutes } from './conversations';
import { setupMessageRoutes } from './messages';
import { setupArtifactRoutes } from './artifacts';
import { setupMcpRoutes } from './mcp';
import { setupOllamaRoutes } from './ollama';
import { setupTitleGenerationRoutes } from "./title-generation";
import logsRouter from './logs';

// Service interfaces (contracts only)
import { ConversationService } from '@olympian/shared/services/conversation-service';
import { MessageService } from '@olympian/shared/services/message-service';
import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { McpService } from '@olympian/shared/services/mcp-service';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { TitleGenerationService } from "@olympian/shared/services/title-generation-service";
import { StreamingService } from "@olympian/shared/services/streaming-service";
import { MemoryService } from "@olympian/shared/services/memory-service";
import { ToolService } from "@olympian/shared/services/tool-service";
import { LayoutService } from "@olympian/shared/services/layout-service";

export interface ApiServices {
  conversationService: ConversationService;
  messageService: MessageService;
  artifactService: ArtifactService;
  mcpService: McpService;
  modelRegistryService: ModelRegistryService;
  titleGenerationService: TitleGenerationService;
  streamingService: StreamingService;
  memoryService: MemoryService;
  toolService: ToolService;
  layoutService: LayoutService;
}

/**
 * Setup all API routes with dependency injection
 * Each route module receives only the services it needs
 */
export function setupAllRoutes(app: Express, services: ApiServices) {
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
