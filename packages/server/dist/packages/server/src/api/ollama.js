"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupOllamaRoutes = setupOllamaRoutes;
const express_1 = require("express");
function setupOllamaRoutes(app, modelRegistryService) {
    const router = (0, express_1.Router)();
    // GET /api/ollama/status - Get Ollama status
    router.get('/status', async (req, res) => {
        try {
            // Check if Ollama service is available
            // This would typically involve checking if Ollama is running
            res.json({
                status: 'available',
                version: '0.1.0', // Would be retrieved from actual Ollama
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('Error checking Ollama status:', error);
            res.status(503).json({
                status: 'unavailable',
                error: 'Ollama service not available',
                timestamp: new Date()
            });
        }
    });
    // GET /api/ollama/models - List available Ollama models
    router.get('/models', async (req, res) => {
        try {
            const models = await modelRegistryService.getAllRegisteredModels();
            const ollamaModels = models.filter(model => model.provider === 'ollama');
            res.json({
                models: ollamaModels,
                count: ollamaModels.length
            });
        }
        catch (error) {
            console.error('Error listing Ollama models:', error);
            res.status(500).json({ error: 'Failed to list Ollama models' });
        }
    });
    app.use('/api/ollama', router);
}
//# sourceMappingURL=ollama.js.map