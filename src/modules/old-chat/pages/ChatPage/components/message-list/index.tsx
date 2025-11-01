'use client';

import React, { useEffect, useRef } from 'react';
import { Typography } from 'antd';
import './index.scss';
import clsx from 'clsx';
const { Text } = Typography;

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='container'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx('message', {
              user:  message.role === 'user',
              assistant: message.role != 'user',
          })}
        >
            <div
              className={clsx('messageBubble', {
                  user:  message.role === 'user',
                  assistant: message.role != 'user',
              })}

          >
              <Text className={clsx('messageText', {
                      user:  message.role === 'user',
                      assistant: message.role != 'user',
                  })}
              >
              {message.content}
            </Text>


            <div
                className={clsx('messageTimestamp', {
                    user:  message.role === 'user',
                    assistant: message.role != 'user',
                })}


            >
              {message.timestamp.toLocaleTimeString()}

            </div>

          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}