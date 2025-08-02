/**
 * Image Detection Adapter
 * Detects images in message inputs for vision model routing
 */
export interface MessageInput {
    content: string;
    attachments?: {
        type: string;
        data: string;
    }[];
}
export interface ImageDetectionAdapter {
    detectImages(input: MessageInput): boolean;
    requiresVision(input: MessageInput): boolean;
    getContentType(input: MessageInput): 'text' | 'vision' | 'mixed';
    getImageCount(input: MessageInput): number;
}
export declare function createImageDetectionAdapter(): ImageDetectionAdapter;
export declare function analyzeInputForRouting(input: MessageInput): {
    hasImages: boolean;
    imageCount: number;
    contentType: "text" | "vision" | "mixed";
    requiresVisionModel: boolean;
    recommendations: {
        preferVisionModel: boolean;
        canUseTextModel: boolean;
        isMultimodalContent: boolean;
    };
};
