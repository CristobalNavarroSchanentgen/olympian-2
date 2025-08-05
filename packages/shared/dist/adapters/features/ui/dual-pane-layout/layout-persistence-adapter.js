/**
 * Layout Persistence Adapter
 *
 * Transforms between browser localStorage and layout configuration.
 * Under 100 lines, pure transformation logic.
 */
export class LayoutPersistenceAdapter {
    storageKey = 'olympian-layout-config';
    /**
     * Load layout configuration from browser storage
     */
    loadLayoutConfig() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return null;
        }
        try {
            const stored = window.localStorage.getItem(this.storageKey);
            if (!stored)
                return null;
            const parsed = JSON.parse(stored);
            return this.validateLayoutConfig(parsed);
        }
        catch (error) {
            console.warn('Failed to load layout config from storage:', error);
            return null;
        }
    }
    /**
     * Save layout configuration to browser storage
     */
    saveLayoutConfig(config) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }
        try {
            const serialized = JSON.stringify(config);
            window.localStorage.setItem(this.storageKey, serialized);
            return true;
        }
        catch (error) {
            console.warn('Failed to save layout config to storage:', error);
            return false;
        }
    }
    /**
     * Convert layout props to persistable config
     */
    layoutPropsToConfig(props) {
        return {
            conversationVisible: props.conversationPanel.visible,
            conversationWidth: props.conversationPanel.width,
            showReasoning: props.conversationPanel.showReasoningPanel,
            codeEditorVisible: props.codeEditor.visible,
            defaultLanguage: props.codeEditor.language,
            readOnly: props.codeEditor.readOnly,
            title: props.header.title,
            showNavigation: props.header.showNavigation,
            showModelSelector: props.header.showModelSelector,
        };
    }
    /**
     * Clear stored layout configuration
     */
    clearLayoutConfig() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }
        try {
            window.localStorage.removeItem(this.storageKey);
            return true;
        }
        catch (error) {
            console.warn('Failed to clear layout config from storage:', error);
            return false;
        }
    }
    validateLayoutConfig(config) {
        if (!config || typeof config !== 'object')
            return null;
        // Return only valid properties, ignore invalid ones
        const validated = {};
        if (typeof config.conversationVisible === 'boolean') {
            validated.conversationVisible = config.conversationVisible;
        }
        if (typeof config.conversationWidth === 'number' && config.conversationWidth >= 20 && config.conversationWidth <= 80) {
            validated.conversationWidth = config.conversationWidth;
        }
        if (typeof config.showReasoning === 'boolean') {
            validated.showReasoning = config.showReasoning;
        }
        if (typeof config.codeEditorVisible === 'boolean') {
            validated.codeEditorVisible = config.codeEditorVisible;
        }
        if (typeof config.defaultLanguage === 'string') {
            validated.defaultLanguage = config.defaultLanguage;
        }
        if (typeof config.readOnly === 'boolean') {
            validated.readOnly = config.readOnly;
        }
        if (typeof config.title === 'string') {
            validated.title = config.title;
        }
        if (typeof config.showNavigation === 'boolean') {
            validated.showNavigation = config.showNavigation;
        }
        if (typeof config.showModelSelector === 'boolean') {
            validated.showModelSelector = config.showModelSelector;
        }
        return validated;
    }
}
//# sourceMappingURL=layout-persistence-adapter.js.map