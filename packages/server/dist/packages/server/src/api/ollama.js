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
            // This would typically involve checking if Ollama is running on baseUrl
            const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
            // TODO: Add actual health check to Ollama service
            const connected = true; // Would be result of actual health check
            res.json({
                connected,
                baseUrl,
                version: '0.1.0', // Would be retrieved from actual Ollama
                lastChecked: new Date()
            });
        }
        catch (error) {
            console.error('Error checking Ollama status:', error);
            res.status(503).json({
                connected: false,
                baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
                error: 'Ollama service not available'
            });
        }
    });
    // GET /api/ollama/models - List available Ollama models
    router.get('/models', async (req, res) => {
        try {
            const models = await modelRegistryService.getAllRegisteredModels();
            const ollamaModels = models.filter(model => model.provider === 'ollama');
            // Transform to match contract ModelInfo format
            const formattedModels = ollamaModels.map(model => ({
                name: model.name,
                modified_at: model.lastUpdated || new Date().toISOString(),
                size: parseInt(model.size || '0'),
                digest: model.id || '',
                details: {
                    format: model.format || 'unknown',
                    family: model.family || 'unknown',
                    parameter_size: model.parameterCount || 'unknown',
                    quantization_level: model.quantization || 'unknown'
                }
            }));
            res.json({
                models: formattedModels,
                count: formattedModels.length
            });
        }
        catch (error) {
            console.error('Error listing Ollama models:', error);
            res.status(500).json({
                models: [],
                count: 0,
                error: 'Failed to list Ollama models'
            });
        }
    });
    app.use('/api/ollama', router);
}
//# sourceMappingURL=ollama.js.map