import { create } from 'zustand';

export interface VolatileStoreModel {
  fullscreen: boolean
}

const initialState:any = {
  fullscreen: false
}

export const volatileStore = create<VolatileStoreModel>((set) => ({
  ...initialState,
  reset: () => set(initialState)
}));