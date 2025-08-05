/**
 * Prompt Adapter
 * Handles prompt creation and response parsing for title generation
 */
export declare class PromptAdapter {
    createTitlePrompt(message: string, maxLength: number): string;
    extractTitle(response: string): string | null;
    sanitizeTitle(title: string): string;
}
//# sourceMappingURL=prompt-adapter.d.ts.map