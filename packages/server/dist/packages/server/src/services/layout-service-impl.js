"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutServiceImpl = void 0;
/**
 * Layout Service Implementation
 * Handles UI layout configuration and preferences
 */
class LayoutServiceImpl {
    layouts = new Map();
    currentLayout;
    constructor() {
        // Initialize with default layout
        this.currentLayout = {
            leftPaneVisible: true,
            rightPaneVisible: true,
            leftPaneWidth: 50,
            activeLeftTab: 'conversation',
            activeRightTab: 'codeEditor',
            reasoningPanelOpen: false,
            reasoningPanelHeight: 200
        };
    }
    async loadLayout() {
        return this.layouts.get('default') || null;
    }
    async saveLayout(config) {
        this.layouts.set('default', config);
        return true;
    }
    getCurrentLayout() {
        return { ...this.currentLayout };
    }
    async updateLayout(updates) {
        this.currentLayout = { ...this.currentLayout, ...updates };
        return { ...this.currentLayout };
    }
    async resetLayout() {
        this.currentLayout = {
            leftPaneVisible: true,
            rightPaneVisible: true,
            leftPaneWidth: 50,
            activeLeftTab: 'conversation',
            activeRightTab: 'codeEditor',
            reasoningPanelOpen: false,
            reasoningPanelHeight: 200
        };
        return { ...this.currentLayout };
    }
    async togglePanel(panel) {
        switch (panel) {
            case 'conversation':
                this.currentLayout.leftPaneVisible = !this.currentLayout.leftPaneVisible;
                break;
            case 'codeEditor':
                this.currentLayout.rightPaneVisible = !this.currentLayout.rightPaneVisible;
                break;
            case 'reasoning':
                this.currentLayout.reasoningPanelOpen = !this.currentLayout.reasoningPanelOpen;
                break;
        }
        return { ...this.currentLayout };
    }
}
exports.LayoutServiceImpl = LayoutServiceImpl;
//# sourceMappingURL=layout-service-impl.js.map