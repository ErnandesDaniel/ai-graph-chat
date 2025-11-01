'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useChatStore } from '@/modules/chat/store/chatStore';
import './index.scss';

interface Chat {
  id: string;
  name: string;
  createdAt: Date;
}

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    chats,
    activeChatId,
    filter,
    chatLoadingStates,
    setFilter,
    addChat,
    selectChat,
    deleteChat,
  } = useChatStore();

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    // Keep the current route, just update the active chat
  };

  return (
    <div className="chat-layout">
      <div className="chat-list-layout">
        <button className="create-button" onClick={addChat}>
          Create New Chat
        </button>
        <input
          type="text"
          placeholder="Filter chats"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <div className="chat-list">
          {filteredChats.map(chat => {
            const isLoading = chatLoadingStates[chat.id] || false;
            return (
              <div
                key={chat.id}
                className={clsx('chat-item', {
                  active: activeChatId === chat.id,
                  loading: isLoading,
                  'active-loading': activeChatId === chat.id && isLoading
                })}
                onClick={() => handleSelectChat(chat.id)}
              >
                <span>{chat.name}</span>
                {isLoading && <div className="loading-indicator">⟳</div>}
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-content">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;