/**
 * Selection Persistence Adapter
 * Handles saving and loading model selections
 */

export interface SelectionAdapter {
  saveTextModelSelection(modelName: string): Promise<void>;
  saveVisionModelSelection(modelName: string): Promise<void>;
  getTextModelSelection(): Promise<string | null>;
  getVisionModelSelection(): Promise<string | null>;
  clearSelections(): Promise<void>;
}

// In-memory storage for now (will be enhanced with proper persistence later)
class InMemorySelectionStorage {
  private textModel: string | null = null;
  private visionModel: string | null = null;

  async saveTextModel(modelName: string): Promise<void> {
    this.textModel = modelName;
    console.log('Saved text model selection:', modelName);
  }

  async saveVisionModel(modelName: string): Promise<void> {
    this.visionModel = modelName;
    console.log('Saved vision model selection:', modelName);
  }

  async getTextModel(): Promise<string | null> {
    return this.textModel;
  }

  async getVisionModel(): Promise<string | null> {
    return this.visionModel;
  }

  async clear(): Promise<void> {
    this.textModel = null;
    this.visionModel = null;
    console.log('Cleared all model selections');
  }
}

// Singleton instance
const storage = new InMemorySelectionStorage();

export function createSelectionPersistenceAdapter(): SelectionAdapter {
  return {
    async saveTextModelSelection(modelName: string): Promise<void> {
      await storage.saveTextModel(modelName);
    },

    async saveVisionModelSelection(modelName: string): Promise<void> {
      await storage.saveVisionModel(modelName);
    },

    async getTextModelSelection(): Promise<string | null> {
      return await storage.getTextModel();
    },

    async getVisionModelSelection(): Promise<string | null> {
      return await storage.getVisionModel();
    },

    async clearSelections(): Promise<void> {
      await storage.clear();
    }
  };
}

// Helper function to validate selection persistence
export async function validateSelectionPersistence(adapter: SelectionAdapter): Promise<boolean> {
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
  } catch (error) {
    console.error('Selection persistence validation failed:', error);
    return false;
  }
}
