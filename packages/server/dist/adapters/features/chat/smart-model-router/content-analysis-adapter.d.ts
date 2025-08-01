/**
 * Content Analysis Adapter
 * Analyzes message content to determine model requirements
 */
export interface ContentAnalysisAdapter {
    analyzeTextComplexity(content: string): Promise<{
        complexity: 'simple' | 'moderate' | 'complex';
        suggestedCapabilities: string[];
    }>;
    detectImageContent(images: string[]): Promise<{
        hasImages: boolean;
        requiresProcessing: boolean;
    }>;
}
export declare function createContentAnalysisAdapter(): ContentAnalysisAdapter;
