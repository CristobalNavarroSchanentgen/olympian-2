/**
 * Main API Router - Coordinates all API route modules
 * Follows AI-native architecture: minimal context, explicit contracts
 */
import { Express } from 'express';
import { ConversationService } from '@olympian/shared/services/conversation-service';
import { MessageService } from '@olympian/shared/services/message-service';
import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { McpService } from '@olympian/shared/services/mcp-service';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { TitleGenerationService } from "@olympian/shared/services/title-generation-service";
export interface ApiServices {
    conversationService: ConversationService;
    messageService: MessageService;
    artifactService: ArtifactService;
    mcpService: McpService;
    modelRegistryService: ModelRegistryService;
    titleGenerationService: TitleGenerationService;
}
/**
 * Setup all API routes with dependency injection
 * Each route module receives only the services it needs
 */
export declare function setupAllRoutes(app: Express, services: ApiServices): void;
