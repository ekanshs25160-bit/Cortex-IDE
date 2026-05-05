import React from 'react';
import { Folder, Search, Bug, User, Settings } from 'lucide-react';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, mobile }) {
  if (mobile) {
    return (
      <nav className="h-14 bg-zinc-950 border-t border-white/10 flex items-center justify-around px-4">
        <button
          onClick={() => setIsSidebarOpen((v) => !v)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            isSidebarOpen ? 'text-accent' : 'text-stone-500 hover:text-stone-300'
          }`}
          title="Explorer"
        >
          <Folder className="w-5 h-5 fill-current" />
          <span className="text-[10px]">Files</span>
        </button>
        <button
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-stone-500 hover:text-stone-300 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </button>
        <button
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-stone-500 hover:text-stone-300 transition-colors"
          title="Debug"
        >
          <Bug className="w-5 h-5" />
          <span className="text-[10px]">Debug</span>
        </button>
        <button
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-stone-500 hover:text-stone-300 transition-colors"
          title="Account"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </button>
      </nav>
    );
  }

  return (
    <aside className="w-14 glass-dark flex flex-col items-center py-4 justify-between shrink-0 z-40">
      <div className="flex flex-col gap-6 w-full items-center">
        <button
          onClick={() => setIsSidebarOpen((v) => !v)}
          className={`${
            isSidebarOpen ? 'text-accent border-l-2 border-accent' : 'text-stone-500 hover:text-stone-300'
          } w-full flex justify-center py-2 transition-all cursor-pointer`}
          title="Explorer"
        >
          <Folder className="w-5 h-5 fill-current" />
        </button>
        <button
          className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors"
          title="Debugger"
        >
          <Bug className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-4 w-full items-center mb-4">
        <button
          className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors"
          title="Accounts"
        >
          <User className="w-5 h-5" />
        </button>
        <button
          className="text-stone-500 hover:text-stone-300 w-full flex justify-center py-2 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
