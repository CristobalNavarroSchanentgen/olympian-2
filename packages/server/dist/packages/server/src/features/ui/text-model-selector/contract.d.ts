export interface TextModelSelectorContract {
    selectModel(criteria: any): Promise<string>;
    getAvailableModels(): Promise<string[]>;
}
