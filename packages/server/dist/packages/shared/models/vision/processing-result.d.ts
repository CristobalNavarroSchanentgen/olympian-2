export interface ProcessingResult {
    id: string;
    imageId: string;
    description?: string;
    processedAt: Date;
    model: string;
    processingTime: number;
    confidence: number;
}
