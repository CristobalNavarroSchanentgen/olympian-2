/**
 * Selection Persistence Adapter
 * Handles saving and loading model selections
 */
// In-memory storage for now (will be enhanced with proper persistence later)
class InMemorySelectionStorage {
    textModel = null;
    visionModel = null;
    async saveTextModel(modelName) {
        this.textModel = modelName;
        console.log('Saved text model selection:', modelName);
    }
    async saveVisionModel(modelName) {
        this.visionModel = modelName;
        console.log('Saved vision model selection:', modelName);
    }
    async getTextModel() {
        return this.textModel;
    }
    async getVisionModel() {
        return this.visionModel;
    }
    async clear() {
        this.textModel = null;
        this.visionModel = null;
        console.log('Cleared all model selections');
    }
}
// Singleton instance
const storage = new InMemorySelectionStorage();
export function createSelectionPersistenceAdapter() {
    return {
        async saveTextModelSelection(modelName) {
            await storage.saveTextModel(modelName);
        },
        async saveVisionModelSelection(modelName) {
            await storage.saveVisionModel(modelName);
        },
        async getTextModelSelection() {
            return await storage.getTextModel();
        },
        async getVisionModelSelection() {
            return await storage.getVisionModel();
        },
        async clearSelections() {
            await storage.clear();
        }
    };
}
// Helper function to validate selection persistence
export async function validateSelectionPersistence(adapter) {
    try {
        const testTextModel = 'test-text-model';
        const testVisionModel = 'test-vision-model';
        // Test text model persistence
        await adapter.saveTextModelSelection(testTextModel);
        const retrievedTextModel = await adapter.getTextModelSelection();
        // Test vision model persistence
        await adapter.saveVisionModelSelection(testVisionModel);
        const retrievedVisionModel = await adapter.getVisionModelSelection();
        return retrievedTextModel === testTextModel && retrievedVisionModel === testVisionModel;
    }
    catch (error) {
        console.error('Selection persistence validation failed:', error);
        return false;
    }
}
//# sourceMappingURL=selection-persistence-adapter.js.map