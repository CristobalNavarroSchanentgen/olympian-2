/**
 * Prompt Adapter
 * Handles prompt creation and response parsing for title generation
 */
export class PromptAdapter {
    createTitlePrompt(message, maxLength) {
        // Clean and truncate message if too long
        const cleanMessage = message.trim().substring(0, 200);
        const template = `Generate a short, descriptive title (max ${maxLength} characters) for this conversation based on the user message. Only return the title, nothing else:\n\nUser: ${cleanMessage}\n\nTitle:`;
        return template;
    }
    extractTitle(response) {
        if (!response)
            return null;
        // Clean the response
        let title = response.trim();
        // Remove common prefixes/suffixes
        title = title.replace(/^(title:|Title:|TITLE:)/i, '').trim();
        title = title.replace(/^[\"'\`]|[\"'\`]$/g, '').trim();
        // Remove newlines and extra spaces
        title = title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        // Ensure reasonable length (3-50 characters)
        if (title.length < 3 || title.length > 50) {
            return null;
        }
        // Check if it looks like a valid title (not a sentence/paragraph)
        if (title.includes('.') && title.length > 20) {
            const beforePeriod = title.split('.')[0].trim();
            if (beforePeriod.length >= 3 && beforePeriod.length <= 50) {
                title = beforePeriod;
            }
        }
        return title;
    }
    sanitizeTitle(title) {
        // Remove special characters that might break UI
        return title.replace(/[<>\"'&]/g, '').trim();
    }
}
//# sourceMappingURL=prompt-adapter.js.map