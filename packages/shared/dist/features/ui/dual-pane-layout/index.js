/**
 * AI-Native Dual Pane Layout Feature
 *
 * Manages layout state and configuration for the dual-pane interface.
 * Only knows about its contract and layout-related logic.
 */
export class DualPaneLayoutFeature {
    layoutState;
    constructor(initialConfig = {}) {
        this.layoutState = {
            conversationPanel: {
                visible: initialConfig.conversationVisible ?? true,
                width: initialConfig.conversationWidth ?? 50,
                showReasoningPanel: initialConfig.showReasoning ?? false,
            },
            codeEditor: {
                visible: initialConfig.codeEditorVisible ?? false,
                language: initialConfig.defaultLanguage ?? 'typescript',
                readOnly: initialConfig.readOnly ?? false,
            },
            header: {
                title: initialConfig.title ?? 'Olympian AI',
                showNavigation: initialConfig.showNavigation ?? true,
                showModelSelector: initialConfig.showModelSelector ?? true,
            },
        };
    }
    getLayoutProps() {
        return { ...this.layoutState };
    }
    toggleConversationPanel() {
        this.layoutState.conversationPanel.visible = !this.layoutState.conversationPanel.visible;
        return this.getLayoutProps();
    }
    toggleCodeEditor() {
        this.layoutState.codeEditor.visible = !this.layoutState.codeEditor.visible;
        return this.getLayoutProps();
    }
    toggleReasoningPanel() {
        this.layoutState.conversationPanel.showReasoningPanel =
            !this.layoutState.conversationPanel.showReasoningPanel;
        return this.getLayoutProps();
    }
    updateConversationWidth(width) {
        this.layoutState.conversationPanel.width = Math.max(20, Math.min(80, width));
        return this.getLayoutProps();
    }
    updateCodeEditor(content, language) {
        this.layoutState.codeEditor.content = content;
        if (language) {
            this.layoutState.codeEditor.language = language;
        }
        return this.getLayoutProps();
    }
    updateHeader(headerConfig) {
        this.layoutState.header = { ...this.layoutState.header, ...headerConfig };
        return this.getLayoutProps();
    }
}
//# sourceMappingURL=index.js.map