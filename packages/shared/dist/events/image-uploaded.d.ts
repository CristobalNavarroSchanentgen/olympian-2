/**
 * Image uploaded event
 */
export interface ImageUploadedEvent {
    readonly type: 'image-uploaded';
    readonly imageId: string;
    readonly conversationId: string;
    readonly filename: string;
    readonly timestamp: Date;
    readonly metadata: {
        readonly size: number;
        readonly mimeType: string;
        readonly dimensions: {
            readonly width: number;
            readonly height: number;
        };
        readonly compressed: boolean;
        readonly validationPassed: boolean;
    };
}
export declare function createImageUploadedEvent(imageId: string, conversationId: string, filename: string, size: number, mimeType: string, dimensions: {
    width: number;
    height: number;
}, compressed?: boolean, validationPassed?: boolean): ImageUploadedEvent;
//# sourceMappingURL=image-uploaded.d.ts.map