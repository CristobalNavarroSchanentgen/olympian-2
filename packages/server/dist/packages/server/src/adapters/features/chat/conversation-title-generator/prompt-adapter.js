/**
 * Prompt Adapter for Title Generation
 * Creates optimized prompts for generating conversation titles
 */
export const promptAdapter = {
    createTitlePrompt(firstMessage) {
        const cleanMessage = firstMessage.trim().substring(0, 200);
        return `Generate a concise, descriptive title for a conversation that starts with this message: "${cleanMessage}"

Rules:
- Maximum 6 words
- No quotes or special characters
- Capture the main topic or intent
- Be specific and clear

Title:`;
    },
    createFallbackPrompt(messagePreview) {
        return `Summarize in 3-4 words: ${messagePreview}`;
    }
};
//# sourceMappingURL=prompt-adapter.js.map