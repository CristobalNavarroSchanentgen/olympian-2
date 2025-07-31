import { Server as SocketIOServer, Socket } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { OllamaService } from '../services/ollama-service';

export class WebSocketHandler {
  private io: SocketIOServer;
  private dbService: DatabaseService;
  private mcpManager: MCPManager;
  private ollamaService: OllamaService;

  constructor(
    io: SocketIOServer,
    dbService: DatabaseService,
    mcpManager: MCPManager,
    ollamaService: OllamaService
  ) {
    this.io = io;
    this.dbService = dbService;
    this.mcpManager = mcpManager;
    this.ollamaService = ollamaService;
    
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('conversation:join', (conversationId: string) => {
        socket.join('conversation:' + conversationId);
        this.sendSystemStatus(socket);
      });

      socket.on('conversation:leave', (conversationId: string) => {
        socket.leave('conversation:' + conversationId);
      });

      socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
      socket.on('tool:execute', (data) => this.handleToolExecution(socket, data));
      socket.on('image:upload', (data) => this.handleImageUpload(socket, data));
      socket.on('status:request', () => this.sendSystemStatus(socket));
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async handleChatMessage(socket: Socket, data: {
    conversationId: string;
    content: string;
    model?: string;
  }): Promise<void> {
    try {
      const userMessage = await this.dbService.createMessage({
        conversationId: data.conversationId,
        role: 'user',
        content: data.content,
        timestamp: new Date()
      });

      this.io.to('conversation:' + data.conversationId).emit('chat:message', userMessage);

      const assistantMessage = await this.dbService.createMessage({
        conversationId: data.conversationId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      });

      const chatRequest = {
        model: data.model || 'llama3.2',
        messages: [{ role: 'user' as const, content: data.content }]
      };

      let fullResponse = '';

      for await (const chunk of this.ollamaService.streamChat(chatRequest)) {
        if (chunk.message?.content) {
          fullResponse += chunk.message.content;
          
          socket.emit('chat:stream', {
            messageId: assistantMessage.id,
            content: chunk.message.content,
            metadata: { streaming: true }
          });
        }
      }

      await this.dbService.updateMessage(assistantMessage.id, {
        content: fullResponse,
        metadata: { streaming: false, completed: true }
      });

      this.io.to('conversation:' + data.conversationId).emit('chat:complete', {
        messageId: assistantMessage.id,
        fullContent: fullResponse
      });

      await this.dbService.updateConversation(data.conversationId, {
        updatedAt: new Date()
      });

    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('chat:error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleToolExecution(socket: Socket, data: {
    serverName: string;
    toolName: string;
    arguments: any;
  }): Promise<void> {
    try {
      const result = await this.mcpManager.executeTool(
        data.serverName,
        data.toolName,
        data.arguments
      );

      socket.emit('tool:result', result);
    } catch (error) {
      socket.emit('tool:error', {
        error: error instanceof Error ? error.message : 'Tool execution failed'
      });
    }
  }

  private async handleImageUpload(socket: Socket, data: {
    conversationId: string;
    imageData: string;
    filename: string;
  }): Promise<void> {
    try {
      const imageBuffer = Buffer.from(data.imageData.split(',')[1], 'base64');
      
      socket.emit('image:uploaded', {
        success: true,
        filename: data.filename,
        size: imageBuffer.length
      });
    } catch (error) {
      socket.emit('image:error', {
        error: error instanceof Error ? error.message : 'Image upload failed'
      });
    }
  }

  private sendSystemStatus(socket: Socket): void {
    const mcpStatus = this.mcpManager.getServerStatus();
    const tools = this.mcpManager.getAllTools();

    socket.emit('status:update', {
      mcp: {
        servers: mcpStatus,
        tools: tools.length
      },
      database: {
        connected: true
      },
      ollama: {
        connected: this.ollamaService.isConnected()
      }
    });
  }
}
