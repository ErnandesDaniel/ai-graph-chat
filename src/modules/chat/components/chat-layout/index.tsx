'use client';

import React from 'react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import ChatListLayout from '@/modules/chat/components/chat-list-layout';
import UserLinearChat from '@/modules/chat/pages/user-linear-chat';
import UserGraphChat from '@/modules/chat/pages/user-graph-chat';
import { useChatStore } from '@/modules/chat/stores/chatStore';
import './index.scss';

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const {
    filteredChats,
    activeChatId,
    filter,
    chatLoadingStates,
    chatMode,
    setFilter,
    addChat,
    selectChat,
    deleteChat,
    toggleChatMode,
  } = useChatStore();

  return (
    <div className="chat-layout">
      <ChatListLayout
        chats={filteredChats}
        activeChatId={activeChatId}
        filter={filter}
        onFilterChange={setFilter}
        onAddChat={addChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        chatLoadingStates={chatLoadingStates}
        headerExtra={
          <Button
            type="text"
            icon={<SwapOutlined />}
            onClick={toggleChatMode}
            title={`Switch to ${chatMode === 'linear' ? 'Graph' : 'Linear'} Chat`}
          >
            {chatMode === 'linear' ? 'Graph' : 'Linear'}
          </Button>
        }
      />
      <div className="chat-content">
        {chatMode === 'linear' ? (
          <UserLinearChat />
        ) : (
          <UserGraphChat />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;