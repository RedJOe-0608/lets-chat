import {create} from 'zustand';

export const useGroupParticipantsStore = create( (set) => ({
   groupParticipants: [],
   updateGroupParticipants: (groups) => set({groupParticipants: groups }),
}));
