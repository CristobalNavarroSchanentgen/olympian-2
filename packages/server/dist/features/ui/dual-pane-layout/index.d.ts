/**
 * DUAL PANE LAYOUT IMPLEMENTATION
 */
import { DualPaneLayoutProps } from './contract';
export declare class DualPaneLayout {
    private layoutState;
    constructor();
    updateLayout(props: Partial<DualPaneLayoutProps>): Promise<void>;
    toggleCodeEditor(): Promise<void>;
    toggleReasoningPanel(): Promise<void>;
    getLayoutState(): DualPaneLayoutProps;
    private renderLayout;
}
export declare function createDualPaneLayout(): DualPaneLayout;
