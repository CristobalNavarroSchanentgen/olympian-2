/**
 * Vision-related events
 */
export interface ImageUploaded {
    readonly type: 'image-uploaded';
    readonly imageId: string;
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface ImageProcessed {
    readonly type: 'image-processed';
    readonly imageId: string;
    readonly processingTime: number;
    readonly timestamp: Date;
}
