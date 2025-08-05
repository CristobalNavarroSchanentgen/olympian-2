import { DualPaneLayoutProps } from './contract';
/**
 * AI-Native Dual Pane Layout Feature
 *
 * Manages layout state and configuration for the dual-pane interface.
 * Only knows about its contract and layout-related logic.
 */
export declare class DualPaneLayoutFeature {
    private layoutState;
    constructor(initialConfig?: LayoutConfig);
    getLayoutProps(): DualPaneLayoutProps;
    toggleConversationPanel(): DualPaneLayoutProps;
    toggleCodeEditor(): DualPaneLayoutProps;
    toggleReasoningPanel(): DualPaneLayoutProps;
    updateConversationWidth(width: number): DualPaneLayoutProps;
    updateCodeEditor(content: string, language?: string): DualPaneLayoutProps;
    updateHeader(headerConfig: Partial<DualPaneLayoutProps["header"]>): DualPaneLayoutProps;
}
export interface LayoutConfig {
    conversationVisible?: boolean;
    conversationWidth?: number;
    showReasoning?: boolean;
    codeEditorVisible?: boolean;
    defaultLanguage?: string;
    readOnly?: boolean;
    title?: string;
    showNavigation?: boolean;
    showModelSelector?: boolean;
}
//# sourceMappingURL=index.d.ts.map