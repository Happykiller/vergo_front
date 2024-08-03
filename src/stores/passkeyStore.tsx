import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState:any = null;

const passkeyPersist = persist<any>(
  (set:any) => ({
    ...initialState,
    reset: () => set(initialState)
  }),
  {
    name: "vergo-passkey-storage",
    storage: createJSONStorage(() => localStorage),
  }
);

export const passkeyStore = create<any>()(passkeyPersist);