/**
 * ARTIFACT PANEL UI CONTRACT
 *
 * Enforces conversation experience requirements for automatic artifact detection,
 * content formatting, and artifact management controls.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: smartContentManagement
 */
export interface ArtifactContent {
    id: string;
    messageId: string;
    type: 'code' | 'document' | 'chart' | 'image' | 'data' | 'config';
    language?: string;
    title: string;
    content: string;
    metadata: {
        size: number;
        created: Date;
        modified?: Date;
        version: number;
        author: 'user' | 'assistant';
    };
    formatting: {
        syntaxHighlighting: boolean;
        lineNumbers: boolean;
        wordWrap: boolean;
        theme: 'light' | 'dark' | 'auto';
    };
}
export interface ArtifactPanelState {
    visible: boolean;
    activeArtifactId?: string;
    artifacts: ArtifactContent[];
    panelWidth: number;
    panelPosition: 'right' | 'bottom' | 'modal';
    autoOpen: boolean;
}
export interface ArtifactDetectionResult {
    detected: boolean;
    artifactType: ArtifactContent['type'];
    confidence: number;
    suggestedTitle: string;
    language?: string;
    extractedContent: string;
}
export interface ArtifactPanelUIContract {
    /**
     * CONVERSATION EXPERIENCE ENFORCEMENT
     * Ensures automatic artifact detection and seamless content management
     */
    /**
     * Detect artifacts in AI response
     * Contract: 100% of artifact-generating responses trigger panel display
     */
    detectArtifacts(messageId: string, content: string): Promise<ArtifactDetectionResult[]>;
    /**
     * Display artifact panel automatically
     * Contract: panel appears only when artifacts are generated
     */
    displayArtifactPanel(artifacts: ArtifactContent[], autoOpen?: boolean): Promise<void>;
    /**
     * Open artifact panel with smooth animation
     * Contract: artifact panel opens/closes smoothly < 300ms
     */
    openArtifactPanel(artifactId?: string): Promise<void>;
    /**
     * Close artifact panel gracefully
     * Contract: no manual action needed to see generated content
     */
    closeArtifactPanel(): Promise<void>;
    /**
     * Add new artifact to panel
     * Contract: all generated artifacts remain accessible throughout session
     */
    addArtifact(artifact: ArtifactContent): Promise<void>;
    /**
     * Update existing artifact
     * Contract: persistent access to generated content
     */
    updateArtifact(artifactId: string, updates: Partial<ArtifactContent>): Promise<void>;
    /**
     * Apply syntax highlighting and formatting
     * Contract: appropriate syntax highlighting and formatting
     */
    formatArtifactContent(artifact: ArtifactContent): Promise<string>;
    /**
     * Get artifact panel state
     * Contract: clear artifact type and creation timestamp
     */
    getPanelState(): Promise<ArtifactPanelState>;
    /**
     * Configure panel preferences
     * Contract: easy close and menu options for artifact management
     */
    configurePanelPreferences(preferences: ArtifactPanelPreferences): Promise<void>;
    /**
     * Validate artifact panel against contract requirements
     * Contract: ensure smart content management criteria met
     */
    validateArtifactPanel(): Promise<ArtifactValidationResult>;
}
export interface ArtifactPanelPreferences {
    autoOpenPanel: boolean;
    defaultPanelPosition: 'right' | 'bottom' | 'modal';
    defaultPanelWidth: number;
    showLineNumbers: boolean;
    enableSyntaxHighlighting: boolean;
    defaultTheme: 'light' | 'dark' | 'auto';
    enableWordWrap: boolean;
    showArtifactMetadata: boolean;
    enableVersionTracking: boolean;
}
export interface ArtifactValidationResult {
    meetsContract: boolean;
    detection: {
        artifactDetectionRate: number;
        falsePositiveRate: number;
        detectionLatency: number;
    };
    display: {
        panelResponsiveness: number;
        formattingQuality: boolean;
        persistentAccess: boolean;
    };
    usability: {
        automaticDisplay: boolean;
        intuitivControls: boolean;
        contentAccessibility: boolean;
    };
    recommendations?: string[];
}
/**
 * CONTRACT VALIDATION CRITERIA
 */
export declare const ArtifactPanelContractValidation: {
    readonly detection: {
        readonly accuracyRequired: 1;
        readonly latencyMaxMs: 100;
        readonly falsePositiveMaxRate: 0.05;
    };
    readonly display: {
        readonly panelResponseMaxMs: 300;
        readonly formattingRequired: true;
        readonly persistentAccessRequired: true;
    };
    readonly automation: {
        readonly automaticDisplayRequired: true;
        readonly conditionalDisplayRequired: true;
        readonly gracefulCloseRequired: true;
    };
};
