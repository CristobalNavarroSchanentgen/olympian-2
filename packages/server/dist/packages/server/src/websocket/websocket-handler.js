"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
class WebSocketHandler {
    io;
    conversationService;
    messageService;
    mcpManager;
    ollamaService;
    constructor(io, conversationService, messageService, mcpManager, ollamaService) {
        this.io = io;
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.mcpManager = mcpManager;
        this.ollamaService = ollamaService;
        this.setupHandlers();
    }
    setupHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('conversation:join', (conversationId) => {
                socket.join('conversation:' + conversationId);
                this.sendSystemStatus(socket);
            });
            socket.on('conversation:leave', (conversationId) => {
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
    async handleChatMessage(socket, data) {
        try {
            const userMessage = await this.messageService.createMessage(data.conversationId, { content: data.content, role: "user" }, "user");
            this.io.to('conversation:' + data.conversationId).emit('chat:message', userMessage);
            const assistantMessage = await this.messageService.createMessage(data.conversationId, { content: "", role: "assistant" }, "assistant");
            const chatRequest = {
                model: data.model || 'llama3.2',
                messages: [{ role: 'user', content: data.content }]
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
            await this.messageService.updateMessage(assistantMessage.id, {
                content: fullResponse,
                metadata: { streaming: false, completed: true }
            });
            this.io.to('conversation:' + data.conversationId).emit('chat:complete', {
                messageId: assistantMessage.id,
                fullContent: fullResponse
            });
            await this.conversationService.updateConversation(data.conversationId, {
                metadata: { updatedAt: new Date().toISOString() }
            });
        }
        catch (error) {
            console.error('Chat message error:', error);
            socket.emit('chat:error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async handleToolExecution(socket, data) {
        try {
            const result = await this.mcpManager.executeTool(data.serverName, data.toolName, data.arguments);
            socket.emit('tool:result', result);
        }
        catch (error) {
            socket.emit('tool:error', {
                error: error instanceof Error ? error.message : 'Tool execution failed'
            });
        }
    }
    async handleImageUpload(socket, data) {
        try {
            const imageBuffer = Buffer.from(data.imageData.split(',')[1], 'base64');
            socket.emit('image:uploaded', {
                success: true,
                filename: data.filename,
                size: imageBuffer.length
            });
        }
        catch (error) {
            socket.emit('image:error', {
                error: error instanceof Error ? error.message : 'Image upload failed'
            });
        }
    }
    sendSystemStatus(socket) {
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
exports.WebSocketHandler = WebSocketHandler;
//# sourceMappingURL=websocket-handler.js.map