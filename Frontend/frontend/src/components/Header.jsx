import React from 'react';
import { FileCode, Zap, History, Menu, PanelRight } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onIntentClick, onToggleExplorer, onToggleMemory, isSidebarOpen, isMemoryOpen }) {
  return (
    <header className="h-12 glass flex items-center justify-between px-3 md:px-4 z-50 shrink-0 gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleExplorer}
          className="md:hidden text-stone-400 hover:text-white transition-colors p-1"
          title="Toggle Explorer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-heading text-lg md:text-xl font-semibold text-primary-fixed-dim tracking-tight whitespace-nowrap">
          Cortex IDE
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <button
          onClick={onIntentClick}
          className="bg-accent text-black px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold hover:bg-accent-dim transition-all shadow-[0_0_12px_rgba(190,242,100,0.4)] flex items-center gap-1.5 group"
        >
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current group-hover:scale-110 transition-transform" />
          <span className="hidden xs:inline">Intent Mode</span>
          <span className="xs:hidden">AI</span>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleMemory}
          className={`hidden md:flex bg-accent text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-accent-dim transition-all shadow-[0_0_12px_rgba(190,242,100,0.4)] items-center gap-2 ${isMemoryOpen ? 'ring-2 ring-accent/50' : ''}`}
        >
          <History className="w-4 h-4" />
          Decision Memory
        </button>
        <button
          onClick={onToggleMemory}
          className={`md:hidden text-stone-400 hover:text-accent transition-colors p-1 ${isMemoryOpen ? 'text-accent' : ''}`}
          title="Decision Memory"
        >
          <PanelRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
