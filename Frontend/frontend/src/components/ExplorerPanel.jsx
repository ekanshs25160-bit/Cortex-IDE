import React, { useState } from 'react';
import { Folder, FolderOpen, File, FilePlus, FolderPlus, ChevronRight, ChevronDown } from 'lucide-react';

// Recursive inner entry node view component
function FileTreeItem({ node, activeFileId, onSelectFile, onCreateItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === 'folder';

  if (!isFolder) {
    return (
      <div
        onClick={() => onSelectFile(node.id)}
        className={`flex items-center gap-2 pl-6 pr-3 py-1.5 rounded cursor-pointer text-xs font-mono select-none transition group ${
          activeFileId === node.id 
            ? 'bg-zinc-800 text-cyan-400 font-medium' 
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
        }`}
      >
        <File size={14} className={activeFileId === node.id ? 'text-cyan-400' : 'text-zinc-500'} />
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Folder Header Line Row */}
      <div
        className="flex items-center justify-between px-2 py-1.5 rounded text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 cursor-pointer select-none group"
      >
        <div className="flex items-center gap-1.5 text-xs font-mono flex-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
          {isOpen ? <FolderOpen size={14} className="text-amber-400" /> : <Folder size={14} className="text-amber-500" />}
          <span className="truncate font-medium">{node.name}</span>
        </div>
        
        {/* Inline contextual creation shortcuts */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
          <button 
            onClick={() => onCreateItem('file', prompt('Enter File Name:'), node.id)} 
            className="p-0.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-cyan-400"
            title="New File Inside"
          >
            <FilePlus size={12} />
          </button>
          <button 
            onClick={() => onCreateItem('folder', prompt('Enter Folder Name:'), node.id)} 
            className="p-0.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-amber-400"
            title="New Folder Inside"
          >
            <FolderPlus size={12} />
          </button>
        </div>
      </div>

      {/* Render children recursively if folder is toggled open */}
      {isOpen && node.children && (
        <div className="pl-3 border-l border-zinc-800/60 ml-3 mt-0.5 space-y-0.5">
          {node.children.map(child => (
            <FileTreeItem
              key={child.id}
              node={child}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
              onCreateItem={onCreateItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorerPanel({ fileSystem, activeFileId, onSelectFile, onCreateItem }) {
  return (
    <div className="h-full w-64 bg-zinc-950 flex flex-col border-r border-zinc-900 select-none">
      {/* Upper Navigation Header Action Control Actions Bar */}
      <div className="p-3 border-b border-zinc-900 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 tracking-wider font-mono">WORKSPACE FILES</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onCreateItem('file', prompt('Enter File Name:'), 'root')}
            className="p-1 hover:bg-zinc-900 rounded text-zinc-400 hover:text-zinc-200 transition"
            title="Create File at Root"
          >
            <FilePlus size={14} />
          </button>
          <button
            onClick={() => onCreateItem('folder', prompt('Enter Folder Name:'), 'root')}
            className="p-1 hover:bg-zinc-900 rounded text-zinc-400 hover:text-zinc-200 transition"
            title="Create Folder at Root"
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      {/* Main Render Core Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {fileSystem.children && fileSystem.children.length > 0 ? (
          fileSystem.children.map(child => (
            <FileTreeItem
              key={child.id}
              node={child}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
              onCreateItem={onCreateItem}
            />
          ))
        ) : (
          <div className="text-center text-[11px] text-zinc-600 mt-8 font-mono">Workspace Empty</div>
        )}
      </div>
    </div>
  );
}

export const getLanguageFromExtension = (filename) => {
  if (!filename) return 'plaintext';
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
  };
  return map[ext] || 'plaintext';
};