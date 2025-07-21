import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
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
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
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
        theme: state.theme 
      }),
    }
  )
);
