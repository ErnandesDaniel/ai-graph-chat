'use client';

import React, { useState } from 'react';
import { Layout, Typography, List, Button, Input } from 'antd';
import MessageList from '@/modules/old-chat/pages/ChatPage/components/message-list';
import MessageInput  from '@/modules/old-chat/pages/ChatPage/components/message-input';

import { PlusOutlined } from '@ant-design/icons';
import './index.scss';

const { Sider, Content } = Layout;
const { Title } = Typography;

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [currentChatId, setCurrentChatId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'General Chat',
      lastMessage: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      name: 'Project Ideas',
      lastMessage: 'Let\'s brainstorm some ideas...',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      },
    ],
    '2': [
      {
        id: '2',
        content: 'Let\'s brainstorm some ideas...',
        role: 'assistant',
        timestamp: new Date(Date.now() - 3600000),
      },
    ],
  });

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const currentMessages = messages[currentChatId] || [];

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), userMessage],
    }));

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${content}". This is a placeholder response.`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), aiMessage],
      }));
    }, 1000);
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleCreateNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      name: `New Chat ${chats.length + 1}`,
      lastMessage: '',
      timestamp: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages(prev => ({
      ...prev,
      [newChatId]: [],
    }));
  };

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Layout className='layout'>
      <Sider width={300} className='sider'>
        <div className='siderHeader'>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNewChat}
            className='newChatButton'
          >
            New Chat
          </Button>
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='searchInput'
          />
          <Title level={4} className='chatsTitle'>
            Chats
          </Title>
        </div>
        <div className='chatListContainer'>
          <List
            dataSource={filteredChats}
            renderItem={(chat) => (
            <List.Item
              //className={'chatItem' ${currentChatId === old-chat.id ? 'active' : ''}`}}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className='chatItemContent'>
                <div className='chatName'>
                  {chat.name}
                </div>
                <div className='chatLastMessage'>
                  {chat.lastMessage}
                </div>
              </div>
            </List.Item>
          )}
        />
        </div>
      </Sider>
      <Layout>
        <Content className='content'>
          <div className='chatHeader'>
            <Title level={3} className='chatTitle'>
              {currentChat?.name || 'Chat'}
            </Title>
          </div>
          <div className='messagesContainer'>
            <MessageList messages={currentMessages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}