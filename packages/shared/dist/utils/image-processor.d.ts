/**
 * Image Processor Utility
 */
export interface ImageDimensions {
    width: number;
    height: number;
}
export interface ProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: string;
}
export declare function validateImageFormat(mimetype: string): boolean;
export declare function calculateDimensions(original: ImageDimensions, maxWidth: number, maxHeight: number): ImageDimensions;
export declare function estimateImageTokens(width: number, height: number): number;
//# sourceMappingURL=image-processor.d.ts.map