/**
 * Artifact validation utility - pure functions
 */

import { ArtifactType, ArtifactValidation, ValidationError } from '../models/artifacts/artifact.js';

export interface ValidationConfig {
  readonly maxSize: number;
  readonly allowedTypes: ArtifactType[];
  readonly strictMode: boolean;
}

/**
 * Default validation configuration
 */
export function getDefaultValidationConfig(): ValidationConfig {
  return {
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['code', 'html', 'react', 'svg', 'mermaid', 'json', 'csv', 'markdown', 'text'],
    strictMode: false
  };
}

/**
 * Validate artifact content
 */
export function validateArtifact(
  type: ArtifactType,
  content: string,
  config: ValidationConfig = getDefaultValidationConfig()
): ArtifactValidation {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  
  // Check if type is allowed
  if (!config.allowedTypes.includes(type)) {
    errors.push({
      code: 'INVALID_TYPE',
      message: 'Artifact type is not allowed'
    });
  }
  
  // Type-specific validation
  const typeErrors = validateByType(type, content);
  errors.push(...typeErrors);
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    size: new TextEncoder().encode(content).length
  };
}

/**
 * Validate content by artifact type
 */
export function validateByType(
  type: ArtifactType,
  content: string
): ValidationError[] {
  switch (type) {
    case 'json':
      return validateJson(content);
    case 'html':
      return validateHtml(content);
    case 'react':
      return validateReact(content);
    default:
      return [];
  }
}

/**
 * Validate JSON content
 */
export function validateJson(content: string): ValidationError[] {
  try {
    JSON.parse(content);
    return [];
  } catch (error) {
    return [{
      code: 'INVALID_JSON',
      message: 'Invalid JSON format'
    }];
  }
}

/**
 * Validate HTML content
 */
export function validateHtml(content: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!content.includes('<') || !content.includes('>')) {
    errors.push({
      code: 'INVALID_HTML',
      message: 'Content does not appear to be valid HTML'
    });
  }
  
  return errors;
}

/**
 * Validate React component
 */
export function validateReact(content: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!content.includes('export default')) {
    errors.push({
      code: 'MISSING_EXPORT',
      message: 'React component should have default export'
    });
  }
  
  return errors;
}
