'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './index.scss';

const { TextArea } = Input;

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const content = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      await onSendMessage(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='container'>
      <div className='inputContainer'>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          className='textarea'
          disabled={isLoading}
        />
      </div>
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        loading={isLoading}
        className='sendButton'
        size="large"
      />
    </div>
  );
}