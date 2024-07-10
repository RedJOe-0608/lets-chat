import { create } from "zustand";

export const useSocketStore = create( (set) => ({
    socket: null,
    updateSocket: (socket) => set({ socket}),
 }));
 