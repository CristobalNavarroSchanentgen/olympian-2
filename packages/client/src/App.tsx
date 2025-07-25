import { Routes, Route } from 'react-router-dom';
import { DualPaneLayout } from './components/ui/DualPaneLayout';
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
          <Route path="/" element={<DualPaneLayout />} />
          <Route path="/chat/:conversationId" element={<DualPaneLayout />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="*" element={<DualPaneLayout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
