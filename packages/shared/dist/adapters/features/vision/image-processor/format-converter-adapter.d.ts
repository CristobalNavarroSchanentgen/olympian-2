import { ImageData } from '../../../models/vision/image-data';
/**
 * Format converter adapter for vision processing
 * Transforms image format utilities for image-processor feature
 */
export interface FormatConverterAdapter {
    convertFormat(imageData: ImageData, targetFormat: ImageFormat): Promise<ImageData>;
    optimizeForVision(imageData: ImageData): Promise<ImageData>;
    createThumbnail(imageData: ImageData, size: ThumbnailSize): Promise<ImageData>;
    prepareForModel(imageData: ImageData, modelRequirements: ModelRequirements): Promise<ImageData>;
}
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif';
export type ThumbnailSize = 'small' | 'medium' | 'large' | 'custom';
export interface ModelRequirements {
    maxWidth: number;
    maxHeight: number;
    format: ImageFormat;
    quality: number;
    maxSizeBytes?: number;
}
export declare function createFormatConverterAdapter(): FormatConverterAdapter;
//# sourceMappingURL=format-converter-adapter.d.ts.map