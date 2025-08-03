# Olympian AI - Architectural Contract Enforcement Plan

## The Contract-First Philosophy

In traditional software architectures, complexity grows exponentially as systems scale. Dependencies become tangled, side effects multiply, and understanding the system requires holding vast mental models. The AI-native architecture flips this paradigm through strict contract enforcement.

### The Flow of Contract Respect

Imagine contracts as rivers that carve clear channels through the codebase:

1. **Contracts Define Reality**: A contract isn't documentation - it's the source of truth. When a contract says a service exists, it must exist. When it defines an interface, that interface is sacred.

2. **Features as Orchestrators**: Features are the conductors of the symphony. They don't implement business logic directly; they orchestrate it by calling services through contracts. This separation ensures that transport layers (HTTP, WebSocket) never touch implementation details.

3. **Adapters as Translators**: The external world is messy. Adapters translate this mess into the clean, predictable interfaces our features expect. They're the only place where implementation details are allowed to leak.

4. **Events as Conversations**: Features don't shout into the void - they emit events that other features can listen to. This creates a natural flow of information without tight coupling.

### Why Contract Breaches Cascade

When we violate these principles, the architecture doesn't just degrade - it collapses:
- A WebSocket calling a service directly bypasses the entire orchestration layer
- A missing service registration creates a phantom dependency
- Mismatched API contracts create silent failures that ripple through the system

### The Power of Enforcement

When contracts are strictly enforced:
- **Minimal Context**: Any developer (human or AI) can understand a component by reading only its contract
- **Natural Boundaries**: Features can't accidentally become tightly coupled
- **Self-Healing**: Contract violations are immediately visible, not hidden in runtime behavior
- **AI-Friendly**: LLMs can navigate the codebase efficiently without loading entire contexts

## Critical Contract Breaches to Fix

### 1. API Response Format Mismatch (BLOCKING ISSUE)
**Breach**: Server wraps responses in objects, client expects raw data
**Fix**: Standardize on unwrapped responses
- Server: Change `res.json({ conversation })` to `res.json(conversation)`
- Server: Change `res.json({ conversations })` to `res.json(conversations)`
- Apply to ALL routes: conversations, messages, artifacts, mcp, ollama

### 2. Feature-First Transport Layer
**Breach**: WebSocket handlers call services directly
**Fix**: Create and use features as orchestrators
```typescript
// Current (WRONG):
this.conversationService.createConversation()

// Fixed (CORRECT):
this.conversationManager.createConversation()
```

### 3. Service Registration
**Breach**: Manifest services not instantiated
**Fix**: Only keep services that have implementations
- Remove from manifest.yaml: streaming-service, process-service, memory-service, tool-service, health-service, code-editor-service, connection-service, detection-service, image-service, layout-service, logging-service, reasoning-service
- OR create stub implementations if needed later

### 4. Integration Function Usage
**Breach**: title-generation-integration.ts exists but unused
**Fix**: Import and use in server initialization
```typescript
import { createTitleGenerationIntegration } from '../../../integrations/title-generation-integration';
```

### 5. Feature Instantiation
**Breach**: Features defined in manifest but not created
**Fix**: Instantiate all features in server init
- ConversationManager
- MessageProcessor
- TitleGenerator
- SmartModelRouter
- MemoryManager

## Implementation Order

### Phase 1: Fix Blocking Issues (Immediate)
1. **Fix API Response Format** - This unblocks the UI
   - Update all routes in `/packages/server/src/api/*`
   - Remove object wrapping from responses

### Phase 2: Restore Feature Architecture
1. **Import existing features**
   ```typescript
   import { ConversationManager } from '@olympian/shared/features/chat/conversation-manager';
   import { MessageProcessor } from '@olympian/shared/features/chat/message-processor';
   ```

2. **Wire features with their adapters**
   - Each feature gets its required adapters from manifest
   - Pass service implementations to features

3. **Update WebSocket to use features**
   - Replace all direct service calls with feature calls
   - Features orchestrate the business logic

### Phase 3: Complete Contract Compliance
1. **Use integration functions**
   - Import title-generation-integration
   - Let it wire the features together properly

2. **Verify event emissions**
   - Features emit events
   - WebSocket subscribes and forwards to clients

3. **Clean manifest.yaml**
   - Remove undefined services
   - Ensure all listed services exist

## Validation Checklist
- [ ] All API responses are unwrapped
- [ ] WebSocket never calls services directly
- [ ] All manifest services have implementations
- [ ] Integration functions are imported and used
- [ ] Features are instantiated with proper dependencies
- [ ] Events flow: Feature → Event Bus → WebSocket → Client

## Architecture Principles Reminder
- **Features orchestrate, services execute**
- **Transport layers call features, not services**
- **Every manifest entry must have an implementation**
- **Integration functions wire features together**
- **Contracts are the source of truth**

## Success Criteria
- Conversations can be created without errors
- Model selection works properly
- Messages flow through the feature layer
- All architectural rules pass validation
