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
export declare function createSelectionPersistenceAdapter(): SelectionAdapter;
export declare function validateSelectionPersistence(adapter: SelectionAdapter): Promise<boolean>;
