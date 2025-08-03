# Olympian AI - Architectural Contract Enforcement Plan

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
