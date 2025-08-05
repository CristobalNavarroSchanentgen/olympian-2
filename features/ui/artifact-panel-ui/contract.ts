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
  displayArtifactPanel(
    artifacts: ArtifactContent[], 
    autoOpen?: boolean
  ): Promise<void>;
  
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
    artifactDetectionRate: number;     // Should be 100%
    falsePositiveRate: number;         // Should be < 5%
    detectionLatency: number;          // Should be immediate
  };
  display: {
    panelResponsiveness: number;       // Should be < 300ms
    formattingQuality: boolean;        // Proper syntax highlighting
    persistentAccess: boolean;         // Content remains available
  };
  usability: {
    automaticDisplay: boolean;         // No manual action needed
    intuitivControls: boolean;         // Easy panel management
    contentAccessibility: boolean;     // All artifacts accessible
  };
  recommendations?: string[];
}

/**
 * CONTRACT VALIDATION CRITERIA
 */
export const ArtifactPanelContractValidation = {
  detection: {
    accuracyRequired: 1.0,             // 100% artifact detection
    latencyMaxMs: 100,                 // Immediate detection
    falsePositiveMaxRate: 0.05         // < 5% false positives
  },
  
  display: {
    panelResponseMaxMs: 300,           // < 300ms panel animation
    formattingRequired: true,          // Syntax highlighting
    persistentAccessRequired: true     // Session-long availability
  },
  
  automation: {
    automaticDisplayRequired: true,    // No manual intervention
    conditionalDisplayRequired: true,  // Only when artifacts exist
    gracefulCloseRequired: true        // Smooth panel management
  }
} as const;
