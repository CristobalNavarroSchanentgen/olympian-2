# Model Registry UI Integration Plan

## 🎯 Project Objective

Integrate the fixed model registry with the UI to provide distinct model selectors for text-to-text and vision models, enabling users to route requests to appropriate Ollama models through the predefined registry system.

## 🏗️ Architecture Integration Strategy

This plan leverages the existing AI-Native architecture to seamlessly integrate model selection capabilities while maintaining the contract-first, minimal-context principles already established.

### Current Architecture Assets
- ✅ Fixed model registry: `packages/shared/models/connection/model-registry.ts`
- ✅ ModelRegistryManager: `packages/shared/features/connection/model-registry/`
- ✅ Registry adapter: `packages/shared/adapters/features/connection/model-registry/`
- ✅ WebSocket chat infrastructure
- ✅ Ollama connection service

## 📋 Implementation Phases

### Phase 1: Model Selection UI Features 🚀

#### 1.1 Text Model Selector Feature
**Location:** `packages/shared/features/ui/text-model-selector/`

**Contract:** `contract.ts`
```typescript
export interface TextModelSelectorContract {
  // Get available text-generation models from registry
  getAvailableTextModels(): Promise<ModelCapabilityDefinition[]>;
  
  // Get currently selected text model
  getCurrentTextModel(): Promise<string | null>;
  
  // Set selected text model
  setTextModel(modelName: string): Promise<void>;
  
  // Validate text model selection
  validateTextModelSelection(modelName: string): Promise<ValidationResult>;
}
```

**Dependencies:**
- Services: `model-registry-service`, `user-preference-service`
- Adapters: `text-model-filter-adapter`, `selection-persistence-adapter`
- Events: `text-model-selected`, `text-model-validation-failed`

**Implementation:** `index.ts`
- Filter registry models by `capabilities: ['text-generation']`
- Exclude vision-only models (`hasVision: true` without text-generation)
- Persist user selection via adapter
- Emit selection events

#### 1.2 Vision Model Selector Feature  
**Location:** `packages/shared/features/ui/vision-model-selector/`

**Contract:** `contract.ts`
```typescript
export interface VisionModelSelectorContract {
  // Get available vision models from registry
  getAvailableVisionModels(): Promise<ModelCapabilityDefinition[]>;
  
  // Get currently selected vision model
  getCurrentVisionModel(): Promise<string | null>;
  
  // Set selected vision model
  setVisionModel(modelName: string): Promise<void>;
  
  // Check if vision model is required for current input
  isVisionModelRequired(input: MessageInput): Promise<boolean>;
}
```

**Dependencies:**
- Services: `model-registry-service`, `user-preference-service`
- Adapters: `vision-model-filter-adapter`, `image-detection-adapter`
- Events: `vision-model-selected`, `vision-input-detected`

**Implementation:** `index.ts`
- Filter registry models by `hasVision: true`
- Auto-detect image uploads requiring vision models
- Fallback to text model when no images present

### Phase 2: Registry Integration Adapters 🔧

#### 2.1 Model Filter Adapters
**Location:** `packages/shared/adapters/features/ui/text-model-selector/`

**Text Model Filter Adapter:** `text-model-filter-adapter.ts`
```typescript
export function createTextModelFilterAdapter(): ModelFilterAdapter {
  return {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
      return models.filter(model => 
        model.capabilities.includes('text-generation') && 
        !isVisionOnlyModel(model)
      );
    }
  };
}
```

**Vision Model Filter Adapter:** `vision-model-filter-adapter.ts`
```typescript
export function createVisionModelFilterAdapter(): ModelFilterAdapter {
  return {
    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
      return models.filter(model => model.hasVision === true);
    }
  };
}
```

#### 2.2 Selection Persistence Adapter
**Location:** `packages/shared/adapters/features/ui/model-selector/`

**Selection Persistence Adapter:** `selection-persistence-adapter.ts`
```typescript
export function createSelectionPersistenceAdapter(): SelectionAdapter {
  return {
    saveTextModelSelection(modelName: string): Promise<void>,
    saveVisionModelSelection(modelName: string): Promise<void>,
    getTextModelSelection(): Promise<string | null>,
    getVisionModelSelection(): Promise<string | null>
  };
}
```

### Phase 3: Chat Router Enhancement 📡

#### 3.1 Smart Model Router Feature
**Location:** `packages/shared/features/chat/smart-model-router/`

**Contract:** `contract.ts`
```typescript
export interface SmartModelRouterContract {
  // Route message to appropriate model based on content and user selection
  routeMessage(input: MessageInput, userSelections: ModelSelections): Promise<ModelRoutingDecision>;
  
  // Validate routing decision against registry
  validateRouting(decision: ModelRoutingDecision): Promise<ValidationResult>;
  
  // Get fallback model if primary selection fails
  getFallbackModel(failedModel: string, inputType: 'text' | 'vision'): Promise<string>;
}
```

**Dependencies:**
- Services: `model-registry-service`, `text-model-selector-service`, `vision-model-selector-service`
- Adapters: `content-analyzer-adapter`, `model-availability-adapter`
- Events: `model-routed`, `routing-failed`, `fallback-triggered`

**Implementation:** `index.ts`
- Analyze input content for images/vision requirements
- Route to vision model if images detected AND vision model selected
- Route to text model for text-only content
- Validate selected model exists in registry and is available on Ollama
- Handle fallback scenarios

#### 3.2 Content Analyzer Adapter
**Location:** `packages/shared/adapters/features/chat/smart-model-router/`

**Content Analyzer Adapter:** `content-analyzer-adapter.ts`
```typescript
export function createContentAnalyzerAdapter(): ContentAnalyzerAdapter {
  return {
    detectImages(input: MessageInput): boolean {
      return input.attachments?.some(att => att.type.startsWith('image/')) || false;
    },
    
    requiresVision(input: MessageInput): boolean {
      return this.detectImages(input);
    },
    
    getContentType(input: MessageInput): 'text' | 'vision' | 'mixed' {
      const hasImages = this.detectImages(input);
      const hasText = input.content?.trim().length > 0;
      
      if (hasImages && hasText) return 'mixed';
      if (hasImages) return 'vision';
      return 'text';
    }
  };
}
```

### Phase 4: UI Component Implementation 🎨

#### 4.1 React Model Selector Components
**Location:** `packages/client/src/components/model-selectors/`

**TextModelSelector.tsx**
```typescript
export function TextModelSelector() {
  const { availableModels, selectedModel, selectModel } = useTextModelSelector();
  
  return (
    <select 
      value={selectedModel || ''} 
      onChange={(e) => selectModel(e.target.value)}
      className="model-selector text-model-selector"
    >
      <option value="">Select Text Model...</option>
      {availableModels.map(model => (
        <option key={model.modelName} value={model.modelName}>
          {model.modelName} ({model.capabilities.join(', ')})
        </option>
      ))}
    </select>
  );
}
```

**VisionModelSelector.tsx**
```typescript
export function VisionModelSelector() {
  const { availableModels, selectedModel, selectModel } = useVisionModelSelector();
  
  return (
    <select 
      value={selectedModel || ''} 
      onChange={(e) => selectModel(e.target.value)}
      className="model-selector vision-model-selector"
    >
      <option value="">Select Vision Model...</option>
      {availableModels.map(model => (
        <option key={model.modelName} value={model.modelName}>
          {model.modelName} (Vision + {model.capabilities.filter(c => c !== 'vision').join(', ')})
        </option>
      ))}
    </select>
  );
}
```

#### 4.2 Custom Hooks for Model Selection
**Location:** `packages/client/src/hooks/`

**useTextModelSelector.ts**
```typescript
export function useTextModelSelector() {
  const [availableModels, setAvailableModels] = useState<ModelCapabilityDefinition[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const selectModel = useCallback(async (modelName: string) => {
    await textModelSelectorManager.setTextModel(modelName);
    setSelectedModel(modelName);
  }, []);
  
  // Load available models and current selection on mount
  // Subscribe to model selection events
  
  return { availableModels, selectedModel, selectModel };
}
```

### Phase 5: WebSocket Integration Updates 🔌

#### 5.1 Enhanced Chat Message Handler
**Location:** `packages/server/src/websocket/websocket-handler.ts`

**Updated handleChatMessage method:**
```typescript
async handleChatMessage(socket: Socket, data: any) {
  try {
    // Get user's model selections
    const modelSelections = await this.getModelSelections(socket.userId);
    
    // Route message to appropriate model
    const routingDecision = await this.smartModelRouter.routeMessage(data, modelSelections);
    
    // Validate against registry
    const validation = await this.smartModelRouter.validateRouting(routingDecision);
    
    if (!validation.allowed) {
      // Try fallback model
      const fallbackModel = await this.smartModelRouter.getFallbackModel(
        routingDecision.selectedModel, 
        routingDecision.inputType
      );
      routingDecision.selectedModel = fallbackModel;
    }
    
    // Stream chat with selected model
    await this.ollamaService.streamChat(routingDecision.selectedModel, data.messages, socket);
    
  } catch (error) {
    socket.emit('chat-error', { error: error.message });
  }
}
```

## 🎯 Expected Registry Models After Integration

### Text-Only Models (Text Selector)
- `phi4:14b` (text-generation)
- `llama3.2:3b` (text-generation) 
- `phi4-mini:3.8b` (text-generation, tool-use) 
- `deepseek-r1:14b` (text-generation, tool-use, reasoning)
- `qwen3:4b` (text-generation, tool-use, reasoning)
- `gemma3:4b` (text-generation)

### Vision Models (Vision Selector)  
- `llama3.2-vision:11b` (vision, text-generation)
- `granite3.2-vision:2b` (vision, text-generation)

## 📊 Implementation Timeline

### Week 1: Foundation
- **Days 1-2:** Model selector features (contracts + implementations)
- **Days 3-4:** Registry integration adapters
- **Day 5:** Smart model router feature

### Week 2: UI & Integration
- **Days 1-2:** React components and hooks
- **Days 3-4:** WebSocket integration updates
- **Day 5:** Testing and debugging

### Week 3: Polish & Deployment
- **Days 1-2:** Error handling and fallback scenarios
- **Days 3-4:** UI/UX improvements and validation
- **Day 5:** Documentation and deployment

## 🔧 Technical Validation

### Registry Validation
- ✅ 8 predefined models in `PREDEFINED_MODEL_REGISTRY`
- ✅ Clear capability distinctions (text vs vision)
- ✅ Proper metadata for routing decisions

### Architecture Validation
- ✅ Contract-first design maintains AI-native principles
- ✅ Adapter pattern isolates UI from registry complexity
- ✅ Event-driven communication for real-time updates
- ✅ Service boundaries preserved

### Integration Points
- ✅ Existing ModelRegistryManager ready for UI integration
- ✅ WebSocket infrastructure supports enhanced routing
- ✅ Ollama service can handle dynamic model selection

## 🎉 Success Criteria

1. **User Experience:** Two distinct, functional model selectors in UI
2. **Registry Integration:** All 8 registry models properly categorized and available
3. **Smart Routing:** Messages automatically routed to appropriate selected models
4. **Error Handling:** Graceful fallbacks when models unavailable
5. **Persistence:** User selections persist across sessions
6. **Real-time Updates:** Model availability updates reflected immediately in UI

## 🚀 Next Steps

1. **Initialize Phase 1:** Create model selector feature contracts
2. **Implement Registry Filters:** Build text/vision model filtering adapters  
3. **Smart Router Development:** Implement content-aware model routing
4. **UI Component Creation:** Build React model selector components
5. **WebSocket Enhancement:** Update chat handlers for dynamic model routing

This plan transforms the existing fixed registry into a dynamic, user-controlled model selection system while preserving the AI-native architecture principles and ensuring seamless integration with the current chat infrastructure.
