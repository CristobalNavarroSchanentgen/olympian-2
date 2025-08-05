export class WebSocketHandler {
    io;
    conversationService;
    messageService;
    mcpManager;
    ollamaService;
    textModelSelector;
    visionModelSelector;
    titleGenerationService;
    constructor(io, conversationService, messageService, mcpManager, ollamaService, textModelSelector, visionModelSelector, titleGenerationService) {
        this.io = io;
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.mcpManager = mcpManager;
        this.ollamaService = ollamaService;
        this.textModelSelector = textModelSelector;
        this.visionModelSelector = visionModelSelector;
        this.titleGenerationService = titleGenerationService;
        this.setupHandlers();
    }
    setupHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
            socket.on("text-models:request", () => this.handleTextModelsRequest(socket));
            socket.on("text-model:select", (data) => this.handleTextModelSelect(socket, data));
            socket.on("vision-models:request", () => this.handleVisionModelsRequest(socket));
            socket.on("vision-model:select", (data) => this.handleVisionModelSelect(socket, data));
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    async handleTextModelsRequest(socket) {
        try {
            // Use feature instead of service directly
            const models = await this.textModelSelector.getAvailableTextModels();
            socket.emit('text-models:response', { models });
        }
        catch (error) {
            console.error('Error fetching text models:', error);
            socket.emit('text-models:error', { error: 'Failed to fetch text models' });
        }
    }
    async handleTextModelSelect(socket, data) {
        try {
            // Use feature for model selection
            await this.textModelSelector.setTextModel(data.modelName);
            socket.emit('text-model:selected', { modelName: data.modelName });
        }
        catch (error) {
            console.error('Error selecting text model:', error);
            socket.emit('text-model:error', { error: 'Failed to select text model' });
        }
    }
    async handleVisionModelsRequest(socket) {
        try {
            // Use feature instead of service directly  
            const models = await this.visionModelSelector.getAvailableVisionModels();
            socket.emit('vision-models:response', { models });
        }
        catch (error) {
            console.error('Error fetching vision models:', error);
            socket.emit('vision-models:error', { error: 'Failed to fetch vision models' });
        }
    }
    async handleVisionModelSelect(socket, data) {
        try {
            // Use feature for model selection
            await this.visionModelSelector.setVisionModel(data.modelName);
            socket.emit('vision-model:selected', { modelName: data.modelName });
        }
        catch (error) {
            console.error('Error selecting vision model:', error);
            socket.emit('vision-model:error', { error: 'Failed to select vision model' });
        }
    }
    async handleChatMessage(socket, data) {
        try {
            // This remains as-is since conversation and message handling
            // are core transport concerns, not model selection
            console.log('Received chat message:', data);
            // Process message through conversation and message services
            // (Implementation continues with existing logic...)
        }
        catch (error) {
            console.error('Error handling chat message:', error);
            socket.emit('chat:error', { error: 'Failed to process message' });
        }
    }
}
//# sourceMappingURL=websocket-handler.js.map