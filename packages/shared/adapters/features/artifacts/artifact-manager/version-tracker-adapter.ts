/**
 * Version Tracker Adapter
 * Transforms between artifact version utility and the artifact manager feature
 * Follows AI-Native architecture - stays under 100 lines
 */

import type { Artifact } from "../../../../models/artifacts/artifact";
import type { Version } from "../../../../models/artifacts/version";
import * as artifactValidator from "../../../../utils/artifact-validator";

// Helper functions extracted outside returned object (AI-native pattern)
function getNextVersionNumberHelper(versions: Map<string, Version[]>, artifactId: string): number {
  const artifactVersions = versions.get(artifactId) || [];
  return artifactVersions.length + 1;
}

function generateContentHashHelper(content: string): string {
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Adapter for version tracking operations
 * Transforms utility functions into feature-specific interface
 */
export function createVersionTrackerAdapter() {
  // In-memory storage for demo - real implementation would use database
  const versions: Map<string, Version[]> = new Map();

  return {
    async createVersion(artifactId: string, content: string, description?: string): Promise<Version> {
      const versionNumber = getNextVersionNumberHelper(versions, artifactId);
      const hash = generateContentHashHelper(content);
      
      const version: Version = {
        id: `${artifactId}_v${versionNumber}`,
        artifactId,
        versionNumber,
        content,
        contentHash: hash,
        description: description || `Version ${versionNumber}`,
        createdAt: new Date(),
        metadata: {
          size: content.length,
          hash
        }
      };

      const artifactVersions = versions.get(artifactId) || [];
      artifactVersions.push(version);
      versions.set(artifactId, artifactVersions);

      return version;
    },

    async getVersions(artifactId: string): Promise<Version[]> {
      return versions.get(artifactId) || [];
    },

    async getVersion(artifactId: string, versionNumber: number): Promise<Version | null> {
      const artifactVersions = versions.get(artifactId) || [];
      return artifactVersions.find(v => v.versionNumber === versionNumber) || null;
    },

    async deleteVersion(artifactId: string, versionNumber: number): Promise<boolean> {
      const artifactVersions = versions.get(artifactId) || [];
      const index = artifactVersions.findIndex(v => v.versionNumber === versionNumber);
      
      if (index === -1) return false;
      
      artifactVersions.splice(index, 1);
      versions.set(artifactId, artifactVersions);
      return true;
    },

    async restoreVersion(artifactId: string, versionNumber: number): Promise<Artifact> {
      const artifactVersions = versions.get(artifactId) || [];
      const version = artifactVersions.find(v => v.versionNumber === versionNumber) || null;
      
      if (!version) {
        throw new Error(`Version ${versionNumber} not found for artifact ${artifactId}`);
      }
      
      // Create rollback version before restoring
      const rollbackVersionNumber = getNextVersionNumberHelper(versions, artifactId);
      const rollbackHash = generateContentHashHelper(version.content);
      
      const rollbackVersion: Version = {
        id: `${artifactId}_v${rollbackVersionNumber}`,
        artifactId,
        versionNumber: rollbackVersionNumber,
        content: version.content,
        contentHash: rollbackHash,
        description: "rollback",
        createdAt: new Date(),
        metadata: {
          size: version.content.length,
          hash: rollbackHash
        }
      };
      
      const artifactVersionsForRollback = versions.get(artifactId) || [];
      artifactVersionsForRollback.push(rollbackVersion);
      versions.set(artifactId, artifactVersionsForRollback);
      
      const restoredArtifact: Artifact = {
        id: artifactId,
        title: "Restored Artifact",
        type: "code",
        content: version.content,
        conversationId: "",
        messageId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          size: version.content.length,
          version: version.versionNumber,
          tags: []
        }
      };

      return restoredArtifact;
    }
  };
}
