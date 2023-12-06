import { useAppStore } from '@src/state/app';

export const setReplyUri = (uri: string | null): void => {
  useAppStore.setState((state) => {
    state.replyUri = uri;
  });
};
