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

const TEXT_MODELS = ['llama3.2:latest', 'llama3.2:3b', 'codellama:latest', 'mistral:latest'];
const VISION_MODELS = ['llava:latest', 'llava:13b', 'bakllava:latest'];

export function ApplicationHeader({ title, modelSelector, onHistoryClick, onConnectionsClick, onMCPClick }: ApplicationHeaderProps) {
  const [textModelOpen, setTextModelOpen] = useState(false);
  const [visionModelOpen, setVisionModelOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-nav h-14 flex items-center px-4 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary-blue rounded flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-medium text-primary">{title}</h1>
      </div>

      <div className="flex-1 flex items-center justify-center space-x-6">
        {modelSelector && (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setTextModelOpen(!textModelOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 model-selector hover:opacity-90 rounded-lg text-sm transition-colors"
              >
                <span className="text-secondary">Text:</span>
                <span className="text-primary">{modelSelector.textModel}</span>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </button>
              {textModelOpen && (
                <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded-lg shadow-lg min-w-48 z-50">
                  <div className="p-1">
                    {TEXT_MODELS.map((model) => (
                      <div
                        key={model}
                        onClick={() => { modelSelector.onTextModelChange(model); setTextModelOpen(false); }}
                        className="px-3 py-2 hover:bg-accent rounded text-sm cursor-pointer"
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setVisionModelOpen(!visionModelOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 model-selector hover:opacity-90 rounded-lg text-sm transition-colors"
              >
                <span className="text-secondary">Vision:</span>
                <span className="text-primary">{modelSelector.visionModel}</span>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </button>
              {visionModelOpen && (
                <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded-lg shadow-lg min-w-48 z-50">
                  <div className="p-1">
                    {VISION_MODELS.map((model) => (
                      <div
                        key={model}
                        onClick={() => { modelSelector.onVisionModelChange(model); setVisionModelOpen(false); }}
                        className="px-3 py-2 hover:bg-accent rounded text-sm cursor-pointer"
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={modelSelector.autoDetect}
                onChange={modelSelector.onAutoDetectToggle}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <span className="text-secondary">Auto-detect</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={onHistoryClick} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Toggle Sidebar">
          <History className="w-5 h-5 text-secondary" />
        </button>
        <button onClick={onConnectionsClick} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Connections">
          <Zap className="w-5 h-5 text-secondary" />
        </button>
        <button onClick={onMCPClick} className="p-2 hover:bg-accent rounded-lg transition-colors" title="MCP Configuration">
          <div className="flex items-center space-x-1">
            <Settings className="w-5 h-5 text-secondary" />
            <span className="text-sm text-secondary">MCP Config</span>
          </div>
        </button>
      </div>
    </header>
  );
}
