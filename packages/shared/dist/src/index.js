// AI-Native Shared Package - Contract-Driven Exports
// This file exports all contracts, models, services, events, and utilities
// following the AI-native architecture dependency hierarchy
// EXPERIENCE CONTRACTS (Layer 0)
// Experience contracts define user goals and serve as coordination points
// FEATURE CONTRACTS (Layer 1) 
// Feature contracts implement business logic to fulfill experience contracts
// SERVICE CONTRACTS (Layer 2)
// Service contracts define inter-feature communication protocols
// EVENT CONTRACTS (Layer 3)
// Event contracts define asynchronous messaging and coordination
// MODEL CONTRACTS (Layer 4)
// Pure data structures with no logic - shared across all layers
// UTILITY CONTRACTS (Layer 5)
// Pure functions with no context awareness
// Core utilities that are always available
export * from './utils/event-bus';
// Export a default configuration for the shared package
export const SHARED_PACKAGE_CONFIG = {
    name: '@olympian/shared',
    version: '1.0.0',
    architecture: 'ai-native-contracts',
    layer_hierarchy: [
        'experience', // Layer 0
        'features', // Layer 1  
        'services', // Layer 2
        'events', // Layer 3
        'models', // Layer 4
        'utils' // Layer 5
    ]
};
// Runtime contract validation (placeholder)
export function validateContractIntegrity() {
    // This would validate the contract dependency graph
    return true;
}
//# sourceMappingURL=index.js.map