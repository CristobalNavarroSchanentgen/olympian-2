import { Server as SocketIOServer } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { OllamaService } from '../services/ollama-service';
export declare class WebSocketHandler {
    private io;
    private conversationService;
    private messageService;
    private mcpManager;
    private ollamaService;
    constructor(io: SocketIOServer, conversationService: ConversationService, messageService: MessageService, mcpManager: MCPManager, ollamaService: OllamaService);
    private setupHandlers;
    private handleChatMessage;
    private handleToolExecution;
    private handleImageUpload;
    private sendSystemStatus;
}
