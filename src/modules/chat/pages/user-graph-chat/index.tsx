'use client';

import React, { useCallback, useMemo } from 'react';
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
import { useChatStore } from '@/modules/chat/store/chatStore';

const UserGraphChat: React.FC = () => {
  const { activeChatId, chatMessages } = useChatStore();

  const { nodes: messageNodes, edges: messageEdges } = useMemo(() => {
    if (!activeChatId) {
      return { nodes: [], edges: [] };
    }

    const messages = chatMessages[activeChatId] || [];
    const nodes = messages.map((message, index) => ({
      id: message.id,
      type: 'default',
      position: {
        x: message.sender === 'user' ? 100 : 400,
        y: index * 150 + 50
      },
      data: {
        label: `${message.sender.toUpperCase()}: ${message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content}`
      },
      className: message.sender === 'user' ? 'user-message-node' : 'ai-message-node',
    }));

    const edges: Edge[] = [];
    for (let i = 0; i < messages.length - 1; i++) {
      edges.push({
        id: `e${messages[i].id}-${messages[i + 1].id}`,
        source: messages[i].id,
        target: messages[i + 1].id,
      });
    }

    return { nodes, edges };
  }, [activeChatId, chatMessages]);

  const [nodes, setNodes, onNodesChange] = useNodesState(messageNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(messageEdges);

  // Update nodes and edges when activeChatId or chatMessages change
  React.useEffect(() => {
    setNodes(messageNodes);
    setEdges(messageEdges);
  }, [messageNodes, messageEdges, setNodes, setEdges]);

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