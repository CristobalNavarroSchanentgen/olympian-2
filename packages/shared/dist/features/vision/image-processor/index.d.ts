/**
 * Feature Implementation: Vision Image Processor
 */
import { ImageProcessorContract, ImageProcessorDependencies } from "./contract";
import { ImageData } from "../../../models/vision/image-data";
import { ProcessingResult } from "../../../models/vision/processing-result";
export declare class ImageProcessor implements ImageProcessorContract {
    private deps;
    private uploadQueue;
    constructor(deps: ImageProcessorDependencies);
    uploadImage(params: {
        file: Buffer | string;
        filename: string;
        conversationId: string;
        metadata?: Record<string, unknown>;
    }): Promise<ImageData>;
    private processUpload;
    processImage(imageId: string, options?: any): Promise<ProcessingResult>;
    batchUpload(files: Array<{
        file: Buffer | string;
        filename: string;
        conversationId: string;
    }>): Promise<ImageData[]>;
    batchProcess(imageIds: string[], options?: any): Promise<ProcessingResult[]>;
    getImage(imageId: string): Promise<ImageData | null>;
    deleteImage(imageId: string): Promise<void>;
    getImagesByConversation(conversationId: string): Promise<ImageData[]>;
    analyzeWithVision(params: {
        imageIds: string[];
        prompt: string;
        model?: string;
    }): Promise<string>;
    private generateUploadId;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map