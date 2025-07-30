import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Clock, BookOpen, Eye, Download, Trash2 } from 'lucide-react';
import { reasoningService } from '../../services';
import { ReasoningPanelProps, ReasoningBlock } from '@olympian/shared/features/ui/reasoning-panel/contract';
import { ReasoningEvent } from "@olympian/shared/events/ui/reasoning-events";
import { useEventSubscription } from "../../hooks/useEventSubscription";
// MILESTONE 4: Event-driven UI - This component uses event subscriptions instead of direct service calls

export function ReasoningPanel(props: { blocks: any; metadata: any; expanded: boolean; onToggle: () => void }) {
  // AI-native service state
  const [panelState, setPanelState] = useState<ReasoningPanelProps>(() =>
    reasoningService.getReasoningPanel()
  );
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  // Load initial state
  useEffect(() => {
    const loadState = () => {
      const currentState = reasoningService.getReasoningPanel();
      setPanelState(currentState);
    };

    loadState();
  }, []);

  // AI-native handlers using service
  const handleTogglePanel = async () => {
    try {
      // Service will emit "reasoning-panel-toggled" event
      await reasoningService.toggleReasoningPanel();
    } catch (error) {
      console.error('Failed to toggle reasoning panel:', error);
    }
  };

  const handleClearReasoning = async () => {
    try {
      const updatedState = await reasoningService.clearReasoning();
      setExpandedBlocks(new Set());
    } catch (error) {
      console.error('Failed to clear reasoning:', error);
    }
  };

  const handleExportReasoning = async () => {
    try {
      const exported = await reasoningService.exportReasoning();
      
      // Create download link
      const blob = new Blob([exported], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reasoning-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export reasoning:', error);
    }
  };

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getBlockTypeIcon = (type: ReasoningBlock['type']) => {
    switch (type) {
      case 'planning': return '🎯';
      case 'step': return '⚡';
      case 'conclusion': return '✅';
      default: return '💭';
    }
  };

  if (!panelState.isOpen) {
    return null;
  }

  const { blocks, totalSteps, currentStep, config } = panelState;

  return (
    <div className="bg-gray-800 border-t border-gray-700 h-64 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-750">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">Reasoning Process</span>
          <span className="text-xs text-gray-400">
            {currentStep}/{totalSteps} steps
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportReasoning}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Export reasoning"
            disabled={blocks.length === 0}
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleClearReasoning}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Clear reasoning"
            disabled={blocks.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleTogglePanel}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Close reasoning panel"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {blocks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reasoning steps yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Reasoning blocks will appear here during AI processing
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block) => (
              <div key={block.id} className="border border-gray-600 rounded-lg overflow-hidden">
                {/* Block Header */}
                <button
                  onClick={() => toggleBlock(block.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-750 hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {expandedBlocks.has(block.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-lg">{getBlockTypeIcon(block.type)}</span>
                    <span className="text-sm font-medium text-gray-200">{block.title}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Step {block.stepNumber}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {block.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(block.duration)}
                      </div>
                    )}
                    <span className="capitalize">{block.type}</span>
                  </div>
                </button>

                {/* Block Content */}
                {expandedBlocks.has(block.id) && (
                  <div className="p-3 bg-gray-800 border-t border-gray-600">
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {block.content}
                    </div>
                    
                    {block.timestamp && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
                        {new Date(block.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with settings */}
      {blocks.length > 0 && (
        <div className="border-t border-gray-700 p-2 bg-gray-750">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Max blocks: {config.maxBlocks}</span>
            <span>Export format: {config.exportFormat}</span>
          </div>
        </div>
      )}
    </div>
  );
}
