import {create} from 'zustand';

export const useChatMessagesStore = create( (set) => ({
   chatMessages: [],
   updateChatMessages: (messages) => set({chatMessages: messages})
}));
