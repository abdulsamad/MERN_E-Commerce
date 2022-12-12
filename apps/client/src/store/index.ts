import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { logout } from '@api/index';

export interface IRootStore {
  isAuthenticated: boolean;
  user: null | object;
  token: null | object;
  actions: {
    logout: () => void;
  };
}

export const useRootStore = create<IRootStore>()(
  devtools((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    actions: {
      logout: async () => {
        await logout();

        set(() => ({ isAuthenticated: false, token: null, user: null }));
      },
    },
  }))
);

export default useRootStore;
