'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import MessageInput from '@/modules/chat/pages/user-linear-chat/components/message-input';
import { useChatStore } from '@/modules/chat/store/chatStore';
import './index.scss';

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
    selectedMessageId,
    chatMessages,
    setFilter,
    addChat,
    selectChat,
    deleteChat,
    addMessage,
  } = useChatStore();

  const selectedMessageForChild = selectedMessageId;

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    // Keep the current route, just update the active chat
  };

  const handleSendMessage = (content: string) => {
    if (selectedMessageForChild) {
      // Check if selected message already has child chats
      const hasChildChats = chats.some(chat => chat.parentMessageId === selectedMessageForChild);
      if (hasChildChats) {
        // Add message to current chat
        addMessage(content);
      } else {
        // Create child chat from selected message
        const newChatId = addChat(selectedMessageForChild);
        selectChat(newChatId);
        // Add the message to the new child chat
        addMessage(content);
      }
    } else {
      // Regular message sending
      addMessage(content);
    }
  };

  // Get loading state for the currently active chat
  const isActiveChatLoading: boolean = activeChatId ? chatLoadingStates[activeChatId] || false : false;

  const handleToggleChatMode = () => {
    const isGraphMode = pathname.includes('/graph');
    router.push(isGraphMode ? '/chat' : '/chat/graph');
  };

  return (
    <div className="chat-layout">
      <div className="chat-list-layout">
        <div className="header-buttons">
          <button className="create-button" onClick={() => addChat()}>
            Create New Chat
          </button>
          <button className="toggle-mode-button" onClick={handleToggleChatMode}>
            {pathname.includes('/graph') ? '💬 Linear' : '🔗 Graph'}
          </button>
        </div>
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
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={false}
          sending={isActiveChatLoading}
          placeholder={selectedMessageForChild ? "Type to create child chat..." : "Type your message..."}
          disableSend={pathname.includes('/graph') && !selectedMessageForChild && (activeChatId ? (chatMessages[activeChatId] || []).length > 0 : false)}
        />
      </div>
    </div>
  );
};

export default ChatLayout;