import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, ChevronRight, ChevronDown, FileCode, X } from 'lucide-react';

export default function ExplorerPanel({ files, onFileClick, onCreate, onDelete, activeFileId }) {
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <span className="text-xs font-bold text-zinc-500 uppercase">Explorer</span>
        <button onClick={onCreate} className="text-zinc-400 hover:text-white text-xl">+</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileClick(file)}
            className={`group flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-zinc-800 ${
              activeFileId === file.id ? "bg-zinc-800 border-l-2 border-accent" : ""
            }`}
          >
            <span className="text-sm text-zinc-300">📄 {file.name}</span>
            <button
              onClick={(e) => onDelete(file.id, e)}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}