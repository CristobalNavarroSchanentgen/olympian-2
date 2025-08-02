/**
 * Content Analysis Adapter - Server Implementation
 */
import { ContentAnalysisAdapter } from '@olympian/shared/features/chat/smart-model-router/contract';
export declare class ContentAnalysisAdapterImpl implements ContentAnalysisAdapter {
    analyzeTextComplexity(content: string): Promise<{
        complexity: "complex" | "simple" | "moderate";
        suggestedCapabilities: string[];
    }>;
    detectImageContent(images: string[]): Promise<{
        hasImages: boolean;
        requiresProcessing: boolean;
    }>;
    analyzeContent(content: string): Promise<any>;
    detectMediaType(content: string): Promise<any>;
}
