import { IAccount } from '@src/types';
import { useAccountStore } from '@src/state/account';

export const removeAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const currentAccountIndex = state.accounts.findIndex(
      (a) =>
        a.handle === account.handle && a.serviceType === account.serviceType,
    );

    const currentAccount = state.currentAccount;
    if (currentAccountIndex > -1) {
      state.accounts.splice(currentAccountIndex, 1);
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete state.sessions[`${account.handle}${account.host}`];

    if (
      currentAccount.handle === account.handle &&
      currentAccount.host === account.host
    ) {
      state.currentAccount = state.accounts[0];
    }
  });
};
