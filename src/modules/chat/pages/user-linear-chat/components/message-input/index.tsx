'use client'


import React, { useState } from 'react';
import clsx from 'clsx';
import './index.scss';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  sending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false, sending = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !sending) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        className="message-input__textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        rows={3}
      />
      <button
        type="submit"
        className={clsx('message-input__button', { disabled })}
        disabled={!message.trim() || disabled || sending}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;