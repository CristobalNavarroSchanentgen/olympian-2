import { create } from 'zustand';
import { Conversation, Message, Artifact } from '@olympian/shared';

interface ChatState {
  // Conversations
  conversations: Conversation[];
  currentConversationId: string | null;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  setCurrentConversation: (id: string | null) => void;
  
  // Messages
  messages: Record<string, Message[]>;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  
  // Streaming
  streamingMessageId: string | null;
  streamingContent: string;
  setStreaming: (messageId: string | null, content?: string) => void;
  appendStreamingContent: (content: string) => void;
  
  // Artifacts
  artifacts: Record<string, Artifact[]>;
  setArtifacts: (conversationId: string, artifacts: Artifact[]) => void;
  addArtifact: (artifact: Artifact) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Input
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedImages: string[];

  // Model Selection
  selectedModel: string | null;
  modelPreferences: {
    preferredTextModel?: string;
    preferredVisionModel?: string;
    autoSelect?: boolean;
  };
  modelRecommendation: {
    model: string;
    reason: string;
    confidence: number;
  } | null;  setSelectedImages: (images: string[]) => void;
  addImage: (image: string) => void;
  removeImage: (index: number) => void;

  // Model Selection Actions
  setSelectedModel: (model: string | null) => void;
  setModelPreferences: (preferences: Partial<ChatState["modelPreferences"]>) => void;
  setModelRecommendation: (recommendation: ChatState["modelRecommendation"]) => void;
  clearModelRecommendation: () => void;}

export const useChatStore = create<ChatState>()((set, get) => ({
  // Conversations
  conversations: [],
  currentConversationId: null,
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) => set({ 
    conversations: [conversation, ...(get().conversations || [])] 
  }),
  updateConversation: (id, updates) => set({
    conversations: get().conversations?.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  
  // Messages
  messages: {},
  setMessages: (conversationId, messages) => set({
    messages: { ...get().messages, [conversationId]: messages }
  }),
  addMessage: (message) => set({
    messages: {
      ...get().messages,
      [message.conversationId]: [
        ...(get().messages[message.conversationId] || []),
        message
      ]
    }
  }),
  updateMessage: (messageId, updates) => set({
    messages: Object.fromEntries(
      Object.entries(get().messages).map(([conversationId, msgs]) => [
        conversationId,
        ((msgs || []).map(msg => msg.id === messageId ? { ...msg, ...updates } : msg))
      ])
    )
  }),
  
  // Streaming
  streamingMessageId: null,
  streamingContent: '',
  setStreaming: (messageId, content = '') => set({
    streamingMessageId: messageId,
    streamingContent: content
  }),
  appendStreamingContent: (content) => set({
    streamingContent: get().streamingContent + content
  }),
  
  // Artifacts
  artifacts: {},
  setArtifacts: (conversationId, artifacts) => set({
    artifacts: { ...get().artifacts, [conversationId]: artifacts }
  }),
  addArtifact: (artifact) => set({
    artifacts: {
      ...get().artifacts,
      [artifact.conversationId]: [
        ...(get().artifacts[artifact.conversationId] || []),
        artifact
      ]
    }
  }),
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Input
  inputValue: '',
  setInputValue: (value) => set({ inputValue: value }),
  selectedImages: [],

  // Model Selection
  selectedModel: null,
  modelPreferences: {
    autoSelect: true
  },
  modelRecommendation: null,  setSelectedImages: (images) => set({ selectedImages: images }),
  addImage: (image) => set({ 
    selectedImages: [...get().selectedImages, image] 
  }),
  removeImage: (index) => set({
    selectedImages: get().selectedImages.filter((_, i) => i !== index)
  }),
}));
