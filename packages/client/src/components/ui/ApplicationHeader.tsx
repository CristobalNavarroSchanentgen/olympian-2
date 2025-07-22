import { useState } from 'react';
import { ChevronDown, History, Zap, Settings } from 'lucide-react';

interface ApplicationHeaderProps {
  title: string;
  modelSelector?: {
    textModel: string;
    visionModel: string;
    onTextModelChange: (model: string) => void;
    onVisionModelChange: (model: string) => void;
    autoDetect: boolean;
    onAutoDetectToggle: () => void;
  };
  onHistoryClick?: () => void;
  onConnectionsClick?: () => void;
  onMCPClick?: () => void;
}

export function ApplicationHeader({ 
  title, 
  modelSelector, 
  onHistoryClick, 
  onConnectionsClick, 
  onMCPClick 
}: ApplicationHeaderProps) {
  const [textModelOpen, setTextModelOpen] = useState(false);
  const [visionModelOpen, setVisionModelOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-14 flex items-center px-4 shadow-sm">
      {/* Application Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>

      {/* Center Controls */}
      <div className="flex-1 flex items-center justify-center space-x-6">
        {/* Text Model Selector */}
        {modelSelector && (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setTextModelOpen(!textModelOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
              >
                <span className="text-muted-foreground">Text:</span>
                <span className="text-foreground">{modelSelector.textModel}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {textModelOpen && (
                <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded-lg shadow-lg min-w-48">
                  <div className="p-1">
                    <div className="px-3 py-2 hover:bg-muted rounded text-sm cursor-pointer">
                      llama3.2:latest
                    </div>
                    <div className="px-3 py-2 hover:bg-muted rounded text-sm cursor-pointer">
                      codellama:latest
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vision Model Selector */}
            <div className="relative">
              <button
                onClick={() => setVisionModelOpen(!visionModelOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
              >
                <span className="text-muted-foreground">Vision:</span>
                <span className="text-foreground">{modelSelector.visionModel}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {visionModelOpen && (
                <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded-lg shadow-lg min-w-48">
                  <div className="p-1">
                    <div className="px-3 py-2 hover:bg-muted rounded text-sm cursor-pointer">
                      llava:latest
                    </div>
                    <div className="px-3 py-2 hover:bg-muted rounded text-sm cursor-pointer">
                      bakllava:latest
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auto-detect Toggle */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={modelSelector.autoDetect}
                onChange={modelSelector.onAutoDetectToggle}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <span className="text-muted-foreground">Auto-detect</span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onHistoryClick}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="History"
        >
          <History className="w-5 h-5 text-muted-foreground" />
        </button>
        <button
          onClick={onConnectionsClick}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Connections"
        >
          <Zap className="w-5 h-5 text-muted-foreground" />
        </button>
        <button
          onClick={onMCPClick}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="MCP Configuration"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
