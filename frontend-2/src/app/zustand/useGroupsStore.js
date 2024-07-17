import {create} from 'zustand';

export const useGroupsStore = create( (set) => ({
   groups: [],
   updateGroups: (groups) => set({groups }),
}));
