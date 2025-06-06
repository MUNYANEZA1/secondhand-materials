
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface ChatThread {
  id: string;
  productId?: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen: number;
}

interface ChatState {
  threads: ChatThread[];
  contacts: Contact[];
  activeThread: string | null;
  online: boolean;
  typing: { [threadId: string]: string[] };
}

const initialState: ChatState = {
  threads: [],
  contacts: [
    {
      id: '1',
      name: 'John Uwimana',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      online: true,
      lastSeen: Date.now()
    },
    {
      id: '2',
      name: 'Marie Mukamana',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b734?w=150',
      online: false,
      lastSeen: Date.now() - 3600000
    },
    {
      id: '3',
      name: 'David Niyonzima',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      online: true,
      lastSeen: Date.now()
    }
  ],
  activeThread: null,
  online: false,
  typing: {},
};

export const initializeChat = createAsyncThunk(
  'chat/initialize',
  async (userId: string) => {
    // Mock API call to get user's chat threads
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      threads: [
        {
          id: '1',
          participants: [userId, '1'],
          messages: [
            {
              id: '1',
              senderId: '1',
              recipientId: userId,
              content: 'Hi! I saw your MacBook listing. Is it still available?',
              timestamp: Date.now() - 600000,
              read: true,
              type: 'text' as const,
              status: 'read' as const
            }
          ],
          unreadCount: 1,
          createdAt: Date.now() - 3600000
        }
      ]
    };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ threadId, content, recipientId }: { threadId: string; content: string; recipientId: string }, { getState }) => {
    const state = getState() as { auth: { user: { id: string } | null } };
    const userId = state.auth.user?.id || 'me';
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: userId,
      recipientId,
      content,
      timestamp: Date.now(),
      read: false,
      type: 'text',
      status: 'sent'
    };
    
    return { threadId, message };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setActiveThread: (state, action: PayloadAction<string | null>) => {
      state.activeThread = action.payload;
      if (action.payload) {
        const thread = state.threads.find(t => t.id === action.payload);
        if (thread) {
          thread.unreadCount = 0;
          thread.messages.forEach(msg => msg.read = true);
        }
      }
    },
    createThread: (state, action: PayloadAction<{ recipientId: string; productId?: string }>) => {
      const { recipientId, productId } = action.payload;
      const existingThread = state.threads.find(t => 
        t.participants.includes(recipientId) && 
        (!productId || t.productId === productId)
      );
      
      if (!existingThread) {
        const newThread: ChatThread = {
          id: Date.now().toString(),
          productId,
          participants: ['me', recipientId],
          messages: [],
          unreadCount: 0,
          createdAt: Date.now()
        };
        state.threads.unshift(newThread);
        state.activeThread = newThread.id;
      } else {
        state.activeThread = existingThread.id;
      }
    },
    markMessageAsRead: (state, action: PayloadAction<{ threadId: string; messageId: string }>) => {
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        const message = thread.messages.find(m => m.id === action.payload.messageId);
        if (message) {
          message.read = true;
          message.status = 'read';
        }
      }
    },
    setTyping: (state, action: PayloadAction<{ threadId: string; userId: string; isTyping: boolean }>) => {
      const { threadId, userId, isTyping } = action.payload;
      if (!state.typing[threadId]) {
        state.typing[threadId] = [];
      }
      if (isTyping && !state.typing[threadId].includes(userId)) {
        state.typing[threadId].push(userId);
      } else if (!isTyping) {
        state.typing[threadId] = state.typing[threadId].filter(id => id !== userId);
      }
    },
    updateContactStatus: (state, action: PayloadAction<{ contactId: string; online: boolean }>) => {
      const contact = state.contacts.find(c => c.id === action.payload.contactId);
      if (contact) {
        contact.online = action.payload.online;
        contact.lastSeen = Date.now();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeChat.fulfilled, (state, action) => {
        state.threads = action.payload.threads;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { threadId, message } = action.payload;
        const thread = state.threads.find(t => t.id === threadId);
        if (thread) {
          thread.messages.push(message);
          thread.lastMessage = message;
        }
      });
  },
});

export const { 
  setOnlineStatus, 
  setActiveThread, 
  createThread, 
  markMessageAsRead, 
  setTyping, 
  updateContactStatus 
} = chatSlice.actions;
export default chatSlice.reducer;
