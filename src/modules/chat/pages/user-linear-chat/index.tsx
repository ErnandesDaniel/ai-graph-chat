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
  const [isSending, setIsSending] = useState<boolean>(false);

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
    setChatMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[chatId];
      return newMessages;
    });
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setIsSending(false); // Reset sending state when active chat is deleted
    }
  };

  const addMessage = async (content: string) => {
    if (isSending) return;

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
      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    setIsSending(true);

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

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

      setChatMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), aiMessage],
      }));

      setIsSending(false);
    }, 5000);
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
        onDeleteChat={deleteChat}
      />
      <div className="chat-content">
        <MessageList messages={activeMessages} />
        <MessageInput onSendMessage={addMessage} disabled={false} sending={isSending} />
      </div>
    </div>
  );
};

export default UserLinearChat;