# Model Selector Architecture

## Overview

The Model Selector is a key UI component that allows users to select AI models before sending messages. This document outlines the AI-native architecture implementation that was added to fix the model selection propagation issue.

## Problem Statement

The original system had:
- Hardcoded model references (`llama3.2:latest` vs available `llama3.2:3b`)
- No visible model selector UI
- Messages could be sent without model selection
- Model selection didn't propagate from UI to backend properly

## Architecture Solution

Following the AI-native codebase principles, the model selector was implemented using:

### 1. Features Layer (`features/ui/text-model-selector/`)

**Contract**: `features/ui/text-model-selector/contract.ts`
```typescript
export interface TextModelSelectorContract {
  getAvailableTextModels(): Promise<ModelCapability[]>;
  getCurrentTextModel(): Promise<string | null>;
  setTextModel(modelName: string): Promise<void>;
  validateTextModelSelection(modelName: string): Promise<ValidationResult>;
  isModelAvailable(modelName: string): Promise<boolean>;
}
```

### 2. UI Components (`packages/client/src/components/model-selector/`)

**Components Created:**
- `TextModelDropdown.tsx` - Dropdown component for text model selection
- `VisionModelDropdown.tsx` - Dropdown component for vision model selection  
- `ModelSelectorPanel.tsx` - Combined panel for both selectors

**Integration:** Added to `ConversationPanel.tsx` header with settings icon

### 3. Hooks (`packages/client/src/hooks/model-selector/`)

**`useTextModelSelector.ts`** - WebSocket-based hook for model selection:
```typescript
export function useTextModelSelector() {
  const socket = useWebSocket();
  const [state, setState] = useState<TextModelSelectorState>({
    selectedModel: null,
    availableModels: [],
    isLoading: false,
    error: null
  });
  
  // WebSocket event handlers for:
  // - text-model-selected
  // - model-selection-failed  
  // - text-models:available
}
```

### 4. Services (`packages/server/src/services/`)

**ModelRegistryServiceImpl** - Enhanced to sync with real Ollama models:
```typescript
export class ModelRegistryServiceImpl implements ModelRegistryService {
  constructor(ollamaService?: OllamaService) {
    this.ollamaService = ollamaService;
    // Auto-refresh models from Ollama every 30 seconds
    setInterval(() => this.refreshModelsFromOllama(), 30000);
  }
  
  private async refreshModelsFromOllama(): Promise<void> {
    const ollamaModels = await this.ollamaService.getModels();
    // Convert to ModelCapabilityDefinition with capabilities detection
  }
}
```

### 5. WebSocket Events

**Client ? Server:**
- `text-models:request` - Request available text models
- `text-model:select` - Select a specific model

**Server ? Client:**
- `text-models:available` - List of available models
- `text-model-selected` - Confirmation of selection
- `model-selection-failed` - Error in selection

### 6. State Management

**App Store** (`packages/client/src/stores/app-store.ts`):
```typescript
interface AppState {
  textModel: string;
  visionModel: string;
  setTextModel: (model: string) => void;
  setVisionModel: (model: string) => void;
}
```

## Key Features Implemented

### 1. Visible Model Selector UI
- Added settings button in conversation header
- Dropdown shows available models with display names
- Visual indicator when no model is selected (red dot)
- Warning message when model is required

### 2. Model Requirement Enforcement
- Message input disabled until model selected
- Clear messaging: "Select a model above to start chatting"
- Attach and send buttons disabled without model

### 3. Real-time Model Discovery
- ModelRegistry syncs with Ollama every 30 seconds
- Detects model capabilities (text, vision, code)
- Provides fallback suggestions for unavailable models

### 4. Smart Model Fallback
- If `llama3.2:latest` requested but only `llama3.2:3b` available
- Automatically selects best available alternative
- Logs fallback decisions for debugging

### 5. Type-Safe Implementation
- Full TypeScript coverage with proper interfaces
- Component props properly typed
- WebSocket events typed for safety

## File Changes Made

### UI Components
- ? `packages/client/src/components/ui/ConversationPanel.tsx` - Added model selector
- ? `packages/client/src/components/chat/MessageInput.tsx` - Added disabled state
- ? `packages/client/src/components/model-selector/*` - Already existed, now integrated

### Services & Backend
- ? `packages/server/src/services/model-registry-service-impl.ts` - Enhanced with Ollama sync
- ? `packages/server/src/websocket/websocket-handler.ts` - Complete rewrite for streaming
- ? `packages/server/src/index.ts` - Fixed service initialization wiring

### Hooks & State
- ? `packages/client/src/hooks/model-selector/useTextModelSelector.ts` - Already existed
- ? `packages/client/src/stores/app-store.ts` - Already had model state

## Usage Flow

1. **User opens chat interface**
   - ConversationPanel shows "No Model" with red indicator
   - Message input is disabled with explanatory text

2. **User clicks settings button**
   - Model selector dropdown opens
   - WebSocket request sent: `text-models:request`
   - Server responds with available models from Ollama

3. **User selects model**
   - Selection sent via WebSocket: `text-model:select`
   - Server validates and confirms: `text-model-selected`
   - App store updated, UI enabled

4. **User sends message**
   - Message includes selected model
   - Server uses model fallback if needed
   - Streaming response returned

## WebSocket Message Flow

```
Client                    Server
  |                        |
  |-- text-models:request->|
  |                        |-- Ollama.getModels()
  |                        |-- ModelRegistry.process()
  |<--text-models:available|
  |                        |
  |-- text-model:select -->|
  |                        |-- ModelRegistry.validate()
  |<-- text-model-selected |
  |                        |
  |-- chat:message ------->|
  |                        |-- OllamaService.streamChat()
  |<-- chat:stream --------|
```

## Error Handling

### Model Not Available
- Server provides suggested alternatives
- UI shows error with suggestions
- Fallback to best available model

### Connection Issues
- Graceful degradation with cached models
- Retry mechanisms for WebSocket connections
- User feedback for connection status

### Invalid Selections
- Validation before enabling message input
- Clear error messages
- Automatic recovery suggestions

## Testing Strategy

### Manual Testing
1. Start with no models selected
2. Verify message input is disabled
3. Open model selector, verify models load
4. Select model, verify input enables
5. Send message, verify correct model used
6. Test with different model combinations

### Integration Points
- WebSocket event handling
- State synchronization between components
- Model registry updates
- Ollama connection resilience

## Future Enhancements

1. **Model Performance Metrics** - Show response times, success rates
2. **Model Recommendations** - Suggest best model for task type
3. **Batch Model Loading** - Preload models in background
4. **Model Switching Mid-Conversation** - Allow changing models per message
5. **Custom Model Configurations** - Temperature, max tokens, etc.

## Troubleshooting

### Model Not Showing
- Check Ollama connection in server logs
- Verify WebSocket connection in browser dev tools
- Check model registry refresh intervals

### Selection Not Persisting
- Verify app store persistence configuration
- Check WebSocket event handlers
- Validate model names match exactly

### Streaming Issues
- Check OllamaService error logs
- Verify model exists in Ollama
- Test model fallback logic

## Architecture Benefits

1. **Separation of Concerns** - UI, business logic, and services cleanly separated
2. **Type Safety** - Full TypeScript coverage prevents runtime errors  
3. **Real-time Updates** - WebSocket integration for immediate feedback
4. **Resilient Fallbacks** - Smart model selection and error recovery
5. **Developer Experience** - Clear contracts and minimal context requirements