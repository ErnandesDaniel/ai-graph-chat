import React from 'react';
import clsx from 'clsx';
import './index.scss';

interface Chat {
  id: string;
  name: string;
  createdAt: Date;
}

interface Chat {
  id: string;
  name: string;
  createdAt: Date;
}

interface ChatListLayoutProps {
  chats: Chat[];
  activeChatId: string | null;
  filter: string;
  onFilterChange: (filter: string) => void;
  onAddChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  chatLoadingStates: Record<string, boolean>;
}

const ChatListLayout: React.FC<ChatListLayoutProps> = ({
  chats,
  activeChatId,
  filter,
  onFilterChange,
  onAddChat,
  onSelectChat,
  onDeleteChat,
  chatLoadingStates,
}) => {
  return (
    <div className="chat-list-layout">
      <button className="create-button" onClick={onAddChat}>
        Create New Chat
      </button>
      <input
        type="text"
        placeholder="Filter chats"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-input"
      />
      <div className="chat-list">
        {chats.map(chat => {
          const isLoading = chatLoadingStates[chat.id] || false;
          return (
            <div
              key={chat.id}
              className={clsx('chat-item', {
                active: activeChatId === chat.id,
                loading: isLoading,
                'active-loading': activeChatId === chat.id && isLoading
              })}
              onClick={() => onSelectChat(chat.id)}
            >
              <span>{chat.name}</span>
              {isLoading && <div className="loading-indicator">⟳</div>}
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatListLayout;