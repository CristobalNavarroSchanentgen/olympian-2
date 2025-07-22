import { Routes, Route } from 'react-router-dom';
import { ChatLayout } from './components/chat/ChatLayout';
import { ConfigPage } from './components/config/ConfigPage';
import { useAppStore } from './stores/app-store';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { theme } = useAppStore();
  useWebSocket(); // Initialize WebSocket connection

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/chat/:conversationId" element={<ChatLayout />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="*" element={<ChatLayout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
