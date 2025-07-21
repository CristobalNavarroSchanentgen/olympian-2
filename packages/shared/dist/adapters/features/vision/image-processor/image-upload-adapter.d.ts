import { ImageData } from '../../../models/vision/image-data';
/**
 * Image upload adapter for vision processing
 * Transforms image utilities for image-processor feature
 */
export interface ImageUploadAdapter {
    validateUpload(file: File): Promise<ValidationResult>;
    processUpload(file: File): Promise<ImageData>;
    batchProcessUploads(files: File[]): Promise<ImageData[]>;
    convertToBase64(file: File): Promise<string>;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
        size: number;
        format: string;
        dimensions?: {
            width: number;
            height: number;
        };
    };
}
export declare function createImageUploadAdapter(): ImageUploadAdapter;
//# sourceMappingURL=image-upload-adapter.d.ts.map