import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Model settings
  textModel: string;
  visionModel: string;
  autoDetectModel: boolean;
  setTextModel: (model: string) => void;
  setVisionModel: (model: string) => void;
  setAutoDetectModel: (autoDetect: boolean) => void;
  
  // WebSocket connection status
  connected: boolean;
  setConnected: (connected: boolean) => void;
  
  // System status
  systemStatus: {
    database: boolean;
    mcp: boolean;
    ollama: boolean;
  };
  setSystemStatus: (status: Partial<AppState['systemStatus']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Model settings
      textModel: 'llama3.2:1b',
      visionModel: 'llava:latest',
      autoDetectModel: false,
      setTextModel: (model) => set({ textModel: model }),
      setVisionModel: (model) => set({ visionModel: model }),
      setAutoDetectModel: (autoDetect) => set({ autoDetectModel: autoDetect }),
      
      connected: false,
      setConnected: (connected) => set({ connected }),
      
      systemStatus: {
        database: false,
        mcp: false,
        ollama: false,
      },
      setSystemStatus: (status) => set({ 
        systemStatus: { ...get().systemStatus, ...status } 
      }),
    }),
    {
      name: 'olympian-app-store',
      partialize: (state) => ({ 
        theme: state.theme,
        textModel: state.textModel,
        visionModel: state.visionModel,
        autoDetectModel: state.autoDetectModel
      }),
    }
  )
);
