/**
 * Image Processing Result Models
 */

export interface ProcessingResult {
  id: string;
  imageId: string;
  description: string;
  extractedText?: string;
  detectedObjects?: string[];
  processedAt: Date;
  processingTime: number;
  model: string;
  metadata: Record<string, unknown>;
}
