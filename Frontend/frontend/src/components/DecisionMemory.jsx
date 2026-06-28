import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function DecisionMemory({ onClose }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8000/api/memory/all');
        if (!res.ok) throw new Error('Failed to fetch memories');
        const data = await res.json();
        setMemories(data.memories || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);
  return (
    <div className="w-72 md:w-64 h-full bg-surface-container-low border-l border-outline-variant flex flex-col">
      <div className="p-4 border-b border-outline-variant flex items-center justify-between shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Decision Memory
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-12">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 italic">Error: {error}</p>
        ) : memories.length === 0 ? (
          <p className="text-xs text-outline italic">No decisions recorded yet.</p>
        ) : (
          memories.map((m) => (
            <div
              key={m.id}
              className="p-3 bg-surface-container rounded-lg border border-outline-variant shadow-sm"
            >
              <p className="text-sm text-on-surface leading-tight mb-2">{m.action}</p>
              <div className="text-[10px] text-outline font-mono uppercase">{m.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}