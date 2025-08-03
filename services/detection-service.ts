export interface DetectionService {
  detectCapabilities(target: string): Promise<any>;
  scanForModels(): Promise<any[]>;
  validateDetection(detectionId: string): Promise<boolean>;
}

