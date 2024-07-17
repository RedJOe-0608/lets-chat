import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      authName: '',
      updateAuthName: (name) => set({ authName: name }),
    }),
    {
      name: 'authName', // Unique name for the storage item
      getStorage: () => localStorage, 
    //   storage: createJSONStorage(() => localStorage) // Specify localStorage
    }
  )
);
 