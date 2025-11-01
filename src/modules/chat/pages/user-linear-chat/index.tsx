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

const UserLinearChat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({});
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

  const addMessage = (content: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `AI response to: ${content}`,
        sender: 'ai',
        timestamp: new Date(),
      };

      setChatMessages(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), aiMessage],
      }));
    }, 1000);
  };

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const activeMessages = activeChatId ? chatMessages[activeChatId] || [] : [];

  return (
    <div className="user-linear-chat">
      <ChatListLayout
        chats={filteredChats}
        activeChatId={activeChatId}
        filter={filter}
        onFilterChange={setFilter}
        onAddChat={addChat}
        onSelectChat={selectChat}
      />
      <div className="chat-content">
        <MessageList messages={activeMessages} />
        <MessageInput onSendMessage={addMessage} disabled={!activeChatId} />
      </div>
    </div>
  );
};

export default UserLinearChat;