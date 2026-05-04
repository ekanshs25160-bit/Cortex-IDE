import React from 'react';
import { Code2, Network, Bug, Cpu, Sparkles, BookOpen } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function UtilityBar() {
  return (
    <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-surface-container/50">
      <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
        <button className="px-3 py-1 rounded-md bg-white/10 text-accent font-medium text-xs flex items-center gap-1">
          <Code2 className="w-4 h-4" /> Code View
        </button>
        <button className="px-3 py-1 rounded-md text-on-surface-variant hover:text-on-surface text-xs flex items-center gap-1 transition-colors">
          <Network className="w-4 h-4" /> Architecture Map
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <ToolbarButton icon={<Bug className="w-4 h-4" />} title="Debug" />
        <ToolbarButton icon={<Cpu className="w-4 h-4" />} title="Optimize" />
        <ToolbarButton icon={<Sparkles className="w-4 h-4" />} title="Translate" />
        <ToolbarButton icon={<BookOpen className="w-4 h-4" />} title="Documentation" />
      </div>
    </div>
  );
}
