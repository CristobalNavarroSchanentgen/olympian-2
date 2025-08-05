/**
 * ERROR RECOVERY UI CONTRACT
 *
 * Enforces conversation experience requirements for graceful error handling,
 * transparent recovery mechanisms, and maintaining conversation flow continuity.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: robustErrorHandling
 */
/**
 * CONTRACT VALIDATION CRITERIA
 */
export const ErrorRecoveryContractValidation = {
    automation: {
        transparentRecoveryRate: 0.95, // > 95% automatic recovery
        userVisibleErrorsMax: 0.05, // < 5% require user action
        statePreservationRequired: true // Conversation state maintained
    },
    transparency: {
        transparentRetriesRequired: true, // Hidden recovery attempts
        fallbackRoutingRequired: true, // Automatic model switching
        gracefulDegradationRequired: true // Smooth feature degradation
    },
    usability: {
        minimalDisruption: true, // Workflow continuity
        actionableMessaging: true, // Clear error communication
        persistentSettings: true // User preferences maintained
    }
};
//# sourceMappingURL=contract.js.map