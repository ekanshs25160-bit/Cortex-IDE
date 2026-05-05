import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function ArchitectureCanvas({ files, edges = [] }) {
  // Turn each file into a visual "Node"
  const nodes = files.map((file, index) => ({
    id: file.id.toString(),
    data: { label: file.name },
    position: { x: index * 250, y: 150 }, // Adjusted spacing
    style: { 
      background: '#121212', 
      color: '#00e5ff', 
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
      textAlign: 'center'
    },
  }));

  // For now, we'll start with nodes. 
  // Later, we can add 'edges' to show imports/exports.
  const defaultEdges = [];

  return (
    <div className="h-full w-full bg-zinc-950">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#27272a" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}