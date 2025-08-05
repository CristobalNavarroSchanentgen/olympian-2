/**
 * DUAL PANE LAYOUT IMPLEMENTATION
 */
export class DualPaneLayout {
    layoutState = {
        conversationPanel: {
            visible: true,
            width: 50,
            showReasoningPanel: false
        },
        codeEditor: {
            visible: false,
            readOnly: false
        },
        header: {
            title: 'Olympian AI',
            showNavigation: true,
            showModelSelector: true
        }
    };
    constructor() { }
    async updateLayout(props) {
        this.layoutState = { ...this.layoutState, ...props };
        await this.renderLayout();
        console.log('Layout updated');
    }
    async toggleCodeEditor() {
        this.layoutState.codeEditor.visible = !this.layoutState.codeEditor.visible;
        await this.renderLayout();
    }
    async toggleReasoningPanel() {
        if (this.layoutState.conversationPanel) {
            this.layoutState.conversationPanel.showReasoningPanel = !this.layoutState.conversationPanel.showReasoningPanel;
            await this.renderLayout();
        }
    }
    getLayoutState() {
        return { ...this.layoutState };
    }
    async renderLayout() {
        console.log('Rendering dual pane layout');
    }
}
export function createDualPaneLayout() {
    return new DualPaneLayout();
}
//# sourceMappingURL=index.js.map