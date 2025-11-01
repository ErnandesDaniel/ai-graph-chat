'use client'

import React, { useState } from 'react';
import ChatListLayout from '@/modules/chat/components/chat-list-layout';
import MessageList from '@/modules/chat/pages/user-linear-chat/components/message-list';
import MessageInput from '@/modules/chat/pages/user-linear-chat/components/message-input';
import './index.scss';

interface Chat {
  id: string;
  name: string;
  createdAt: Date;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Type for storing messages for all chats
// Key: chatId, Value: array of messages for that chat
type ChatMessagesMap = Record<string, Message[]>;

// Type for storing loading states for all chats
// Key: chatId, Value: boolean indicating if chat is loading
type ChatLoadingStates = Record<string, boolean>;

const UserLinearChat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessagesMap>({});
  const [chatLoadingStates, setChatLoadingStates] = useState<ChatLoadingStates>({});
  const [filter, setFilter] = useState<string>('');

  const addChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: `New Chat ${chats.length + 1}`,
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setChatMessages(prev => ({ ...prev, [newChat.id]: [] }));
    if (!activeChatId) {
      setActiveChatId(newChat.id);
    }
  };

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));

    // Remove messages for the deleted chat
    setChatMessages(prev => {
      const updatedMessages: ChatMessagesMap = { ...prev };
      delete updatedMessages[chatId];
      return updatedMessages;
    });

    // Remove loading state for the deleted chat
    setChatLoadingStates(prev => {
      const updatedLoadingStates: ChatLoadingStates = { ...prev };
      delete updatedLoadingStates[chatId];
      return updatedLoadingStates;
    });

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const addMessage = async (content: string) => {
    let chatId = activeChatId;

    // If no active chat, create a new one
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        name: `New Chat ${chats.length + 1}`,
        createdAt: new Date(),
      };
      setChats([newChat, ...chats]);
      setChatMessages(prev => ({ ...prev, [newChat.id]: [] }));
      setChatLoadingStates(prev => ({ ...prev, [newChat.id]: false }));
      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    // Check if this specific chat is already loading
    if (chatLoadingStates[chatId]) return;

    // Set loading state for this specific chat
    setChatLoadingStates(prev => ({ ...prev, [chatId]: true }));

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to the current chat
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `AI response to: ${content}`,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Add AI response to the current chat
      setChatMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), aiMessage],
      }));

      // Reset loading state for this specific chat
      setChatLoadingStates(prev => ({ ...prev, [chatId]: false }));
    }, 5000);
  };

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get messages for the currently active chat
  const activeMessages: Message[] = activeChatId ? chatMessages[activeChatId] || [] : [];

  // Get loading state for the currently active chat
  const isActiveChatLoading: boolean = activeChatId ? chatLoadingStates[activeChatId] || false : false;

  return (
    <div className="user-linear-chat">
      <ChatListLayout
        chats={filteredChats}
        activeChatId={activeChatId}
        filter={filter}
        onFilterChange={setFilter}
        onAddChat={addChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        chatLoadingStates={chatLoadingStates}
      />
      <div className="chat-content">
        <MessageList messages={activeMessages} />
        <MessageInput onSendMessage={addMessage} disabled={false} sending={isActiveChatLoading} />
      </div>
    </div>
  );
};

export default UserLinearChat;