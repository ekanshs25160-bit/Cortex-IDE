import React from 'react';
import { Folder, Search, GitBranch, Blocks, Bug, Share2, User, Settings } from 'lucide-react';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <aside className="w-16 glass-dark flex flex-col items-center py-4 justify-between shrink-0 z-40">
      <div className="flex flex-col gap-6 w-full items-center">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`${isSidebarOpen ? 'text-accent border-l-2 border-accent' : 'text-stone-500 hover:text-stone-300'} w-full flex justify-center py-2 transition-all cursor-pointer`} 
          title="Explorer"
        >
          <Folder className="w-6 h-6 fill-current" />
        </button>
        <button className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors" title="Search">
          <Search className="w-6 h-6" />
        </button>
        
        <button className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors" title="Debugger">
          <Bug className="w-6 h-6" />
        </button>
        
      </div>
      <div className="flex flex-col gap-4 w-full items-center mb-4">
        <button className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors" title="Accounts">
          <User className="w-6 h-6" />
        </button>
        <button className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors" title="Manage">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
}
