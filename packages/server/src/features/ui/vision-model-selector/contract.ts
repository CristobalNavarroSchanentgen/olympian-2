export interface VisionModelSelectorContract {
  selectModel(criteria: any): Promise<string>;
  getAvailableModels(): Promise<string[]>;
}
