import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import './index.scss';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map(message => (
        <div
          key={message.id}
          className={clsx('message', {
            'message--user': message.sender === 'user',
            'message--ai': message.sender === 'ai',
          })}
        >
          <div className="message__content">{message.content}</div>
          <div className="message__timestamp">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;