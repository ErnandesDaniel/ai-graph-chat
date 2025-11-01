import React from 'react';
import clsx from 'clsx';
import './index.scss';

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
}

const ChatListLayout: React.FC<ChatListLayoutProps> = ({
  chats,
  activeChatId,
  filter,
  onFilterChange,
  onAddChat,
  onSelectChat,
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
        {chats.map(chat => (
          <div
            key={chat.id}
            className={clsx('chat-item', { active: activeChatId === chat.id })}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListLayout;