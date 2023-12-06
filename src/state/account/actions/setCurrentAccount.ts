import { useAccountStore } from '@src/state/account';
import { IAccount } from '@src/types';

export const setCurrentAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    state.currentAccount = account;
  });
};
