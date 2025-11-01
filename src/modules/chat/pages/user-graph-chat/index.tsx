'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
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
import clsx from "clsx";

const UserGraphChat: React.FC = () => {
  const { activeChatId, chatMessages, clearMessageSelection } = useChatStore();

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
      className: clsx(
        message.sender === 'user' ? 'user-message-node' : 'ai-message-node',
        { 'selected-node': message.selected }
      ),
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

  // Handle Escape key to clear selection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeChatId) {
        clearMessageSelection(activeChatId);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeChatId, clearMessageSelection]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    if (activeChatId) {
      const { selectMessage } = useChatStore.getState();
      selectMessage(activeChatId, node.id);
    }
  }, [activeChatId]);

  return (
    <div className="user-graph-chat">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
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