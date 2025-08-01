import { Server as SocketIOServer } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { OllamaService } from '../services/ollama-service';
import { SmartModelRouter } from "@olympian/shared/features/chat/smart-model-router";
import { ModelRegistryService } from "@olympian/shared/services/model-registry-service";
export declare class WebSocketHandler {
    private io;
    private conversationService;
    private messageService;
    private mcpManager;
    private ollamaService;
    private smartModelRouter;
    private modelRegistryService;
    constructor(io: SocketIOServer, conversationService: ConversationService, messageService: MessageService, mcpManager: MCPManager, ollamaService: OllamaService, smartModelRouter: SmartModelRouter, modelRegistryService: ModelRegistryService);
    private setupHandlers;
    private handleChatMessage;
    private handleToolExecution;
    private handleImageUpload;
    private sendSystemStatus;
    private handleModelsList;
    private handleModelRecommendation;
    private handleModelsAvailability;
    private sendStatusUpdate;
}
