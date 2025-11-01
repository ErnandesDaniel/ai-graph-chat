'use client'

import React from 'react';
import ChatListLayout from '@/modules/chat/components/chat-list-layout';
import MessageList from '@/modules/chat/pages/user-linear-chat/components/message-list';
import MessageInput from '@/modules/chat/pages/user-linear-chat/components/message-input';
import { useChatStore } from '@/modules/chat/store/chatStore';
import './index.scss';

const UserLinearChat: React.FC = () => {
  const {
    chats,
    activeChatId,
    chatMessages,
    chatLoadingStates,
    filter,
    addChat,
    selectChat,
    deleteChat,
    addMessage,
    setFilter,
  } = useChatStore();

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get messages for the currently active chat
  const activeMessages = activeChatId ? chatMessages[activeChatId] || [] : [];

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