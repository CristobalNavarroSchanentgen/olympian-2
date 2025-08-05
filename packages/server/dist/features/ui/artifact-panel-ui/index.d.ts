/**
 * ARTIFACT PANEL UI IMPLEMENTATION
 */
import { ArtifactPanelUIContract, ArtifactContent, ArtifactPanelState, ArtifactDetectionResult, ArtifactValidationResult } from './contract';
export declare class ArtifactPanelUI implements ArtifactPanelUIContract {
    private panelState;
    detectArtifacts(messageId: string, content: string): Promise<ArtifactDetectionResult[]>;
    displayArtifactPanel(artifacts: ArtifactContent[], autoOpen?: boolean): Promise<void>;
    openArtifactPanel(artifactId?: string): Promise<void>;
    closeArtifactPanel(): Promise<void>;
    addArtifact(artifact: ArtifactContent): Promise<void>;
    updateArtifact(artifactId: string, updates: Partial<ArtifactContent>): Promise<void>;
    formatArtifactContent(artifact: ArtifactContent): Promise<string>;
    getPanelState(): Promise<ArtifactPanelState>;
    configurePanelPreferences(preferences: any): Promise<void>;
    validateArtifactPanel(): Promise<ArtifactValidationResult>;
}
export declare function createArtifactPanelUI(): ArtifactPanelUI;
