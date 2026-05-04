import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, ChevronRight, ChevronDown, FileCode, X } from 'lucide-react';

// export default function ExplorerPanel({ isSidebarOpen, setIsSidebarOpen }) {
//   return (
//     <AnimatePresence>
//       {isSidebarOpen && (
//         <motion.div 
//           initial={{ width: 0, opacity: 0 }}
//           animate={{ width: 260, opacity: 1 }}
//           exit={{ width: 0, opacity: 0 }}
//           className="bg-surface-container-low/90 backdrop-blur-md border-r border-white/10 flex flex-col shrink-0 overflow-hidden"
//         >
//           <div className="p-4 border-b border-white/5 flex justify-between items-center">
//             <div>
//               <h2 className="font-heading text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Project Explorer</h2>
//               <div className="text-xs text-on-surface font-medium">vortex-main</div>
//             </div>
//             <button onClick={() => setIsSidebarOpen(false)} className="text-stone-500 hover:text-white transition-colors">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
          
//           <div className="p-2 overflow-y-auto flex-1 text-xs text-on-surface-variant">
//             <div className="flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors group">
//               <ChevronRight className="w-4 h-4 group-hover:text-accent transition-colors" />
//               <Folder className="w-4 h-4 text-blue-400 fill-current" />
//               images/
//             </div>
            
//             <div className="flex flex-col">
//               <div className="flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors group">
//                 <ChevronDown className="w-4 h-4 text-accent" />
//                 <Folder className="w-4 h-4 text-blue-400 fill-current" />
//                 tools/
//               </div>
//               <div className="pl-8 py-1 pr-2 flex items-center gap-2 hover:bg-white/5 rounded cursor-pointer transition-colors text-stone-300">
//                 <FileCode className="w-4 h-4 text-yellow-500" />
//                 tool.py
//               </div>
//             </div>

//             <div className="flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors group">
//               <ChevronRight className="w-4 h-4 group-hover:text-accent transition-colors" />
//               <Folder className="w-4 h-4 text-blue-400 fill-current" />
//               third_party/
//             </div>

//             <div className="flex items-center gap-2 py-1 px-2 pl-7 hover:bg-white/5 rounded cursor-pointer transition-colors">
//               <FileCode className="w-4 h-4 text-orange-500" />
//               index.html
//             </div>
            
//             <div className="flex items-center gap-2 py-1 px-2 pl-7 bg-primary-fixed-dim/10 text-primary-fixed-dim rounded cursor-pointer transition-colors border-l-2 border-accent">
//               <FileCode className="w-4 h-4" />
//               script.py
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }



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