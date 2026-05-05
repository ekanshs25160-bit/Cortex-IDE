import React from 'react';
import { X } from 'lucide-react';

export default function ExplorerPanel({ isSidebarOpen, setIsSidebarOpen, files, onFileClick, onCreate, onDelete, activeFileId }) {
  return (
    <div className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800 shrink-0">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Explorer</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreate}
            className="text-zinc-400 hover:text-white text-lg leading-none transition-colors"
            title="New file"
          >
            +
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-zinc-500 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileClick(file)}
            className={`group flex justify-between items-center px-4 py-2.5 cursor-pointer hover:bg-zinc-800 transition-colors ${
              activeFileId === file.id ? 'bg-zinc-800 border-l-2 border-accent' : ''
            }`}
          >
            <span className="text-sm text-zinc-300 truncate mr-2">📄 {file.name}</span>
            <button
              onClick={(e) => onDelete(file.id, e)}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity text-lg leading-none"
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}