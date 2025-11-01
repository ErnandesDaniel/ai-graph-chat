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
  const { activeChatId, chatMessages, clearMessageSelection, chats } = useChatStore();

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

    // Add child chat nodes
    const childChats = chats.filter(chat => chat.parentMessageId && messages.some(msg => msg.id === chat.parentMessageId));
    childChats.forEach((childChat, childIndex) => {
      const parentMessage = messages.find(msg => msg.id === childChat.parentMessageId);
      if (parentMessage) {
        nodes.push({
          id: `chat-${childChat.id}`,
          type: 'default',
          position: {
            x: parentMessage.sender === 'user' ? 600 : 800,
            y: messages.indexOf(parentMessage) * 150 + 50 + (childIndex + 1) * 100
          },
          data: {
            label: `Child Chat: ${childChat.name}`
          },
          className: 'child-chat-node',
        });

        // Connect the parent message to the child chat
        edges.push({
          id: `e${parentMessage.id}-chat-${childChat.id}`,
          source: parentMessage.id,
          target: `chat-${childChat.id}`,
        });
      }
    });

    for (let i = 0; i < messages.length - 1; i++) {
      edges.push({
        id: `e${messages[i].id}-${messages[i + 1].id}`,
        source: messages[i].id,
        target: messages[i + 1].id,
      });
    }

    return { nodes, edges };
  }, [activeChatId, chatMessages, chats]);

  const [nodes, setNodes, onNodesChange] = useNodesState(messageNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(messageEdges);
  const [viewportKey, setViewportKey] = React.useState(0);

  // Update nodes and edges when activeChatId or chatMessages change
  React.useEffect(() => {
    setNodes(messageNodes);
    setEdges(messageEdges);
  }, [messageNodes, messageEdges, setNodes, setEdges]);

  // Reset viewport when switching chats
  React.useEffect(() => {
    setViewportKey(prev => prev + 1);
  }, [activeChatId]);

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

  const onNodeClick = useCallback((event: React.MouseEvent, node: { id: string }) => {
    if (activeChatId && !node.id.startsWith('chat-')) {
      const { selectMessage } = useChatStore.getState();
      selectMessage(activeChatId, node.id);
    }
  }, [activeChatId]);


  return (
    <div className="user-graph-chat">
      <ReactFlow
        key={viewportKey}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ maxZoom: 1.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default UserGraphChat;