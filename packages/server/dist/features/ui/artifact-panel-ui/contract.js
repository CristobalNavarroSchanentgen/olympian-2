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
/**
 * CONTRACT VALIDATION CRITERIA
 */
export const ArtifactPanelContractValidation = {
    detection: {
        accuracyRequired: 1.0, // 100% artifact detection
        latencyMaxMs: 100, // Immediate detection
        falsePositiveMaxRate: 0.05 // < 5% false positives
    },
    display: {
        panelResponseMaxMs: 300, // < 300ms panel animation
        formattingRequired: true, // Syntax highlighting
        persistentAccessRequired: true // Session-long availability
    },
    automation: {
        automaticDisplayRequired: true, // No manual intervention
        conditionalDisplayRequired: true, // Only when artifacts exist
        gracefulCloseRequired: true // Smooth panel management
    }
};
//# sourceMappingURL=contract.js.map