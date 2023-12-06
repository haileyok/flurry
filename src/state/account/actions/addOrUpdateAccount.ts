import { IAccount } from '@src/types';
import { useAccountStore } from '@src/state/account';

export const addOrUpdateAccount = (
  account: IAccount,
  setCurrent = false,
): void => {
  useAccountStore.setState((state) => {
    const currentIndex = state.accounts.findIndex(
      (a) =>
        a.handle === account.handle && a.serviceType === account.serviceType,
    );

    // Update if the account exists
    if (currentIndex > -1) {
      state.accounts[currentIndex] = account;
    } else {
      state.accounts.push(account);
    }

    if (setCurrent) {
      state.currentAccount = account;
    }
  });
};
