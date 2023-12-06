import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage } from 'zustand/esm/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAccount } from '@src/types';
import { AtpSessionData } from '@atproto/api';

interface AccountStore {
  accounts: IAccount[];
  sessions: Record<string, AtpSessionData>;
  currentAccount: IAccount;
}

export const useAccountStore = create(
  persist(
    immer<AccountStore>(() => ({
      accounts: [],
      sessions: {},
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      currentAccount: {} as IAccount,
    })),
    {
      name: 'account',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useAccounts = (): IAccount[] =>
  useAccountStore((state) => state.accounts);

export const useCurrentAccount = (): IAccount =>
  useAccountStore((state) => state.currentAccount);
