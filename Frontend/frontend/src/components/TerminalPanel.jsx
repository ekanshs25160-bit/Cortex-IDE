import React from 'react';
import { motion } from 'motion/react';

export default function TerminalPanel() {
  return (
    <div className="h-48 border-t border-white/5 bg-surface-container-highest/60 backdrop-blur-xl flex flex-col">
      <div className="flex h-8 border-b border-white/5">
        <button className="px-4 py-1 text-[10px] font-bold text-on-surface border-t-2 border-accent bg-white/5 tracking-wider">TERMINAL</button>
        <button className="px-4 py-1 text-[10px] font-bold text-on-surface-variant hover:text-on-surface transition-colors tracking-wider">OUTPUT</button>
        <button className="px-4 py-1 text-[10px] font-bold text-on-surface-variant hover:text-on-surface transition-colors tracking-wider flex items-center gap-2">
          PROBLEMS <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full text-[9px]">2</span>
        </button>
      </div>
      <div className="flex-1 p-3 font-mono text-xs overflow-y-auto">
        <div className="text-green-400/80 mb-1">Python 3.8.5 boot sequence...</div>
        <div className="text-on-surface-variant">Loading environment variables... <span className="text-green-400">Done</span></div>
        <div className="text-on-surface-variant">Initializing virtual environment... <span className="text-green-400">Done</span></div>
        <div className="mt-2 flex items-center text-on-surface">
          <span className="text-primary-fixed-dim mr-2">vortex@local:~$</span>
          <motion.span 
            animate={{ opacity: [1, 0] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-primary-fixed-dim" 
          />
        </div>
      </div>
    </div>
  );
}
