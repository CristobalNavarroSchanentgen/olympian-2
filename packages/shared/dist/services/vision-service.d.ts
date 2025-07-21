/**
 * Vision Service Interface
 * Defines the contract for vision-related operations
 */
import { ImageData, ProcessingResult } from '../models/vision';
export interface VisionService {
    processImage(imageData: ImageData, model?: string): Promise<ProcessingResult>;
    analyzeImage(imageData: ImageData, prompt: string): Promise<string>;
    extractText(imageData: ImageData): Promise<string>;
    detectObjects(imageData: ImageData): Promise<string[]>;
}
//# sourceMappingURL=vision-service.d.ts.map