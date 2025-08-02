/**
 * Prompt Adapter for Title Generation
 * Creates optimized prompts for generating conversation titles
 */
export declare const promptAdapter: {
    createTitlePrompt(firstMessage: string): string;
    createFallbackPrompt(messagePreview: string): string;
};
