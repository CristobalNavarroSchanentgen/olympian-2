import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server, Bot, Wrench, Database } from 'lucide-react';
import { useAppStore } from '../../stores/app-store';
import { chatService } from '../../services/chat-service';

export function ConfigPage() {
  const { systemStatus, theme, setTheme } = useAppStore();
  const [ollamaStatus, setOllamaStatus] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);
  const [mcpServers, setMCPServers] = useState<any[]>([]);
  const [mcpTools, setMCPTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    try {
      const [ollamaRes, modelsRes, serversRes, toolsRes] = await Promise.allSettled([
        chatService.getOllamaStatus(),
        chatService.getModels(),
        chatService.getMCPServers(),
        chatService.getMCPTools(),
      ]);

      if (ollamaRes.status === 'fulfilled') setOllamaStatus(ollamaRes.value);
      if (modelsRes.status === 'fulfilled') setModels(modelsRes.value);
      if (serversRes.status === 'fulfilled') setMCPServers(serversRes.value);
      if (toolsRes.status === 'fulfilled') setMCPTools(toolsRes.value);
    } catch (error) {
      console.error('Failed to load system info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">System Configuration</h1>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Interface Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                    className="w-full p-2 border border-input rounded-lg bg-background"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Status
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    systemStatus.database 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.database ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Ollama</span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    systemStatus.ollama 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.ollama ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>MCP Servers</span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    systemStatus.mcp 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.mcp ? 'Running' : 'Stopped'}
                  </div>
                </div>
              </div>
            </div>

            {/* Ollama Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Server className="h-5 w-5" />
                Ollama Configuration
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Base URL:</span>
                  <p className="font-mono text-sm">{ollamaStatus?.baseUrl || 'Not connected'}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Available Models:</span>
                  <p className="text-2xl font-bold">{models.length}</p>
                </div>
                
                {models.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground mb-2 block">Models:</span>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {(models || []).map((model, idx) => (
                        <div key={idx} className="text-sm font-mono px-2 py-1 bg-muted rounded">
                          {model.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MCP Servers */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                MCP Servers
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Active Servers:</span>
                  <p className="text-2xl font-bold">{mcpServers.length}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Available Tools:</span>
                  <p className="text-2xl font-bold">{mcpTools.length}</p>
                </div>
                
                {mcpServers.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground mb-2 block">Servers:</span>
                    <div className="space-y-2">
                      {(mcpServers || []).map((server, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm font-mono">{server.name}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            server.status === 'running' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {server.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
