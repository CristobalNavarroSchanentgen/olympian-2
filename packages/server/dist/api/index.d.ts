/**
 * Main API Router - Coordinates all API route modules
 * Follows AI-native architecture: minimal context, explicit contracts
 */
import { Express } from 'express';
import { ConversationService } from '../../../shared/services/conversation-service';
import { MessageService } from '../../../shared/services/message-service';
import { ArtifactService } from '../../../shared/services/artifact-service';
import { McpService } from '../../../shared/services/mcp-service';
import { ModelRegistryService } from '../../../shared/services/model-registry-service';
export interface ApiServices {
    conversationService: ConversationService;
    messageService: MessageService;
    artifactService: ArtifactService;
    mcpService: McpService;
    modelRegistryService: ModelRegistryService;
}
/**
 * Setup all API routes with dependency injection
 * Each route module receives only the services it needs
 */
export declare function setupAllRoutes(app: Express, services: ApiServices): void;
