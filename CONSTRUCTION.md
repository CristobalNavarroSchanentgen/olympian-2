# Chat History & AI-Generated Conversation Names Implementation Plan

## Purpose
This document outlines the implementation plan for adding chat history functionality with AI-generated conversation names to the Olympian AI system, following the AI-native architecture principles.

## Current System Analysis

### What Currently Exists (✅ Complete)

#### 1. Conversation Infrastructure
- Conversation Manager Feature (features/chat/conversation-manager/)
  - Contract with full CRUD operations for conversations
  - Database adapter for persistence
  - WebSocket adapter for real-time updates

- Data Models (packages/shared/models/chat/conversation.ts)
  - Conversation interface with id, title, createdAt, updatedAt, etc.
  - ConversationSummary for list views
  - ConversationFilter for search/filtering

- Service Layer (packages/shared/services/conversation-service.ts)
  - Complete interface for conversation operations
  - Client-side implementation (packages/client/src/services/chat-service.ts)

#### 2. UI Infrastructure
- Left Panel (packages/client/src/components/chat/Sidebar.tsx)
  - Conversation list display
  - New conversation creation
  - Conversation deletion
  - Navigation between conversations
  - Model selector integration

- Dual Pane Layout (features/ui/dual-pane-layout/)
  - Already includes conversation panel props
  - Supports conversation history in the interface contract

#### 3. Message System
- Message models and services for accessing conversation content
- First message content available for title generation

## Implementation Plan

### Phase 1: AI Title Generation Feature (🚧 New)

#### Backend Architecture
Location: features/chat/conversation-title-generator/

Required Files:
```
features/chat/conversation-title-generator/
├── contract.ts              # Interface for title generation
├── index.ts                 # Feature implementation
└── config/
    └── schema.ts            # Configuration for title generation

adapters/features/chat/conversation-title-generator/
├── ollama-title-adapter.ts  # Adapter for Ollama model calls
├── prompt-adapter.ts        # Adapter for title generation prompts
└── message-content-adapter.ts # Extract first user message

events/
└── conversation-title-generated.ts  # Event schema

models/chat/
├── title-generation-request.ts     # Request/response models
└── title-generation-config.ts      # Configuration models

services/
└── title-generation-service.ts     # Service interface
```

#### Contract Definition
```typescript
// features/chat/conversation-title-generator/contract.ts
export interface TitleGenerationRequest {
  conversationId: string;
  firstUserMessage: string;
  preferredModel?: string;
  maxLength?: number;
}

export interface TitleGenerationResult {
  title: string;
  confidence: number;
  model: string;
  tokensUsed: number;
}

export interface ConversationTitleGeneratorContract {
  generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResult>;
  validateTitle(title: string): boolean;
  getFallbackTitle(messageContent: string): string;
}
```

#### Service Integration
- Add title-generation-service.ts to services/
- Integrate with existing conversation-service 
- Connect to message-service for first message content
- Use existing Ollama connection infrastructure

### Phase 2: UI Enhancements & User Experience

#### 2.1 Enhanced Sidebar Component
File: packages/client/src/components/chat/Sidebar.tsx

New Features:
- Real-time title updates during generation
- Loading states for title generation
- Manual title editing capability
- Visual indicators for AI-generated vs user-set titles
- Error handling for failed title generation

UI States:
```typescript
interface ConversationItemState {
  conversation: Conversation;
  titleGenerating: boolean;
  titleError: boolean;
  isEditing: boolean;
  hasCustomTitle: boolean;
}
```

#### 2.2 Enhanced Conversation Display
New UI Elements:
- Shimmer effect during title generation
- Pencil icon for manual editing
- Tooltip showing "AI-generated" or "Custom title"
- Error state with retry option
- Timestamp with relative dates (e.g., "2 hours ago", "Yesterday")

#### 2.3 Title Edit Component
New File: packages/client/src/components/chat/ConversationTitleEditor.tsx

Features:
- Inline editing with Enter/Escape key handling
- Auto-save on blur
- Validation (length limits, special characters)
- Revert to AI-generated option

#### 2.4 Loading States & Feedback
Visual Indicators:
- Pulsing dot during title generation
- Success animation when title updates
- Error icon with retry button
- Progress indicator for batch operations

### Phase 3: Auto-Naming Workflow

#### 3.1 Event-Driven Title Generation
Trigger Points:
1. User creates new conversation → gets "New Chat" title
2. User sends first message → triggers title generation
3. AI generates title → updates conversation automatically
4. Real-time UI update via WebSocket

Event Flow:
```
User sends first message → message-sent event
→ Title generation triggered → conversation-title-generated event  
→ UI updates via WebSocket → Sidebar refreshes
```

#### 3.2 Configuration Options
File: config/features/chat/conversation-title-generator/schema.ts

Settings:
```typescript
export interface TitleGenerationConfig {
  enabled: boolean;
  model: string;                    // Preferred model for title generation
  maxTitleLength: number;           // Default: 50 characters
  fallbackBehavior: "timestamp" | "truncate" | "random";
  promptTemplate: string;
  retryAttempts: number;
  timeoutMs: number;
  autoUpdateEnabled: boolean;       // Allow auto-updates of existing titles
}
```

#### 3.3 Prompt Engineering
Default Prompt Template:
```
Generate a concise, descriptive title (max 6 words) for this conversation based on the users first message:

"{firstUserMessage}"

The title should:
- Capture the main topic/intent
- Be clear and specific
- Use title case
- Avoid generic words like "Question", "Help", "Chat"

Title:
```

### Phase 4: User Experience Testing Scenarios

#### 4.1 Happy Path Workflow
1. User clicks "New Chat"
   - Sidebar shows "New Chat" with shimmer effect
   - Chat area opens with welcome message

2. User types first message: "How do I set up Docker on Ubuntu?"
   - Message sends successfully
   - Title generation starts (loading indicator appears)
   - Within 2-3 seconds, title updates to "Docker Ubuntu Setup"

3. User continues conversation
   - Title remains stable
   - Conversation appears in sidebar with generated title
   - User can navigate between conversations easily

#### 4.2 Error Handling Scenarios
1. Title generation fails
   - Shows error icon with retry button
   - Falls back to truncated first message: "How do I set up Dock..."
   - User can manually edit title or retry generation

2. Ollama connection issues
   - Graceful fallback to timestamp-based naming
   - Background retry mechanism
   - User notification of service issues

#### 4.3 Edge Cases
1. Very long first messages
   - Prompt truncation handling
   - Meaningful title extraction from long content

2. Non-English content
   - Model capability handling
   - Fallback to content-based truncation

3. Empty or minimal messages
   - Detection of insufficient content
   - Fallback naming strategies

### Phase 5: Advanced Features

#### 5.1 Bulk Title Generation
- "Regenerate all titles" option in settings
- Progress indication for batch operations
- Ability to revert changes

#### 5.2 Title History & Versioning
- Track title change history
- Show who/what set each title (user vs AI)
- Ability to revert to previous titles

#### 5.3 Smart Suggestions
- Suggest alternative titles
- Learn from user preferences
- Context-aware improvements

## Implementation Steps

### Step 1: Backend Foundation
1. Create conversation-title-generator feature structure
2. Implement title generation contract and service
3. Create Ollama adapter for title generation
4. Add event definitions and handlers
5. Update manifest.yaml

### Step 2: Basic Title Generation
1. Implement auto-trigger on first message
2. Basic Ollama integration for title generation
3. Update conversation service to handle title updates
4. Test title generation workflow

### Step 3: UI Integration
1. Enhance Sidebar component with loading states
2. Add real-time title updates via WebSocket
3. Implement error handling and retry logic
4. Add basic manual editing capability

### Step 4: Polish & Testing
1. Add visual polish (animations, icons, feedback)
2. Implement comprehensive error handling
3. Add configuration options
4. Performance optimization for title generation

### Step 5: Advanced Features
1. Manual title editing with validation
2. Title history and versioning
3. Bulk operations and settings
4. Analytics and improvement tracking

## Architecture Compliance

### ✅ Respects AI-Native Principles:
- New feature stays under 500 lines per file
- Clear contract boundaries with minimal context
- Pure adapter functions for external dependencies
- Event-driven communication between features
- No direct cross-feature dependencies

### ✅ Integration Strategy:
- Leverages existing conversation infrastructure
- Uses established Ollama connection for AI calls
- Follows existing event patterns for real-time updates
- Maintains service interface consistency
- Preserves separation of concerns

## Manifest Updates

Add to manifest.yaml:
```yaml
chat:
  features:
    - name: conversation-title-generator
      contract: features/chat/conversation-title-generator/contract.ts
      adapters:
        - ollama-title-adapter
        - prompt-adapter
        - message-content-adapter
      services:
        - title-generation-service
        - conversation-service
        - message-service
      events:
        - conversation-title-generated
        - title-generation-failed
      config: config/features/chat/conversation-title-generator/schema.ts

events:
  - name: conversation-title-generated
    schema: events/conversation-title-generated.ts
  - name: title-generation-failed
    schema: events/title-generation-failed.ts

services:
  - name: title-generation-service
    interface: services/title-generation-service.ts
```

## Success Criteria

### Functional Requirements
- ✅ Conversations automatically receive meaningful titles based on first user message
- ✅ Titles generate within 3 seconds of first message
- ✅ Manual title editing works seamlessly
- ✅ Error states are handled gracefully with fallbacks
- ✅ Real-time UI updates work across browser tabs

### Performance Requirements
- ✅ Title generation does not impact message sending speed
- ✅ UI remains responsive during title generation
- ✅ Bulk operations handle 100+ conversations efficiently
- ✅ Memory usage stays within acceptable limits

### User Experience Requirements
- ✅ Clear visual feedback during all states
- ✅ Intuitive manual editing workflow
- ✅ Graceful degradation when AI services unavailable
- ✅ Consistent behavior across different conversation types

### Technical Requirements
- ✅ All contracts properly defined and implemented
- ✅ Event-driven architecture maintained
- ✅ No breaking changes to existing functionality
- ✅ Comprehensive error handling and logging
- ✅ Configuration flexibility for different use cases

---

**Next Action:** Begin implementation with Step 1 (Backend Foundation), focusing on the conversation-title-generator feature contract and basic service implementation.
