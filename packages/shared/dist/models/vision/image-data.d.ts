/**
 * Image Data Models
 */
export interface ImageData {
    id: string;
    filename: string;
    mimetype: string;
    size: number;
    width: number;
    height: number;
    url?: string;
    base64?: string;
    uploadedAt: Date;
    metadata: Record<string, unknown>;
}
//# sourceMappingURL=image-data.d.ts.map