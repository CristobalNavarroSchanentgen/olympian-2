/**
 * REASONING PANEL UI CONTRACT
 *
 * Enforces conversation experience requirements for transparent AI reasoning display,
 * milestone tracking, and reasoning exploration controls.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: transparentReasoning
 */
/**
 * CONTRACT VALIDATION CRITERIA
 */
export const ReasoningPanelContractValidation = {
    availability: {
        reasoningModelsSupported: 1.0, // 100% reasoning model coverage
        instantToggle: true, // Immediate show/hide
        milestoneClarity: true // Clear reasoning breakdown
    },
    userExperience: {
        trustBuilding: true, // Transparency builds trust
        nonIntrusive: true, // Optional display
        informative: true, // Adds understanding value
        navigable: true // Can explore reasoning
    }
};
//# sourceMappingURL=contract.js.map