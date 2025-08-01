# Olympian AI-Native Architecture: Model Selector Implementation Plan

## 🎯 Current Status
**✅ FOUNDATION COMPLETE:** Model selector features are properly registered in manifest.yaml with full contract definitions, adapters, events, and config schemas.

**🔄 NEXT PHASE:** Wire the backend features to frontend components using AI-native architecture patterns.

## 🏗️ AI-Native Architecture Approach

### Core Principle
Every component follows the contract-first, adapter-based pattern:
- **Features** define business logic through contracts
- **Adapters** transform between utilities and feature expectations  
- **Services** provide interface-only communication between features
- **Events** enable async feature communication

### Implementation Strategy
Work feature-by-feature, leveraging contracts to minimize context switching.

## 📋 Implementation Roadmap

### Phase 1: Service Registration & Dependency Injection
**Objective:** Register model selector services in the application bootstrap

**Tasks:**
1. **Update Service Registry** (`packages/server/src/services/`)
   - Register `TextModelSelectorService` implementation
   - Register `VisionModelSelectorService` implementation
   - Wire to existing `ModelRegistryService`

2. **Bootstrap Integration** (`packages/server/src/server.ts`)
   - Add model selector services to DI container
   - Initialize with proper adapter dependencies

**Architecture Benefit:** Services remain interface-only, implementations stay isolated

### Phase 2: Frontend Integration
**Objective:** Create React components that consume the model selector contracts

**Tasks:**
1. **Create UI Components** (`packages/client/src/components/model-selector/`)
   - `TextModelDropdown.tsx` - Consumes TextModelSelectorContract
   - `VisionModelDropdown.tsx` - Consumes VisionModelSelectorContract
   - `ModelSelectorPanel.tsx` - Combines both selectors

2. **WebSocket Event Handlers** (`packages/client/src/hooks/`)
   - `useTextModelSelector.ts` - Handles text-model events
   - `useVisionModelSelector.ts` - Handles vision-model events
   - Subscribe to: `text-model-selected`, `vision-model-selected`, `model-selection-failed`

**Architecture Benefit:** Components only know about contracts, not implementations

### Phase 3: Integration Testing
**Objective:** Verify end-to-end model selection workflow

**Tasks:**
1. **Contract Testing** 
   - Test each feature contract independently
   - Verify adapter transformations work correctly

2. **Integration Testing**
   - Test service-to-service communication
   - Verify event flow: selection → validation → persistence → UI update

3. **User Flow Testing**
   - Model dropdown population from registry
   - Model selection persistence
   - Smart routing integration

## 🔧 Technical Implementation Notes

### Working with Existing Infrastructure
- **Model Registry:** Already provides `getAllRegisteredModels()` and `getModelCapability()`
- **Smart Router:** Already consumes model selections for routing decisions
- **WebSocket Handler:** Already set up for real-time model communication

### Adapter Requirements
- `text-model-filter-adapter.ts` - Filter registry models for text generation
- `vision-model-filter-adapter.ts` - Filter registry models for vision capabilities  
- `selection-persistence-adapter.ts` - Save/load user model preferences

### Event Flow
```
User selects model → Validation → Persistence → Event emission → UI update → Smart router uses selection
```

## 🎯 Success Criteria
1. **Model dropdowns populate** from registry data
2. **User selections persist** across sessions
3. **Smart routing uses** selected models for appropriate content
4. **Real-time updates** when model availability changes
5. **Error handling** with fallback suggestions

## 📁 Key Files to Modify
- `packages/server/src/server.ts` - Service registration
- `packages/client/src/components/` - React components
- `packages/client/src/hooks/` - WebSocket event handling
- `packages/client/src/stores/` - State management integration

## 🚀 Next Actions
1. Start with Phase 1: Service registration
2. Test contracts work in isolation  
3. Build UI components incrementally
4. Test integration end-to-end

**Architecture Advantage:** Each phase can be developed and tested independently, with clear contracts defining boundaries between components.

