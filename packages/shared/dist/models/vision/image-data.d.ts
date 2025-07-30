/**
 * Vision domain models
 */
export interface ImageData {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    base64Data: string;
    dimensions: {
        width: number;
        height: number;
    };
    uploadedAt: Date;
    metadata?: Record<string, unknown>;
}
//# sourceMappingURL=image-data.d.ts.map