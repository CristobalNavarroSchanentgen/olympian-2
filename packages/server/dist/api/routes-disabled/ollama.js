"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaRoutes = ollamaRoutes;
const express_1 = require("express");
const ollama_service_1 = require("../../services/ollama-service");
function ollamaRoutes() {
    const router = (0, express_1.Router)();
    const ollamaService = new ollama_service_1.OllamaService();
    // Get Ollama connection status
    router.get('/status', (req, res) => {
        res.json({
            connected: ollamaService.isConnected(),
            baseUrl: ollamaService.getBaseUrl()
        });
    });
    // List available models
    router.get('/models', async (req, res) => {
        try {
            const models = await ollamaService.getModels();
            res.json(models);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get models'
            });
        }
    });
    // Get model info
    router.get('/models/:name', async (req, res) => {
        try {
            const info = await ollamaService.getModelInfo(req.params.name);
            res.json(info);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get model info'
            });
        }
    });
    // Pull a model
    router.post('/models/:name/pull', async (req, res) => {
        try {
            await ollamaService.pullModel(req.params.name);
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to pull model'
            });
        }
    });
    // Check if model exists
    router.get('/models/:name/check', async (req, res) => {
        try {
            const exists = await ollamaService.checkModel(req.params.name);
            res.json({ exists });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to check model'
            });
        }
    });
    return router;
}
//# sourceMappingURL=ollama.js.map