/**
 * Feature Implementation: Model Detector
 */

import { ModelDetectorContract, ModelDetectorDependencies } from "./contract";
import { ModelCapability } from "../../../models/connection/model-capability";
import { ModelRegistryService } from "../../../services/model-registry-service";

export class ModelDetector implements ModelDetectorContract {
  private detectionCache = new Map<string, ModelCapability>();
  private modelRegistry?: ModelRegistryService;
  
  constructor(private deps: ModelDetectorDependencies) {}

  setModelRegistry(registry: ModelRegistryService): void {
    this.modelRegistry = registry;
  }

  async detectCapabilities(modelName: string): Promise<ModelCapability> {
    // Check if we're in registry mode and have a registry
    if (this.modelRegistry) {
      const isRegistryMode = await this.modelRegistry.isRegistryMode();
      if (isRegistryMode) {
        // In registry mode, only use predefined capabilities
        const registryCapability = await this.modelRegistry.getModelCapability(modelName);
        if (registryCapability) {
          // Convert registry definition to ModelCapability
          const capability: ModelCapability = {
            id: `registry-${modelName}`,
            modelName: modelName,
            capabilities: this.getCapabilityList(registryCapability),
            confidence: 1.0,
            detectedAt: new Date(),
            metadata: {
              source: 'registry',
              hasTools: registryCapability.hasTools,
              hasReasoning: registryCapability.hasReasoning,
              hasVision: registryCapability.hasVision
            }
          };
          this.detectionCache.set(modelName, capability);
          return capability;
        } else {
          throw new Error(`Model '${modelName}' not found in registry`);
        }
      }
    }

    // Fallback to auto-detection
    if (this.detectionCache.has(modelName)) {
      return this.detectionCache.get(modelName)!;
    }

    const capability = await this.deps.capabilityScanner.scanModel(modelName, {
      testMethods: this.deps.config.detection.methods,
      timeout: this.deps.config.detection.timeout
    });

    this.detectionCache.set(modelName, capability);
    
    this.deps.eventPublisher.publishCapabilityDetected({
      modelName,
      capabilities: capability.capabilities,
      detectionMethod: capability.detectionMethod,
      timestamp: new Date()
    });

    return capability;
  }

  async batchDetect(modelNames: string[]): Promise<ModelCapability[]> {
    const results = await Promise.allSettled(
      modelNames.map(name => this.detectCapabilities(name))
    );

    return results
      .filter(result => result.status === "fulfilled")
      .map(result => (result as PromiseFulfilledResult<ModelCapability>).value);
  }

  private getCapabilityList(registryDef: any): string[] {
    const capabilities: string[] = ['chat', 'streaming'];
    if (registryDef.hasVision) capabilities.push('vision');
    if (registryDef.hasTools) capabilities.push('tools', 'code');
    if (registryDef.hasReasoning) capabilities.push('reasoning');
    return capabilities;
  }

  async testVisionCapability(modelName: string): Promise<boolean> {
    return await this.deps.capabilityScanner.testVision(modelName);
  }

  async getCapability(modelName: string): Promise<ModelCapability | null> {
    return this.detectionCache.get(modelName) || null;
  }

  async refreshCapability(modelName: string): Promise<ModelCapability> {
    this.detectionCache.delete(modelName);
    return await this.detectCapabilities(modelName);
  }

  async setCustomCapability(modelName: string, capability: ModelCapability): Promise<void> {
    this.detectionCache.set(modelName, capability);
    await this.deps.detectionService.saveCustomCapability(modelName, capability);
  }

  async listDetectedModels(): Promise<ModelCapability[]> {
    return Array.from(this.detectionCache.values());
  }

  async clearCache(): Promise<void> {
    this.detectionCache.clear();
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
