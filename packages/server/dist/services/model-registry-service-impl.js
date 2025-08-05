/**
 * Model Registry Service Implementation
 * Fetches models from Ollama and provides model capabilities
 */
export class ModelRegistryServiceImpl {
    initializationPromise = null;
    models = new Map();
    registryMode = true;
    ollamaService;
    lastFetch = null;
    fetchInterval = 30000; // 30 seconds
    constructor(ollamaService) {
        this.ollamaService = ollamaService;
        this.initializeDefaultModels();
        // Auto-refresh models periodically if Ollama service is available
        if (this.ollamaService) {
            this.refreshModelsFromOllama();
            setInterval(() => this.refreshModelsFromOllama(), this.fetchInterval);
            console.log("🔧 Forcing immediate model refresh...");
            this.refreshModelsFromOllama().then(() => {
                console.log("✅ Initial model refresh completed");
            }).catch(error => {
                console.error("❌ Initial model refresh failed:", error);
            });
        }
    }
    initializeDefaultModels() {
        // Fallback models if Ollama is not available
        const defaultModels = [
            {
                modelName: 'llama3.2:3b',
                name: 'llama3.2:3b',
                displayName: 'Llama 3.2 (3B)',
                provider: 'ollama',
                capabilities: ['text-generation', 'conversation'],
                contextLength: 8192,
                maxTokens: 4096,
                streaming: true,
                metadata: { family: 'llama', size: '3b' }
            },
            {
                modelName: 'llama3.2:1b',
                name: 'llama3.2:1b',
                displayName: 'Llama 3.2 (1B)',
                provider: 'ollama',
                capabilities: ['text-generation', 'conversation'],
                contextLength: 8192,
                maxTokens: 4096,
                streaming: true,
                metadata: { family: 'llama', size: '1b' }
            }
        ];
        defaultModels.forEach(model => {
            this.models.set(model.modelName, model);
        });
    }
    async refreshModelsFromOllama() {
        if (!this.ollamaService?.isConnected()) {
            console.log('? Ollama not connected, using default models');
            return;
        }
        try {
            console.log('? Refreshing models from Ollama...');
            const ollamaModels = await this.ollamaService.getModels();
            // Clear current models and rebuild from Ollama
            this.models.clear();
            for (const ollamaModel of ollamaModels) {
                const modelDef = this.createModelDefinitionFromOllama(ollamaModel);
                console.log("🔍 REGISTRY DEBUG: Creating model definition for:", ollamaModel.name, "-> displayName:", modelDef.displayName);
                this.models.set(modelDef.modelName, modelDef);
            }
            this.lastFetch = new Date();
            console.log(`? Loaded ${this.models.size} models from Ollama`);
            // Log available models for debugging
            const modelNames = Array.from(this.models.keys());
            console.log("🔍 REGISTRY DEBUG: Model map contents:");
            this.models.forEach((model, key) => console.log("  " + key + ": " + model.displayName + " [" + model.capabilities.join(", ") + "]"));
            console.log('? Available models:', modelNames);
        }
        catch (error) {
            console.error('? Failed to refresh models from Ollama:', error);
            this.initializeDefaultModels(); // Fallback to defaults
        }
    }
    createModelDefinitionFromOllama(ollamaModel) {
        const modelName = ollamaModel.name;
        const isVisionModel = this.detectVisionCapabilities(modelName);
        const isCodeModel = this.detectCodeCapabilities(modelName);
        const capabilities = ['text-generation', 'conversation'];
        if (isVisionModel)
            capabilities.push('vision');
        if (isCodeModel)
            capabilities.push('code-generation');
        return {
            modelName,
            name: modelName,
            displayName: this.generateDisplayName(modelName),
            provider: 'ollama',
            capabilities,
            contextLength: this.estimateContextLength(modelName),
            maxTokens: 4096,
            streaming: true,
            metadata: {
                family: this.extractModelFamily(modelName),
                size: this.extractModelSize(modelName),
                ollamaDigest: ollamaModel.digest,
                modified: ollamaModel.modified_at,
                sizeBytes: ollamaModel.size
            }
        };
    }
    detectVisionCapabilities(modelName) {
        const visionIndicators = ['vision', 'llava', 'moondream', 'minicpm'];
        return visionIndicators.some(indicator => modelName.toLowerCase().includes(indicator));
    }
    detectCodeCapabilities(modelName) {
        const codeIndicators = ['code', 'codellama', 'deepseek', 'coder'];
        return codeIndicators.some(indicator => modelName.toLowerCase().includes(indicator));
    }
    generateDisplayName(modelName) {
        // Convert 'llama3.2:3b' to 'Llama 3.2 (3B)'
        const parts = modelName.split(':');
        const baseName = parts[0];
        const tag = parts[1];
        let displayName = baseName
            .replace(/([a-z])([0-9])/g, '$1 $2')
            .replace(/^[a-z]/, c => c.toUpperCase())
            .replace(/llama/i, 'Llama');
        if (tag && tag !== 'latest') {
            displayName += ` (${tag.toUpperCase()})`;
        }
        return displayName;
    }
    estimateContextLength(modelName) {
        // Estimate context length based on model name
        if (modelName.includes('32b') || modelName.includes('70b'))
            return 32768;
        if (modelName.includes('13b') || modelName.includes('14b'))
            return 16384;
        if (modelName.includes('7b') || modelName.includes('8b'))
            return 8192;
        return 4096; // Default for smaller models
    }
    extractModelFamily(modelName) {
        const familyMap = {
            'llama': 'llama',
            'codellama': 'llama',
            'qwen': 'qwen',
            'gemma': 'gemma',
            'phi': 'phi',
            'deepseek': 'deepseek',
            'granite': 'granite'
        };
        for (const [key, family] of Object.entries(familyMap)) {
            if (modelName.toLowerCase().includes(key)) {
                return family;
            }
        }
        return 'unknown';
    }
    extractModelSize(modelName) {
        const sizeMatch = modelName.match(/(\d+\.?\d*)([bg])/i);
        return sizeMatch ? sizeMatch[0] : 'unknown';
    }
    async getModelCapability(modelName) {
        // Refresh models if stale
        if (this.shouldRefreshModels()) {
            await this.refreshModelsFromOllama();
        }
        return this.models.get(modelName) || null;
    }
    async getAllRegisteredModels() {
        // Wait for initial load if still pending
        if (this.initializationPromise) {
            await this.initializationPromise;
            this.initializationPromise = null;
        }
        // Refresh models if stale
        if (this.shouldRefreshModels()) {
            await this.refreshModelsFromOllama();
        }
        return Array.from(this.models.values());
    }
    async getAllModels() {
        return this.getAllRegisteredModels();
    }
    async validateModelAccess(modelName) {
        // Refresh models if stale
        if (this.shouldRefreshModels()) {
            await this.refreshModelsFromOllama();
        }
        const hasModel = this.models.has(modelName);
        if (hasModel) {
            return { allowed: true };
        }
        // Find similar models as alternatives
        const allModelNames = Array.from(this.models.keys());
        const suggestedAlternatives = allModelNames
            .filter(name => {
            const nameBase = name.split(':')[0];
            const requestedBase = modelName.split(':')[0];
            return nameBase.toLowerCase().includes(requestedBase.toLowerCase()) ||
                requestedBase.toLowerCase().includes(nameBase.toLowerCase());
        })
            .slice(0, 3);
        return {
            allowed: false,
            reason: `Model '${modelName}' not found. Available models: ${allModelNames.slice(0, 3).join(', ')}`,
            suggestedAlternatives: suggestedAlternatives.length > 0 ? suggestedAlternatives : allModelNames.slice(0, 3)
        };
    }
    async isRegistryMode() {
        return this.registryMode;
    }
    shouldRefreshModels() {
        if (!this.lastFetch)
            return true;
        const timeSinceLastFetch = Date.now() - this.lastFetch.getTime();
        return timeSinceLastFetch > this.fetchInterval;
    }
    // Manual refresh method for external calls
    async forceRefresh() {
        await this.refreshModelsFromOllama();
    }
}
//# sourceMappingURL=model-registry-service-impl.js.map