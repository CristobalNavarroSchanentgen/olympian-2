/**
 * Feature Implementation: Model Detector
 */

import { ModelDetectorContract, ModelDetectorDependencies } from "./contract";
import { ModelCapability } from "../../../models/connection/model-capability";

export class ModelDetector implements ModelDetectorContract {
  private detectionCache = new Map<string, ModelCapability>();
  
  constructor(private deps: ModelDetectorDependencies) {}

  async detectCapabilities(modelName: string): Promise<ModelCapability> {
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
