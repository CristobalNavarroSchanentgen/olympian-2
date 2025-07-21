/**
 * Artifact Validator Utility
 * Pure functions for validating artifacts
 */
import type { Artifact } from '../models/artifacts/artifact';
export interface ValidationResult {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
    errors: string[];
}
export declare function validateArtifact(artifact: Partial<Artifact>): ValidationResult;
//# sourceMappingURL=artifact-validator.d.ts.map