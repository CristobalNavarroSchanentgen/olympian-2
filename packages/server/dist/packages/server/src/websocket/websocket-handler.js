"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
class WebSocketHandler {
    io;
    conversationService;
    messageService;
    mcpManager;
    ollamaService;
    modelRegistryService;
    constructor(io, conversationService, messageService, mcpManager, ollamaService, modelRegistryService) {
        this.io = io;
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.mcpManager = mcpManager;
        this.ollamaService = ollamaService;
        this.modelRegistryService = modelRegistryService;
        this.setupHandlers();
    }
    setupHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    async handleChatMessage(socket, data) {
        try {
            const userMessage = await this.messageService.createMessage(data.conversationId, { content: data.content, role: "user" }, "user");
            socket.emit('chat:message', userMessage);
            socket.emit('chat:response', { content: 'Hello from simplified server!' });
        }
        catch (error) {
            socket.emit('chat:error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.WebSocketHandler = WebSocketHandler;
//# sourceMappingURL=websocket-handler.js.map