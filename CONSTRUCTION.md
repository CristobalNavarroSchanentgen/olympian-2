# Olympian AI Construction & Contract Validation Guide

## Purpose
This document defines the construction process and contract validation requirements for the Olympian AI system, ensuring end-to-end coherence from user interaction to backend services.

## Current System Issues

### Critical Contract Violations Found:

1. **Client Service Layer Violations**
   - packages/client/src/services/chat-service.ts incorrectly transforms ALL responses to arrays
   - Breaks contract for getOllamaStatus() which should return an object
   - Breaks data extraction for getModels() which receives {models: [...]} but expects array

2. **API Response Format Mismatches**
   - Server: /api/ollama/models returns { models: [...], count: n }
   - Client: Expects direct array of models
   - No adapter layer to transform between formats

3. **Missing Architecture Components**
   - No proper contract definitions for ollama-connector feature
   - Missing HTTP adapters for API response transformation
   - Service implementations not following defined interfaces

## Contract Validation Checklist

### 1. Feature Contract Definition
- [ ] Contract file exists at features/[domain]/[feature]/contract.ts
- [ ] All external interfaces are defined
- [ ] Input/output types are explicit
- [ ] Error cases are documented

### 2. Service Interface Compliance
- [ ] Service interface exists in services/[service-name].ts
- [ ] All methods have proper TypeScript signatures
- [ ] Return types match contract expectations
- [ ] Error handling is consistent

### 3. Transport Layer Implementation
- [ ] HTTP endpoints implement ALL service contract methods
- [ ] WebSocket handlers implement ALL real-time contract methods
- [ ] Response formats match client expectations
- [ ] Status codes are consistent

### 4. Client-Server Data Flow
- [ ] API client preserves response structure
- [ ] No incorrect data transformations
- [ ] Error responses are handled properly
- [ ] Type safety is maintained

### 5. Adapter Layer Verification
- [ ] Adapters exist for all external dependencies
- [ ] Input transformation is correct
- [ ] Output transformation maintains contract
- [ ] Edge cases are handled

## Build Verification Process

### Pre-Build Checks
1. Verify all contracts exist
2. Check service implementations match interfaces
3. Verify API routes implement service contracts
4. Validate adapter transformations

### Build Process
1. Clean build: make clean
2. Build with type checking: npm run build
3. Run contract validation tests: npm run test:contracts
4. Verify Docker images: make build-docker

### Post-Build Validation
1. Start services: make quick-docker-multi
2. Test API endpoints manually
3. Verify WebSocket connections in browser
4. Monitor logs for contract violations: make logs

## Critical Fixes Required

### 1. Fix Client Service Layer
The chat-service.ts file has a systematic bug where ALL methods return arrays:

BROKEN CODE:
async getOllamaStatus(): Promise<{ connected: boolean; baseUrl: string }> {
  const { data } = await api.get('/ollama/status');
  return Array.isArray(data) ? data : [];  // WRONG - always returns array
}

CORRECT CODE:
async getOllamaStatus(): Promise<{ connected: boolean; baseUrl: string }> {
  const { data } = await api.get('/ollama/status');
  return data;  // Return object as-is
}

For models endpoint:
async getModels(): Promise<any[]> {
  const { data } = await api.get('/ollama/models');
  return data.models || [];  // Extract models array from response object
}

### 2. Standardize API Response Format
Either:
- Option A: Change server to return array directly
- Option B: Create adapter in client to transform response

### 3. Implement Missing Contracts
Create proper contract definitions for all features listed in manifest.yaml

## Construction Principles

1. **Contract-First Development**
   - Define contracts before implementation
   - All changes must maintain contract compatibility
   - Breaking changes require version updates

2. **End-to-End Type Safety**
   - Use TypeScript strict mode
   - No any types in contracts
   - Validate at runtime boundaries

3. **Adapter Pattern Enforcement**
   - All external dependencies through adapters
   - Transform data at adapter boundaries
   - Keep business logic pure

4. **Service Layer Consistency**
   - One service interface, multiple implementations
   - Transport layers are just service proxies
   - No business logic in transport layer

5. **Observability Requirements**
   - Log all contract violations
   - Monitor service health
   - Track data transformation errors

## Validation Matrix

| Layer | Component | Validation Method | Success Criteria |
|-------|-----------|-------------------|------------------|
| UI | Components | TypeScript + Runtime | Props match contracts |
| Client Services | API Calls | Response validation | Data structures preserved |
| API Routes | Endpoints | Integration tests | Status codes correct |
| Services | Business Logic | Unit tests | Contract compliance |
| Database | Schemas | Migration tests | Data integrity |

## Continuous Validation

### Development Time
- ESLint rules for contract compliance
- TypeScript strict checks
- Pre-commit hooks for validation

### Build Time
- Contract compatibility tests
- API response format validation
- End-to-end type checking

### Runtime
- Contract violation logging
- Health check endpoints
- Monitoring dashboards

## Next Steps

1. **Immediate**: Fix client service data transformations
2. **Short-term**: Implement missing contract definitions
3. **Medium-term**: Add contract validation tests
4. **Long-term**: Automated contract compliance monitoring

---

**Remember**: Every data transformation is a potential contract violation. When in doubt, preserve the original structure and transform only at designated adapter boundaries.
