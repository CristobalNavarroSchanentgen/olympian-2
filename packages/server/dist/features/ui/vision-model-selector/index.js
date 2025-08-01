"use strict";
/**
 * Vision Model Selector Implementation
 * Manages vision-capable model selection using registry
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionModelSelector = void 0;
exports.createVisionModelSelector = createVisionModelSelector;
class VisionModelSelector {
    modelRegistryService;
    visionModelFilterAdapter;
    selectionPersistenceAdapter;
    imageDetectionAdapter;
    currentVisionModel = null;
    constructor(modelRegistryService, visionModelFilterAdapter, selectionPersistenceAdapter, imageDetectionAdapter) {
        this.modelRegistryService = modelRegistryService;
        this.visionModelFilterAdapter = visionModelFilterAdapter;
        this.selectionPersistenceAdapter = selectionPersistenceAdapter;
        this.imageDetectionAdapter = imageDetectionAdapter;
        this.initializeSelection();
    }
    async initializeSelection() {
        try {
            this.currentVisionModel = await this.selectionPersistenceAdapter.getVisionModelSelection();
        }
        catch (error) {
            console.warn(`Failed to load vision model selection:`, error);
        }
    }
    async getAvailableVisionModels() {
        try {
            const allModels = await this.modelRegistryService.getAllRegisteredModels();
            return this.visionModelFilterAdapter.filterVisionModels(allModels);
        }
        catch (error) {
            console.error(`Failed to get available vision models:`, error);
            return [];
        }
    }
    async getCurrentVisionModel() {
        return this.currentVisionModel;
    }
    async setVisionModel(modelName) {
        try {
            // Validate selection first
            const validation = await this.validateVisionModelSelection(modelName);
            if (!validation.allowed) {
                throw new Error(validation.reason || `Invalid vision model selection`);
            }
            // Save selection
            await this.selectionPersistenceAdapter.saveVisionModelSelection(modelName);
            this.currentVisionModel = modelName;
            // Emit event (to be implemented with event system)
            console.log(`Vision model selected:`, modelName);
        }
        catch (error) {
            console.error(`Failed to set vision model:`, error);
            throw error;
        }
    }
    async isVisionModelRequired(input) {
        try {
            return this.imageDetectionAdapter.detectImages(input);
        }
        catch (error) {
            console.error(`Failed to detect images in input:`, error);
            return false;
        }
    }
    async validateVisionModelSelection(modelName) {
        try {
            // Check if model exists in registry
            const modelCapability = await this.modelRegistryService.getModelCapability(modelName);
            if (!modelCapability) {
                return {
                    allowed: false,
                    reason: "Model not found in registry"
                };
            }
            // Check if model has vision capability
            if (!modelCapability.hasVision) {
                return {
                    allowed: false,
                    reason: `Model does not support vision processing`
                };
            }
            return { allowed: true };
        }
        catch (error) {
            return {
                allowed: false,
                reason: `Failed to validate vision model selection`
            };
        }
    }
}
exports.VisionModelSelector = VisionModelSelector;
// Factory function for easy instantiation
function createVisionModelSelector(modelRegistryService, visionModelFilterAdapter, selectionPersistenceAdapter, imageDetectionAdapter) {
    return new VisionModelSelector(modelRegistryService, visionModelFilterAdapter, selectionPersistenceAdapter, imageDetectionAdapter);
}
//# sourceMappingURL=index.js.map