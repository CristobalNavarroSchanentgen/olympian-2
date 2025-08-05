/**
 * Configuration Schema for Conversation Title Generator
 */
export const defaultConfig = {
    enabled: true,
    defaultModel: 'llama3.2:1b', // Use a lightweight model for title generation
    maxTitleLength: 50,
    minMessageLength: 5,
    temperature: 0.7
};
export * from '../../../../../../shared/models/chat/title-generation';
//# sourceMappingURL=schema.js.map