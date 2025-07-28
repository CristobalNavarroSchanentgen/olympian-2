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
export interface ImageDimensions {
    width: number;
    height: number;
}
export interface ImageMetadata {
    dimensions: ImageDimensions;
    format: string;
    size: number;
    hasAlpha: boolean;
}
export declare function getImageDimensions(data: string | Buffer): Promise<ImageDimensions>;
export declare function resizeImage(data: string | Buffer, targetDimensions: ImageDimensions, options?: {
    quality?: number;
    preserveAspectRatio?: boolean;
}): Promise<Buffer>;
export declare function compressImage(data: string | Buffer, quality?: number): Promise<Buffer>;
export declare function extractImageMetadata(data: string | Buffer): Promise<ImageMetadata>;
//# sourceMappingURL=image-processor.d.ts.map