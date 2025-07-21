import { Server as SocketIOServer } from 'socket.io';
import { DatabaseService } from '../services/database-service';
import { McpManager } from '../mcp/mcp-manager';
import { OllamaService } from '../services/ollama-service';
export declare class WebSocketHandler {
    private io;
    private dbService;
    private mcpManager;
    private ollamaService;
    constructor(io: SocketIOServer, dbService: DatabaseService, mcpManager: McpManager, ollamaService: OllamaService);
    private setupHandlers;
    private handleChatMessage;
    private handleToolExecution;
    private handleImageUpload;
    private sendSystemStatus;
}
