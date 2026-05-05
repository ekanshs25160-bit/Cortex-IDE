import React from 'react';
import { Code2, Network, Bug, Cpu, Sparkles, BookOpen } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function UtilityBar({ viewMode, setViewMode, onIntentClick }) {
  return (
    <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-surface-container/50">
      <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
        <button 
          onClick={() => setViewMode('editor')}
          className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-colors ${viewMode === 'editor' ? 'bg-white/10 text-accent font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          <Code2 className="w-4 h-4" /> Code View
        </button>
        <button 
          onClick={() => setViewMode('map')}
          className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-colors ${viewMode === 'map' ? 'bg-white/10 text-accent font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          <Network className="w-4 h-4" /> Architecture Map
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <ToolbarButton 
          icon={<Bug className="w-4 h-4" />} 
          title="Debug" 
          onClick={() => onIntentClick("Debug this code and fix any errors")} 
        />
        <ToolbarButton 
          icon={<Cpu className="w-4 h-4" />} 
          title="Optimize" 
          onClick={() => onIntentClick("Optimize this code for better performance")} 
        />
        <ToolbarButton 
          icon={<Sparkles className="w-4 h-4" />} 
          title="Explain" 
          onClick={() => onIntentClick("Explain how this code works in detail")} 
        />
        <ToolbarButton 
          icon={<BookOpen className="w-4 h-4" />} 
          title="Documentation" 
          onClick={() => onIntentClick("Generate JSDoc style documentation for this code")} 
        />
      </div>
    </div>
  );
}