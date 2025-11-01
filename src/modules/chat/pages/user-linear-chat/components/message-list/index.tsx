import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useChatStore } from '@/modules/chat/store/chatStore';
import './index.scss';

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // This will be handled by the component that has access to the store
  }
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  selected?: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeChatId, selectMessage, clearMessageSelection } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleMessageClick = (messageId: string) => {
    if (activeChatId) {
      selectMessage(activeChatId, messageId);
    }
  };

  return (
    <div className="message-list">
      {messages.map(message => (
        <div
          key={message.id}
          className={clsx('message', {
            'message--user': message.sender === 'user',
            'message--ai': message.sender === 'ai',
            'message--selected': message.selected,
          })}
          onClick={() => handleMessageClick(message.id)}
        >
          <div className="message__content">{message.content}</div>
          <div className="message__timestamp">
            {message.timestamp.toLocaleTimeString()}
          </div>
          {message.selected && <div className="message__selected-indicator">✓</div>}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;