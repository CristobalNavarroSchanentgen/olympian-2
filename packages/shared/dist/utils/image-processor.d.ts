export interface ImageDimensions {
    width: number;
    height: number;
}
export interface ProcessedImageData {
    data: Buffer;
    base64Data: string;
    mimeType: string;
    dimensions: ImageDimensions;
}
export declare function validateImageFormat(mimeType: string): boolean;
export declare function convertToBase64(buffer: Buffer, mimeType: string): string;
//# sourceMappingURL=image-processor.d.ts.map