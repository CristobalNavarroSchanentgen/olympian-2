export interface ModelRegistryService {
  getModelCapability(modelName: string): Promise<any>;
  getAllModels(): Promise<any[]>;
  getAllRegisteredModels(): Promise<any[]>;
  validateModelAccess(modelName: string): Promise<boolean>;
  isRegistryMode(): Promise<boolean>;
}

