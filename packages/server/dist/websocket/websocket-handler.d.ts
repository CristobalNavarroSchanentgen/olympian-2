import { Server as SocketIOServer } from 'socket.io';
import { DatabaseService } from '../services/database-service-fix';
import { MCPManager } from '../mcp/mcp-manager-stub';
import { OllamaService } from '../services/ollama-service';
export declare class WebSocketHandler {
    private io;
    private dbService;
    private mcpManager;
    private ollamaService;
    constructor(io: SocketIOServer, dbService: DatabaseService, mcpManager: MCPManager, ollamaService: OllamaService);
    private setupHandlers;
    private handleChatMessage;
    private handleToolExecution;
    private handleImageUpload;
    private sendSystemStatus;
}
