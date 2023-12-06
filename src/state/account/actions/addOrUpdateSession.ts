import { AtpSessionData } from '@atproto/api';
import { useAccountStore } from '@src/state/account';

export const addOrUpdateSession = (
  key: string,
  session: AtpSessionData,
): void => {
  useAccountStore.setState((state) => {
    state.sessions[key] = session;
  });
};
