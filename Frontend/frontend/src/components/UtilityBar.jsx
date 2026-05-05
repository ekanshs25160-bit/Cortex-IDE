import React from 'react';
import { Code2, Network, Bug, Cpu, Sparkles, BookOpen } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function UtilityBar({ viewMode, setViewMode, onIntentClick }) {
  return (
    <div className="h-10 border-b border-white/5 flex items-center justify-between px-2 md:px-4 bg-surface-container/50 gap-2 shrink-0">
      {/* View toggle */}
      <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 shrink-0">
        <button
          onClick={() => setViewMode('editor')}
          className={`px-2 md:px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-colors ${
            viewMode === 'editor'
              ? 'bg-white/10 text-accent font-medium'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Code View</span>
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-2 md:px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-colors ${
            viewMode === 'map'
              ? 'bg-white/10 text-accent font-medium'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Network className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Architecture Map</span>
        </button>
      </div>

      {/* Toolbar actions */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-none">
        <ToolbarButton
          icon={<Bug className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          title="Debug"
          onClick={() => onIntentClick("Debug this code and fix any errors")}
        />
        <ToolbarButton
          icon={<Cpu className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          title="Optimize"
          onClick={() => onIntentClick("Optimize this code for better performance")}
        />
        <ToolbarButton
          icon={<Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          title="Explain"
          onClick={() => onIntentClick("Explain how this code works in detail")}
        />
        <ToolbarButton
          icon={<BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          title="Docs"
          onClick={() => onIntentClick("Generate JSDoc style documentation for this code")}
        />
      </div>
    </div>
  );
}