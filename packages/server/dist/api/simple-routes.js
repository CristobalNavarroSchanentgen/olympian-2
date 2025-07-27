"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const express_1 = require("express");
const model_registry_helper_1 = require("@olympian/shared/utils/model-registry-helper");
const model_registry_1 = require("@olympian/shared/features/connection/model-registry");
const registry_loader_adapter_1 = require("@olympian/shared/adapters/features/connection/model-registry/registry-loader-adapter");
function setupRoutes(app) {
    const router = (0, express_1.Router)();
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date() });
    });
    router.get('/status', (req, res) => {
        res.json({
            database: true,
            mcp: {},
            ollama: true,
            timestamp: new Date()
        });
    });
    // Model registry routes
    router.get('/models', async (req, res) => {
        try {
            const isRegistryMode = (0, model_registry_helper_1.isRegistryModeEnabled)();
            if (isRegistryMode) {
                const models = (0, model_registry_helper_1.getFormattedModelList)();
                const grouped = (0, model_registry_helper_1.getModelsByCapabilityGroup)();
                res.json({
                    mode: 'registry',
                    models,
                    grouped,
                    total: models.length
                });
            }
            else {
                res.json({
                    mode: 'auto-scan',
                    message: 'Use /api/ollama/models endpoint for dynamic model detection',
                    models: []
                });
            }
        }
        catch (error) {
            console.error('Error fetching models:', error);
            res.status(500).json({ error: 'Failed to fetch models' });
        }
    });
    router.get('/models/validate/:modelName', async (req, res) => {
        try {
            const { modelName } = req.params;
            const registryAdapter = (0, registry_loader_adapter_1.createRegistryLoaderAdapter)();
            const config = { mode: ((0, model_registry_helper_1.isRegistryModeEnabled)() ? "registry" : "auto-scan") };
            const registry = (0, model_registry_1.createModelRegistryManager)({ registryAdapter, config });
            const validation = await registry.validateModelAccess(modelName);
            res.json(validation);
        }
        catch (error) {
            console.error('Error validating model:', error);
            res.status(500).json({ error: 'Failed to validate model' });
        }
    });
    router.get('/models/capabilities/:modelName', async (req, res) => {
        try {
            const { modelName } = req.params;
            const registryAdapter = (0, registry_loader_adapter_1.createRegistryLoaderAdapter)();
            const config = { mode: ((0, model_registry_helper_1.isRegistryModeEnabled)() ? "registry" : "auto-scan") };
            const registry = (0, model_registry_1.createModelRegistryManager)({ registryAdapter, config });
            const capability = await registry.getModelCapability(modelName);
            if (capability) {
                const fullCapability = await registry.toModelCapability(capability);
                res.json(fullCapability);
            }
            else {
                res.status(404).json({ error: 'Model not found in registry' });
            }
        }
        catch (error) {
            console.error('Error fetching model capabilities:', error);
            res.status(500).json({ error: 'Failed to fetch model capabilities' });
        }
    });
    app.use('/api', router);
    console.log('📡 Simple API routes configured');
    console.log('📋 Model registry mode:', (0, model_registry_helper_1.isRegistryModeEnabled)() ? 'enabled' : 'disabled');
}
//# sourceMappingURL=simple-routes.js.map