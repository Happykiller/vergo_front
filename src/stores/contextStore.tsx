import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ContextStoreModel {
  id: string|null
  code: string|null
  access_token: string|null
  name_first: string|null
  name_last: string|null
  volume: number
  reset?: () => void
}

const initialState:ContextStoreModel = {
  id: null,
  code: null,
  access_token: null,
  name_first: null,
  name_last: null,
  volume: 0.1,
}

const contextPersist = persist<ContextStoreModel>(
  (set) => ({
    ...initialState,
    reset: () => set(initialState)
  }),
  {
    name: "vergo-storage",
    storage: createJSONStorage(() => localStorage),
  }
);

export const contextStore = create<ContextStoreModel>()(contextPersist);