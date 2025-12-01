import { create } from 'zustand';
import { socketService } from '../services/socket';

export interface Message {
    id: string;
    chatRoomId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'location';
    readAt?: Date;
    createdAt: string;
}

interface ChatState {
    messages: Record<string, Message[]>; // chatRoomId -> messages
    activeChatRoomId: string | null;
    isTyping: boolean;
    typingUsers: Record<string, boolean>; // userId -> isTyping

    // Actions
    setActiveChatRoom: (chatRoomId: string | null) => void;
    addMessage: (chatRoomId: string, message: Message) => void;
    setMessages: (chatRoomId: string, messages: Message[]) => void;
    sendMessage: (chatRoomId: string, content: string, type?: 'text' | 'image' | 'location') => void;
    setTyping: (chatRoomId: string, isTyping: boolean) => void;
    handleUserTyping: (userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: {},
    activeChatRoomId: null,
    isTyping: false,
    typingUsers: {},

    setActiveChatRoom: (chatRoomId) => {
        set({ activeChatRoomId: chatRoomId });
        if (chatRoomId) {
            socketService.emit('join_chat', chatRoomId);
        }
    },

    addMessage: (chatRoomId, message) => {
        set((state) => {
            const roomMessages = state.messages[chatRoomId] || [];
            // Avoid duplicates
            if (roomMessages.some(m => m.id === message.id)) return state;

            return {
                messages: {
                    ...state.messages,
                    [chatRoomId]: [...roomMessages, message],
                },
            };
        });
    },

    setMessages: (chatRoomId, messages) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [chatRoomId]: messages,
            },
        }));
    },

    sendMessage: (chatRoomId, content, type = 'text') => {
        socketService.emit('send_message', {
            chatRoomId,
            content,
            type,
        });
    },

    setTyping: (chatRoomId, isTyping) => {
        set({ isTyping });
        socketService.emit('typing', { chatRoomId, isTyping });
    },

    handleUserTyping: (userId, isTyping) => {
        set((state) => ({
            typingUsers: {
                ...state.typingUsers,
                [userId]: isTyping,
            },
        }));
    },
}));

// Initialize socket listeners for chat
socketService.on('new_message', (message: Message) => {
    useChatStore.getState().addMessage(message.chatRoomId, message);
});

socketService.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
    useChatStore.getState().handleUserTyping(data.userId, data.isTyping);
});
