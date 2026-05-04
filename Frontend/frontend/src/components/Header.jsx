import React from 'react';
import { FileCode, Zap, Sparkles, History } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="h-12 glass flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center gap-4">
        
        <div className="font-heading text-xl font-semibold text-primary-fixed-dim tracking-tight">
          Cortex IDE
        </div>
        
        <nav className="flex h-full items-end ml-6">
          {/* <button 
            onClick={() => setActiveTab('index.html')}
            className={`h-full px-4 py-2 text-xs transition-colors flex items-center gap-2 rounded-t-lg ${activeTab === 'index.html' ? 'border-t-2 border-accent bg-white/5 text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-white/10'}`}
          >
            <FileCode className={`w-4 h-4 ${activeTab === 'index.html' ? 'text-accent' : ''}`} />
            index.html
          </button>
          <button 
            onClick={() => setActiveTab('script.py')}
            className={`h-full px-4 py-2 text-xs transition-colors flex items-center gap-2 rounded-t-lg ${activeTab === 'script.py' ? 'border-t-2 border-accent bg-white/5 text-white font-medium' : 'text-stone-400 hover:text-stone-200 hover:bg-white/10'}`}
          >
            <FileCode className={`w-4 h-4 ${activeTab === 'script.py' ? 'text-accent' : ''}`} />
            script.py
          </button> */}
        </nav>
      </div>

      <div className="flex-1 flex justify-center items-center gap-3">
        <button className="bg-accent text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-accent-dim transition-all shadow-[0_0_12px_rgba(190,242,100,0.4)] flex items-center gap-2 group">
          <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          Intent Mode
        </button>
        <button className="bg-white/10 border border-white/10 text-on-surface px-4 py-1 rounded-full text-sm hover:bg-white/20 transition-colors flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          Generate Code
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
