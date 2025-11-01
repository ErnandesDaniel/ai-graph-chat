'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './index.scss';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 25 },
    data: { label: 'Hello World!' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 125 },
    data: { label: 'This is a text block' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 125 },
    data: { label: 'You can drag me around' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const UserGraphChat: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="user-graph-chat">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default UserGraphChat;