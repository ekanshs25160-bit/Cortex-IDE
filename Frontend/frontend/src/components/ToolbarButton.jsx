import React from 'react';

export default function ToolbarButton({ icon, title }) {
  return (
    <button className="p-1.5 rounded text-on-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-all group relative" title={title}>
      {icon}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
        {title}
      </span>
    </button>
  );
}
