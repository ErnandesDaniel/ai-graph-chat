import { create } from 'zustand';

interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  parentMessageId?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  selected?: boolean;
}

// Type for storing messages for all chats
// Key: chatId, Value: array of messages for that chat
type ChatMessagesMap = Record<string, Message[]>;

// Type for storing loading states for all chats
// Key: chatId, Value: boolean indicating if chat is loading
type ChatLoadingStates = Record<string, boolean>;

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  chatMessages: ChatMessagesMap;
  chatLoadingStates: ChatLoadingStates;
  filter: string;
  selectedMessageId: string | null;

  // Actions
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (id: string | null) => void;
  setChatMessages: (messages: ChatMessagesMap) => void;
  setChatLoadingStates: (states: ChatLoadingStates) => void;
  setFilter: (filter: string) => void;
  setSelectedMessageId: (id: string | null) => void;

  addChat: (parentMessageId?: string) => string;
  selectChat: (chatId: string) => void;
  clearMessageSelection: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  addMessage: (content: string) => Promise<void>;
  selectMessage: (chatId: string, messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  chatMessages: {},
  chatLoadingStates: {},
  filter: '',
  selectedMessageId: null,

  setChats: (chats) => set({ chats }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  setChatLoadingStates: (chatLoadingStates) => set({ chatLoadingStates }),
  setFilter: (filter) => set({ filter }),
  setSelectedMessageId: (selectedMessageId) => set({ selectedMessageId }),

  addChat: (parentMessageId?: string) => {
    const { chats } = get();
    const newChat: Chat = {
      id: Date.now().toString(),
      name:`New Chat ${chats.length + 1}`,
      createdAt: new Date(),
      parentMessageId,
    };
    set((state) => ({
      chats: [newChat, ...state.chats],
      chatMessages: { ...state.chatMessages, [newChat.id]: [] },
      activeChatId: state.activeChatId || newChat.id,
    }));
    return newChat.id;
  },

  selectChat: (chatId: string) => {
    set({ activeChatId: chatId, selectedMessageId: null });
    // Clear selection when switching chats
    get().clearMessageSelection(chatId);
  },

  deleteChat: (chatId: string) => {
    const { chats, chatMessages, chatLoadingStates, activeChatId } = get();
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    const updatedMessages = { ...chatMessages };
    delete updatedMessages[chatId];
    const updatedLoadingStates = { ...chatLoadingStates };
    delete updatedLoadingStates[chatId];

    set({
      chats: updatedChats,
      chatMessages: updatedMessages,
      chatLoadingStates: updatedLoadingStates,
      activeChatId: activeChatId === chatId ? null : activeChatId,
    });
  },

  addMessage: async (content: string) => {
    const { chats, activeChatId, chatLoadingStates } = get();
    let chatId = activeChatId;

    // If no active chat, create a new one
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        name: `New Chat ${chats.length + 1}`,
        createdAt: new Date(),
      };
      set((state) => ({
        chats: [newChat, ...state.chats],
        chatMessages: { ...state.chatMessages, [newChat.id]: [] },
        chatLoadingStates: { ...state.chatLoadingStates, [newChat.id]: false },
        activeChatId: newChat.id,
      }));
      chatId = newChat.id;
    }

    // Check if this specific chat is already loading
    if (chatLoadingStates[chatId]) return;

    // Set loading state for this specific chat
    set((state) => ({
      chatLoadingStates: { ...state.chatLoadingStates, [chatId]: true },
    }));

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to the current chat
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [chatId]: [...(state.chatMessages[chatId] || []), newMessage],
      },
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `AI response to: ${content}`,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Add AI response to the current chat
      set((state) => ({
        chatMessages: {
          ...state.chatMessages,
          [chatId]: [...(state.chatMessages[chatId] || []), aiMessage],
        },
        chatLoadingStates: { ...state.chatLoadingStates, [chatId]: false },
      }));
    }, 0);
  },

  selectMessage: (chatId: string, messageId: string) => {
    set((state) => {
      const messages = state.chatMessages[chatId] || [];
      const updatedMessages = messages.map(message =>
        message.id === messageId
          ? { ...message, selected: true }
          : { ...message, selected: false }
      );

      return {
        chatMessages: {
          ...state.chatMessages,
          [chatId]: updatedMessages,
        },
        selectedMessageId: messageId,
      };
    });
  },

  clearMessageSelection: (chatId: string) => {
    set((state) => {
      const messages = state.chatMessages[chatId] || [];
      const updatedMessages = messages.map(message => ({
        ...message,
        selected: false,
      }));

      return {
        chatMessages: {
          ...state.chatMessages,
          [chatId]: updatedMessages,
        },
        selectedMessageId: null,
      };
    });
  },
}));