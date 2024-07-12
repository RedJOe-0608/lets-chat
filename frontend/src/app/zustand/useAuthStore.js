// import {create} from 'zustand'

// // Load the auth name from local storage if it exists
// const getStoredAuthName = () => {
//     try {
//       const storedAuthName = localStorage.getItem('authName');
//       return storedAuthName ? JSON.parse(storedAuthName) : '';
//     } catch (error) {
//       console.error('Error loading auth name from local storage:', error);
//       return '';
//     }
//   };
  
//   // Save the auth name to local storage
//   const setStoredAuthName = (name) => {
//     try {
//       localStorage.setItem('authName', JSON.stringify(name));
//     } catch (error) {
//       console.error('Error saving auth name to local storage:', error);
//     }
//   };

// export const useAuthStore = create((set) => ({
//     authName: getStoredAuthName(),
//     updateAuthName: (name) => {
//         set({ authName: name });
//         setStoredAuthName(name);
//     }
//  }))




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
 