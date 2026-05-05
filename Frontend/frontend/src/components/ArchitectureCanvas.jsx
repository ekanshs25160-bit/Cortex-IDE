import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function ArchitectureCanvas({ files }) {
  // Turn each file into a visual "Node"
  const nodes = files.map((file, index) => ({
    id: file.id.toString(),
    data: { label: file.name },
    position: { x: index * 200, y: 100 }, // Spread them out horizontally
    style: { 
      background: '#18181b', 
      color: '#fafafa', 
      border: '1px solid #3f3f46',
      borderRadius: '8px',
      padding: '10px'
    },
  }));

  // For now, we'll start with nodes. 
  // Later, we can add 'edges' to show imports/exports.
  const edges = [];

  return (
    <div className="h-full w-full bg-zinc-950">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#27272a" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}