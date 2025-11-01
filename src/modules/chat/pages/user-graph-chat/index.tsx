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

    // Add child chat nodes and their messages
    const childChats = chats.filter(chat => chat.parentMessageId && messages.some(msg => msg.id === chat.parentMessageId));
    childChats.forEach((childChat, childIndex) => {
      const parentMessage = messages.find(msg => msg.id === childChat.parentMessageId);
      if (parentMessage) {
        const childChatMessages = chatMessages[childChat.id] || [];
        const parentIndex = messages.indexOf(parentMessage);

        // Add child chat node
        nodes.push({
          id: `chat-${childChat.id}`,
          type: 'default',
          position: {
            x: parentMessage.sender === 'user' ? 600 : 800,
            y: parentIndex * 150 + 50 + (childIndex + 1) * 100
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

        // Add child chat messages
        childChatMessages.forEach((childMessage, msgIndex) => {
          const messageY = parentIndex * 150 + 50 + (childIndex + 1) * 100 + (msgIndex + 1) * 150;
          nodes.push({
            id: `child-${childChat.id}-${childMessage.id}`,
            type: 'default',
            position: {
              x: childMessage.sender === 'user' ? 100 : 400,
              y: messageY
            },
            data: {
              label: `${childMessage.sender.toUpperCase()}: ${childMessage.content.length > 50 ? childMessage.content.substring(0, 50) + '...' : childMessage.content}`
            },
            className: clsx(
              childMessage.sender === 'user' ? 'user-message-node' : 'ai-message-node',
              'child-message-node'
            ),
          });

          // Connect child chat to first message
          if (msgIndex === 0) {
            edges.push({
              id: `e-chat-${childChat.id}-child-${childChat.id}-${childMessage.id}`,
              source: `chat-${childChat.id}`,
              target: `child-${childChat.id}-${childMessage.id}`,
            });
          } else {
            // Connect messages within child chat
            const prevMessage = childChatMessages[msgIndex - 1];
            edges.push({
              id: `e-child-${childChat.id}-${prevMessage.id}-child-${childChat.id}-${childMessage.id}`,
              source: `child-${childChat.id}-${prevMessage.id}`,
              target: `child-${childChat.id}-${childMessage.id}`,
            });
          }
        });

        // Recursively add nested child chats
        const nestedChildChats = chats.filter(chat => chat.parentMessageId && childChatMessages.some(msg => msg.id === chat.parentMessageId));
        nestedChildChats.forEach((nestedChat, nestedIndex) => {
          const nestedParentMessage = childChatMessages.find(msg => msg.id === nestedChat.parentMessageId);
          if (nestedParentMessage) {
            const nestedMessages = chatMessages[nestedChat.id] || [];
            const nestedParentIndex = childChatMessages.indexOf(nestedParentMessage);

            // Add nested child chat node
            nodes.push({
              id: `nested-chat-${nestedChat.id}`,
              type: 'default',
              position: {
                x: nestedParentMessage.sender === 'user' ? 600 : 800,
                y: parentIndex * 150 + 50 + (childIndex + 1) * 100 + (nestedParentIndex + 1) * 150 + (nestedIndex + 1) * 100
              },
              data: {
                label: `Nested Child Chat: ${nestedChat.name}`
              },
              className: 'nested-child-chat-node',
            });

            // Connect nested parent message to nested child chat
            edges.push({
              id: `e-child-${childChat.id}-${nestedParentMessage.id}-nested-chat-${nestedChat.id}`,
              source: `child-${childChat.id}-${nestedParentMessage.id}`,
              target: `nested-chat-${nestedChat.id}`,
            });

            // Add nested child chat messages
            nestedMessages.forEach((nestedMessage, nestedMsgIndex) => {
              const nestedMessageY = parentIndex * 150 + 50 + (childIndex + 1) * 100 + (nestedParentIndex + 1) * 150 + (nestedIndex + 1) * 100 + (nestedMsgIndex + 1) * 150;
              nodes.push({
                id: `nested-child-${nestedChat.id}-${nestedMessage.id}`,
                type: 'default',
                position: {
                  x: nestedMessage.sender === 'user' ? 100 : 400,
                  y: nestedMessageY
                },
                data: {
                  label: `${nestedMessage.sender.toUpperCase()}: ${nestedMessage.content.length > 50 ? nestedMessage.content.substring(0, 50) + '...' : nestedMessage.content}`
                },
                className: clsx(
                  nestedMessage.sender === 'user' ? 'user-message-node' : 'ai-message-node',
                  'nested-child-message-node'
                ),
              });

              // Connect nested child chat to first message
              if (nestedMsgIndex === 0) {
                edges.push({
                  id: `e-nested-chat-${nestedChat.id}-nested-child-${nestedChat.id}-${nestedMessage.id}`,
                  source: `nested-chat-${nestedChat.id}`,
                  target: `nested-child-${nestedChat.id}-${nestedMessage.id}`,
                });
              } else {
                // Connect messages within nested child chat
                const prevNestedMessage = nestedMessages[nestedMsgIndex - 1];
                edges.push({
                  id: `e-nested-child-${nestedChat.id}-${prevNestedMessage.id}-nested-child-${nestedChat.id}-${nestedMessage.id}`,
                  source: `nested-child-${nestedChat.id}-${prevNestedMessage.id}`,
                  target: `nested-child-${nestedChat.id}-${nestedMessage.id}`,
                });
              }
            });
          }
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