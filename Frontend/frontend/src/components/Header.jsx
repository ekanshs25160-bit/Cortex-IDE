import React from 'react';
import { FileCode, Zap, Sparkles, History } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onIntentClick }) {
  return (
    <header className="h-12 glass flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center gap-4">
        
        <div className="font-heading text-xl font-semibold text-primary-fixed-dim tracking-tight">
          Cortex IDE
        </div>
        
        <nav className="flex h-full items-end ml-6">
          
        </nav>
      </div>

      <div className="flex-1 flex justify-center items-center gap-3">
        <button onClick={onIntentClick} className="bg-accent text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-accent-dim transition-all shadow-[0_0_12px_rgba(190,242,100,0.4)] flex items-center gap-2 group">
          <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          Intent Mode
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-accent text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-accent-dim transition-all shadow-[0_0_12px_rgba(190,242,100,0.4)] flex items-center gap-2">
          <History className="w-4 h-4" />
          Decision Memory
        </button>
      </div>
    </header>
  );
}
