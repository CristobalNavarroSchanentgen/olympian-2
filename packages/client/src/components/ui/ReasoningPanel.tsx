import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Brain, Download, Trash2, X, Clock } from 'lucide-react';

interface ReasoningBlock {
  id: string;
  type: 'planning' | 'step' | 'conclusion';
  title: string;
  content: string;
  stepNumber: number;
  timestamp: Date;
  duration?: number;
}

interface ReasoningPanelProps {
  blocks: ReasoningBlock[];
  metadata?: {
    duration: number;
    wordCount: number;
    estimatedReadingTime: number;
  };
  expanded: boolean;
  onToggle: () => void;
}

export function ReasoningPanel({ blocks, metadata, expanded, onToggle }: ReasoningPanelProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const formatDuration = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'planning': return '🎯';
      case 'step': return '⚡';
      case 'conclusion': return '✅';
      default: return '💭';
    }
  };

  if (!expanded) return null;

  return (
    <div className="bg-gray-800 border-t border-gray-700 h-64 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-750">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">Reasoning Process</span>
          <span className="text-xs text-gray-400">{blocks.length} steps</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Close reasoning panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {blocks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reasoning steps yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Reasoning blocks will appear here during AI processing
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {(blocks || []).map(block => (
              <div key={block.id} className="border border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleBlock(block.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-750 hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {expandedBlocks.has(block.id) ? 
                      <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                    <span className="text-lg">{getBlockIcon(block.type)}</span>
                    <span className="text-sm font-medium text-gray-200">{block.title}</span>
                    <span className="text-xs text-gray-500 ml-2">Step {block.stepNumber}</span>
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

      {/* Footer with metadata */}
      {metadata && blocks.length > 0 && (
        <div className="border-t border-gray-700 p-2 bg-gray-750">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total duration: {formatDuration(metadata.duration)}</span>
            <span>Words: {metadata.wordCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}
